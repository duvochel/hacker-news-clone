import { Resolvers } from '@/__generated__/resolvers-types';
import Query from './queries.js';
import Mutation from './mutations.js';
import User from './user.js';
import Link from './link.js';
import Vote from './vote.js';
import Subscription from './subscriptions.js';

const resolvers: Resolvers = { Query, Mutation, User, Link, Vote, Subscription };

export default resolvers;
