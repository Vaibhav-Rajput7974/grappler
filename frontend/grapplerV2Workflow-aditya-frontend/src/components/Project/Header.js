import React, { useState } from "react";
import "./Header.css";
import { addProject } from "../../Api/AllApi";
import { createProject, addStage } from "../../slice/ProjectSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import RuleModal from "../Rule/RuleModal";
import AddRule from "../Rule/AddRule";
const Header = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const { status, stageList, projectById } = useSelector(
    (state) => state.Project
  );

  const dispatch = useDispatch();

  const handleAddTaskClick = () => {
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };
  const handleShowRuleModal = () => {
    setShowRuleModal(true);
  };
  const handleCloseRuleModal = () => {
    setShowRuleModal(false);
  };

  const [formData, setFormData] = useState({
    previousStage: "",
    currentStage: "",
    condition: "",
    nextStage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
    if (option === "Add Rule") {
      setShowTaskModal(true);
    }
    if (option === "Show Rule") {
      setShowRuleModal(true);
    }
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const prejectCreateNotify = () =>
    toast.success("Project Create Successfully...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      theme: "light",
    });

  // FOR THE VALIDATION
  function isProjectNameValid(projectName) {
    const trimmedProjectName = projectName.trim();
    return /^[A-Za-z][A-Za-z0-9- ]*$/.test(trimmedProjectName);
  }

  const handleSaveProject = () => {
    const newProjectData = {
      projectName: newProjectName,
      projectDescription: newProjectDescription,
    };

    addProject(newProjectData)
      .then((response) => {
        console.log("Project saved successfully");
        console.log("DSDS", response.data.data);
        dispatch(createProject(response.data.data));
        prejectCreateNotify();
        setNewProjectName("");
        setNewProjectDescription("");
      })
      .catch((error) => {
        console.error("Error saving the project: ", error);
      });

    closeModal();
  };

  const stageCreateNotify = () =>
    toast.success("Stage Create Successfully...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      theme: "light",
    });

  function handleAddStages() {
    const newStage = {
      stageName: "unknown",
    };
    axios
      .post(
        `http://localhost:8080/projects/${projectById.projectId}/stages`,
        newStage
      )
      .then((response) => {
        dispatch(addStage({ data: response.data.data }));
        stageCreateNotify();
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://static.ambitionbox.com/assets/v2/images/rs:fit:200:200:false:false/bG9jYWw6Ly8vbG9nb3Mvb3JpZ2luYWxzL2lubm9nZW50LXRlY2hub2xvZ2llcy5qcGc.webp" // Add the path to your Innogent logo
          alt="Innogent Logo"
          style={{ width: "30px", height: "30px" }} // Adjust the width and height
        />
        <h1 style={{ color: "white", marginLeft: "10px" }}>Innogent</h1>
      </div>
      <div className="buttons">

        <DropdownButton id="create-dropdown" title="Create" variant="primary">
          <Dropdown.Item onClick={() => handleOptionSelect("Add Rule")}>
            Add Rule
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleOptionSelect("Show Rule")}>
            Show  Rule
          </Dropdown.Item>
        </DropdownButton>

        <button className="add-project" onClick={openModal}>
          Add Project
        </button>
        <button className="add-stages" onClick={handleAddStages}>
          Add Stage
        </button>
        <button className="profile-button">Profile</button>
      </div>

      {selectedOption === "Add Rule" && (
        <AddRule
          show={showTaskModal}
          handleClose={handleCloseTaskModal}
          formData={formData}
          handleInputChange={handleInputChange}
          status={status}
          stageList={stageList}
        />
      )}
      
      {showRuleModal && (
        <RuleModal
          show={showRuleModal}
          handleClose={handleCloseRuleModal}
          projectId={projectById.projectId}  // Pass projectId to RuleModal
        />
      )}

      {isModalOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ textAlign: "center", color: "black" }}
                >
                  Add Project
                </h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: "left" }}>
                <div className="form-group">
                  <label style={{ color: "black" }}>
                    Project Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProjectName}
                    placeholder="Project Name (Must start with a letter)"
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Project Description</label>
                  <textarea
                    className="form-control"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProject}
                  disabled={!isProjectNameValid(newProjectName)}
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
export default Header;
