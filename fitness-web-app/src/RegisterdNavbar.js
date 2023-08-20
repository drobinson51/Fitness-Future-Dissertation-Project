

import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

 
const RegisterdNavbar = () => (
 
        
<Navbar
   expand="lg"
   Navbar bg="primary" 
   data-bs-theme="dark"
 >
   <Container>
     <Navbar.Brand href="#home">Fitness-Future</Navbar.Brand>
     <Navbar.Toggle aria-controls="basic-navbar-nav" />
     <Navbar.Collapse id="basic-navbar-nav">
       <Nav className="me-auto">
         <Nav.Link href="/userhome">Home</Nav.Link>
         <Nav.Link href="/logout">Logout</Nav.Link>
         <NavDropdown title="Workout Management" id="basic-nav-dropdown">
           <NavDropdown.Item href="/createroutine">Create Routine</NavDropdown.Item>
           <NavDropdown.Item href="/addworkouts">
             Add user exercises
           </NavDropdown.Item>
           <NavDropdown.Item href="/editworkouts">
             Edit user exercises
           </NavDropdown.Item>
           <NavDropdown.Item href="/addexercisestoroutine">
             Customise Routines
           </NavDropdown.Item>
           <NavDropdown.Divider />
           <NavDropdown.Item href="/resetprogress">Reset exercise progress</NavDropdown.Item>
           <NavDropdown.Item href="/removeroutineexercise">
             Delete exercise from routine
           </NavDropdown.Item>
           <NavDropdown.Item href="/deleteworkoutroutine">
             Delete routine
           </NavDropdown.Item>
           

         </NavDropdown>
         <Nav.Link href="/leaderboard">The Leaderboard</Nav.Link>
         <Nav.Link href="/exercisecompletion">Workout Record</Nav.Link>

       </Nav>
     </Navbar.Collapse>
   </Container>
 </Navbar>

);
 
export default RegisterdNavbar;



