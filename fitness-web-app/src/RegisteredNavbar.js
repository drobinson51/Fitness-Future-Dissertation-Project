

import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

// Allows it to deal with the logout part of the auth context
 
const RegisteredNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  // This is the registerednavbar
return (      
<Navbar
   expand="lg"
   bg="primary" 
   data-bs-theme="dark"
 >
   <Container>
     <Navbar.Brand href="/userhome">Fitness-Future</Navbar.Brand>
     <Navbar.Toggle aria-controls="basic-navbar-nav" />
     <Navbar.Collapse id="basic-navbar-nav">
       <Nav className="me-auto">
        {/* Pressing this causes the logout */}
       <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
         <NavDropdown title="Workout Management" id="basic-nav-dropdown">
         <NavDropdown.Item href="/addworkouts">
             Exercise Tracker
             </NavDropdown.Item>
           <NavDropdown.Item href="/createroutine">
            Create Routine
            </NavDropdown.Item>
           <NavDropdown.Item href="/editworkouts">
             Edit Tracked Exercises
           </NavDropdown.Item>
           <NavDropdown.Item href="/addexercisestoroutine">
             Customise Routine 
           </NavDropdown.Item>
           <NavDropdown.Divider/>
           <NavDropdown.Item href="/deleteworkouts">
             Stop Tracking Exercise
           </NavDropdown.Item>
           <NavDropdown.Item href="/resetprogress">Reset exercise progress</NavDropdown.Item>
           <NavDropdown.Item href="/removeroutineexercise">
             Drop Exercise From Routine
           </NavDropdown.Item>
           <NavDropdown.Item href="/deleteworkoutroutine">
             Delete Routine
           </NavDropdown.Item>
           

         </NavDropdown>
         <Nav.Link href="/leaderboard">The Leaderboard</Nav.Link>
         <Nav.Link href="/exercisecompletion">Workout Record</Nav.Link>

       </Nav>
     </Navbar.Collapse>
   </Container>
 </Navbar>

);

};
 
export default RegisteredNavbar;



