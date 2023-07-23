import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies('authUser');


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
      } else {
        throw new Error('Login unsuccessful');
      }
    } catch (error) {
      throw new Error('Login unsuccessful');
    }
  };

  const logout = () => {
    setAuthUser(null);
    setIsLoggedIn(false);

    // Cookie area if wanted

    removeCookie('authUser');
  };

  console.log('authUser value:', authUser); 


  const value = {
    authUser,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}