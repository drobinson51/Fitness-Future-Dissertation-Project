import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button  from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
 
//use state to handle form setting variables
const DeleteWorkoutRoutine = () => {
  const [workoutRoutineId, setWorkoutRoutineID] = useState("");
  const [workoutRoutineIds, setWorkoutRoutineIds] = useState([]);
  const [days, setDays] = useState([]);
  const [cookies] = useCookies(["authUser"]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const deleteMessage = location.state && location.state.deletionMessage;

  const fetchWorkoutRoutines = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/exerciseroutines/${cookies.authUser}`
      );

      const workoutRoutineIds = response.data.data.map(
        (workoutroutinesavailable) => workoutroutinesavailable.workoutroutineid
      );
  
      const days = response.data.data.map(
        (workoutroutinedaysavailable) => workoutroutinedaysavailable.day
      );

      setWorkoutRoutineIds(workoutRoutineIds);
      setDays(days);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutRoutines();
  }, [cookies.authUser]);

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!workoutRoutineId) {
      alert("You need to select a workout to delete!")
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/deleteexerciseroutine', {
        userid: cookies.authUser,
        workoutroutineid: parseInt(workoutRoutineId),
      });
      console.log('Response:', response.data);

      // Call fetchWorkoutRoutines again after successful deletion
      fetchWorkoutRoutines();
      setShowConfirmModal(false);

      // Use navigate to change the location state
      navigate('/deleteworkoutroutine', { state: { deletionMessage: response.data.deletionMessage } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const confirmModal = (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this workout routine? Your tracked exercises will be kept for assignment to another routine, but this routine will layout will be lost.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
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
            <Image src="/image/DeleteRoutine.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Delete a workout Routine</h1>
              <p className="mt-3 fw-light">
                Sometimes the time ain't right.
              </p>
              <form onSubmit={handleDelete}>
                <div className="mb-4">
                  <label htmlFor="workoutroutineid">Select Workout day:</label>
                  <select
                    className="form-control"
                    value={workoutRoutineId}
                    onChange={(e) => setWorkoutRoutineID(e.target.value)}
                  >
                  <option value="">Select Workout</option>
                    {workoutRoutineIds.map((id, index) => (
                    <option key={id} value={id}>
                    {days[index]}
                     </option>
                    ))}
                    </select>
                    </div>
                    <Button variant="danger" onClick={() => setShowConfirmModal(true)}>Delete Routine</Button>

                {deleteMessage && (
             <div className="mt-3 alert alert-success">
                {deleteMessage}
              </div>
                )}
              </form>
            </Col>
          </Row>
        </Container>
      </main>
      {confirmModal}
    </div>
  );
};

export default DeleteWorkoutRoutine;