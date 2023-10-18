import { Feed } from '@/__generated__/graphql';

import React from 'react';
import { useQuery, gql } from '@apollo/client';

import LinkElement from './LinkElement';

export interface FeedResult {
  feed: Feed;
}

export const FEED_QUERY = gql`
  query FeedQuery($orderBy: LinkOrderByInput) {
    feed(orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          name
        }
        votes {
          id
        }
      }
    }
  }
`;

const LinkList = () => {
  const { loading, error, data } = useQuery(FEED_QUERY, {
    variables: { orderBy: { createdAt: 'desc' } }
  });

  if (error) {
    return (
      <>
        <h2>Oups...</h2>
        <p>{error.message}</p>
      </>
    );
  }

  return (
    <div>
      {loading && <>Loading...</>}
      {data && (
        <>
          {data.feed.links.map((link, index) => (
            <LinkElement key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;
