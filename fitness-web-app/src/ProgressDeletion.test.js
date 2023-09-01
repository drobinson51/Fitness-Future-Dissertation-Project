import React from 'react';
import { render, screen, fireEvent, act , waitFor,} from '@testing-library/react';
import ProgressDeletion from './ProgressDeletion'; 
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

describe('Progress Deletion', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and populates dropdowns', async () => {

        const mockedRoutineExercises = {
            status: 'success',
            data: [
                { userworkoutid: 1, workoutname: "Squat" },
                { userworkoutid: 2, workoutname: "Deadlift" }
            ],
        };

        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });

        render(
            <MemoryRouter>
                <ProgressDeletion />
            </MemoryRouter>
        );

        // Wait for the dropdown to get populated.
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId('exerciseselection'); 
            expect(exerciseDropdown).toBeInTheDocument();

            expect(exerciseDropdown.innerHTML).toContain("Squat");
            expect(exerciseDropdown.innerHTML).toContain("Deadlift");
        });
    });

    it('modal appears', async () => {
  
        const mockedRoutineExercises = {
            status: 'success',
            data: [
                { userworkoutid: 1, workoutname: "Squat" },
                { userworkoutid: 2, workoutname: "Deadlift" }
            ],
        };
    
        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });
    
        render(
            <MemoryRouter>
                <ProgressDeletion />
            </MemoryRouter>
        );
    
        // Selection of dropdown
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId('exerciseselection'); 
            expect(screen.getByText("Squat")).toBeInTheDocument();
            fireEvent.change(exerciseDropdown, { target: { value: 'Squat' } });
        });


    
       
       
        fireEvent.click(screen.getByText('Delete Progress'));  
    
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument(); 
        });

        
    
    });



    it('deletes an item and displays deletionMessage', async () => {
        const mockedRoutineExercises = {
            status: 'success',
            data: [
                { userworkoutid: 1, workoutname: "Squat" },
                { userworkoutid: 2, workoutname: "Deadlift" }
            ],
        };
        
        const mockedDeletionResponse = {
            status: 'success',
            deletionMessage: "The exercise has been removed from your routine"
        };
        
        // Mocked api calls
        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineExercises });
        mockAxios.post.mockResolvedValueOnce({ data: mockedDeletionResponse });
        
        render(
            <MemoryRouter>
                <ProgressDeletion />
            </MemoryRouter>
        );
        
        // Selection of dropdown
        await waitFor(() => {
            const exerciseDropdown = screen.getByTestId('exerciseselection'); 
            expect(screen.getByText("Squat")).toBeInTheDocument();
            fireEvent.change(exerciseDropdown, { target: { value: '1' } });
        });

        // Mocked modal call
        
        fireEvent.click(screen.getByText('Delete Progress'));  
        
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
        mockAxios.post.mockRejectedValueOnce(new Error('Deletion failed'));

        
        render(
            <MemoryRouter>
                <ProgressDeletion />
            </MemoryRouter>
        );
    
        // Depending on how your component handles errors, you might show an error message to the user.
            await waitFor(() => {
            expect(screen.getByText('An error occurred')).toBeInTheDocument();
        });
    });
    
});