import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import RemoveRoutineExercise from './RemoveExerciseFromRoutine'; 
import { MemoryRouter } from 'react-router-dom';

import mockAxios from './__mocks__/axios';



describe('RemoveExerciseFromRoutine', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and populates dropdowns', async () => {
  
        // Dropdowns working correctly
        const mockedRoutineExercises = {
            status: 'success',
            data: [
              { routineexerciseid: 1, workoutname: "Squat", workoutroutineid: 100, day: "Monday" },
              { routineexerciseid: 2, workoutname: "Deadlift", workoutroutineid: 200, day: "Tuesday" },
            ],
          };
    
    // Mocks get
          mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });


          render(
           <MemoryRouter>
            <RemoveRoutineExercise  />
        </MemoryRouter>
         );
                      
             
         await waitFor(() => {
            const routineDropdown = screen.getByTestId('workoutroutine');
            expect(routineDropdown).toBeInTheDocument();

             
            expect(routineDropdown.innerHTML).toContain("Monday");
            expect(routineDropdown.innerHTML).toContain("Tuesday");


            // Select a routine
            fireEvent.change(routineDropdown, { target: { value: 'Monday' } });

           
          });


          await waitFor(() => {
          const exerciseDropdown = screen.getByTestId('routineexercise');
           

          expect(exerciseDropdown.innerHTML).toContain("Squat");
          });
        });

        // Only needs to test modal really as manual confirms

        it('modal appears', async () => {
  
            const mockedRoutineExercises = {
                status: 'success',
                data: [
                    { routineexerciseid: 1, workoutname: "Squat", workoutroutineid: 100, day: "Monday" },
                    { routineexerciseid: 2, workoutname: "Deadlift", workoutroutineid: 200, day: "Tuesday" },
                ],
            };
        
            mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });
        
            render(
                <MemoryRouter>
                    <RemoveRoutineExercise />
                </MemoryRouter>
            );
        
            // Check 'workoutroutine' dropdown
            await waitFor(() => {
                const routineDropdown = screen.getByTestId('workoutroutine');
                expect(routineDropdown).toBeInTheDocument();
        
                expect(screen.getByText("Monday")).toBeInTheDocument();
                expect(screen.getByText("Tuesday")).toBeInTheDocument();
        
                fireEvent.change(routineDropdown, { target: { value: 'Monday' } });
            });
        
            // Check 'routineexercise' dropdown
            await waitFor(() => {
                const exerciseDropdown = screen.getByTestId('routineexercise');
                expect(screen.getByText("Squat")).toBeInTheDocument();
        
                fireEvent.change(exerciseDropdown, { target: { value: 'Squat' } });
            });
        
           
            fireEvent.click(screen.getByText('Remove Exercise'));  
        
            await waitFor(() => {
                expect(screen.getByText('Confirm Deletion')).toBeInTheDocument(); 
            });

            
        
        });
    });