import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const RemoveRoutineExercise = () => {
  const [selectedRoutineExerciseId, setSelectedRoutineExerciseId] = useState("");
  const [routineExercises, setRoutineExercises] = useState([]);
  const [workoutRoutines, setWorkoutRoutines] = useState([]);
  const [selectedWorkoutRoutineId, setSelectedWorkoutRoutineId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        setRoutineExercises(response.data.data);

        // Get unique workout routine days
        const uniqueDays = [...new Set(response.data.data.map((exercise) => exercise.day))];
        setWorkoutRoutines(uniqueDays);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRoutineExercises();
  }, [cookies.authUser]);

  const handleWorkoutRoutineChange = (e) => {
    const selectedDay = e.target.value;
    setSelectedDay(selectedDay);

    // Find the workout routine with the selected day from routineExercises
    const selectedWorkoutRoutine = routineExercises.find((exercise) => exercise.day === selectedDay);
    setSelectedWorkoutRoutineId(selectedWorkoutRoutine.workoutroutineid);
  };

  const handleExerciseChange = (e) => {
    setSelectedRoutineExerciseId(e.target.value);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedRoutineExerciseId) {
      alert("You need to select an exercise to delete!");
      return;
    }
    try {
      // Perform the delete operation with the selectedRoutineExerciseId
      const response = await axios.post("http://localhost:4000/removeexercise", {
        routineexerciseid: parseInt(selectedRoutineExerciseId),
      });

      console.log("Deleted Exercise ID:", selectedRoutineExerciseId);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const exercisesForSelectedRoutine = routineExercises.filter(
    (exercise) => exercise.workoutroutineid === parseInt(selectedWorkoutRoutineId)
  );

  return (
    <form onSubmit={handleDelete}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>

      <div>
        <label htmlFor="workoutroutine">Select Workout Routine:</label>
        <select
          id="workoutroutine"
          onChange={handleWorkoutRoutineChange}
          value={selectedDay}
        >
          <option value="">Select Workout Routine</option>
          {workoutRoutines.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {selectedWorkoutRoutineId && (
        <div>
          <label htmlFor="routineexercise">Select Exercise:</label>
          <select
            id="routineexercise"
            onChange={handleExerciseChange}
            value={selectedRoutineExerciseId}
          >
            <option value="">Select Exercise</option>
            {exercisesForSelectedRoutine.map((exercise) => (
              <option key={exercise.routineexerciseid} value={exercise.routineexerciseid}>
                {exercise.workoutname}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit">Delete</button>
    </form>
  );
};

export default RemoveRoutineExercise;
