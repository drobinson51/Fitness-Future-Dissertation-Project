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
const Completedworkoutform = () => {
  const [selectedUserWorkoutId, setSelectedUserWorkoutID] = useState("");
  const [routineExerciseId, setRoutineExerciseId] = useState(null);
  const [totalWeightLifted, setTotalWeightLifted] = useState("");
  const [repsCompleted, setRepsCompleted] = useState("");
  const [filteredWorkoutData, setFilteredWorkoutData] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [day, setDay] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [cookies] = useCookies(["authUser"]);
  const [selectedDayWorkouts, setSelectedDayWorkouts] = useState([]);
  

  useEffect(() => {
    const fetchWorkoutInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );


        setWorkoutData(response.data.data);

        const daysFound = [...new Set(response.data.data.map((workout) => workout.day))];
        setAvailableDays(daysFound);
       

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutInfo();
  }, [cookies.authUser]);

  console.log(workoutData);


  //for use with setting routineexerciseid
  useEffect(() => {
    if (day) {
      const dayFilteredWorkoutData = workoutData.filter((workout) => workout.day === day);
      setFilteredWorkoutData(dayFilteredWorkoutData);

      setSelectedUserWorkoutID("");
      setRoutineExerciseId(null);
    }
  }, [day, workoutData]);

  const handleDayChange = (e) => {
    const day = e.target.value;
    setDay(day);
  }



  // function to deal with user selecting values from drop down and ensuring they match up with each other. 
  const infoOfWorkoutSelected = (e) => {
    const selectedRelevantWorkoutId = parseInt(e.target.value);
    setSelectedUserWorkoutID(selectedRelevantWorkoutId);
  
    // Find the workout with the selected userworkoutid from workoutData, which has been filtered by day
    const selectedRelevantWorkout = filteredWorkoutData.find(
      (workout) => workout.userworkoutid === selectedRelevantWorkoutId && workout.day === day
    );
  

    //if found it is set, otherwise it is set to null which disables the input. 
    if (selectedRelevantWorkout) {
      setRoutineExerciseId(selectedRelevantWorkout.routineexerciseid)
    } else {
      setRoutineExerciseId(null);
    }
  };

  useEffect(() => {
    if (day) {
      const dayFilteredWorkoutData = workoutData.filter((workout) => workout.day === day);
      setSelectedDayWorkouts(dayFilteredWorkoutData);
    }
  }, [day, workoutData]);

  const formattedTimestamp = new Date().toLocaleString("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });



  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!selectedUserWorkoutId || !routineExerciseId || !totalWeightLifted || !repsCompleted || !formattedTimestamp) {
      alert("You need to select a fill out all the relevant field to record your progress!")
      return;
    }

    
  try {
    const response = await axios.post('http://localhost:4000/exerciseprogress', {
    userid: cookies.authUser,
    userworkoutid: parseInt(selectedUserWorkoutId),
    routineexerciseid:  parseInt(routineExerciseId),
    totalweightlifted:  parseInt(totalWeightLifted),
    repscompleted:  parseInt(repsCompleted),
    timestamp: formattedTimestamp,

    });

    
     console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }

  
  try {
    const secondResponse = await axios.post('http://localhost:4000/userpoints', {
    userid: cookies.authUser,
    earnedat: formattedTimestamp,
    });

    console.log('Response:' , secondResponse.data);
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
              <h1 className="fw-bold">Remove Exercise from a routine</h1>
              <p className="mt-3 fw-light">
                Remove an exercise from the day it has been assigned to.
              </p>
              <form onSubmit={handleSubmit}>

              <div className="mb-4">
                  <label htmlFor="day">Select Day:</label>
                  <select
                    type="String"
                    id="day"
                    className="form-control"
                    value={day}
                    onChange={handleDayChange} 
                  >
                  <option value="">Select Day</option>
                  {availableDays.map((day) => (
                  <option key={day} value={day}>
                  {day}
                  </option>
                 ))}
                </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="userworkoutid">Select Workout Routine:</label>
                  <select
                    type="String"
                    id="workoutroutine"
                    className="form-control"
                    value={selectedUserWorkoutId}
                    onChange= {infoOfWorkoutSelected}
                  >
                      <option value="">Select Workout</option>
                      {selectedDayWorkouts.map((workout) => (
                      <option key={workout.userworkoutid} value={workout.userworkoutid}>
                      {workout.workoutname}
                      </option>
                       ))} 
                      </select>
                      </div>


                    
                <div className="mb-4">
                  <label htmlFor="routineexerciseid">Routine Exercise id:</label>
                  <input
                    type="int"
                    id="routineexerciseid"
                    className="form-control"
                    value={routineExerciseId || ""}
                    onChange={(e) => setRoutineExerciseId(e.target.value)}
                    disabled={!selectedUserWorkoutId}
                    />
                      </div>
                      <div>
                      <label htmlFor="Total Weight lifted">Total Weight Lifted</label>
                    <input
                    type="int"
                    id="totalweightlifted"
                    className="form-control"
                    value={totalWeightLifted}
                    onChange={(e) => setTotalWeightLifted(e.target.value)}
                    />
                    </div>

                    <div>
                      <label htmlFor="repscompleted">Total Reps Completed:</label>
                    <input
                    type="int"
                    id="repscompleted"
                    className="form-control"
                    value={repsCompleted}
                    onChange={(e) => setRepsCompleted(e.target.value)}
                    />
                    </div>

                    <div>
                      <label htmlFor="timestamp">Time of completion:</label>
                    <input
                    type="String"
                    id="timestamp"
                    className="form-control"
                    value={formattedTimestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    />
                    </div>

                <Button type="submit" className="btn btn-primary">Submit Progress</Button>
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Completedworkoutform;