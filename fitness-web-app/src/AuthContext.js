import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthContext = React.createContext();


export function AuthProvider(props) {
  
  const [cookies, setCookie, removeCookie] = useCookies('authUser');

  const [authUser, setAuthUser] = useState(cookies.authUser || null);
  const [isLoggedIn, setIsLoggedIn] = useState(cookies.isLoggedIn || false);


  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

   

      if (response.data.message === 'Login successful') {
        console.log(response.data)
        const userid = response.data.userid
        console.log(userid);
        setAuthUser(userid);
        setIsLoggedIn(true);
        setCookie('authUser', userid); 
        setCookie('isLoggedIn', true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Login unsuccessful. Please check your email and password are correct.');
    }

  
  };

  const logout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);



    removeCookie('authUser');
    removeCookie ('isLoggedIn');
  };

  console.log('authUser value:', authUser); 


  const value = {
    authUser,
    isLoggedIn,
    login,
    };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );

  
}
export function useAuth() {
    return useContext(AuthContext);
  }