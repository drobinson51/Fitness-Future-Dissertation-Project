import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";

//use state to handle form setting variables
const Completedworkoutform = () => {
  const [userWorkoutId, setUserWorkoutId] = useState("");
  const [selectedUserWorkoutId, setSelectedUserWorkoutID] = useState("");
  const [routineExerciseId, setRoutineExerciseId] = useState("");
  const [totalWeightLifted, setTotalWeightLifted] = useState("");
  const [repsCompleted, setRepsCompleted] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [workoutNames, setWorkoutNames] = useState([]);
  const [workoutData, setWorkoutData] = useState([])
  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );


        setWorkoutData(response.data.data);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutInfo();
  }, [cookies.authUser]);

  const infoOfWorkoutSelected = (e) => {
    const selectedRelevantWorkoutId = parseInt(e.target.value);
    setSelectedUserWorkoutID(selectedRelevantWorkoutId);
    const selectedRelevantRoutineExerciseID = workoutData.find(
      (workout) => workout.userworkoutid === selectedRelevantWorkoutId
    ).routineexerciseid;

    
    setRoutineExerciseId(selectedRelevantRoutineExerciseID);
  }


  const formattedTimestamp = new Date().toLocaleString("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });



  const handleSubmit = async (event) => {
    event.preventDefault();


  try {
    const response = await axios.post('http://localhost:4000/exerciseprogress', {
    userid: cookies.authUser,
    userworkoutid: parseInt(selectedUserWorkoutId),
    routineexerciseid:  parseInt(routineExerciseId),
    totalweightlifted:  parseInt(totalWeightLifted),
    repscompleted:  parseInt(repsCompleted),
    timestamp: formattedTimestamp,

    });

    
     console.log('Response:' , response.data);
  } catch (error) {
    console.error('Error:' , error);
  }

  
  try {
    const secondResponse = await axios.post('http://localhost:4000/userpoints', {
    userid: cookies.authUser,
    earnedat: formattedTimestamp,
    });
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

    <div>
      <select
        id="userworkoutid"
        value={selectedUserWorkoutId}
        onChange= {infoOfWorkoutSelected}
      >
        <option value="">Select Workout</option>
        {workoutData.map((workout) => (
          <option key={workout.userworkoutid} value={workout.userworkoutid}>
            {workout.workoutname}
          </option>
        ))} 
      </select>
    </div>

    <div>
      <label htmlFor="routineexerciseid">Routine Exercise id:</label>
      <input
        type="number"
        id="routineexerciseid"
        value={routineExerciseId}
        onChange={(e) => setRoutineExerciseId(e.target.value)}
      />
    </div>

    <div>
      <label htmlFor="totalweightlifted">Total Weight Lifted:</label>
      <input
        type="number"
        id="totalweightlifted"
        value={totalWeightLifted}
        onChange={(e) => setTotalWeightLifted(e.target.value)}
      />
    </div>

    <div>
      <label htmlFor="repscompleted">Reps Completed:</label>
      <input
        type="number"
        id="repscompleted"
        value={repsCompleted}
        onChange={(e) => setRepsCompleted(e.target.value)}
      />
    </div>

    <div>
      <label htmlFor="timestamp">Timestamp:</label>
      <input
        type="text"
        id="timestamp"
        value={formattedTimestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />
    </div>

    <button type="submit">Submit</button>
  </form>
);
};

export default Completedworkoutform;