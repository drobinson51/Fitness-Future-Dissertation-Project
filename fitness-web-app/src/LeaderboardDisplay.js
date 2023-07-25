import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";



const LeaderBoardDisplay = () => {

    const [leaderboardData, setLeaderBoardData] = useState([]);
    const [cookies] = useCookies(["authUser"]);

useEffect(() => {
    const getLeaderBoardValues = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/leaderboard/`
        );
        console.log("Response:", response.data); // Log the response data

        //gets the first result, which is the user position. 
        setLeaderBoardData(response.data.data);
      
      } catch (error) {
        console.error("Error:", error);
      }
    };


    getLeaderBoardValues();
  }, [cookies.authUser]);


  return (
    <form>
      <div>
        <label htmlFor="userid">User:</label>
        <input type="String" id="userid" value={cookies.authUser} disabled />
      </div>
     
      <div>
        <h2>The Leaderboard is as follows:</h2>

        <ul>
        {leaderboardData.map((user) => (
                <li key = {user.userid}>
                   <p>Username: {user.username}</p>
                   <p>Points: {user.points}</p>
                </li>
            ))}
        </ul>
    </div>
    </form>
  );
};

export default LeaderBoardDisplay;
