import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

const Completedworkoutform = () => {
  const [day, setDay] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [cookies] = useCookies(["authUser"]);
  const [cookieName] = useCookies(["userName"]);

  const [workoutProgress, setWorkoutProgress] = useState([]);

  const [apiError, setApiError] = useState("")

  const navigate = useNavigate();


  useEffect(() => {

  fetchWorkoutInfo();
}, [cookies.authUser]);

 
    const fetchWorkoutInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );


        if (response.data.status === "success") {
          setWorkoutData(response.data.data);

          //use set ensuring no duplicated days, tacit protection against user having multiple days, mostly redundant with new constraint feature. 
          const daysFound = [...new Set(response.data.data.map((workout) => workout.day))];
          setAvailableDays(daysFound);

        } else {

          setApiError(response.data.status)
          console.log(response.data)
        }

    
      } catch (error) {
        console.error("Error:", error);
        setApiError("An error has occured");
      }
    };



  console.log(workoutData);

  const handleDayChange = (e) => {
    const selectedDay = e.target.value;
    setDay(selectedDay);
    const workoutsForSelectedDay = workoutData.filter(workout => workout.day === selectedDay);
    const initializedWorkoutProgress = workoutsForSelectedDay.map(() => ({
      totalweightlifted: "",
      repscompleted: "",
      setscompleted: ""
    }));

    setWorkoutProgress(initializedWorkoutProgress);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();


    const isInvalid = workoutProgress.some(workout => {
      return (
        !workout.totalweightlifted || 
        !workout.repscompleted || 
        !workout.setscompleted
      );
    });
  
    if (isInvalid) {
      alert("You must fill in all fields in order to submit your progress!");
      return;
    }
    


    //function for setting total weight lifted, and total reps. It works by multiplying the reps and sets. Then the reps by the sets by the totalweightlifted, which is actually the weight on the bar the user sets.
    const workoutProgressWithCalculatedData = workoutProgress.map((exercise) => ({
      ...exercise,
      totalreps: exercise.repscompleted * exercise.setscompleted,
      totalweightlifted: (exercise.totalweightlifted || 0) * exercise.repscompleted * exercise.setscompleted,
    }));
  
    try {
      const workoutsAvailableForSelectedDay = workoutData.filter((workout) => workout.day === day);
  
      //keeps a promise of all the results before they are submitted to axios allowing multiple values to go through at once
      const responses = await Promise.all(workoutsAvailableForSelectedDay.map((workout, index) => axios.post('http://localhost:4000/exerciseprogress', {
        userid: cookies.authUser,
        userworkoutid: parseInt(workout.userworkoutid),
        totalweightlifted: workoutProgressWithCalculatedData[index]?.totalweightlifted,
        repscompleted: workoutProgressWithCalculatedData[index]?.totalreps,
        timestamp: formattedTimestamp,
      })));
  
      console.log("Response", responses.map((response) => response.data));

     

    } catch (error) {
      console.log("Error:", error);
      setApiError("An error has occured")
    }

    //userpoints system
    try {
      const secondResponse = await axios.post('http://localhost:4000/userpoints', {
      userid: cookies.authUser,
      earnedat: formattedTimestamp,
      });
  
      console.log('Response:' , secondResponse.data);
      navigate('/userhome', { state: { successMessage: "Congratulations you killed it!", userName: cookieName } })    } catch (error) {
      console.error('Error:' , error);
      setApiError("An error has occured")
    }
    };
  


    //formatting the timestamp which is then further formatted on the back-end serverside
  const formattedTimestamp = new Date().toLocaleString("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });


  return (
    <div className="exercisecompletion">
      
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="/image/WorkoutRecord.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Select a Workout Routine for the Day</h1>
              <p className="mt-3 fw-light">
                Once you select a routine every exercise you have selected will be available for your completion.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="day">Select Day:</label>
                  <select
                    data-testid = "daySelection"
                    type="String"
                    id="day"
                    className="select-menu"
                    value={day}
                    onChange={handleDayChange} 
                  >
                  {/* Maps through days and brings up the results in dropdown */}
                  <option value="">Select Day</option>
                  {availableDays.map((day) => (
                  <option key={day} value={day}>
                  {day}
                  </option>
                 ))}
                </select>
                </div>

                {day && (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Exercise Name</th>
                        <th>Working Weight</th>
                        <th>Working Set Reps</th>
                        <th>Rep Weight</th>
                        <th>Reps completed</th>
                        <th>Sets Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* filters workout data and then maps through the filtered data indexing the results Sets the key as the index */}
                      {workoutData
                        .filter((workout) => workout.day === day)
                        .map((workout, index) => (
                          <tr key={index}>
                            <td>{workout.workoutname}</td>
                            <td>{workout.customliftweight} kg</td>
                            <td>{workout.customliftreps}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                className="form-control custom-input"
                                placeholder="kg"
                                // Optional chaining deals with null values, sets the workoutProgress value to whatever is inputted, similar operation below
                                value={workoutProgress[index]?.totalweightlifted || ""}
                                onChange={(e) => {
                                  const updatedWorkoutProgress = [...workoutProgress];
                                  updatedWorkoutProgress[index] = {
                                    ...updatedWorkoutProgress[index],
                                    totalweightlifted: e.target.value,
                                  };
                                  setWorkoutProgress(updatedWorkoutProgress);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control custom-input"
                                value={workoutProgress[index]?.repscompleted || ""}
                                onChange={(e) => {
                                  const updatedWorkoutProgress = [...workoutProgress];
                                  updatedWorkoutProgress[index] = {
                                    ...updatedWorkoutProgress[index],
                                    repscompleted: e.target.value,
                                  };
                                  setWorkoutProgress(updatedWorkoutProgress);
                                }}
                              />
                            </td>
                            <td> 
                            <input
                              type="number"
                                className="form-control custom-input"
                                value={workoutProgress[index]?.setscompleted || ""}
                              onChange={(e) => {
                              const updatedWorkoutProgress = [...workoutProgress];
                              updatedWorkoutProgress[index] = {
                                ...updatedWorkoutProgress[index],
                              setscompleted: e.target.value,
                                };
                          setWorkoutProgress(updatedWorkoutProgress);
                        }}
                           />
                        </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}

                <Button type="submit" className="btn btn-primary">
                  Submit Progress
                </Button>
              </form>

  
              {apiError && (
             <div className="mt-3 alert alert-danger">
                {apiError}
              </div>
                )}

                
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Completedworkoutform;