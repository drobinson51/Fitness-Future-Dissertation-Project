import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';


const ProgressDeletion = () => {
  const [selectedUserWorkoutId, setSelectedUserWorkoutId] = useState("");
  const [routineExercisesInfo, setRoutineExercisesInfo] = useState([]);
  const [cookies] = useCookies(["authUser"]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const deleteMessage = location.state && location.state.deletionMessage;
  const [apiError, setApiError] = useState("");
  

  useEffect(() => {


    fetchRoutineExercises();
  }, [cookies.authUser]);

  
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/progressinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        if (response.data.status === "success") {
          setRoutineExercisesInfo(response.data.data);
        } else if (response.data.status === "Nothing found") {

          setRoutineExercisesInfo([]);
          setApiError("You don't have progress to delete")
          console.log(response.data.data)
        }
     
      } catch (error) {
        console.error("Error:", error);
        setApiError("An error occurred")
      }
    };



  const handleUserWorkoutChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      setSelectedUserWorkoutId("");
    } else {
      setSelectedUserWorkoutId(parseInt(selectedValue));
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedUserWorkoutId) {
      alert("You need to select workout progress to delete!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/removeprogress', {
        userid: cookies.authUser,
        userworkoutid: selectedUserWorkoutId, 
      });
      console.log('Response:', response.data);


      setSelectedUserWorkoutId("");
      fetchRoutineExercises();
      setShowConfirmModal(false);


      navigate('/resetprogress', { state: { deletionMessage: response.data.deletionMessage } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // creates a set of userworkout ids and names, makes the keys the two values separated by a hyphen and then adds them

  const userWorkoutSet = new Set();
  routineExercisesInfo.forEach((exercise) => {
    const { userworkoutid, workoutname } = exercise;
    const relevantInfos = `${userworkoutid}-${workoutname}`;
    userWorkoutSet.add(relevantInfos);
  });

  //unpacks the set and makes the relevant infos split up so that the workout name and id are separate

  const userWorkoutOptions = Array.from(userWorkoutSet).map((relevantInfos) => {
    const [userworkoutid, workoutname] = relevantInfos.split("-");
    return (
      <option key={userworkoutid} value={userworkoutid}>
        {workoutname}
      </option>
    );
  });

  const confirmModal = (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to reset this progress? This cannot be undone.
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
            <Image src="/image/ProgressDeletion.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Exercise Progression</h1>
              <p className="mt-3 fw-light">Pick an exercise from the list, and then see your progress in it over time</p>
           <form onSubmit={handleDelete}> 
                <div className="mb-4">
                  <label htmlFor="exercise">Select Exercise:</label>
                  <select
                    data-testid = "exerciseselection"
                    id="routineexerciseId"
                    className="form-control"
                    value={selectedUserWorkoutId}
                    onChange={handleUserWorkoutChange}
                  >
                    <option value="">Select an exercise</option>
                    {userWorkoutOptions}
                    </select>
                    
                </div>
               
                <Button variant="danger" onClick={() => setShowConfirmModal(true)}>Delete Progress</Button>
                </form>

                {deleteMessage && (
             <div className="mt-3 alert alert-success">
                {deleteMessage}
              </div>
                )}
            </Col>
          </Row>
          
          {apiError && (
             <div className="mt-3 alert alert-danger">
                {apiError}
              </div>
                )}

        </Container>
      </main>
      {confirmModal}
    </div>
  );
};

export default ProgressDeletion;
