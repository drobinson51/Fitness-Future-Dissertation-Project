import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const NewWorkoutToRoutine = () => {
  const [workoutroutineid, setWorkoutRoutineID] = useState([]);
  const [selectedWorkoutRoutineId, setSelectedWorkoutRoutineId] = useState("");
  const [day, setDay] = useState([]);
  const [workoutname, setWorkoutNames] = useState([]);
  const [userworkoutid, setUserWorkoutID] = useState([]);
  const [selectedUserWorkoutId, setSelectedUserWorkoutId] = useState("");
  const [orderperformed, setOrderPerformed] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchWorkoutIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );

        const secondResponse = await axios.get(
          `http://localhost:4000/workoutroutines/${cookies.authUser}`
        );

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
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchWorkoutIds();
  }, [cookies.authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log('orderPerformed:', orderperformed);
    console.log('workoutroutineid:', workoutroutineid);
    console.log('selectedUserWorkoutId:', selectedUserWorkoutId);
  
    try {
      const response = await axios.post(
        "http://localhost:4000/addroutineexercises",
        {
          workoutroutineid: workoutroutineid,
          userworkoutid: selectedUserWorkoutId,
          orderperformed: orderperformed,
        }
      );
  
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>

      <select
        id="userworkoutid"
        value={selectedUserWorkoutId}
        onChange={(e) => setSelectedUserWorkoutId(e.target.value)}
      >
        <option value="">Select Workout</option>
        {userworkoutid.map((id, index) => (
          <option key={id} value={id}>
            {workoutname[index]}
          </option>
        ))}
      </select>

      <select
        id="workoutroutineid"
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

      <div>
        <label htmlFor="orderPerformed">Order of Performance:</label>
        <input
          type="text"
          id="orderperformed"
          value={orderperformed}
          onChange={(e) => setOrderPerformed(e.target.value)}
        />
      </div>

      <button type="submit">Add</button>
    </form>
  );
};

export default NewWorkoutToRoutine;
