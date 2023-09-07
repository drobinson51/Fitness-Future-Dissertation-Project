




import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { useCookies } from 'react-cookie';
import mockAxios from './__mocks__/axios';

// Mock useCookies

jest.mock('react-cookie');

describe('AuthContext', () => {

  // mocks
    let mockCookies = {};
    let mockSetCookie = jest.fn();
    let mockRemoveCookie = jest.fn();

    // Again mocks

    useCookies.mockReturnValue([mockCookies, mockSetCookie, mockRemoveCookie]);


    beforeEach(() => {
        // Reset mock functions
        mockAxios.post.mockReset();
      
        mockSetCookie = jest.fn();
        let mockRemoveCookie = jest.fn();
      
        // Mocks beign returned
        useCookies.mockReturnValue([{}, mockSetCookie, mockRemoveCookie]);
      
        // mock axios post which is crux of non-mocked version
        mockAxios.post.mockResolvedValue({
          data: {
            message: 'Login successful',
            userid: 'sampleUserId',
            usersName: 'sampleUserName'
          }
        });
      });


     it('axios returns expected data from login', async () => {

      // Expected response
        const expectedData = {
            message: 'Login successful',
            userid: 'sampleUserId',
            usersName: 'sampleUserName'
        };

        
        //Assert data is the same 
        await act(async () => {
            const result = await mockAxios.post('/login', {
                username: 'sampleUsername',
                password: 'samplePassword'
            });
            expect(result.data).toEqual(expectedData);
        });
    });



    

    it('sets cookies correctly after successful axios call', async () => {

        // Mock data
        const mockEmail = 'sampleEmail@example.com';
        const mockPassword = 'samplePassword';

        // Render auth context for use
        
        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>
          });

        //   Sets cookies
          await act(async () => {
            await result.current.login(mockEmail, mockPassword);
          });
        
        // Checks if cookies are set correct
        expect(mockSetCookie).toHaveBeenCalledWith('authUser', 'sampleUserId');
        expect(mockSetCookie).toHaveBeenCalledWith('isLoggedIn', true);
        expect(mockSetCookie).toHaveBeenCalledWith('userName', 'sampleUserName');
      });
    });