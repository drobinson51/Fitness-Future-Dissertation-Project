import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";




//use state to handle form setting variables
const NewUserWorkout = () => {
  const [workoutid, setWorkoutID] = useState("");
  const [userid, setUserID] = useState("");
  const [customliftweight, setCustomLiftWeight] = useState("");
  const [customliftreps, setCustomLiftReps] = useState("");
  const [workoutIds, setWorkoutIds] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchworkoutids = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workouts`
        );
        console.log("Response:", response.data); // Log the response data
  
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
    
    fetchworkoutids();
  }, [cookies.authUser]);

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

    console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>
      
      <select
        id="workoutid"
        value={workoutid}
        onChange={(e) => setWorkoutID(e.target.value)}
      >
        // iterates through workouts, maps id as value, but then also displays name of workout for user friendliness
        <option value="">Select Workout</option>
        {workoutIds.map((id, index) => (
          <option key={id} value={id}>
            {workoutNames[index]}
          </option>
        ))}
      </select>
      <div>
        <label htmlFor="customliftweight">Weight of Lift:</label>
        <input
          type="String"
          id="customliftweight"
          value={customliftweight}
          onChange={(e) => setCustomLiftWeight(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="customliftreps">Reps of Lift:</label>
        <input
          type="String"
          id="customliftreps"
          value={customliftreps}
          onChange={(e) => setCustomLiftReps(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default NewUserWorkout;
