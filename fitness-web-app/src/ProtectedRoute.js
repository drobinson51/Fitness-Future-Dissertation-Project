import {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import RegisteredNavbar from './RegisteredNavbar';
import UnregisteredNavbar from './UnregisteredNavbar';

const ProtectedRoute = ({element }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  //checks the path
  const location = useLocation();

  // set routes that can be used with regular navbar
  const unprotectedRoutes = ['/', '/login', '/register'];



  useEffect(() => {

    //reads the array and checks for the isLoggedIn status from the useAuth. 
    //if you aren't logged in and you're on a page that isn't whitelisted you'll be redirected
    if (!isLoggedIn && !unprotectedRoutes.includes(location.pathname)) {

      navigate('/login');
    }
  }, [isLoggedIn, navigate, location]);

  //again defines the allow pages
  const isUnprotectedRoute = unprotectedRoutes.includes(location.pathname);

  return (

    <div>
   {/* Conditional logic or rendering which navbar based on whether or not user is logged in */}
      {isLoggedIn ? <RegisteredNavbar/> : <UnregisteredNavbar/>}
      {/* Ensures that the page is displayed even if not logged in */}
      {isLoggedIn || isUnprotectedRoute ? element : null}
    </div>
  );
  

};

export default ProtectedRoute;
