import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { FEED_QUERY, FeedResult } from './LinkList';

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });

  const navigate = useNavigate();

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: { description: formState.description, url: formState.url },
    onCompleted: () => navigate('/'),
    update(cache, { data: { link } }) {
      const { feed } = cache.readQuery<FeedResult>({
        query: FEED_QUERY,
        variables: { orderBy: { createdAt: 'desc' } }
      });
      
      const updatedLinks = feed.links.push(link);

      cache.writeQuery({
        query: FEED_QUERY,
        data: { feed: { links: updatedLinks } },
        variables: { orderBy: { createdAt: 'desc' } }
      });
    }
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
