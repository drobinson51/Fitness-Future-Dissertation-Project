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
import { Button } from "react-bootstrap";



const RemoveRoutineExercise = () => {
  const [selectedRoutineExerciseId, setSelectedRoutineExerciseId] = useState("");
  const [routineExercisesInfo, setRoutineExercisesInfo] = useState([]);
  const [days, setDays] = useState([]);
  const [workoutRoutinesAvailable, setWorkoutRoutinesAvailable] = useState([]);
  const [selectedWorkoutRoutine, setSelectedWorkoutRoutine] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        setRoutineExercisesInfo(response.data.data);

     
        const daysAvailable = [...new Set(response.data.data.map((exercise) => exercise.day))];
        setDays(daysAvailable);

       
        const workoutRoutinesAvailable = [...new Set(response.data.data.map((exercise) => exercise.workoutroutineid))];
        setWorkoutRoutinesAvailable(workoutRoutinesAvailable);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRoutineExercises();
  }, [cookies.authUser]);

  //Function that handles what happens when day is selected
  const handleWorkoutRoutineRoutineSelection = (e) => {
    const selectedDay = e.target.value;
    setSelectedDay(selectedDay);

  
    const workoutRoutinesAvailable = routineExercisesInfo.find((exercise) => exercise.day === selectedDay);

    if (workoutRoutinesAvailable) {
      setSelectedWorkoutRoutine(workoutRoutinesAvailable.workoutroutineid)
    } else {
      setSelectedWorkoutRoutine("");
    }
  }

  const handleRoutineExerciseChange = (e) => {
    const selectedValue = e.target.value;
    
  
    if (selectedValue === "") {
      setSelectedRoutineExerciseId(""); 
    }
    
    setSelectedRoutineExerciseId(selectedValue);
  }
  

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedRoutineExerciseId) {
      alert("You need to select a workout to delete!")
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/removeexercise', {
        routineexerciseid: parseInt(selectedRoutineExerciseId),
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exercisesAvailableForSelectedWorkoutRoutine = routineExercisesInfo.filter((exercise) => exercise.workoutroutineid === parseInt(selectedWorkoutRoutine));


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
              <h1 className="fw-bold">Remove Exercise from a routine</h1>
              <p className="mt-3 fw-light">
                Remove an exercise from the day it has been assigned to.
              </p>
              <form onSubmit={handleDelete}>
                <div className="mb-4">
                  <label htmlFor="routineexerciseinfo">Select Workout Routine:</label>
                  <select
                    type="String"
                    id="workoutroutine"
                    className="form-control"
                    value={selectedDay}
                    onChange= {handleWorkoutRoutineRoutineSelection}
                  >
                     <option value="">Select Workout Routine</option>
                    {days.map((day) => (
                    <option key={day} value={day}>
                    {day}
                    </option>
                    ))}
                    </select>
                    </div>

                    {selectedWorkoutRoutine && workoutRoutinesAvailable && (
                <div className="mb-4">
                  <label htmlFor="routineexercise">Select Exercise to remove:</label>
                  <select
                    type="String"
                    id="routineexercise"
                    className="form-control"
                    value={selectedRoutineExerciseId}
                    onChange= {handleRoutineExerciseChange}
                    >
                    <option value="">Select Exercise</option>
                    {exercisesAvailableForSelectedWorkoutRoutine.map((exercise) => (
                    <option key={exercise.routineexerciseid} value={exercise.routineexerciseid}>
                    {exercise.workoutname}
                    </option>
                    ))}
                    </select>
                    </div>

                    )}

                <Button type="submit" className="btn btn-primary">Remove The Exercise</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default RemoveRoutineExercise;