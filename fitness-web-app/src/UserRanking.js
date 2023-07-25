import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";



const UserTierList = () => {

    const [userPosition, setUserPosition] = useState("");
    const [cookies] = useCookies(["authUser"]);

useEffect(() => {
    const getUserValue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/tierlist/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        //gets the first result, which is the user position. 
      setUserPosition(response.data.data[0].title);
      
      } catch (error) {
        console.error("Error:", error);
      }
    };


    getUserValue();
  }, [cookies.authUser]);

  console.log(userPosition);

  return (
    <form>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>
     
      <div>
        <h2>Your current ranking is:</h2>
        <h2>{userPosition}</h2>
    </div>
    </form>
  );
};

export default UserTierList;
