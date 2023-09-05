import React from 'react';
import { render, screen, fireEvent, act , waitFor} from '@testing-library/react';
import Completedworkoutform from './ExerciseCompletion'; 
import { MemoryRouter } from 'react-router-dom';

import mockAxios from './__mocks__/axios';

describe('Exercise Completion', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches user workout routines and populates day dropdown', async () => {
        const mockedWorkouts = {
            status: 'success',
            data: [
              {
                userworkoutid: 12,
                userid: 6,
                workoutid: 3,
                customliftweight: 140,
                customliftreps: 5,
                day: 'Monday', 
                workoutname: 'Overhead press',
                workoutdesc: 'Nothing makes you feel stronger than lifting a heavy weight over your head and putting it back down again.',
              },
            ],
          };
        mockAxios.get.mockResolvedValueOnce({ data: mockedWorkouts });


        render(
          <MemoryRouter>
            <Completedworkoutform/>
          </MemoryRouter>
        );
      
        await waitFor(() => {
            const selectElement = screen.getByTestId('daySelection');
            expect(selectElement).toBeInTheDocument();
            
            expect(selectElement.innerHTML).toContain("Monday");

           
          });
          fireEvent.change(screen.getByTestId('daySelection'), { target: { value: 'Monday' } });


   await waitFor(() => {
          expect(screen.getByText('Exercise Name')).toBeInTheDocument();
          expect(screen.getByText('Working Weight')).toBeInTheDocument();
          expect(screen.getByText('Working Set Reps')).toBeInTheDocument();
          expect(screen.getByText('Rep Weight')).toBeInTheDocument();
          expect(screen.getByText('Reps completed')).toBeInTheDocument();
          expect(screen.getByText('Sets Completed')).toBeInTheDocument();
          expect(screen.getByText('Overhead press')).toBeInTheDocument();
          expect(screen.getByText(/140\s*kg/)).toBeInTheDocument();
          expect(screen.getByText('5')).toBeInTheDocument();
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
        <Completedworkoutform />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("error")).toBeInTheDocument();
    });
  });


  
});
