import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
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
  

  useEffect(() => {
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/progressinfos/${cookies.authUser}`
        );
        console.log("Response:", response.data); // Log the response data

        setRoutineExercisesInfo(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchRoutineExercises();
  }, [cookies.authUser]);

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
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="home">
      <header>
      <Navbar
          expand="lg"
          Navbar bg="primary" 
          data-bs-theme="dark"
        >
          <Container>
            <Navbar.Brand href="#home">Fitness-Future</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/userhome">Home</Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
                <NavDropdown title="Workout Management" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/createroutine">Create Routine</NavDropdown.Item>
                  <NavDropdown.Item href="/addworkouts">
                    Add user exercises
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/editworkouts">
                    Edit user exercises
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/addexercisestoroutine">
                    Customise Routines
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/resetprogress">Reset exercise progress</NavDropdown.Item>
                  <NavDropdown.Item href="/removeroutineexercise">
                    Delete exercise from routine
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/deleteworkoutroutine">
                    Delete routine
                  </NavDropdown.Item>
                  

                </NavDropdown>
                <Nav.Link href="/leaderboard">The Leaderboard</Nav.Link>
                <Nav.Link href="/exercisecompletion">Workout Record</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
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
            </Col>
          </Row>
        </Container>
      </main>
      {confirmModal}
    </div>
  );
};

export default ProgressDeletion;
