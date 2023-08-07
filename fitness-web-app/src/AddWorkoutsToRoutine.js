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



const NewWorkoutToRoutine = () => {
  const [workoutroutineid, setWorkoutRoutineID] = useState([]);
  const [selectedWorkoutRoutineId, setSelectedWorkoutRoutineId] = useState("");
  const [day, setDay] = useState([]);
  const [workoutname, setWorkoutNames] = useState([]);
  const [userworkoutid, setUserWorkoutID] = useState([]);
  const [selectedUserWorkoutId, setSelectedUserWorkoutId] = useState("");
  const [orderperformed, setOrderPerformed] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );

        const secondResponse = await axios.get(
          `http://localhost:4000/workoutroutines/${cookies.authUser}`
        );

        const userworkoutids = response.data.data.map(
          (userworkout) => userworkout.userworkoutid
        );

        const workoutNames = response.data.data.map(
          (workout) => workout.workoutname
        );

        const workoutroutineids = secondResponse.data.data.map(
          (workoutroutine) => workoutroutine.workoutroutineid
        );

        const days = secondResponse.data.data.map(
          (workoutroutine) => workoutroutine.day
        );

        setWorkoutNames(workoutNames);
        setDay(days);
        setUserWorkoutID(userworkoutids);
        setWorkoutRoutineID(workoutroutineids);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutIds();
  }, [cookies.authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!orderperformed || !workoutroutineid || !selectedUserWorkoutId) {
      alert("You need to select an option so that you can add a workout to a routine!")
      return;
    }
  
    console.log('orderPerformed:', orderperformed);
    console.log('workoutroutineid:', workoutroutineid);
    console.log('selectedUserWorkoutId:', selectedUserWorkoutId);
  
    try {
      const response = await axios.post(
        "http://localhost:4000/addroutineexercises",
        {
          workoutroutineid: selectedWorkoutRoutineId,
          userworkoutid: selectedUserWorkoutId,
          orderperformed: orderperformed,
        }
      );
  
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
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
              <h1 className="fw-bold">Create personal workout exercise</h1>
              <p className="mt-3 fw-light">
                Pick from a range of exercises and personalise it to your means.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="workoutid">Workout:</label>
                  <select
                    type="String"
                    id="userworkoutid"
                    className="form-control"
                    value={selectedUserWorkoutId}
                    onChange={(e) => setSelectedUserWorkoutId(e.target.value)}
                  >
                    <option value="">Select Workout</option>
                    {userworkoutid.map((id, index) => (
                    <option key={id} value={id}>
                    {workoutname[index]}
                     </option>
                     ))}
                    </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="workoutroutineid">Select Routine Day:</label>
                  <select
                    type="String"
                    id="selectedWorkoutRoutineId"
                    className="form-control"
                    value={selectedWorkoutRoutineId}
                    onChange={(e) => setSelectedWorkoutRoutineId(e.target.value)}
                    >
                    <option value="">Select Day</option>
                    {workoutroutineid.map((id, index) => (
                    <option key={id} value={id}>
                    {day[index]}
                    </option>
                    ))}
                    </select>
                  
                </div>
                <div className="mb-4">
                  <label htmlFor="orderPerformed">Set the order this should be performed in your routine:</label>
                  <input
                    type="String"
                    id="orderperformed"
                    className="form-control"
                    value={orderperformed}
                    onChange={(e) => setOrderPerformed(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn btn-primary">Add workout to routine</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default NewWorkoutToRoutine;