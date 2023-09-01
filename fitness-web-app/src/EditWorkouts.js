import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [workoutData, setWorkoutData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();


  const message = location.state && location.state.message;

  const [showHomeButton, setShowHomeButton] = useState(false);
  

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

      
        setWorkoutData(response.data.data);

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

    console.log('workoutid:', workoutid);
    console.log('customliftreps:', customliftreps);
    console.log('customliftweight:', customliftweight);

    try {
      const response = await axios.post("http://localhost:4000/editworkout", {
        userid: parseInt(cookies.authUser),
        workoutid: parseInt(workoutid),
        customliftweight: customliftweight,
        customliftreps: customliftreps,
      });


    
      console.log("Response:", response.data);

      setShowHomeButton(true);
      navigate('/editworkouts', { state: { message: response.data.successMessage } });
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleWorkoutChange = (e) => {
    const selectedWorkoutId = e.target.value
    setWorkoutID(selectedWorkoutId);
  
    if (selectedWorkoutId === "") {
      // Clear the old values if nothing is selected
      setCustomLiftWeight("");
      setCustomLiftReps("");

    } else {
      // Finds the selected workout in the object
      const selectedWorkout = workoutData.find(
        (workout) => workout.workoutid === parseInt(selectedWorkoutId)
      );
  
      console.log("Selected Workout:", selectedWorkout);
  
      // Sets old values based on corresponding values in object.
      setCustomLiftWeight(selectedWorkout.customliftweight);
      setCustomLiftReps(selectedWorkout.customliftreps);
  
      console.log("This is the old Weight", selectedWorkout.customliftweight);
      console.log("This is the old reps", selectedWorkout.customliftreps);
    }
  };


  console.log("Workout IDs:", workoutIds);

  return (
    <div className="editworkout">
  
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="/image/EditWorkout.jpeg" className="image-size" fluid rounded />
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
                    data-testid = "workoutSelection"
                    type="String"
                    id="workoutid"
                    className="form-control"
                    value={workoutid}
                    onChange= {handleWorkoutChange}
                     
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
                    data-testid = "setWeight"
                    type="number"
                    id="customliftweight"
                    className="form-control"
                    value={customliftweight}
                    onChange={(e) => setCustomLiftWeight(e.target.value)}
                  />
                 
                </div>
                <div className="mb-4">
                  <label htmlFor="customliftreps">How many reps a set?</label>
                  <input
                    data-testid = "setReps"
                    type="number"
                    id="customliftreps"
                    className="form-control"
                    value={customliftreps}
                    onChange={(e) => setCustomLiftReps(e.target.value)}
                  />
                </div>
                <Button type="submit" data-testid = "actualEdit" className="btn btn-primary">Ammend exercise</Button>
              </form>

              
              {message && (
             <div className="mt-3 alert alert-success">
                {message}
              </div>
                )}

              {showHomeButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/userhome')}
              >
         Want to head back home?
            </Button>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default EditWorkouts;