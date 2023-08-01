import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js'; 
import axios from "axios";
import { useCookies } from "react-cookie";

const UserBarChart = () => {
  const [userChartData, setUserBarChartData] = useState([]);
  const [cookies] = useCookies(["authUser"]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [availableExercises, setAvailableExercises] = useState([]);


  Chart.register(...registerables);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userbarchart/${cookies.authUser}`
        );
        const userData = response.data.data;
        setUserBarChartData(userData);

        const uniqueExercises = [...new Set(userData.map((item) => item.workoutname))];

        //for use with option map
        setAvailableExercises(uniqueExercises);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cookies.authUser]);

  //changes selected exercise based on value selecting in option map 
  const handleExerciseChange = (e) => {
    const exercise = e.target.value;
    setSelectedExercise(exercise);
  };

  //filters the userData to only return the exercise data that matches what is found in the option map
  const filteredData = userChartData.filter(
    (dataset) => dataset.workoutname === selectedExercise
  );

  //filtered data used allowing data to swap based on what exercise has been selected.
  const labels = filteredData.map((item) => item.workoutname);
  const values = filteredData.map((item) => item.totalweightlifted);

  const chartData = {
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
  };

  return (
    <div>
      <h2>Your exercise progression</h2>
      <div>
        <label htmlFor="exercise">Select Exercise:</label>
        <select
          id="exercise"
          value={selectedExercise}
          onChange={handleExerciseChange}
        >
          <option value="">Select an exercise</option>
          {availableExercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            
          ))}
        </select>
      </div>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default UserBarChart;
