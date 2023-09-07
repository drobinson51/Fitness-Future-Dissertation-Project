import React from 'react';
import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Footer from './Footer';


describe("Footer", () => {


  // Tests the footer is actually rendering
    beforeEach(() => {
        render(
          
            <Footer />
        );
      });

    it("should render the footer", () => {
        expect(screen.getByText("Copyright Fitness Future 2023")).toBeInTheDocument();
      });


});


