import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'






// Leaderboard function 
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
    <div className="leaderboard">
  
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={12}>
              <h2>The Leaderboard is as follows:</h2>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sets a standard layout to response */}
                  {leaderboardData.map((user) => (
                    <tr key={user.userid}>
                      <td>{user.username}</td>
                      <td>{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default LeaderBoardDisplay;