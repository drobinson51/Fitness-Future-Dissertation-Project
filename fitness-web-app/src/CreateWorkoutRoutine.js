import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";




//use state to handle form setting variables
const NewUserWorkoutRoutine = () => {

  const [day, setDay] = useState("");

  const [cookies] = useCookies(["authUser"]);

  useEffect(() => {
  }, [cookies.authUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!day) {
      alert("You need to select a day to create a workout!")
      return;
    }

    
  try {
    const response = await axios.post('http://localhost:4000/addworkoutroutine', {

    userid: cookies.authUser,
    day: day,

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
     
      <div>
      <select
        id="day"
        value={day}
        onChange={(e) => setDay(e.target.value)}
      >
        // varies options
        <option value="">Select Day for this routine </option>
        <option value="Monday">Monday </option>
        <option value="Tuesday">Tuesday </option>
        <option value="Wednesday">Wednesday </option>
        <option value="Thursday">Thursday </option>
        <option value="Friday">Friday </option>
        <option value="Saturday">Saturday </option>
        <option value="Sunday">Sunday </option>
      </select>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default NewUserWorkoutRoutine;
