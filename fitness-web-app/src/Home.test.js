import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // To handle the Link component
import HomePage from "./Home";

// Checks the home page is rendering correctly
describe("HomePage", () => {
  beforeEach(() => {
    render(
      <MemoryRouter> {/* Needed for components using react-router's Link plus protected route function */}
        <HomePage />
      </MemoryRouter>
    );
  });

  it("should render the main title", () => {
    expect(screen.getByText("Your Future in Fitness")).toBeInTheDocument();
  });

  it("should render the introductory text", () => {

    // More flexible in finding partial string which proved a bother
    expect(screen.getByText(/Keeping track of your fitness can be hard in today's world,/i)).toBeInTheDocument();

  });

  it("should render the sign-up button", () => {
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });


});
