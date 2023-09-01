import React from 'react';
import { render, screen, fireEvent, act , waitFor,} from '@testing-library/react';
import DeleteUserWorkouts from './DeleteUserWorkout'; 
import { MemoryRouter, useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import mockAxios from './__mocks__/axios';

const mockNavigate = jest.fn();

const mockLocationState = {
    deletionMessage: "The exercise has been removed from your routine."
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState })  // Add this mock
}));

describe('Delete User Workout', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and populates dropdowns', async () => {

        const mockedTrackedExercises = {
            status: 'success',
            data: [
                { userworkoutid: 12,
                userid: 6,
                workoutid: 3,
                customliftweight: 140,
                customliftreps: 5,
                workoutname: "Overhead press",
                workoutdesc: "Nothing makes you feel stronger than lifitng a heavy weight over your head and putting it back down again." },
            ],
        };

        mockAxios.get.mockResolvedValueOnce({ data: mockedTrackedExercises });

        render(
            <MemoryRouter>
                <DeleteUserWorkouts />
            </MemoryRouter>
        );

        // Wait for the dropdown to get populated.
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId("workoutselection"); 
            expect(exerciseDropdown).toBeInTheDocument();

            expect(exerciseDropdown.innerHTML).toContain("Overhead press");
         
        });
    });

    it('modal appears', async () => {
  
        const mockedRoutineExercises = {
            status: 'success',
            data: [
                { userworkoutid: 1, workoutname: "Squat" },
            ],
        };
    
        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });
    
        render(
            <MemoryRouter>
                <DeleteUserWorkouts/>
            </MemoryRouter>
        );
    
        // Selection of dropdown
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId('workoutselection'); 
            expect(screen.getByText("Squat")).toBeInTheDocument();
            fireEvent.change(exerciseDropdown, { target: { value: 'Squat' } });
        });


    
       
       
        fireEvent.click(screen.getByText('Delete User Workout'));  
    
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument(); 
        });

        
    
    });




    it('deletes an item and displays deletionMessage', async () => {
        const mockedTrackedExercises = {
            status: 'success',
            data: [
                {
                userworkoutid: 123,
                userid: 456,
                workoutid: 789,
                customliftweight: 200,
                customliftreps: 5,
                workoutname: "Overhead press",
                workoutdesc: "Nothing makes you feel stronger than lifitng a heavy weight over your head and putting it back down again."
                }
            ]
        };
        
        const mockedDeletionResponse = {
            status: 'success',
            deletionMessage: "The exercise has been removed from your routine"
        };
        
        // Mocked api calls
        mockAxios.get.mockResolvedValueOnce({ data: mockedTrackedExercises });
        mockAxios.post.mockResolvedValueOnce({ data: mockedDeletionResponse });
        
        render(
            <MemoryRouter>
                <DeleteUserWorkouts />
            </MemoryRouter>
        );
        
        // Selection of dropdown
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId('workoutselection'); 
            expect(screen.getByText("Overhead press")).toBeInTheDocument();
            fireEvent.change(exerciseDropdown, { target: { value: '789' } });
        });

        // Mocked modal call
        
        fireEvent.click(screen.getByText('Delete User Workout'));  
        
        // Wait for the call
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('actualDelete'));
        });
        
        // Wait for the post to be made
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledTimes(1));
        // Wait for the navigate
        expect(mockNavigate).toHaveBeenCalled();
        
        // Message shown
        expect(screen.getByText("The exercise has been removed from your routine.")).toBeInTheDocument();
    }); 


    
    it('displays an error message when the fetch fails', async () => {
        mockAxios.get.mockRejectedValueOnce(new Error('An error occurred'));

        
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