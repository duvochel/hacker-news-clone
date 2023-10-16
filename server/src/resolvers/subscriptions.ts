import { Link, SubscriptionResolvers, Vote } from '@/__generated__/resolvers-types';

function newLinkSubscribe(_: any, __: any, context: any) {
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload: Link) => {
    return payload;
  }
};

function newVoteSubscribe(parent: any, args: any, context: any, info: any) {
  return context.pubsub.asyncIterator('NEW_VOTE');
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload: Vote) => {
    return payload;
  }
};

const subscriptions: SubscriptionResolvers = {
  newLink,
  newVote
};
export default subscriptions;
