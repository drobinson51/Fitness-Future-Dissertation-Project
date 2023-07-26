import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import ApiStatus from './ApiStatus';
import RegisterForm from './RegisterForm';
import NewUserWorkout from './NewUserWorkout';
import DeleteUserWorkouts from './DeleteUserWorkout';
import EditWorkouts from './EditWorkouts';
import NewUserWorkoutRoutine from './CreateWorkoutRoutine';
import NewWorkoutToRoutine from './AddWorkoutsToRoutine';
import Completedworkoutform from './ExerciseCompletion';
import UserTierList from './UserRanking';
import LeaderBoardDisplay from './LeaderboardDisplay';
import UserBarChart from './BarChart';
import { AuthProvider } from './AuthContext';



const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ApiStatus/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/addworkouts" element={<NewUserWorkout />} />
        <Route path="/editworkouts" element={<EditWorkouts />} />
        <Route path="/createroutine" element={<NewUserWorkoutRoutine />} />
        <Route path="/deleteworkouts" element={<DeleteUserWorkouts />} />
        <Route path="/exercisecompletion" element={<Completedworkoutform />} />
        <Route path="/tierlist" element={<UserTierList />} />
        <Route path="/leaderboard" element={<LeaderBoardDisplay />} />
        <Route path="/barchart" element={<UserBarChart />} />
        <Route path ="/addexercisestoroutine" element = {<NewWorkoutToRoutine />} />
        
      </Routes>
     
    </Router>
    </AuthProvider>
  );
};


export default App;
