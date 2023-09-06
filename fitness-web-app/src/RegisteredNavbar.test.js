// Test of Register navbar
jest.mock('./AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { BrowserRouter as Router } from 'react-router-dom';


import RegisteredNavbar from './RegisteredNavbar';


describe("Registed Navbar", () => {


    beforeEach(() => {
        render(
          <Router>
            <RegisteredNavbar />
          </Router>
        );
      });



    it("should render the button", () => {
        expect(screen.getByText('Fitness-Future')).toBeInTheDocument();
      });


      it("should render the href links of the navbar", () => {
        expect(screen.getByText('The Leaderboard').closest('a')).toHaveAttribute('href', '/leaderboard');
        expect(screen.getByText('Workout Record').closest('a')).toHaveAttribute('href', '/exercisecompletion');
      });


      
      it("should render the workout management links after a click", () => {

        const dropdownPress = screen.getByText('Workout Management')

        fireEvent.click(dropdownPress);

        expect(screen.getByText('Exercise Tracker').closest('a')).toHaveAttribute('href', '/addworkouts');
        expect(screen.getByText('Create Routine').closest('a')).toHaveAttribute('href', '/createroutine');
        expect(screen.getByText('Edit Tracked Exercises').closest('a')).toHaveAttribute('href', '/editworkouts');
        expect(screen.getByText('Customise Routine').closest('a')).toHaveAttribute('href', '/addexercisestoroutine');
        expect(screen.getByText('Stop Tracking Exercise').closest('a')).toHaveAttribute('href', '/deleteworkouts');
        
        expect(screen.getByText('Drop Exercise From Routine').closest('a')).toHaveAttribute('href', '/removeroutineexercise');
        expect(screen.getByText('Delete Routine').closest('a')).toHaveAttribute('href', '/deleteworkoutroutine');
        expect(screen.getByText('Reset exercise progress').closest('a')).toHaveAttribute('href', '/resetprogress');
        
        });





});


