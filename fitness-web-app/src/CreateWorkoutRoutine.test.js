import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import NewUserWorkoutRoutine from './CreateWorkoutRoutine'; 
import { MemoryRouter } from 'react-router-dom';

import mockAxios from './__mocks__/axios';

describe('NewUserWorkout', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches user workout routines and then removes those days from dropdown', async () => {

      // Classic test
        const mockedWorkouts = {
            status: 'success',
            data: [
                { workoutroutineid: 123, userid: 1, day: "Friday" },
                { workoutroutineid: 456, userid: 1,  day: "Wednesday" },
            ],
        };
      
        // Mocks get
        mockAxios.get.mockResolvedValueOnce({ data: mockedWorkouts });

        // Memory Router to render page correctly

        render(
          <MemoryRouter>
            <NewUserWorkoutRoutine />
          </MemoryRouter>
        );

        // Awaits success response
      
        await waitFor(() => {
            const selectElement = screen.getByTestId('daySelection');
            expect(selectElement).toBeInTheDocument();
            
            expect(selectElement.innerHTML).not.toContain("Friday");
            expect(selectElement.innerHTML).not.toContain("Wednesday");
          });
          
      });

      // Checks posts
      it('posts days and gets successmessage', async () => {

        // mock data
        const serverSuccessResponse = {
            status: 'success',
            successMessage: 'Workout routine created successfully!',
        };
      
        // Mock response
        mockAxios.post.mockResolvedValueOnce({ data: serverSuccessResponse });

        // Renders page
        render(
            <MemoryRouter>
              <NewUserWorkoutRoutine />
            </MemoryRouter>
          );

          //Uses dropdown
        fireEvent.change(screen.getByLabelText('Select a day:'), {
            target: { value: 'Monday' },
        });

        // Presses button
        fireEvent.click(screen.getByText('Create routine'));

        // Waits for the success message
        await waitFor(() => {
            expect(screen.getByText('Workout routine created successfully!')).toBeInTheDocument();
        });
    });

// Error logic

  it('handles server errors gracefully', async () => {
    const serverErrorResponse = {
      status: "error",
      message: "Something went wrong!"
    };

    // Post
    mockAxios.get.mockResolvedValueOnce({ data: serverErrorResponse });

    render(
      <MemoryRouter>
        <NewUserWorkoutRoutine />
      </MemoryRouter>
    );


      // Waits for the error to show up in the page
    await waitFor(() => {
      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    });
  });

});
