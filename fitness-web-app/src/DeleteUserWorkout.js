import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link, useNavigate, useLocation} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';


//use state to handle form setting variables
const DeleteUserWorkouts = () => {
  const [workoutid, setWorkoutID] = useState("");
  const [customliftweight, setCustomLiftWeight] = useState("");
  const [customliftreps, setCustomLiftReps] = useState("");
  const [workoutIds, setWorkoutIds] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const deleteMessage = location.state && location.state.deletionMessage;

  const [apiError, setApiError] = useState("");

  const [cookies] = useCookies(["authUser"]);

  // UseEffect as expected from other behaviour
  useEffect(() => {

    fetchWorkoutIds();
  }, [cookies.authUser]);
    

  // Two responses for filter
  const fetchWorkoutIds = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/userworkouts/${cookies.authUser}`
      );
      const secondResponse = await axios.get(
        `http://localhost:4000/workoutinfos/${cookies.authUser}`
      );
    
      // If the two responses are nothing found
      if (response.data.status === "Nothing found" && secondResponse.data.status === "Nothing found") {


        setWorkoutIds([]);
        setWorkoutNames([]);
        setApiError("You have no tracked exercises.");
        return;

        // This means the user has something tracked, but nothing in their routines. Therefore the dropdowns can be populated. Deleting them.
      } else if (secondResponse.data.status === "Nothing found") {
        const workoutIds = response.data.data.map((workout) => workout.workoutid);
        const workoutNames = response.data.data.map((workout) => workout.workoutname);
          
        setWorkoutIds(workoutIds);
        setWorkoutNames(workoutNames);
      } else {

        // creates a set and then uses that to filter out the data
        const workoutsInRoutine = new Set(
          secondResponse.data.data.map((workoutInfo) => workoutInfo.workoutid)
        );
    
        const workoutsNotInRoutine = response.data.data.filter(
          (workout) => !workoutsInRoutine.has(workout.workoutid)
        );
    
        const workoutIds = workoutsNotInRoutine.map((workout) => workout.workoutid);
        const workoutNames = workoutsNotInRoutine.map((workout) => workout.workoutname);
          
        setWorkoutIds(workoutIds);
        setWorkoutNames(workoutNames);
      }
    
    } catch (error) {
      console.error("Error:", error);
      setApiError("An error occurred");
    }
  };
  
  
// Typical delete logic used in this project
  const handleDelete = async (event) => {
    event.preventDefault();


    // Alert
    if (!workoutid) {
      alert("You need to select a workout to delete!")
      return;
    }


    // Posts
  try {
    const response = await axios.post('http://localhost:4000/deleteuserworkouts', {
    userid: cookies.authUser,
    workoutid: parseInt(workoutid),
    });

    // Resets everything and handles message generation on a successful post

    if (response.data.status === "success") {
      setShowConfirmModal(false);
      setWorkoutID("");
      fetchWorkoutIds();
      navigate('/deleteworkouts', { state: { deletionMessage: response.data.deletionMessage } });
      console.log('Response:' , response.data);
    } else {
      setShowConfirmModal(false);
      setApiError(response.data.message)
    }
   

    // Error handling
   
  } catch (error) {
    console.error('Error:' , error);
    setApiError("An unexpected error has occured in the post, please try again later")
  }
  };


  // Modal, this handles the actual delete it is called whenever the user hits the delete button
  const confirmModal = (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to to stop tracking this progress? It cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" data-testid = "actualDelete" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
  


  return (
    <div className="home">
      
      <main>
      <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
              <Image src="/image/DeleteWorkouts.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Remove a personal exercise</h1>
              <p className="mt-3 fw-light">
                If you no longer wish to work with this exercise then drop it! Be warned an untracked exercise will only appear if it is not in any current routine, you cannot delete an exercise without agreeing to reset your progress and removing it from your routines!
              </p>
              <form onSubmit={handleDelete}>
                <div className="mb-4">
                  <label htmlFor="workoutid">Workout:</label>
                  <select
                  data-testid= "workoutselection"
                    type="String"
                    id="workoutid"
                    className="form-control"
                    value={workoutid}
                    onChange={(e) => setWorkoutID(e.target.value)}
                  >
                    {/* Typical population of dropdowns based on iteration through workoutIds data structure */}
                   <option value="">Select Workout</option>
                    {workoutIds.map((id, index) => (
                    <option key={id} value={id}>
                    {workoutNames[index]}
                    </option>
                    ))}
                </select>
                </div>
                {/* Calls the modal */}
                <Button variant="danger" onClick={() => setShowConfirmModal(true)}>Delete User Workout</Button>
              </form>

              {/*Successful delete  */}
              {deleteMessage && (
             <div className="mt-3 alert alert-success">
                {deleteMessage}
              </div>
                )}
            </Col>
          </Row>

                {/* Error */}
          {apiError && (
             <div className="mt-3 alert alert-danger">
                {apiError}
              </div>
                )}
        </Container>
      </main>
      {/* Where the modal is kept */}
      {confirmModal}
    </div>
  );
};

export default DeleteUserWorkouts;