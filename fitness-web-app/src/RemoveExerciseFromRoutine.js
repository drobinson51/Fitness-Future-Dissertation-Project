import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";

const RemoveRoutineExercise = () => {
  const [selectedRoutineExerciseId, setSelectedRoutineExerciseId] = useState("");
  const [routineExercisesInfo, setRoutineExercisesInfo] = useState([]);
  const [days, setDays] = useState([]);
  const [workoutRoutinesAvailable, setWorkoutRoutinesAvailable] = useState([]);
  const [selectedWorkoutRoutine, setSelectedWorkoutRoutine] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        setRoutineExercisesInfo(response.data.data);

     
        const daysAvailable = [...new Set(response.data.data.map((exercise) => exercise.day))];
        setDays(daysAvailable);

       
        const workoutRoutinesAvailable = [...new Set(response.data.data.map((exercise) => exercise.workoutroutineid))];
        setWorkoutRoutinesAvailable(workoutRoutinesAvailable);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRoutineExercises();
  }, [cookies.authUser]);

  //Function that handles what happens when day is selected
  const handleWorkoutRoutineRoutineSelection = (e) => {
    const selectedDay = e.target.value;
    setSelectedDay(selectedDay);

  
    const workoutRoutinesAvailable = routineExercisesInfo.find((exercise) => exercise.day === selectedDay);

    if (workoutRoutinesAvailable) {
      setSelectedWorkoutRoutine(workoutRoutinesAvailable.workoutroutineid)
    } else {
      setSelectedWorkoutRoutine("");
    }
  }

  const handleRoutineExerciseChange = (e) => {
    const selectedValue = e.target.value;
    
  
    if (selectedValue === "") {
      setSelectedRoutineExerciseId(""); 
    }
    
    setSelectedRoutineExerciseId(selectedValue);
  }
  

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedRoutineExerciseId) {
      alert("You need to select a workout to delete!")
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/removeexercise', {
        routineexerciseid: parseInt(selectedRoutineExerciseId),
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exercisesAvailableForSelectedWorkoutRoutine = routineExercisesInfo.filter((exercise) => exercise.workoutroutineid === parseInt(selectedWorkoutRoutine));
  return (
    <form onSubmit={handleDelete}>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>


      <div>
        <label htmlFor="routineexerciseinfo">Select Workout Routine:</label>
        <select
          id="workoutroutine"
          onChange={handleWorkoutRoutineRoutineSelection}
          value={selectedDay}
        >
          <option value="">Select Workout Routine</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {selectedWorkoutRoutine && workoutRoutinesAvailable && (
        <div>
          <label htmlFor="routineexercise">Select Exercise:</label>
          <select
            id="routineexercise"
            onChange={handleRoutineExerciseChange}
            value={selectedRoutineExerciseId}
          >
            <option value="">Select Exercise</option>
            {exercisesAvailableForSelectedWorkoutRoutine.map((exercise) => (
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
