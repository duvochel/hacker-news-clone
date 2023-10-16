import { readFileSync } from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { PrismaClient } from '@prisma/client';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';

import resolvers from '@/resolvers/index';
import { getUserId } from './utils/auth';

const pubsub = new PubSub();

export interface ServerContext {
  prisma: PrismaClient;
  pubsub: PubSub;
  userId?: String;
}

const app = express();
const httpServer = http.createServer(app);

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf8' });
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions'
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<ServerContext>({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    }
  ]
});

await server.start();

app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const userId = getUserId(req);
      const prisma = new PrismaClient({
        errorFormat: 'minimal'
      });
      return { userId, pubsub, prisma };
    }
  })
);

const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
