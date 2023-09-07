import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import UserPage from './User'; 
import { MemoryRouter } from 'react-router-dom';
import mockAxios from './__mocks__/axios';


// Mocking the bar chart
jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mockBarChart" />
  }));


// Tests all is returning as planned on userHome page
describe('UserPage', () => {
  
    afterEach(() => {
      mockAxios.reset();
    });
  

    // Test data
    it.only('fetches and sets the workout data', async () => {
        const mockedProgress = {
            status: 'success',
  
            data: [

            {
                  userworkoutid: 19,
                  userid: 6,
                  workoutid: 1,
                  customliftweight: 80,
                  customliftreps: 5,
                  workoutname: "Bench Press",
                  workoutdesc: "The Classic!",
                  progressid: 13,
                  totalweightlifted: 200,
                  repscompleted: 25,
                  timestamp: "2023-08-04T14:04:22.000Z"
            },
        ]
    }

    const mockedPosition = {
        status: 'success',

        data: [

        {
              title: "Beginner",
              description: "Keep on trucking!"
        },
    ]
}


// The two api responses. 
        mockAxios.get.mockResolvedValueOnce({ data: mockedProgress });
        mockAxios.get.mockResolvedValueOnce({ data: mockedPosition });


        render(
          <MemoryRouter>
            <UserPage />
          </MemoryRouter>
        );
      
        // Check for the presence of elements that are resultant from workouts being populated
        await waitFor(() => {
           expect(screen.getByTestId('mockBarChart')).toBeInTheDocument();
            expect(screen.getByText("Beginner")).toBeInTheDocument();
            expect(screen.getByText("Keep on trucking!")).toBeInTheDocument();
        });
      });



      });
