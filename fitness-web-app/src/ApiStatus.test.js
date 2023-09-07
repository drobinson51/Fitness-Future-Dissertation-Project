import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';


import ApiStatus from './ApiStatus';
import mockAxios from './__mocks__/axios';

// Not necessary but tested anyways
describe('ApiStatus', () => {
  afterEach(() => {

    mockAxios.reset();
  });


  // Page renders correctly
  it('should render successful API status', async () => {
    render(<ApiStatus />);

    const mockResponse = { data: { message: 'Connected' } };
    mockAxios.mockResponse(mockResponse);

    // Behaviour in order
    await waitFor(() => {
      expect(screen.getByText('Connection Status: Connected')).toBeInTheDocument();
    });
  });

  it('should render error status when API call fails', async () => {
    render(<ApiStatus />);

    // No connection mock
    mockAxios.mockError(new Error('Failed to fetch'));

    // Expected behaviour check.
    await waitFor(() => {
      expect(screen.getByText('Connection Status: Error connecting to the server')).toBeInTheDocument();
    });
  });
});