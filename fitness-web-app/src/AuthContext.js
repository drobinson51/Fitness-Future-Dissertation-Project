import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthContext = React.createContext();


export function AuthProvider(props) {
  

  // Sets the three cookie types

  const [cookies, setCookie, removeCookie] = useCookies(['authUser', 'isLoggedIn', 'userName']);



  // The three types of cookies are set to either be null, or the sates they need to be in
  const [authUser, setAuthUser] = useState(cookies.authUser || null);
  const [isLoggedIn, setIsLoggedIn] = useState(cookies.isLoggedIn || false);
  const [userName, setUserName] = useState(cookies.userName || null);




  // Login function, gets it from the API call to the database
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

   

      // A successful login logic
      if (response.data.message === 'Login successful') {
        console.log(response.data)

        // Sets userid, and name
        const userid = response.data.userid
        const usersname = response.data.usersName;
        console.log(userid);

        // Sets these values
        setAuthUser(userid);
        setIsLoggedIn(true);
        setUserName(usersname);

        // uses cookies as 'keys' to site, one is set to user id, the isloggedIn is used in the RouteProtection and the username is used as part of a greeting in the userpage
        setCookie('authUser', userid); 
        setCookie('isLoggedIn', true);
        setCookie('userName', usersname);
        console.log("Here is the userName" + userName);
        console.log("Here is the username in the cookie" + cookies.userName);
      } else {
        // Else throw an error
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error('Login unsuccessful. Please check your email and password are correct.');
    }

  
  };

  // Logout logic
 
  const logout = () => {

    //Sets everything as null
  setAuthUser(null);
    setIsLoggedIn(false);
    setUserName(null); 


    // Removes the cookies
    removeCookie('authUser');
    removeCookie ('isLoggedIn');
    removeCookie('userName');
  };

  console.log('authUser value:', authUser); 

  // The values are set into a datastructure, which is fed as the authContext Provider

  const value = {
    authUser,
    isLoggedIn,
    login,
    logout
    };

    // By nesting this around the childrem, this data can be accessed by anything wrapped by the provider
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );

  
}


// This is the hook that is received by various functions that need this info such as the login, with it the values of authUser, isLoggedIn and login will be returned.
export function useAuth() {
    return useContext(AuthContext);
  }