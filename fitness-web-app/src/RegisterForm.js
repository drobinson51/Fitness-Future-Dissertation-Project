import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";





//use state to handle form setting variables
const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [emailpreference, setEmailPreference] = useState('');
  

  
  const navigate = useNavigate();
 

  const handleSubmit = async (event) => {
    event.preventDefault();

    //typical alert that doesn't let you submit without all fields being filled
  
    if (!email || !password || !username || !firstname) {
      alert("Please fill out all fields available before registering!");
      return;
    }
  
    //10 rounds of hashing, considered a good compromise between speed and security
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    try {
      const response = await axios.post('http://localhost:4000/register', {
        email: email,
        password: hashedPassword,
        username: username,
        firstname: firstname,
        lastname: lastname,
        emailpreference: emailpreference,
      });
  
      console.log('Response:', response); //Shown for debug uses
  
      // if response is got, and the response data and the message are defined, purely for debugging purposes. 
      if (response && response.data && response.data.successMessage) {
        console.log('Success Message:', response.data.successMessage); // Print the the successmessage for debug purposes
        
      } else {
        console.log('No Success Message found in the response.');
      }
  


      //sends you to the loginpage with the regMessage set, allowing a 
      navigate('/login', { state: { regMessage: response.data.successMessage } });
  
      console.log('Response:', response.data);
  
    } catch (error) {
      console.error('Error:', error);
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
              <h1 className="fw-bold">Registration</h1>
              <p className="mt-3 fw-light">
                Take the first steps towards a healthier future.
              </p>
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
                <div className="mb-4">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="String"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="firstname">First Name:</label>
                  <input
                    type="String"
                    id="firstname"
                    className="form-control"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastname">Last Name:</label>
                  <input
                    type="String"
                    id="lastname"
                    className="form-control"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="emailpreference">Would you like email reminders?:</label>
                  <select
                    className="form-control"
                    value={emailpreference}
                    onChange={(e) => setEmailPreference(e.target.value)}
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <Button type="submit" className="btn btn-primary">Sign-Up</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default RegisterForm;