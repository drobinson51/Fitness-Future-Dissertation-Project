import React from 'react';
import { render, screen, fireEvent, act , waitFor,} from '@testing-library/react';
import DeleteWorkoutRoutine from './DeleteWorkoutRoutine'; 
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

describe('Delete Workout Routine', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  
    it('fetches and populates dropdowns', async () => {

        const mockedRoutineDays = {
            status: 'success',
            data: [
                {workoutroutineid: 12,
                userid: 6,
                day: "Friday"
                }
            ]
        };

        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineDays });

        render(
            <MemoryRouter>
                <DeleteWorkoutRoutine />
            </MemoryRouter>
        );

        // Wait for the dropdown to get populated.
        await waitFor(() => {
            const dayDropdown = screen.getByTestId("daySelection"); 
            expect(dayDropdown).toBeInTheDocument();

            expect(dayDropdown.innerHTML).toContain("Friday");
         
        });
    });

    it('modal appears', async () => {
  
        const mockedRoutineDays = {
            status: 'success',
            data: [
                {workoutroutineid: 12,
                userid: 6,
                day: "Friday"
                }
            ]
        };

        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineDays });
    
        render(
            <MemoryRouter>
                <DeleteWorkoutRoutine/>
            </MemoryRouter>
        );
    
        // Selection of dropdown
        await waitFor(() => {
            const dayDropdown = screen.getByTestId("daySelection"); 
            expect(screen.getByText("Friday")).toBeInTheDocument();
            fireEvent.change(dayDropdown, { target: { value: 'Friday' } });
        });


    
       
       
        fireEvent.click(screen.getByText('Delete Routine'));  
    
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument(); 
        });

        
    
    });



    it('deletes an routine and displays deletionMessage', async () => {
        const mockedRoutineDays = {
            status: 'success',
            data: [
                {workoutroutineid: 12,
                userid: 6,
                day: "Friday"
                }
            ]
        };
        
        const mockedDeletionResponse = {
            status: 'success',
            deletionMessage: "The routine has been deleted"
        };
        
        // Mocked api calls
        mockAxios.get.mockResolvedValueOnce({ data: mockedRoutineDays});
        mockAxios.post.mockResolvedValueOnce({ data: mockedDeletionResponse });
        
        render(
            <MemoryRouter>
                <DeleteWorkoutRoutine/>
            </MemoryRouter>
        );
        
        // Selection of dropdown
        await waitFor(() => {
            const dayDropdown = screen.getByTestId("daySelection"); 
            expect(screen.getByText("Friday")).toBeInTheDocument();
            fireEvent.change(dayDropdown, { target: { value: 'Friday' } });
        });

        // Mocked modal call
        
        fireEvent.click(screen.getByText('Delete Routine'));  
    
        
        // Wait for the call
        await waitFor(() => {
            expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('actualDelete'));
        });
        

        
        // Message shown
        expect(screen.getByText("The exercise has been removed from your routine.")).toBeInTheDocument();
    }); 


    
    it('displays an error message when the fetch fails', async () => {
        mockAxios.get.mockRejectedValueOnce(new Error('An error occurred'));

        
        render(
            <MemoryRouter>
                <DeleteWorkoutRoutine/>
            </MemoryRouter>
        );
    
        // Will display this error
            await waitFor(() => {
            expect(screen.getByText('An error has occurred.')).toBeInTheDocument();
        });
    });
    

});