

import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from './AuthContext';


const mockContext = {
    isLoggedIn: false
  };

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/exampleroute' }),
}));
  
  const mockNavigate = jest.fn((path) => {
    console.log(`Navigating to: ${path}`);
    return path;
  });
  
// Mock of how the auth context decides what values and pages are served the protected route function
  jest.mock('./AuthContext', () => ({
    useAuth: jest.fn(() => mockContext),
    AuthContext: {
      Provider: ({ children }) => children,
      Consumer: jest.fn(),
    }
  }));

  

 beforeEach(() => {
    mockNavigate.mockClear();
  });


    // Sets conditions of what will be server using web api history to mock navigation
    const renderWithRouter = (Navbar, { route = '/exampleroute' } = {}) => {
        window.history.pushState({}, 'Test page', route);
        return render(Navbar, { wrapper: MemoryRouter });
      };
      
      describe("ProtectedRoute Component Tests", () => {
        
        it('renders the RegisteredNavbar for logged-in users', () => {
          mockContext.isLoggedIn = true;
          renderWithRouter(<ProtectedRoute element={<div />} />);
          expect(screen.getByText('Workout Record')).toBeInTheDocument();
        });
      
        it('renders the Unregisterednavbar for non logged-in users', () => {
          mockContext.isLoggedIn = false;
          renderWithRouter(<ProtectedRoute element={<div />} />);
          expect(screen.getByText('Login')).toBeInTheDocument();
        });
      
        it('does redirect not logged-in users', async () => {
          mockContext.isLoggedIn = false;
          console.log(mockContext);
          renderWithRouter(<ProtectedRoute element={<div>Protected Content</div>} />, { route: '/exampleroute' });
          expect(mockNavigate).toHaveBeenCalled;
        });
      
        it('does not redirect logged in users', async () => {
          mockContext.isLoggedIn = true;
          renderWithRouter(<ProtectedRoute element={<div>Protected Content</div>} />, { route: '/exampleroute' });

          
        // Await route
          await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
          });
          expect(mockNavigate).not.toHaveBeenCalled();
        });
      
      });
      