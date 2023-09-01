import React from 'react';
import { render, screen, fireEvent, act , waitFor} from '@testing-library/react';
import NewWorkoutToRoutine from './AddWorkoutsToRoutine'; 
import { MemoryRouter, useNavigate } from 'react-router-dom';

import mockAxios from './__mocks__/axios';


describe('AddWorkoutsToRoutine', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches user workout routines and then removes those days from dropdown', async () => {
  
            const mockedWorkouts = {
                status: 'success',
                data: [
                  { userworkoutid: 1, workoutname: "Bench Press" },
                  { userworkoutid: 2, workoutname: "Deadlift" },
                ],
              };
      
              const mockedWorkoutRoutines = {
                status: 'success',
                data: [
                  { workoutroutineid: 123, day: "Friday" },
                  { workoutroutineid: 456, day: "Wednesday" },
                ],
              };
          
              mockAxios.get.mockResolvedValueOnce({ data: mockedWorkouts })
                        .mockResolvedValueOnce({ data: mockedWorkoutRoutines });


          render(
           <MemoryRouter>
            <NewWorkoutToRoutine />
        </MemoryRouter>
         );
                      
             
        await waitFor(() => {
            const selectElement = screen.getByTestId('workoutSelection');
            expect(selectElement).toBeInTheDocument();
            
            expect(selectElement.innerHTML).toContain("Bench Press");
            expect(selectElement.innerHTML).toContain("Deadlift");


            

            const secondSelectedElement = screen.getByTestId('routineSelection');
            expect(secondSelectedElement).toBeInTheDocument();
            
            expect(secondSelectedElement.innerHTML).toContain("Friday");
            expect(secondSelectedElement.innerHTML).toContain("Wednesday");
          });
    });



    it('handles server errors gracefully', async () => {
        const serverErrorResponse = {
          status: "error",
          message: "Something went wrong!"
        };
    
        mockAxios.get.mockResolvedValueOnce({ data: serverErrorResponse })
        .mockResolvedValueOnce({ data: serverErrorResponse });
    
        render(
          <MemoryRouter>
            <NewWorkoutToRoutine />
          </MemoryRouter>
        );
    
        await waitFor(() => {
          expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
        });
      });
    
    });