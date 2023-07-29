import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);
import axios from "axios";
import { useCookies } from "react-cookie";


const UserBarChart = () => {
  const [userChartData, setUserBarChartData] = useState({});
  const [cookies] = useCookies(["authUser"]); 
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/userbarchart/${cookies.authUser}`);
        const userData = response.data.data;
  
        const labels = userData.map((item) => item.workoutname);
        const values = userData.map((item) => item.totalweightlifted);
  
        console.log("Labels:", labels);
        console.log("Values:", values);
  
        setUserBarChartData({
          labels: labels,
          datasets: [
            {
              label: "Weight Lifted",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [cookies.authUser]);
  

  if (isLoading) {
    return <h2>Loading....</h2>
  }

    return (
    <div>
      <h2>Bar Chart Example</h2>
      <Bar
        data={userChartData}
        options={{
          scales: {
            y: {
              type: "linear", // Set the scale type to "linear"
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default UserBarChart;