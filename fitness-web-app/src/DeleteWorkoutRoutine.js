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
const DeleteWorkoutRoutine = () => {
  const [workoutRoutineId, setWorkoutRoutineID] = useState("");
  const [day, setDay] = useState([]);
  const [UserWorkoutRoutines, setUserWorkoutRoutines] = useState([]);
  const [workoutRoutineIds, setWorkoutRoutineIds] = useState([]);
  const [days, setDays] = useState([]);

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutRoutines = async () => {
      try {
        const response = await axios.get(
            `http://localhost:4000/exerciseroutines/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data


        const workoutRoutineIds = response.data.data.map(
            (workoutroutinesavailable) => workoutroutinesavailable.workoutroutineid
          );
  
          const days = response.data.data.map(
            (workoutroutinedaysavailable) => workoutroutinedaysavailable.day
          );

          setWorkoutRoutineIds(workoutRoutineIds);

          setDays(days);


      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutRoutines();
  }, [cookies.authUser]);

  const handleDelete = async (event) => {
    event.preventDefault();


    if (!workoutRoutineId) {
      alert("You need to select a workout to delete!")
      return;
    }


  try {
    const response = await axios.post('http://localhost:4000/deleteexerciseroutine', {
    userid: cookies.authUser,
    workoutroutineid: parseInt(workoutRoutineId),
    });
     console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };

  return (
    <div className="home">
      <header>
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
      </header>
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="https://picsum.photos/900/400" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Delete a workout Routine</h1>
              <p className="mt-3 fw-light">
                Sometimes the time ain't right.
              </p>
              <form onSubmit={handleDelete}>
                <div className="mb-4">
                  <label htmlFor="workoutroutineid">Select Workout day:</label>
                  <select
                    className="form-control"
                    value={workoutRoutineId}
                    onChange={(e) => setWorkoutRoutineID(e.target.value)}
                  >
                  <option value="">Select Workout</option>
                    {workoutRoutineIds.map((id, index) => (
                    <option key={id} value={id}>
                    {days[index]}
                     </option>
                    ))}
                    </select>
                    </div>
                <Button type="submit" className="btn btn-primary">Delete Routine</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default DeleteWorkoutRoutine;