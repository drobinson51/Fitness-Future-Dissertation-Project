import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { BrowserRouter as Router } from 'react-router-dom';
import UnregisteredNavbar from './UnregisteredNavbar';




describe("Registed Navbar", () => {


    beforeEach(() => {
        render(
          <Router>
            <UnregisteredNavbar />
          </Router>
        );
      });



    it("should render the button", () => {
        expect(screen.getByText('Fitness-Future')).toBeInTheDocument();
      });


      it("should render the href links of the navbar", () => {
        expect(screen.getByText('Fitness-Future').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
      });





});


