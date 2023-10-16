import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { APP_SECRET } from '@/utils/auth';
import {
  AuthPayload,
  Link,
  MutationLoginArgs,
  MutationPostArgs,
  MutationResolvers,
  MutationSignupArgs,
  MutationVoteArgs,
  Vote
} from '@/__generated__/resolvers-types';

const { hash, compare } = bcrypt;
const { sign } = jsonwebtoken;

async function post(
  parent: any,
  args: MutationPostArgs,
  context: any,
  info: any
): Promise<Link> {
  const { userId } = context;

  let postedBy = undefined;
  if (userId) {
    postedBy = { connect: { id: userId } };
  }

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy
    }
  });

  context.pubsub.publish('NEW_LINK', newLink);

  return newLink;
}

async function signup(
  parent: any,
  args: MutationSignupArgs,
  context: any,
  info: any
): Promise<AuthPayload> {
  const password = await hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  const token = sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(
  parent: any,
  args: MutationLoginArgs,
  context: any,
  info: any
): Promise<AuthPayload> {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function vote(
  parent: any,
  args: MutationVoteArgs,
  context: any,
  info: any
): Promise<Vote> {
  const { userId } = context;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: args.linkId,
        userId: userId
      }
    }
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: args.linkId } }
    }
  });
  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
}

const mutations: MutationResolvers = {
  post,
  signup,
  login,
  vote
};
export default mutations;
