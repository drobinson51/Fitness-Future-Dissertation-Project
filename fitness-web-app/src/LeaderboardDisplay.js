import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import { Button } from "react-bootstrap";






const LeaderBoardDisplay = () => {

    const [leaderboardData, setLeaderBoardData] = useState([]);
    const [cookies] = useCookies(["authUser"]);

useEffect(() => {
    const getLeaderBoardValues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/leaderboard/`
        );
        console.log("Response:", response.data); // Log the response data

        //gets the first result, which is the user position. 
        setLeaderBoardData(response.data.data);
      
      } catch (error) {
        console.error("Error:", error);
      }
    };


    getLeaderBoardValues();
  }, [cookies.authUser]);



  return (
    <div>
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
            <Col sm={12}>
              <h2>The Leaderboard is as follows:</h2>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user) => (
                    <tr key={user.userid}>
                      <td>{user.username}</td>
                      <td>{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default LeaderBoardDisplay;