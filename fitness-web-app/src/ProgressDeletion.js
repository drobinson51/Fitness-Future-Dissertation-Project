import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";

const RemoveRoutineExercise = () => {
  const [selectedUserWorkoutId, setSelectedUserWorkoutId] = useState("");
  const [routineExercisesInfo, setRoutineExercisesInfo] = useState([]);
  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/progressinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        setRoutineExercisesInfo(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRoutineExercises();
  }, [cookies.authUser]);

  const handleUserWorkoutChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedUserWorkoutId("");
    } else {
      setSelectedUserWorkoutId(parseInt(selectedValue));
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedUserWorkoutId) {
      alert("You need to select workout progress to delete!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/removeprogress', {
        userid: cookies.authUser,
        userworkoutid: selectedUserWorkoutId, 
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // creates a set of userworkout ids and names, makes the keys the two values separated by a hyphen and then adds them

  const userWorkoutSet = new Set();
  routineExercisesInfo.forEach((exercise) => {
    const { userworkoutid, workoutname } = exercise;
    const relevantInfos = `${userworkoutid}-${workoutname}`;
    userWorkoutSet.add(relevantInfos);
  });

  //unpacks the set and makes the relevant infos split up so that the workout name and id are separate

  const userWorkoutOptions = Array.from(userWorkoutSet).map((relevantInfos) => {
    const [userworkoutid, workoutname] = relevantInfos.split("-");
    return (
      <option key={userworkoutid} value={userworkoutid}>
        {workoutname}
      </option>
    );
  });

  return (
    <form onSubmit={handleDelete}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>

      <div>
        <label htmlFor="routineexerciseinfo">Select Exercise:</label>
        <select
          id="routineexercise"
          onChange={handleUserWorkoutChange}
          value={selectedUserWorkoutId}
        >
          <option value="">Select Exercise</option>
          {userWorkoutOptions}
        </select>
      </div>

      <button type="submit">Delete</button>
    </form>
  );
};

export default RemoveRoutineExercise;
