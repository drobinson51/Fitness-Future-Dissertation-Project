import React from 'react';
import { render, screen, waitFor,} from '@testing-library/react';
import EditWorkouts from './EditWorkouts'; 
import { MemoryRouter } from 'react-router-dom';

import mockAxios from './__mocks__/axios';




// Very quick check of dropdowns

describe('Edit Workout Check', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and populates dropdowns', async () => {

        const mockedWorkoutData = {
            status: 'success',
            data: [
                {userworkoutid: 12,
                userid: 6,
                userid: 1,
                customliftweight: 140,
                customliftreps: 5,
                workoutname: "Overhead Press",
                workoutdesc: "Nothing makes you feel stronger"
                }
            ]
        };

        mockAxios.get.mockResolvedValueOnce({ data: mockedWorkoutData });

        render(
            <MemoryRouter>
                <EditWorkouts />
            </MemoryRouter>
        );

        // Wait for the dropdown to get populated.
        await waitFor(() => {
            const workoutdropdown = screen.getByTestId("workoutSelection"); 
            expect(workoutdropdown).toBeInTheDocument();

            expect(workoutdropdown.innerHTML).toContain("Overhead Press");
         
        });
    });


});