import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 

import ApiStatus from './ApiStatus';
import mockAxios from './__mocks__/axios';

describe('ApiStatus', () => {
  afterEach(() => {

    mockAxios.reset();
  });

  it('should render successful API status', async () => {
    render(<ApiStatus />);

    const mockResponse = { data: { message: 'Connected' } };
    mockAxios.mockResponse(mockResponse);

    await waitFor(() => {
      expect(screen.getByText('Connection Status: Connected')).toBeInTheDocument();
    });
  });

  it('should render error status when API call fails', async () => {
    render(<ApiStatus />);

    mockAxios.mockError(new Error('Failed to fetch'));

    await waitFor(() => {
      expect(screen.getByText('Connection Status: Error connecting to the server')).toBeInTheDocument();
    });
  });
});