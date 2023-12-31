import { Link } from '@/__generated__/graphql';

import React from 'react';
import { useMutation, gql } from '@apollo/client';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';
import { FEED_QUERY, FeedResult } from './LinkList';

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVote($linkId: ID!) {
    vote(linkId: $linkId) {
      id
    }
  }
`;

interface LinkProps {
  link: Link;
  index: number;
}

const LinkElement = ({ link, index }: LinkProps) => {
  const authToken = localStorage.getItem(AUTH_TOKEN);

  const [vote, { error }] = useMutation(CREATE_VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery<FeedResult>({
        query: FEED_QUERY,
        variables: { orderBy: { createdAt: 'desc' } }
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: { feed: { links: updatedLinks } }
      });
    }
  });

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div
            className="ml1 gray f11"
            style={{ cursor: 'pointer' }}
            onClick={() => vote()}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        {
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        }
      </div>
      {error && (
        <div className="orange">
          <p className="black">{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default LinkElement;
