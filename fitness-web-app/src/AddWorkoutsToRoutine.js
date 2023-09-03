import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [apiError, setApiError] = useState(null);
  const [alreadyAssignedWorkouts, setAlreadyAssignedWorkouts] = useState([])
  const [showExerciseCompletionButton, setShowExerciseCompletionButton] = useState(false);


  const [cookies] = useCookies(["authUser"]);

  const location = useLocation();

  const navigate = useNavigate();

  const successMessage = location.state && location.state.successMessage;

  useEffect(() => {



    fetchWorkoutIds();

    fetchAlreadyAssignedWorkouts();
  }, [cookies.authUser, selectedWorkoutRoutineId]);


    const fetchWorkoutIds = async () => {


      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );

        const secondResponse = await axios.get(
          `http://localhost:4000/workoutroutines/${cookies.authUser}`
        );



        if (response.data.status === "success" && secondResponse.data.status === "success") {
        // Simple two responses which maps out and gets ids relevant along with the names to opulated them
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
        } else if ( response.data.status === "error" || secondResponse.data.status === "error") {
          setApiError(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        setApiError("Something went wrong!")
      }
    };

    const fetchAlreadyAssignedWorkouts = async () => {
      if (selectedWorkoutRoutineId) {
        try {
          const response = await axios.get(`http://localhost:4000/routineexercises/${selectedWorkoutRoutineId}`);
          
          if (response.data.status === "success") {
            const assignedWorkouts = response.data.data.map((item) => item.userworkoutid);
            setAlreadyAssignedWorkouts(assignedWorkouts);
          } else if (response.data.status === "Nothing found") {
            setAlreadyAssignedWorkouts([]);
          }
          
        } catch (error) {
          if (error.response && error.response.status !== 404) {
            console.error("Error:", error);
          }
        }
      }
    };


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
  
      
      fetchWorkoutIds();
      fetchAlreadyAssignedWorkouts();

      setOrderPerformed("");
      setSelectedWorkoutRoutineId("");
      setSelectedUserWorkoutId("");
      
      setShowExerciseCompletionButton(true);

      navigate('/addexercisestoroutine', { state: { successMessage: response.data.successMessage } });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
      setApiError(error)
    }
  };
  return (
    <div className="RoutineAdditions">
 
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
            <Image src="/image/AddWorkoutToRoutine.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Add exercises to your routine</h1>
              <p className="mt-3 fw-light">
                Pick from your range of tracked exercises, and add them to a personal routine of your choosing. 
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                
                  <label htmlFor="userworkoutid">Workout:</label>
                  <select
                    data-testid = "workoutSelection"
                    type="String"
                    id="userworkoutid"
                    className="form-control"
                    value={selectedUserWorkoutId}
                    onChange={(e) => setSelectedUserWorkoutId(e.target.value)}
                  >
                    
         
                    <option value="">Select Workout</option>
                    {userworkoutid.map((id, index) => (
                      // Prevents inclusion of already tracked exercises for that particular day
                      !alreadyAssignedWorkouts.includes(id) && (
                        <option key={id} value={id}>
                          {workoutname[index]}
                        </option>
                      )
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="selectedWorkoutRoutineId">Select Routine Day:</label>
                  <select
                    data-testid = "routineSelection"
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
                  <label htmlFor="orderperformed">Set the order this should be performed in your routine:</label>
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


              {successMessage && (
              <div className="mt-3 alert alert-success">
              {successMessage}
              </div>
              )}

              {showExerciseCompletionButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/exercisecompletion')}
              >
              Want to have a look at what your routines look like? Or maybe you want to get about recording your progress right now?
              </Button>
              )}
              
            </Col>

            
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

export default NewWorkoutToRoutine;