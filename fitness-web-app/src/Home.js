import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";

import { useCookies } from "react-cookie";



//Home page, or rather lander page 

const HomePage = () => {
  return (
    <div className="home">
      <main>
      <Container>
      <Row className = "px-4 my-5">
        <Col sm={7}>
        <Image src="/image/LandingPage.jpeg" className="image-size" fluid rounded />
        </Col>
     
        <Col sm={5}>  
        <h1 className = "fw-bold">Your Future in Fitness</h1>
        <p className = "mt-3 fw-light">
        Keeping track of your fitness can be hard in today's world, 
        but don't worry because Fitness Future has you covered!
        We offer a range of features to users who register with us to take
        command of their fitness future, hence the name. Why not give us a shot?

        </p>
        {/* User goes to registration from here */}
        <Link to ="/register">
        <Button variant="primary">Sign up</Button>
        </Link>
        </Col>
      </Row>
     
    </Container>
      </main>
    </div>
  );
};

export default HomePage;
