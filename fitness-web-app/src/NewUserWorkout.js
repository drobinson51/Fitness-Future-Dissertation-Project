import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import {useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";





//use state to handle form setting variables
const NewUserWorkout = () => {
  const [workoutid, setWorkoutID] = useState("");

  const [customliftweight, setCustomLiftWeight] = useState("");
  const [customliftreps, setCustomLiftReps] = useState("");
  const [userWorkouts, setUserWorkouts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([])
  const successMessage = location.state && location.state.successMessage;
  const [cookies] = useCookies(["authUser"]);
  const [apiError, setApiError] = useState(null);
  const [showCreateRoutineButton, setShowCreateRoutineButton] = useState(false);

  // Called up top to allow them to be called again on navigate and not lose information
  useEffect(() => {
 
    
    fetchworkoutids();
  }, [cookies.authUser]);

  useEffect(() => {
  
    fetchUserWorkouts();
  }, [cookies.authUser]);

  const fetchworkoutids = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/workouts`
      );

      if (response.data.status === "success") {
        setWorkouts(response.data.data);
      } else if (response.data.status === "error") {
        setApiError(response.data.message);
      }



      console.log("Response:", response.data); // Log the response data


    } catch (error) {
      console.error("Error:", error);
      setApiError("Failed to fetch workouts. Please try again later.")
    }
  };

  const fetchUserWorkouts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/userworkouts/${cookies.authUser}`
      );
      
      setUserWorkouts(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!workoutid || !customliftweight || !customliftreps) {
      alert("You need to fill all the fields available before adding your workout!")
      return;
    }
    
  try {
    const response = await axios.post('http://localhost:4000/addnewuserworkout', {

    userid: cookies.authUser,
    workoutid: parseInt(workoutid),
    customliftweight: customliftweight,
    customliftreps: customliftreps,

    });

    //Call them after a workout is successfully submitted allowing reset of workout menu and avoiding issue of double tracking exercise. 

    fetchworkoutids();
    fetchUserWorkouts();

    setCustomLiftReps("")

    setCustomLiftWeight("");
    setShowCreateRoutineButton(true);
    navigate('/addworkouts', { state: { successMessage: response.data.successMessage } });

    console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };

  return (
    <div className="exercisetracker">
   
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="image/NewUserWorkout.jpeg" className="image-size" alt= "Group of people performing squats in communal gym area." fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Create personal workout exercise</h1>
              <p className="mt-3 fw-light">
                Pick from a range of exercises and personalise it to your means.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label htmlFor="workoutid">Workout:</label>

                {workouts.length === (userWorkouts ? userWorkouts.length : 0) + 1 ? (
                  <p>All available workouts are already being tracked.</p>
                ) : (
                  <select
                    type="String"
                    id="workoutid"
                    className="form-control"
                    value={workoutid}
                    onChange={(e) => setWorkoutID(e.target.value)}
                  >
                    <option value="" disabled>Select a workout</option> 
                    {workouts.map((workout) => {
                      const isTracked = userWorkouts && userWorkouts.some(
                        (userWorkout) => userWorkout.workoutid === workout.workoutid
                      );

                      if (!isTracked) {
                        return (
                          <option key={workout.workoutid} value={workout.workoutid}>
                            {workout.workoutname}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                )}


                </div>
                <div className="mb-4">
                  <label htmlFor="customliftweight">How much weight will this lift be?:</label>
                  <input
                    type="number"
                    id="customliftweight"
                    placeholder="kg"
                    min = "1"
                    className="form-control"
                    value={customliftweight}
                    onChange={(e) => setCustomLiftWeight(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="customliftreps">How many reps a set?</label>
                  <input
                    type="number"
                    id="customliftreps"
                    min = "1"
                    className="form-control"
                    value={customliftreps}
                    onChange={(e) => setCustomLiftReps(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn btn-primary">Create personal exercise </Button>
                
              </form>
              
              {successMessage && (
             <div className="mt-3 alert alert-success">
                  {successMessage}
                  
              </div>
              )}


                  {apiError && (
             <div className="mt-3 alert alert-danger">
                  {apiError}
                  
              </div>
              )}

            {showCreateRoutineButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/createroutine')}
              >
           Now that you're tracking an exercise, fancy creating a routine for yourself?
            </Button>
              )}

            </Col>
            
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default NewUserWorkout;