import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Stage from "../Stage/Stage";
import { getProjectById, updateStageOrder } from "../../slice/ProjectSlice";
import { getProjectId } from "../../Api/AllApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";

const Project = () => {
  const { projectById } = useSelector((state) => state.Project);
  const { projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getProjectId(projectId)
      .then((response) => {
        dispatch(getProjectById(response.data.data));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [projectId, dispatch]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return; // Item dropped outside the list, no action needed
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) {
      return; // Item dropped in the same position, no action needed
    }

    // Reorder stages in your Redux store based on the source and destination indexes
    const reorderedStages = Array.from(projectById.stageList);
    const [movedStage] = reorderedStages.splice(sourceIndex, 1);
    reorderedStages.splice(destinationIndex, 0, movedStage);

    axios.put(`http://localhost:8080/projects/${projectById.projectId}/changeorder/${sourceIndex}/${destinationIndex}`)
    .then((response) => {
      console.log("stage order Change ", response.data.data);
    })
    .catch((error) => {
      console.error("Error occure while changeing the order : ", error);
    });
    dispatch(updateStageOrder(reorderedStages));

    // Ensure your Redux store is updated with the new order of stages
    // The actual implementation may vary depending on your Redux setup
  };

  return (
    <div
      style={{
        width: "90%",
        position: "absolute",
        right: "-150px",
        top: "100px",
      }}
    >
      {projectById ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="stage-list" direction="horizontal">
            {(provided) => (
              <ul
                className="list-unstyled ps-3 stageComponent"
                style={{ display: "flex", overflowX: "scroll" }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {projectById.stageList?.map((stage, index) => (
                  <div className="stage-container">
                    <Draggable
                      key={stage.stageId}
                      draggableId={stage.stageId.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Stage stageIndex={index} />
                        </li>
                      )}
                    </Draggable>
                  </div>
                ))}
                <div className="plus-button-container"></div>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <p>Data Not found</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default Project;
