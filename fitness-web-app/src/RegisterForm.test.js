import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RegisterForm from './RegisterForm'; 
import { BrowserRouter as Router } from 'react-router-dom';
import mockAxios from './__mocks__/axios';




describe('RegisterForm', () => {


    jest.mock('bcryptjs', () => ({
        hashSync: jest.fn(() => 'hashedPassword')
      }));

    afterEach(() => {
        mockAxios.reset();
      });
    

    it('renders form elemets', () => {

        render(
            <Router>
              <RegisterForm />
            </Router>
          );
          expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
          expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
          expect(screen.getByTestId('emailPreferenceDropdown')).toBeInTheDocument();
          expect(screen.getByRole('button', {name: /sign-up/i})).toBeInTheDocument();
        
     
      
    })

    //Typical test of post
    it('successful post', async () => {
        render(<Router><RegisterForm /></Router>);
        
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testusername' } });
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByTestId('emailPreferenceDropdown'), { target: { value: '1' } });




        mockAxios.post.mockResolvedValueOnce({
            data: { successMessage: 'Registration successful!', userid: '123'}
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign-up/i }));
        });

   

        expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:4000/register', {
            email: 'test@test.com',
            password: expect.any(String), //hashed password
            username: 'testusername',
            firstname: 'John',
            lastname: 'Doe',
            emailpreference: '1'
        });
    });

    it ('handles failure to post', async () => {


        mockAxios.post.mockRejectedValueOnce({
            response: {
              data: {
                err: "User registration failed"
              }
            }
          });

          render(<Router><RegisterForm /></Router>);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testusername' } });
        fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByTestId('emailPreferenceDropdown'), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /sign-up/i }));


         

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign-up/i }));
          });
   
     expect(screen.getByText('User registration failed')).toBeInTheDocument();

    })
});



