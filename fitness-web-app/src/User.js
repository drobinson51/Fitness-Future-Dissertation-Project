import React, { useState, useEffect } from "react";
import {useNavigate, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from 'chart.js';
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


import { useCookies } from "react-cookie";




//User page

const UserPage = () => {
const [cookiesName] = useCookies(["userName"]);
const [cookieAuth] = useCookies(["authUser"]);
const [userChartData, setUserBarChartData] = useState([]);
const [selectedExercise, setSelectedExercise] = useState("");
const [availableExercises, setAvailableExercises] = useState([]);

const [userPosition, setUserPosition] = useState("");
const [description, setDescription] = useState("");
const location = useLocation();
const successMessage = location.state && location.state.successMessage;



Chart.register(...registerables);

// Use effect that handles getting barchart info for rendering. 
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/userbarchart/${cookieAuth.authUser}`
      );
      const userData = response.data.data;


        //date time is converted into JS date object
      const dataDividedByDate = userData.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));

      //sorts the data timestamps in ascending order
      dataDividedByDate.sort((a, b) => a.timestamp - b.timestamp);

      setUserBarChartData(dataDividedByDate);

      const uniqueExercises = [...new Set(userData.map((item) => item.workoutname))];

      //for use with option map
      setAvailableExercises(uniqueExercises);

    } catch (error) {
      console.error("Error:", error);
      
    }
  };

  fetchData();
}, [cookieAuth.authUser]);

//changes selected exercise based on value selecting in option map 
const handleExerciseChange = (e) => {
  const exercise = e.target.value;
  setSelectedExercise(exercise);
};


const getWeeklyAverages = () => {
  const weeklyAverages = [];
  //curent week keeps the averages contained to that particular week, once it encounters a different week it moves on
  let currentWeek = null;
  let sumWeights = 0;
  let countWeights = 0;

  for (const item of userChartData) {
    //sets the format of week which is identical to the format of currentWeek so they are compared
    const week = item.timestamp.toLocaleDateString("en-UK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });


    //if selected exercise isn't picked, then the array will not be formed of the week from the timestamp and average
    if (item.workoutname === selectedExercise) {
      //if the week isn't current week then that means it has moved on in which case the previous weeks data can be pushed to the array
    if (week !== currentWeek) {
      

      if (currentWeek !== null) {
        weeklyAverages.push({
          week: currentWeek,
          averageWeight: sumWeights / countWeights,
        });
      }

      //sets default values again if week doesn't equal current week
      currentWeek = week;
      sumWeights = 0;
      countWeights = 0;
    }

    //sum of weights is pushed every time week
    sumWeights += item.totalweightlifted
    countWeights++;


  }
}

//manually have to push last value, as loop condition terminates and there is no next week
  if (currentWeek !== null) {
    weeklyAverages.push({
      week: currentWeek,
      averageWeight: sumWeights / countWeights,
    });
  }
  return weeklyAverages;
}


const weeklyAverages = getWeeklyAverages();

//filtered data used allowing data to swap based on what exercise has been selected.
const labels = weeklyAverages.map((item) => item.week);
const values = weeklyAverages.map((item) => item.averageWeight);

const chartData = {
  labels: labels,
  datasets: [
    {
      label: "Weight Average Weight Lifted",
      data: values,
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

useEffect(() => {
    const getUserValue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/tierlist/${cookieAuth.authUser}`
        );
        console.log("Response:", response.data);

        //gets the first result, which is the user position. 
      setUserPosition(response.data.data[0].title);
      setDescription(response.data.data[0].description);
      
      } catch (error) {
        console.error("Error:", error);
      }
    };


    getUserValue();
  }, [cookieAuth.authUser]);

  return (
    <div className="home">
   
      <main>
        <Container>
        {successMessage && (
        <Row className="mt-3">
            <Col>
                <div className="alert alert-success">
                    {successMessage}
                </div>
            </Col>
        </Row>
    )}
        </Container>
      <Container>
      <Row className = "px-4 my-5">
        <Col sm={6}>
        <Image src="image/userhomepage.jpg"  className = "image-size" alt = "Three people working out with dumbells whilst smiling" fluid rounded/>
        </Col>
     
        <Col sm={6}>  
        <h1 className = "fw-bold">Hello {cookiesName.userName}</h1>
        <p className = "mt-3 fw-light">
        Manage your workout choices, routine and progress all from here.
        Your progress is kept at the bottom, use the navbar to access the other functions of the website.  
        </p>
        </Col>
      </Row>

      <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Your weekly progress in the selected exercise</Card.Title>
                  <Bar data={chartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                <Card.Title>Select an exercise for the chart.</Card.Title>
                <select
                    id="exercise"
                    className="form-control"
                    value={selectedExercise}
                    onChange={handleExerciseChange}
                  >
                    <option value="">Select an exercise</option>
                    {/* Maps through the exercises so that it decides what chart is being rendered */}
                    {availableExercises.map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}

                    </select>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  {/* Here is where the userPosition goes */}
                <Card.Title>Your ranking</Card.Title>
                  <h2> {userPosition} </h2>
                  <p>{description}</p>
                 
                </Card.Body>
              </Card>
            </Col>
          </Row>
     
    </Container>
      </main>
    </div>
  );
};

export default UserPage;
