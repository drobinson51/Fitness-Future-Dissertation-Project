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
  useEffect(() => {

    fetchWorkoutIds();
  }, [cookies.authUser]);
    

    const fetchWorkoutIds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/userworkouts/${cookies.authUser}`
        );


        if (response.data.status === "success") {
          console.log("Response:", response.data); // Log the response data

          const workoutIds = response.data.data.map(
            (workoutsavaiable) => workoutsavaiable.workoutid
          );
  
          const workoutNames = response.data.data.map(
            (workoutnamesavailable) => workoutnamesavailable.workoutname
          );
          console.log("Here are the workout ids:", workoutIds);
          setWorkoutIds(workoutIds);
          setWorkoutNames(workoutNames);
        } else {
          console.log(response.data)
          setApiError(response.data.message)
        }
      
      } catch (error) {
        console.error("Error:", error);
        setApiError("An error occurred")
      }
    };

  

  const handleDelete = async (event) => {
    event.preventDefault();


    if (!workoutid) {
      alert("You need to select a workout to delete!")
      return;
    }


  try {
    const response = await axios.post('http://localhost:4000/deleteuserworkouts', {
    userid: cookies.authUser,
    workoutid: parseInt(workoutid),
    });


    if (response.data.status === "success") {
      setShowConfirmModal(false);
      fetchWorkoutIds();
      navigate('/deleteworkouts', { state: { deletionMessage: response.data.deletionMessage } });
      console.log('Response:' , response.data);
    } else {
      setApiError(response.data.message)
    }
   

   
  } catch (error) {
    console.error('Error:' , error);
    setApiError("An unexpected error has occured in the post, please try again later")
  }
  };


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
              <Image src="https://picsum.photos/900/400" fluid rounded />
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
                   <option value="">Select Workout</option>
                    {workoutIds.map((id, index) => (
                    <option key={id} value={id}>
                    {workoutNames[index]}
                    </option>
                    ))}
                </select>
                </div>
                <Button variant="danger" onClick={() => setShowConfirmModal(true)}>Delete User Workout</Button>
              </form>

              {deleteMessage && (
             <div className="mt-3 alert alert-success">
                {deleteMessage}
              </div>
                )}
            </Col>
          </Row>

          {apiError && (
             <div className="mt-3 alert alert-success">
                {apiError}
              </div>
                )}
        </Container>
      </main>
      {confirmModal}
    </div>
  );
};

export default DeleteUserWorkouts;