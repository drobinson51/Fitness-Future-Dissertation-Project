import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
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

  // Lets it be re-called after handlesubmit. 
  useEffect(() => {

    console.log("useEffect triggered");
    console.log("Current selectedWorkoutRoutineId:", selectedWorkoutRoutineId);
    console.log("Current selectedUserWorkoutId:", selectedUserWorkoutId);

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


        // Checks available workouts and available routines, populates the relevant ids. 

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

  

        // Sets them with outputs of above consts 
        setWorkoutNames(workoutNames);
        setDay(days);
        setUserWorkoutID(userworkoutids);
        setWorkoutRoutineID(workoutroutineids);

        // Errror handling
        } else if ( response.data.status === "error" || secondResponse.data.status === "error") {
          setApiError(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        setApiError("Something went wrong!")
      }
    };

    // Looks for workouts already in a routine, makes sure the same workout does not go into the same routine twice.
    const fetchAlreadyAssignedWorkouts = async () => {
      console.log("fetchAlreadyAssignedWorkouts called");
      if (selectedWorkoutRoutineId) {
        try {
          const response = await axios.get(`http://localhost:4000/routineexercises/${selectedWorkoutRoutineId}`);
          
          console.log("Response from fetchAlreadyAssignedWorkouts:", response.data);


    // Success and error handling
          if (response.data.status === "success") {
            // Maps theassigned workouts
            const assignedWorkouts = response.data.data.map((item) => item.userworkoutid);
            setAlreadyAssignedWorkouts(assignedWorkouts);
          } else if (response.data.status === "Nothing found") {
            // Sets it empty to not cause any issues with dropdowns
            setAlreadyAssignedWorkouts([]);
            console.log("Setting alreadyAssignedWorkouts to an empty array");
          }
          
          // Error handling
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // sets empty again to avoid errors, arguably should not be done
            setAlreadyAssignedWorkouts([]);
            console.log("Setting alreadyAssignedWorkouts to an empty array because of 404");
          }
          else {
            console.error("Error:", error);
          }
        }
      }
    };
    

    // submission logic
  const handleSubmit = async (event) => {
    // To ensure that the event must be explicitly handled overwise do not treat it as normal. 
    event.preventDefault();

    // Standard alert 
    if (!orderperformed || !workoutroutineid || !selectedUserWorkoutId) {
      alert("You need to select an option so that you can add a workout to a routine!")
      return;
    }
  
    console.log('orderPerformed:', orderperformed);
    console.log('workoutroutineid:', workoutroutineid);
    console.log('selectedUserWorkoutId:', selectedUserWorkoutId);
  
    // Classic post
    try {
      const response = await axios.post(
        "http://localhost:4000/addroutineexercises",
        {
          workoutroutineid: selectedWorkoutRoutineId,
          userworkoutid: selectedUserWorkoutId,
          orderperformed: orderperformed,
        }

      
      );
  
      // Calls all relevant functions again to refresh page
      
      fetchWorkoutIds();
      fetchAlreadyAssignedWorkouts();

      setOrderPerformed("");
      setSelectedWorkoutRoutineId("");
      setSelectedUserWorkoutId("");
      

      // For redirection
      setShowExerciseCompletionButton(true);


      //refreshes page, also gives success message for user communication
      navigate('/addexercisestoroutine', { state: { successMessage: response.data.successMessage } });
      console.log("Response:", response.data);
    } catch (error) {
      // Again error handling
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
                  <label htmlFor="selectedWorkoutRoutineId">Select Routine Day:</label>
                  <select
                    data-testid = "routineSelection"
                    type="String"
                    id="selectedWorkoutRoutineId"
                    className="form-control"
                    value={selectedWorkoutRoutineId}
                    // Classic onChange, grabs relevant id from mao and sets it as workoutroutine id
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
                
                  <label htmlFor="userworkoutid">Workout:</label>
                  <select
                    data-testid = "workoutSelection"
                    type="String"
                    id="userworkoutid"
                    className="form-control"
                    value={selectedUserWorkoutId}
                    // Same general idea as above
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
                  {/* Order performed, mostly superflous */}
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


              {/*Success message */}
              {successMessage && (
              <div className="mt-3 alert alert-success">
              {successMessage}
              </div>
              )}

                {/*Button for navigation  */}
              {showExerciseCompletionButton && (
              <Button variant="outline-primary" className = "mt-3"
              onClick={() => navigate('/exercisecompletion')}
              >
              Want to have a look at what your routines look like? Or maybe you want to get about recording your progress right now?
              </Button>
              )}
              
            </Col>

                {/* API error if applicable */}
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