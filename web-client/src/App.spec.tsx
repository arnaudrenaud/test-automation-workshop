import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';

import App, { GET_WILDERS } from './App';

const GET_WILDERS_SUCCESS_MOCK = {
  request: {
    query: GET_WILDERS,
  },
  result: {
    data: {
      wilders: [
        {
          id: '1',
          displayName: '[SXB] Lorie Laurette',
        },
        {
          id: '2',
          displayName: '[PAR] Laure Laurent',
        },
      ],
    },
  },
};

const GET_WILDERS_ERROR_MOCK = {
  request: {
    query: GET_WILDERS,
  },
  error: new Error('Unable to reach server.'),
};

describe('App', () => {
  describe('while fetching wilders', () => {
    it('renders loading', () => {
      render(
        <MockedProvider mocks={[GET_WILDERS_SUCCESS_MOCK]} addTypename={false}>
          <App />
        </MockedProvider>
      );

      expect(screen.getByText('Chargement en cours…')).toBeInTheDocument();
    });
  });

  describe('when unable to reach server', () => {
    it('renders error', async () => {
      render(
        <MockedProvider mocks={[GET_WILDERS_ERROR_MOCK]} addTypename={false}>
          <App />
        </MockedProvider>
      );

      const errorMessage = await waitFor(() =>
        screen.getByText('Erreur de chargement.')
      );

      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('when fetching wilders succeeded', () => {
    it('renders wilders', async () => {
      render(
        <MockedProvider mocks={[GET_WILDERS_SUCCESS_MOCK]} addTypename={false}>
          <App />
        </MockedProvider>
      );

      const list = await waitFor(() => screen.getByRole('list'));

      const listItems = within(list).getAllByRole('listitem');
      expect(listItems).toHaveLength(2);

      expect(listItems[0]).toHaveTextContent('[SXB] Lorie Laurette');
      expect(listItems[1]).toHaveTextContent('[PAR] Laure Laurent');
    });
  });
});
