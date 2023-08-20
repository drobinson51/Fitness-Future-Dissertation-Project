
//use state to handle form setting variables
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";

const NewUserWorkoutRoutine = () => {
  const [day, setDay] = useState("");
  const [cookies] = useCookies(["authUser"]);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state && location.state.message;
  const [userWorkoutDays, setUserWorkoutDays] = useState([]);
  const [showCreateWorkoutsButton, setShowCreateWorkoutsButton] = useState(false);
  const [availableDays, setAvailableDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);


  useEffect(() => {
    
    fetchUserWorkouts();
  
  }, [cookies.authUser]);


  const fetchUserWorkouts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/workoutdays/${cookies.authUser}`
      );
      
      setUserWorkoutDays(response.data.data);

      const daysTaken = response.data.data.map(workoutDay => workoutDay.day);

      const daysNotTaken = availableDays.filter(day => !daysTaken.includes(day));

      console.log(daysTaken)
      console.log(daysNotTaken);

      setAvailableDays(daysNotTaken);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    //typical alert to prevent user submitting without selecting from dropdown
    if (!day) {
      alert("You need to select a day to create a workout!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/addworkoutroutine', {
        userid: cookies.authUser,
        day: day,
      });
    
      console.log('Response:', response.data);
    
      
      setShowCreateWorkoutsButton(true);
      // Set the message and trigger navigation

      fetchUserWorkouts();

      setDay(""); 


      navigate('/createroutine', { state: { message: response.data.successMessage } });
    } catch (error) {
      console.error('Error:', error);
    }

  };


  return (
    <div className="home">
     
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="image/CreateRoutinePicture.jpeg" className="image-size" fluid rounded />
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
                   
              {/* Creates an array then filters and maps through it with an key of dayOption which is compared to workoutinfos this dynamically removes day when the user has added them  */}
            

               {availableDays.map(dayOption => (
                <option key={dayOption} value={dayOption}>
                {dayOption}
                </option>
                ))}
                </select>
                </div>
                <Button type="submit" className="btn btn-primary">Create routine</Button>

                {message && (
             <div className="mt-3 alert alert-success">
                {message}
              </div>
                )}

              {showCreateWorkoutsButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/addworkouts')}
              >
            Add some exercises to your routines? 
            </Button>
              )}
              </form>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default NewUserWorkoutRoutine;