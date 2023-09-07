

import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

//  Unregistered navbar
const UnregisteredNavbar = () => (
 
        
<Navbar expand="lg"  bg="primary" 
    data-bs-theme="dark">
    <Container>
      <Navbar.Brand href="/">Fitness-Future</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
 
export default UnregisteredNavbar;



