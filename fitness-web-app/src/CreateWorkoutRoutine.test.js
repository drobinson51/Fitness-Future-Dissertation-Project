import React from 'react';
import { render, screen, fireEvent, act , waitFor} from '@testing-library/react';
import NewUserWorkoutRoutine from './CreateWorkoutRoutine'; 
import { MemoryRouter } from 'react-router-dom';

import mockAxios from './__mocks__/axios';

describe('NewUserWorkout', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches user workout routines and then removes those days from dropdown', async () => {
        const mockedWorkouts = {
            status: 'success',
            data: [
                { workoutroutineid: 123, userid: 1, day: "Friday" },
                { workoutroutineid: 456, userid: 1,  day: "Wednesday" },
            ],
        };
      
        mockAxios.get.mockResolvedValueOnce({ data: mockedWorkouts });


        render(
          <MemoryRouter>
            <NewUserWorkoutRoutine />
          </MemoryRouter>
        );
      
        await waitFor(() => {
            const selectElement = screen.getByTestId('daySelection');
            expect(selectElement).toBeInTheDocument();
            
            expect(selectElement.innerHTML).not.toContain("Friday");
            expect(selectElement.innerHTML).not.toContain("Wednesday");
          });
          
      });

      it('posts days and gets successmessage', async () => {

        const serverSuccessResponse = {
            status: 'success',
            successMessage: 'Workout routine created successfully!',
        };
      
        mockAxios.post.mockResolvedValueOnce({ data: serverSuccessResponse });

        render(
            <MemoryRouter>
              <NewUserWorkoutRoutine />
            </MemoryRouter>
          );

        fireEvent.change(screen.getByLabelText('Select a day:'), {
            target: { value: 'Monday' },
        });

        fireEvent.click(screen.getByText('Create routine'));

        await waitFor(() => {
            expect(screen.getByText('Workout routine created successfully!')).toBeInTheDocument();
        });
    });



  it('handles server errors gracefully', async () => {
    const serverErrorResponse = {
      status: "error",
      message: "Something went wrong!"
    };

    mockAxios.get.mockResolvedValueOnce({ data: serverErrorResponse });

    render(
      <MemoryRouter>
        <NewUserWorkoutRoutine />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    });
  });

});
