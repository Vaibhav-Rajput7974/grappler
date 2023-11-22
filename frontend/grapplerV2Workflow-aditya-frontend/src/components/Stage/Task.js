import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSliceTicket } from "../../slice/ProjectSlice";
import axios from "axios";
import { format } from 'date-fns';
const Task = ({ taskIndex, stageIndex, stageId }) => {
  const { projectById } = useSelector((state) => state.Project);
  const task = projectById.stageList[stageIndex].ticketList[taskIndex];
  const dispatch = useDispatch();
  const { status } = projectById;
  const [users,setusers]=useState([]);
  const [taskAssignee, setTaskAssignee] = useState(1);
  const [formData, setFormData] = useState({
    ticketId: task.ticketId,
    ticketName: task.ticketName,
    ticketAssign: task.ticketAssign,
    ticketEndingDate: task.ticketEndingDate,
    ticketDescription: task.ticketDescription,
    ticketPriority: task.ticketPriority,
    status: task.status,
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name,'---------',value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleStageChange = (e) => {
    formData.stageId=e.target.value;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleClose = () => {
    const formattedendingDateTime = format(new Date(formData?.ticketEndingDate), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
    const Assignee=users.find(user=>user.id == taskAssignee);
    formData.ticketAssign=Assignee;
    formData.ticketEndingDate= formattedendingDateTime;
    console.log(formData);
    axios
      .put(
        `http://localhost:8080/projects/${projectById.projectId}/stages/${stageId}/tickets`,
        formData
      )
      .then((response) => {
        dispatch(
          updateSliceTicket({
            previous: stageId,
            data: response.data.data,
          })
        );
        console.log("Ticket updated successfully", response.data.data);
      })
      .catch((error) => {
        console.error("Error updating the ticket: ", error);
      });
  };
  const handelOpen = () => {
    axios
      .get(
        `http://localhost:8080/projects/${projectById.projectId}/stages/${stageId}/tickets/${task.ticketId}`
      )
      .then((response) => {
        console.log("ticket Bu ID", response.data.data);
        setFormData(response.data.data);
      })
      .catch((error) => { 
        console.error("Error updating the ticket: ", error);
      });
  };
  return (
    <div className="card task-card">
      <button
        onClick={handelOpen}
        type="button"
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target={`#offcanvasRight_${task.ticketId}`}
        style={{ margin: "10px", backgroundColor: "blue" }}
      >
        <div className="card-title">
          <h4>{task.ticketName}</h4>
        </div>
        <div className="card-body">
          <h6>{task.status}</h6>
          <h6>{task.ticketPriority}</h6>
          <h6>{task.ticketEndingDate?.substring(0, 10)}</h6>
          <h6>{task.ticketAssign?.userName}</h6>
        </div>
        
        
      </button>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id={`offcanvasRight_${task.ticketId}`}
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title text-center">Ticket Details</h2>
          <button
            type="button"
            className="btn btn-close"
            data-bs-dismiss="offcanvas"
            onClick={handleClose}
          ></button>
        </div>
        <div className="offcanvas-body">
          <form className="ticket-form">
            <p>Task created on: {task.ticketStartingDate}</p>
            <div>
              <div className="form-group">
                <label htmlFor="ticketName">Ticket Name</label>
                <input
                  type="text"
                  name="ticketName"
                  id="ticketName"
                  className="form-control"
                  value={formData.ticketName}
                  onChange={handleChange}
                />
              </div>
              {/* Add a select dropdown for selecting the stage */}
              <div className="form-group">
                <label htmlFor="selectedStage">Select Status</label>
                <select
                  name="status"
                  id="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {status?.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
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
                <label htmlFor="ticketEndingDate">End Date</label>
                <input
                  type="datetime-local"
                  name="ticketEndingDate"
                  id="ticketEndingDate"
                  className="form-control"
                  value={formData.ticketEndingDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketPriority">Ticket Priority</label>
                <div>
                  <input
                    type="text"
                    id="ticketPriority"
                    className="form-control"
                    name="ticketPriority"
                    value={formData.ticketPriority}
                    readOnly
                  />
                  <select
                    className="form-control"
                    name="ticketPriority" // Use "ticketPriority" instead of "newPriority"
                    value={formData.ticketPriority} // Update the value to formData.ticketPriority
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="ticketDescription">Ticket Description</label>
                <textarea
                  name="ticketDescription"
                  id="ticketDescription"
                  className="form-control"
                  value={formData.ticketDescription}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketStage">Select Ticket Stage</label>
                <select
                  name="stageId"
                  id="stageId"
                  className="form-control"
                  value={formData.stageId}
                  onChange={handleStageChange}
                >
                  {projectById.stageList.map((stage) => (
                    <option key={stage.stageId} value={stage.stageId}>
                      {stage.stageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Task; 