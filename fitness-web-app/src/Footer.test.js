import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import Footer from './Footer';


describe("Footer", () => {


    beforeEach(() => {
        render(
          
            <Footer />
        );
      });

    it("should render the footer", () => {
        expect(screen.getByText("Copyright Fitness Future 2023")).toBeInTheDocument();
      });


});


