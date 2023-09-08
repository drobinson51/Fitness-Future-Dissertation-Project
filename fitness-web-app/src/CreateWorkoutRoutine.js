
//use state to handle form setting variables
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
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
  const [apiError, setApiError] = useState(null);
  const [availableDays, setAvailableDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

  // Place useEffect outside allow it to be called again after redirect

  useEffect(() => {
    
    fetchUserWorkouts();
  
  }, [cookies.authUser]);



// Gets the days the user is working out on 
  const fetchUserWorkouts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/workoutdays/${cookies.authUser}`
      );
      

      
    //  A successful response 
    if (response.data.status === "success") {
      // gets the workout day and puts them into the data structure
      const fetchedWorkoutDays = response.data.data;
      setUserWorkoutDays(fetchedWorkoutDays);

      // Maps the days taken.
      const daysTaken = fetchedWorkoutDays.map(workoutDay => workoutDay.day);
      // Available days is filtered by the days the user already has
      const daysNotTaken = availableDays.filter(day => !daysTaken.includes(day));

      console.log(daysTaken);
      console.log(daysNotTaken);

      // Sets the new available days.
      setAvailableDays(daysNotTaken);

    } else if (response.data.status === "error") {
      setApiError(response.data.message);
    }
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

      // Refreshes dropdown functons
      fetchUserWorkouts();

      // Resets users taken day
      setDay(""); 


      // Refreshes page with success message
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
              <Image src="image/CreateRoutinePicture.jpeg" className="image-size" alt= "Man entering gym with bag in one hand, and water bottle in other, smiling" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Create a new Routine</h1>
              <p className="mt-3 fw-light">
                Every good thing starts with a plan
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="daySelection">Select a day:</label>
                  <select
                    id="daySelection"
                    data-testid = "daySelection"
                    className="form-control"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                   
              {/* Creates an array then filters and maps through it with an key of dayOption which is compared to workoutinfos this dynamically removes day when the user has added them  */}
            
              <option value="">Select Day</option>
               {availableDays.map(dayOption => (
                <option key={dayOption} value={dayOption}>
                {dayOption}
                </option>
                ))}
                </select>
                </div>
                <Button type="submit" className="btn btn-primary">Create routine</Button>

                {/* Success Message */}
                {message && (
             <div className="mt-3 alert alert-success">
                {message}
              </div>
                )}

              {/*Button redirect  */}
              {showCreateWorkoutsButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/addexercisestoroutine')}
              >
            Want to add some of your tracked workouts to a routine?
            </Button>
              )}
              </form>
            </Col>

                {/* Error */}
            {apiError && (
             <div className="mt-3 alert alert-danger">
                {apiError}
              </div>
                )}
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default NewUserWorkoutRoutine;