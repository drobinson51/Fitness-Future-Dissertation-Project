import React, { useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";



const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const redirect = useNavigate();
  const location = useLocation();
  const regMessage = location.state && location.state.regMessage;

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    //if the login is successful you are allowed in and it redirects you to the home page. Otherwise you are sent an error
    try {
      await login(email, password);
      redirect('/userhome');
    } catch (error) {
      console.error('Error:', error.message);
      setLoginError(error.message)
    }
  };


   
  



  return (
    <div className="home">
      <header>
        <Navbar expand="lg"  Navbar bg="primary" 
          data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">Fitness-Future</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="https://picsum.photos/900/400" fluid rounded />
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
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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