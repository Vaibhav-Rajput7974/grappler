import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Task from "./Task.js";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { updateStage, deleteStageById } from "../../Api/AllApi.js";
import {
  deleteStage,
  updateSliceStage,
  updateSliceTicket,
} from "../../slice/ProjectSlice.js";
import TaskModal from "./TaskModal.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Stage = ({ stageIndex }) => {
  const { projectById } = useSelector((state) => state.Project);
  const stage = projectById.stageList[stageIndex];

  const dispatch = useDispatch();
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [stageName, setStageName] = useState(stage.stageName);

  

  const handleAddTaskClick = () => {
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  const stageNameNotify = () =>
    toast.success("Stage Update Successfully...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      theme: "light",
    });

  const deleteNotify = () =>
    toast.success("Stage Delete Successfully...", {
      position: "top-center",
      autoClose: 1000,
      closeOnClick: true,
      theme: "light",
    });

  const handleStageNameChange = (e) => {
    const newStageName = e.target.value;
    setStageName(newStageName);
    // saveUpdatedName(newStageName);
  };

  function saveUpdatedName(newStageName) {
    const updatedStage = {
      ...stage,
      stageName: newStageName,
    };

    updateStage(projectById.projectId, updatedStage)
      .then(() => {
        dispatch(
          updateSliceStage({ index: stageIndex, updateStage: updatedStage })
        );
        stageNameNotify();
      })
      .catch((error) => {
        console.error("Error updating data: ", error);
      });
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // const sourceIndex = result.source.index;
    // const destinationIndex = result.destination.index;

    // if (sourceIndex === destinationIndex) {
    //   return;
    // }

    // const reorderedList = Array.from(stage.ticketList);
    // const [movedItem] = reorderedList.splice(sourceIndex, 1);
    // reorderedList.splice(destinationIndex, 0, movedItem);

    // const updatedStage = {
    //   ...stage,
    //   ticketList: reorderedList,
    // };

    // updateStage(projectById.projectId, updatedStage)
    //   .then(() => {
    //     dispatch(updateSliceStage({ index: stageIndex, updateStage: updatedStage }));
    //     projectNameNotify();
    //   })
    //   .catch((error) => {
    //     console.error("Error updating data: ", error);
    //   });

    // // Move the task to another stage if the destination is a different stage
    // if (result.destination.droppableId !== result.source.droppableId) {
    //   const destinationStageIndex = parseInt(result.destination.droppableId, 10);

    //   const sourceTask = stage.ticketList[sourceIndex];
    //   const destinationStage = projectById.stageList[destinationStageIndex];

    //   dispatch(updateSliceTicket({
    //     sourceStageIndex: stageIndex,
    //     destinationStageIndex,
    //     sourceTask,
    //     destinationStage,
    //   }));
    // }
  };

  function handleDeleteClick() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this stage?"
    );

    if (confirmDelete) {
      deleteStageById(projectById.projectId, stage.stageId)
        .then(() => {
          deleteNotify();
          dispatch(deleteStage(stageIndex));
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    } else {
      console.log("Deletion canceled");
    }
  }

  return (
    <div>
      <div
        className="card"
        style={{
          width: "300px",
          margin: "30px",
          minHeight: "500px",
          backgroundColor: "lightblue",
        }}
      >
        <div className="card-title">
          <DropdownButton
            id={`dropdown-button-${stage.stageId}`}
            className="position-absolute top-0 end-0"
            style={{
              zIndex: 1000,
              backgroundColor: "#F8F9FA",
            }}
          >
            <Dropdown.Item onClick={handleAddTaskClick}>
              Add Task
            </Dropdown.Item>
            <TaskModal
              show={showTaskModal}
              handleClose={handleCloseTaskModal}
              stageId={stage.stageId}
            />
            <Dropdown.Item onClick={handleDeleteClick}>
              Delete Stage
            </Dropdown.Item>
          </DropdownButton>

          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            value={stageName}
            onChange={handleStageNameChange}
            onBlur={() => saveUpdatedName(stageName)}
            style={{
              fontSize: "20px",
              textAlign: "center",
              border: "none",
              outline: "none",
              backgroundColor: "#F0F8FF",
            }}
          />
        </div>
        <div className="card-body" style={{ width: "100%" }}>
                {stage.ticketList && stage.ticketList.length > 0 ? (
                  stage.ticketList.map((ticket, index) => (
                          <Task
                            taskIndex={index} stageIndex={stageIndex} stageId={projectById.stageList[stageIndex].stageId}
                          />
                  ))
                ) : (
                  <p>Data Not found</p>
                )}
        </div>
      </div>
    </div>
  );
  <ToastContainer />;
};

export default Stage;
