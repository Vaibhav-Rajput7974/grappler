import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { createTask } from "../../Api/AllApi";
import { addTicketToStage } from "../../slice/ProjectSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import axios from "axios";
const TaskModal = ({ show, handleClose, stageId }) => {
  const [taskName, setTaskName] = useState("");
  const [taskStartingDate, setTaskStartingDate] = useState(new Date());
  const [taskEndingDate, setTaskEndingDate] = useState(new Date());
  const [taskPriority , setTaskPriority] = useState("Low");
  const [taskAssignee, setTaskAssignee] = useState(1);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("to-Do");
  const { projectById } = useSelector((state) => state.Project);
  const [users,setusers]=useState([]);
  const { status } = projectById;
  const dispatch = useDispatch();
  const taskCreateNotify = () =>
    toast.success("Task Create Successfully...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      theme: "light",
    });

    useEffect(() => {
      axios
        .get(`http://localhost:8080/users`)
        .then((response) => {
          console.log(response.data.data);
          setusers(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching rules: ", error);
        });
    }, []);

  const handleCreateTask = () => {
    const formattedstartingDateTime = format(new Date(taskStartingDate), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
    const formattedendDateTime = format(new Date(taskEndingDate), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
    const Assignee=users.find(user=>user.id == taskAssignee);
    const newTask = {
      ticketName: taskName,
      ticketStartingDate: formattedstartingDateTime,
      ticketEndingDate: formattedendDateTime,
      ticketAssign: Assignee,
      ticketPriority : taskPriority,
      ticketDescription: taskDescription,
      status: taskStatus,
    };
    console.log(newTask);
    
    createTask(projectById.projectId, stageId, newTask)
      .then((response) => {
        dispatch(
          addTicketToStage({ stageId: stageId, ticketData: response.data.data })
        );
        handleClose();
        taskCreateNotify();
      })
      .catch((error) => {
        console.error("Error creating task: ", error);
      });
    setTaskName("");
    setTaskStartingDate(new Date());
    setTaskEndingDate(new Date());
    setTaskAssignee("");
    setTaskPriority("Low");
    setTaskDescription("");
    setTaskStatus("to-Do");
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>
              Task Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              Project <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={projectById.projectName}
              readOnly={true}
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="datetime-local"
              className="form-control"
              value={taskStartingDate}
              onChange={(e) => setTaskStartingDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="datetime-local"
              className="form-control"
              value={taskEndingDate}
              onChange={(e) => setTaskEndingDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Assignee</label>
            <select
              name="status"
              id="status"
              className="form-control"
              onChange={(e) => setTaskAssignee(e.target.value)}
            >
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="selectedStage">Select Status</label>
            <select
              name="status"
              id="status"
              className="form-control"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              {status?.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Task Priority</label>
            <select
              className="form-control"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Task Description</label>
            <textarea
              className="form-control"
              placeholder="Enter task description"
              rows="4"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateTask}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
  <ToastContainer />;
};
export default TaskModal;