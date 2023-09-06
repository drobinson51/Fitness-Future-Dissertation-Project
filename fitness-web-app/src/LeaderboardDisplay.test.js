import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LeaderBoardDisplay from './LeaderboardDisplay'; // adjust path if necessary
import mockAxios from './__mocks__/axios';


// Checks the leaderboard rendering correctly
describe('LeaderBoardDisplay', () => {
  
  afterEach(() => {
    mockAxios.reset();
  });

  it('should display leaderboard data when fetched successfully', async () => {

    // Mock data
    const mockData = {
      data: [
        { userid: '1', username: 'JohnDoe', points: 100 },
        { userid: '2', username: 'JaneSmith', points: 90 }
      ]
    };

    render(<LeaderBoardDisplay />);

    mockAxios.mockResponse({ data: mockData });

    // See if the table is there
    await waitFor(() => {
      expect(screen.getByText('JohnDoe')).toBeInTheDocument();
      expect(screen.getByText('JaneSmith')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  // Error handling
  it('should handle errors', async () => {
    render(<LeaderBoardDisplay />); 

 
    mockAxios.mockError(new Error('Failed to fetch'));

    await waitFor(() => {
      expect(screen.queryByText('JohnDoe')).toBeNull();
    });
});
});