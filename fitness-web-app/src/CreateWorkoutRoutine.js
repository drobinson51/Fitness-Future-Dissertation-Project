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




//use state to handle form setting variables
const NewUserWorkoutRoutine = () => {

  const [day, setDay] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
  }, [cookies.authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!day) {
      alert("You need to select a day to create a workout!")
      return;
    }

    
  try {
    const response = await axios.post('http://localhost:4000/addworkoutroutine', {

    userid: cookies.authUser,
    day: day,

    });

    console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };


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
              <h1 className="fw-bold">Create a new Routine</h1>
              <p className="mt-3 fw-light">
                Every good thing starts with a plan
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="emailpreference">Select a day:</label>
                  <select
                    className="form-control"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <Button type="submit" className="btn btn-primary">Create routine</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default NewUserWorkoutRoutine;