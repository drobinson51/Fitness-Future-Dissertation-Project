import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";


// Legacy page, overall function subsumed into userhome page


const UserTierList = () => {

    const [userPosition, setUserPosition] = useState("");
    const [description, setDescription] = useState("");
    const [cookies] = useCookies(["authUser"]);

useEffect(() => {
    const getUserValue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/tierlist/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        //gets the first result, which is the user position. 
      setUserPosition(response.data.data[0].title);
      setDescription(response.data.data[0].description);
      
      } catch (error) {
        console.error("Error:", error);
      }
    };


    getUserValue();
  }, [cookies.authUser]);

  console.log(userPosition);

  return (
    <div className="home">
      <header>
        <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">Fitness-Future</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <NavDropdown title="Fitness-Functions" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/createroutine">Create Routine</NavDropdown.Item>
                  <NavDropdown.Item href="/addworkouts">
                    Add workouts
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/addexercisestoroutine">
                    Customise Routines
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/leaderboard">
                    Leaderboard
                  </NavDropdown.Item>
                </NavDropdown>
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
              <h1 className="fw-bold">Your tier as a user</h1>
              <p className="mt-3 fw-light">
                Let's you get the by and by on how dedicated you've been. Want to get better? Complete more workouts! Consistency is King!
              </p>
              <form>
                <div className="mb-4">
                  <label htmlFor="userRanking">Your ranking:</label>
                  <h2> {userPosition} </h2>
                  <p>{description}</p>
                    </div>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default UserTierList;