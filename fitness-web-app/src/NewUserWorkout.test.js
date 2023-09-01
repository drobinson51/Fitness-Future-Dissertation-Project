import React from 'react';
import { render, screen, fireEvent, act , waitFor} from '@testing-library/react';
import NewUserWorkout from './NewUserWorkout'; 
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 
import mockAxios from './__mocks__/axios';

describe('NewUserWorkout', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and sets the workout data', async () => {
        const mockedWorkouts = {
            status: 'success',
            data: [
                { workoutid: 1, workoutname: "Squat" },
                { workoutid: 2, workoutname: "Bench Press" },
            ],
        };
      
        mockAxios.get.mockResolvedValueOnce({ data: mockedWorkouts });


        render(
          <MemoryRouter>
            <NewUserWorkout />
          </MemoryRouter>
        );
      
        // Check for the presence of elements that are resultant from workouts being populated
        await waitFor(() => {
            expect(screen.getByText("Squat")).toBeInTheDocument();
            expect(screen.getByText("Bench Press")).toBeInTheDocument();
        });
      });


      it('handles server errors gracefully', async () => {
        // Mock a server error response
        const serverErrorResponse = {
            status: "error",
            message: "Something went wrong!"
        };

        mockAxios.get.mockResolvedValueOnce({ data: serverErrorResponse });
        
        render(
            <MemoryRouter>
                <NewUserWorkout />
            </MemoryRouter>
        );
        
        // Check if the server's error message is displayed
        await waitFor(() => {
            expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
        });
    });

      });
