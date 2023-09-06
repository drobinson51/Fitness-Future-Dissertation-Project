import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginForm from './LoginForm'; 
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 
import mockAxios from './__mocks__/axios';


// Various tests

jest.mock('./AuthContext', () => ({
    useAuth: () => ({ login: jest.fn() })
  }));


// test of login form
describe('LoginForm', () => {
  
    afterEach(() => {
        mockAxios.reset();
      });
    

    it('renders form elemets', () => {

        render(
            <MemoryRouter>
              <LoginForm />
            </MemoryRouter>
          );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    })




    it('successful post', async () => {
        render(<MemoryRouter><LoginForm /></MemoryRouter>);
        
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

        // Mocking the axios response
        mockAxios.post.mockResolvedValueOnce({
            data: { message: 'Login successful', userid: '123', usersName: 'Example' }
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /login/i }));
        });

        // Verify that axios.post was called with the correct URL and data
        expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:4000/login', {
            email: 'test@test.com',
            password: 'testpassword'
        });
    });
    it('displays error on unsuccessful login', async () => {
        render(<MemoryRouter><LoginForm /></MemoryRouter>);
    
        // Mock unsuccessful login API response.
        mockAxios.post.mockRejectedValueOnce({ 
          response: {
            status: 401, 
            data: { message: 'Login unsuccessful. Please check your email and password.' }
          }
        });
    
        // Simulate form submission
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
        
        await act(async () => {
          fireEvent.click(screen.getByRole('button', {name: /login/i}));
        });
    
        expect(screen.getByText("An error has occured during login, please try again later.")).toBeInTheDocument();
      });
    
});
