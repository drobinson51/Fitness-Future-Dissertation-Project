import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js'; 
import axios from "axios";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";


const UserBarChart = () => {
  const [userChartData, setUserBarChartData] = useState([]);
  const [cookies] = useCookies(["authUser"]);

  const [selectedExercise, setSelectedExercise] = useState("");
  const [availableExercises, setAvailableExercises] = useState([]);


  Chart.register(...registerables);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userbarchart/${cookies.authUser}`
        );
        const userData = response.data.data;
        setUserBarChartData(userData);

        const uniqueExercises = [...new Set(userData.map((item) => item.workoutname))];

        //for use with option map
        setAvailableExercises(uniqueExercises);
 
      } catch (error) {
        console.error("Error:", error);
        
      }
    };

    fetchData();
  }, [cookies.authUser]);

  //changes selected exercise based on value selecting in option map 
  const handleExerciseChange = (e) => {
    const exercise = e.target.value;
    setSelectedExercise(exercise);
  };

  //filters the userData to only return the exercise data that matches what is found in the option map
  const filteredData = userChartData.filter(
    (dataset) => dataset.workoutname === selectedExercise
  );

  //filtered data used allowing data to swap based on what exercise has been selected.
  const labels = filteredData.map((item) => item.workoutname);
  const values = filteredData.map((item) => item.totalweightlifted);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Weight Lifted",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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
                  <NavDropdown.Item href="/addworkouts">Add workouts</NavDropdown.Item>
                  <NavDropdown.Item href="/addexercisestoroutine">Customise Routines</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/leaderboard">Leaderboard</NavDropdown.Item>
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
              
            <Bar
                      data={chartData}
                      options={{
                        scales: {
                        y: {
                        type: "linear",
                         beginAtZero: true,
                        },
                      },
                      }}
                    />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Exercise Progression</h1>
              <p className="mt-3 fw-light">Pick an exercise from the list, and then see your progress in it over time</p>
           
                <div className="mb-4">
                  <label htmlFor="exercise">Select Exercise:</label>
                  <select
                    id="exercise"
                    className="form-control"
                    value={selectedExercise}
                    onChange={handleExerciseChange}
                  >
                    <option value="">Select an exercise</option>
                    {availableExercises.map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}

                    </select>

      

                  
                </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default UserBarChart;
