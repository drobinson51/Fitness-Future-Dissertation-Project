import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useLocation, useNavigate } from "react-router-dom";



const RemoveRoutineExercise = () => {
  const [selectedRoutineExerciseId, setSelectedRoutineExerciseId] = useState("");
  const [routineExercisesInfo, setRoutineExercisesInfo] = useState([]);
  const [days, setDays] = useState([]);
  const [workoutRoutinesAvailable, setWorkoutRoutinesAvailable] = useState([]);
  const [selectedWorkoutRoutine, setSelectedWorkoutRoutine] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const deleteMessage = location.state && location.state.deletionMessage;
  const [cookies] = useCookies(["authUser"]);


  useEffect(() => {

    fetchRoutineExercises();
  }, [cookies.authUser]);


// Finds out if user has routine exercises
    const fetchRoutineExercises = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/workoutinfos/${cookies.authUser}`
        );
    
        // Sets the arrays as blank helping to deal with workouts remaining if not are meant to remain
        if (response.data.status === "Nothing found") {
          setRoutineExercisesInfo([]);
          setDays([]);
          setWorkoutRoutinesAvailable([]);
          return;
        }
    
        console.log("Response:", response.data);
    
        setRoutineExercisesInfo(response.data.data);
    
        const daysAvailable = [...new Set(response.data.data.map((exercise) => exercise.day))];
        setDays(daysAvailable);
    
        const workoutRoutinesAvailable = [...new Set(response.data.data.map((exercise) => exercise.workoutroutineid))];
        setWorkoutRoutinesAvailable(workoutRoutinesAvailable);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    

  //Function that handles what happens when day is selected
  const handleWorkoutRoutineRoutineSelection = (e) => {
    const selectedDay = e.target.value;
    setSelectedDay(selectedDay);
  
    const workoutRoutineAvailable = routineExercisesInfo.find((exercise) => exercise.day === selectedDay);
  
    if (workoutRoutineAvailable) {
      setSelectedWorkoutRoutine(workoutRoutineAvailable.workoutroutineid);
    } else {
      setSelectedWorkoutRoutine("");
    }
    
    console.log("Selected Workout Routine:", selectedWorkoutRoutine); // Add this line
  };



const handleRoutineExerciseChange = (e) => {
  const selectedValue = e.target.value;
    
  if (selectedValue === "") {
    setSelectedRoutineExerciseId(""); 
  }
    
  setSelectedRoutineExerciseId(selectedValue);
  
  console.log("Selected Routine Exercise ID:", selectedRoutineExerciseId); // Add this line
};

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!selectedRoutineExerciseId) {
      alert("You need to select a workout to delete!")
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/removeexercise', {
        routineexerciseid: parseInt(selectedRoutineExerciseId),
      });
      console.log('Response:', response.data);

      fetchRoutineExercises();
      setShowConfirmModal(false);

      

      navigate('/removeroutineexercise', { state: { deletionMessage: response.data.deletionMessage } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // filters through the exercises that can be added to the routine to match them up to the relevant routine
  const exercisesAvailableForSelectedWorkoutRoutine = routineExercisesInfo.filter((exercise) => exercise.workoutroutineid === parseInt(selectedWorkoutRoutine));

    const confirmModal = (
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove this exercise from the routine?
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
    <div className="removesworkoutsfromroutine">
  
      <main>
        <Container>
          <Row className="px-4 my-5">
            <Col sm={7}>
            <Image src="/image/RemoveExerciseFromRoutine.jpeg" className="image-size" fluid rounded />
            </Col>
            <Col sm={5}>
              <h1 className="fw-bold">Remove Exercise from a routine</h1>
              <p className="mt-3 fw-light">
                Remove an exercise from the day it has been assigned to.
              </p>
              <form onSubmit={handleDelete}>
                <div className="mb-4">
                  <label htmlFor="routineexerciseinfo">Select Workout Routine:</label>
                  <select
                   data-testid="workoutroutine"
                    type="String"
                    id="workoutroutine"
                    className="form-control"
                    value={selectedDay}
                    onChange= {handleWorkoutRoutineRoutineSelection}
                  >
                     <option value="">Select Workout Routine</option>
                    {days.map((day) => (
                    <option key={day} value={day}>
                    {day}
                    </option>
                    ))}
                    </select>
                    </div>

                    {selectedWorkoutRoutine && workoutRoutinesAvailable && (
                <div className="mb-4">
                  <label htmlFor="routineexercise">Select Exercise to remove:</label>
                  <select
                   data-testid="routineexercise"
                    type="String"
                    id="routineexercise"
                    className="form-control"
                    value={selectedRoutineExerciseId}
                    onChange= {handleRoutineExerciseChange}
                    >
                    <option value="">Select Exercise</option>
                    {exercisesAvailableForSelectedWorkoutRoutine.map((exercise) => (
                    <option key={exercise.routineexerciseid} value={exercise.routineexerciseid}>
                    {exercise.workoutname}
                    </option>
                    ))}
                    </select>
                    </div>

                    )}

              <Button variant="danger" onClick={() => setShowConfirmModal(true)}>Remove Exercise</Button>
              </form>

              
              {deleteMessage && (
             <div className="mt-3 alert alert-success">
                {deleteMessage}
              </div>
                )}
            </Col>
          </Row>
        </Container>
      </main>
      {confirmModal}
    </div>
  );
};

export default RemoveRoutineExercise;