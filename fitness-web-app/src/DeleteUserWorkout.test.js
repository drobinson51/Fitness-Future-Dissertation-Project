import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DeleteUserWorkouts from './DeleteUserWorkout'; 
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

import mockAxios from './__mocks__/axios';

jest.mock('axios');

describe('DeleteUserWorkouts', () => {
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
  });

  it('fetches and displays workout data', async () => {
    mockAxios.get.mockResolvedValueOnce({
        data: {
          status: 'success',
          data: [
            {
              userworkoutid: 12,
              userid: 6,
              workoutid: 3,
              customliftweight: 140,
              customliftreps: 5,
              workoutname: 'Overhead press',
              workoutdesc: 'Nothing makes you feel stronger than lifitng a heavy weight over your head and putting it back down again.',
            },
          ],
        },
      });

      axios.get.mockResolvedValueOnce({
        data: {
          status: 'Nothing found',
          data: [
          ],
        },
      });
      
      await act(async () => {
    render(
      <MemoryRouter>
        <DeleteUserWorkouts />
      </MemoryRouter>
    );
      });

    await waitFor(() => {
      expect(screen.getByTestId('workoutselection')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('workoutselection')).toHaveTextContent('Overhead');
  });

  it('shows a confirmation modal when deleting', async () => {

    mockAxios.get.mockResolvedValueOnce({
        data: {
          status: 'success',
          data: [
            {
              userworkoutid: 12,
              userid: 6,
              workoutid: 3,
              customliftweight: 140,
              customliftreps: 5,
              workoutname: 'Overhead press',
              workoutdesc: 'Nothing makes you feel stronger than lifitng a heavy weight over your head and putting it back down again.',
            },
          ],
        },
      });

      mockAxios.get.mockResolvedValueOnce({
        data: {
          status: 'Nothing found',
          data: [
          ],
        },
      });

      
      
      await act(async () => {
    render(
      <MemoryRouter>
        <DeleteUserWorkouts />
      </MemoryRouter>
    );
      });

      fireEvent.click(screen.getByText('Delete User Workout'));

    await waitFor(() => {
        expect(screen.getByTestId('actualDelete')).toBeInTheDocument();
    });
  });


  it('shows an error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <DeleteUserWorkouts />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
