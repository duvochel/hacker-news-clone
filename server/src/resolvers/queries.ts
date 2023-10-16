import {
  Feed,
  QueryFeedArgs,
  User,
  QueryResolvers
} from '@/__generated__/resolvers-types';
import { ServerContext } from '@/index';

const queries: QueryResolvers = {
  feed: async (_, args: QueryFeedArgs, context: ServerContext) => {
    const where = args.filter
      ? {
          OR: [
            { description: { contains: args.filter } },
            { url: { contains: args.filter } }
          ]
        }
      : {};

    const orderBy = {
      description: args.orderBy?.description ?? undefined,
      url: args.orderBy?.url ?? undefined,
      createdAt: args.orderBy?.createdAt ?? undefined
    };

    const links = await context.prisma.link.findMany({
      where,
      skip: args.skip ?? undefined,
      take: args.take ?? undefined,
      orderBy
    });

    const count = await context.prisma.link.count({ where });

    return {
      id: 'main-feed',
      links,
      count
    };
  },

  users: async (_, __, context: ServerContext) => {
    return context.prisma.user.findMany();
  }
};

export default queries;
