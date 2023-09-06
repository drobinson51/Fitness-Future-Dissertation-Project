import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import HomePage from './Home';
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
import RemoveRoutineExercise from './RemoveExerciseFromRoutine';
import DeleteWorkoutRoutine from './DeleteWorkoutRoutine';
import ProgressDeletion from './ProgressDeletion';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import UserPage from './User';
import Footer from './Footer';
import './styles.css';




const App = () => {


  // Several things going on, authProvider wraps around Router to allow its behaviour to affect all children of router
  // ProtectedRoute is itself a function part of the route path, it wraps around the routes actual element and enforces its logic as to whether or not they see the page 
  // Due to protected route also handling the navbar, this also means the navbar shows up in every page it handles and alters state depending on user authentication

  return (
    <AuthProvider>
    <Router>
      <main>
      <Routes>
      <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
         <Route path="/login" element={<ProtectedRoute element={<LoginForm />} />} />
         <Route path="/register" element={<ProtectedRoute element={<RegisterForm />} />} />
          <Route path="/api" element={<ProtectedRoute element={<ApiStatus />} />} />
          <Route path="/addworkouts" element={<ProtectedRoute element={<NewUserWorkout />} />} />
          <Route path="/userhome" element={<ProtectedRoute element={<UserPage />} />} />
          <Route path="/editworkouts" element={<ProtectedRoute element={<EditWorkouts />} />} />
          <Route path="/createroutine" element={<ProtectedRoute element={<NewUserWorkoutRoutine />} />} />
          <Route path="/deleteworkouts" element={<ProtectedRoute element={<DeleteUserWorkouts />} />} />
          <Route path="/exercisecompletion" element={<ProtectedRoute element={<Completedworkoutform />} />} />
          <Route path="/tierlist" element={<ProtectedRoute element={<UserTierList />} />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<LeaderBoardDisplay />} />} />
          <Route path="/barchart" element={<ProtectedRoute element={<UserBarChart />} />} />
          <Route path="/addexercisestoroutine" element={<ProtectedRoute element={<NewWorkoutToRoutine />} />} />
          <Route path="/removeroutineexercise" element={<ProtectedRoute element={<RemoveRoutineExercise />} />} />
          <Route path="/deleteworkoutroutine" element={<ProtectedRoute element={<DeleteWorkoutRoutine />} />} />
          <Route path="/resetprogress" element={<ProtectedRoute element={<ProgressDeletion />} />} />
          </Routes>
          </main>
          <Footer/>
    </Router>
    </AuthProvider>
  );
};


export default App;
