import React, { useState, useEffect } from "react";
import axios from "axios";
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



const EditWorkouts = () => {
  const [workoutid, setWorkoutID] = useState("");
  const [customliftweight, setCustomLiftWeight] = useState("");
  const [customliftreps, setCustomLiftReps] = useState("");
  const [workoutIds, setWorkoutIds] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);
  

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        const workoutIds = response.data.data.map(
          (workoutsavaiable) => workoutsavaiable.workoutid
        );

        const workoutNames = response.data.data.map(
          (workoutnamesavailable) => workoutnamesavailable.workoutname
        );
        console.log("Here are the workout ids:", workoutIds);
        setWorkoutIds(workoutIds);
        setWorkoutNames(workoutNames);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutIds();
  }, [cookies.authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!workoutid || !customliftreps || !customliftweight) {
      alert("You need to fill out all fields to edit the workout!")
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/editworkout", {
        userid: cookies.authUser,
        workoutid: parseInt(workoutid),
        customliftweight: customliftweight,
        customliftreps: customliftreps,
      });

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log("Workout IDs:", workoutIds);

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
              <h1 className="fw-bold">Edit a workout</h1>
              <p className="mt-3 fw-light">
               Lets use select one of your exercises, and then allows you to change the values of it.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="workoutid">Workout:</label>
                  <select
                    type="String"
                    id="workoutid"
                    className="form-control"
                    value={workoutid}
                    onChange={(e) => setWorkoutID(e.target.value)}
                  >
                   <option value="">Select Workout</option>
                  {workoutIds.map((id, index) => (
                  <option key={id} value={id}>
                  {workoutNames[index]}
                  </option>
                  ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="customliftweight">How much weight will this lift be?:</label>
                  <input
                    type="String"
                    id="customliftweight"
                    className="form-control"
                    value={customliftweight}
                    onChange={(e) => setCustomLiftWeight(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="customliftreps">How many reps a set?</label>
                  <input
                    type="String"
                    id="customliftreps"
                    className="form-control"
                    value={customliftreps}
                    onChange={(e) => setCustomLiftReps(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn btn-primary">Ammend exercise </Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default EditWorkouts;