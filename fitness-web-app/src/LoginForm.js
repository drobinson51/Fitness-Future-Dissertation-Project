import React, { useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import axios from "axios";
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import './styles.css';




const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const redirect = useNavigate();
  const location = useLocation();
  const regMessage = location.state && location.state.regMessage;



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    //if the login is successful you are allowed in and it redirects you to the home page. Otherwise you are sent an error
    try {

      const response = await axios.post(`http://localhost:4000/login`, {
        email, 
        password,
      });

      if (response.status === 200) {
        await login(email, password);
        redirect('/userhome');
      } else {
        setLoginError("Your password or email was incorrect, please try again");
      }
    
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError("An error has occured during login, please try again later.")
      
    }
  };


   
  



  return (
    <div className="home">
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
            
              <Image src="/image/loginpage.jpg"  className = "image-size" fluid rounded />
            
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Login</h1>
              <p className="mt-3 fw-light">
                Hello again friend.
              </p>
                  {regMessage && (
             <div className="mt-3 alert alert-success">
                  {regMessage}
              </div>
                )}
  
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password">Password:</label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type = "button" onClick = {togglePasswordVisibility}>Show Password</button>
                 
                </div>
                <Button type="submit" className="btn btn-primary">Login</Button>
                 {loginError && <div className="error text-danger">{loginError}</div>}
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};


export default LoginForm;