import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";

//use state to handle form setting variables
const DeleteWorkoutRoutine = () => {
  const [workoutRoutineId, setWorkoutRoutineID] = useState("");
  const [day, setDay] = useState([]);
  const [UserWorkoutRoutines, setUserWorkoutRoutines] = useState([]);
  const [workoutRoutineIds, setWorkoutRoutineIds] = useState([]);
  const [days, setDays] = useState([]);

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutRoutines = async () => {
      try {
        const response = await axios.get(
            `http://localhost:4000/exerciseroutines/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data


        const workoutRoutineIds = response.data.data.map(
            (workoutroutinesavailable) => workoutroutinesavailable.workoutroutineid
          );
  
          const days = response.data.data.map(
            (workoutroutinedaysavailable) => workoutroutinedaysavailable.day
          );

          setWorkoutRoutineIds(workoutRoutineIds);

          setDays(days);


      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutRoutines();
  }, [cookies.authUser]);

  const handleDelete = async (event) => {
    event.preventDefault();


    if (!workoutRoutineId) {
      alert("You need to select a workout to delete!")
      return;
    }


  try {
    const response = await axios.post('http://localhost:4000/deleteexerciseroutine', {
    userid: cookies.authUser,
    workoutroutineid: parseInt(workoutRoutineId),
    });
     console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };

  return (
    <form onSubmit={handleDelete}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>

      <div>
        <select
          id="workoutid"
          value={workoutRoutineId}
          onChange={(e) => setWorkoutRoutineID(e.target.value)}
        >
          
          <option value="">Select Workout</option>
          {workoutRoutineIds.map((id, index) => (
            <option key={id} value={id}>
              {days[index]}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary">Delete Workout Routine</button>
    </form>
  );
};

export default DeleteWorkoutRoutine;
