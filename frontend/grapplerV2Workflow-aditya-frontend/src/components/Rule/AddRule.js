import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import axios from "axios";

const AddRule = ({ show, handleClose }) => {
  const { projects } = useSelector((state) => state.Project);
  const { projectById } = useSelector((state) => state.Project);
  const { status } = projectById;
  const { stageList } = projectById;
  const { projectId } = projectById;
  const [triggerType, setTriggerType] = useState("");
  const [actionType, setActionType] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(); // State to store selected project ID
  const [stages, setStages] = useState([]);
  const [FieldList, setFieldList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/projects/fields`)
      .then((response) => {
        setFieldList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const [triggerCondition, setTriggerCondition] = useState();
  const [actionCondition, setActionCondition] = useState();
  const [triggerdata, setTriggerdata] = useState();
  const [actiondata, setActiondata] = useState();

  const handleTriggerTypeChange = (e) => {
    if(e.target.value === "")return;
    setTriggerType(e.target.value);
    const triggerData = FieldList.find((fields) => fields.id == e.target.value);
    const { dataType } = triggerData;
    const { name } = triggerData;
    console.log(dataType);
    console.log(name);
    setTriggerdata(name);
    setTriggerCondition(dataType);
  };

  const handleActionTypeChange = (e) => {
    if(e.target.value === "")return;
    setActionType(e.target.value);
    const actionData = FieldList.find((fields) => fields.id == e.target.value);
    const { dataType } = actionData;
    const { name } = actionData;

    setActiondata(name);
    setActionCondition(dataType);
  };

  const [triggeroperation, settriggeroperation] = useState();
  const [actionoperation, setactionoperation] = useState();

  const handleConditionTrigger = (e) => {
    settriggeroperation(e.target.value);
    console.log(triggeroperation, '-------');
  };

  const handleConditionAction = (e) => {
    setactionoperation(e.target.value);
    console.log(actionoperation);
  };

  const handleCreateRule = () => {
    if (triggerType === "" || actionType === "") {
      return;
    } 

    let newRuleObject = {
      triggerFieldId: triggerType,
      triggerCondition: triggerCondition,
      actionFieldId: actionType,
      actionCondition: actionCondition
    };

    if (triggerCondition === "STRING" && triggerdata !== "status" ) {
      if (triggeroperation === "set") {
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          currentString: document.getElementById("current-string-trigger")?.value

        };
      } else if (triggeroperation === "change") {
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          previousString: document.getElementById("previous-string-trigger")?.value,
          currentString: document.getElementById("current-string-trigger")?.value
        };
      } else if (triggeroperation === "remove") {
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          previousString: document.getElementById("previous-string-trigger")?.value
        };
      }

    } else if (triggerdata === "status") {

      if (triggeroperation === "set") {
        console.log("foe",document.getElementById("current-status-trigger")?.value);
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          currentString: document.getElementById("current-status-trigger")?.value

        };
      } else if (triggeroperation === "change") {
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          previousString: document.getElementById("previous-status-trigger")?.value,
          currentString: document.getElementById("current-status-trigger")?.value
        };
      } else if (triggeroperation === "remove") {
        newRuleObject.stringTrigger = {
          operation: triggeroperation,
          previousString: document.getElementById("previous-status-trigger")?.value
        };
      }

    } 
    // else if (triggerdata === "ticketPriority") {

    //   if (triggeroperation === "set") {
    //     newRuleObject.stringTrigger = {
    //       operation: triggeroperation,
    //       currentString: document.getElementById("current-ticketPriority-trigger").value

    //     };
    //   } else if (triggeroperation === "change") {
    //     newRuleObject.stringTrigger = {
    //       operation: triggeroperation,
    //       previousString: document.getElementById("previous-ticketPriority-trigger").value,
    //       currentString: document.getElementById("current-ticketPriority-trigger").value
    //     };
    //   } else if (triggeroperation === "remove") {
    //     newRuleObject.stringTrigger = {
    //       operation: triggeroperation,
    //       previousString: document.getElementById("previous-ticketPriority-trigger").value
    //     };
    //   }

    // } 
    
    else if (triggerCondition === "STAGE") {

      if (triggeroperation === "set") {
        newRuleObject.stageTrigger = {
          operation: triggeroperation,
          currentStage: document.getElementById("current-stage-trigger")?.value

        };
      } else if (triggeroperation === "change") {
        newRuleObject.stageTrigger = {
          operation: triggeroperation,
          previousStage: document.getElementById("previous-stage-trigger")?.value,
          currentStage: document.getElementById("current-stage-trigger")?.value
        };
      } else if (triggeroperation === "remove") {
        newRuleObject.stageTrigger = {
          operation: triggeroperation,
          previousStage: document.getElementById("previous-stage-trigger")?.value
        };
      }

    } else if (triggerCondition === "DATE") {

      newRuleObject.dateTrigger = {
        operation: triggeroperation,
        days: document.getElementById("day-trigger")?.value,
        hours: document.getElementById("hours-trigger")?.value,
        minuter: document.getElementById("minute-trigger")?.value,
      }
    } else if (triggerCondition === "NUMBER"){
      newRuleObject.numberTrigger = {
        operation: triggeroperation,
        value: document.getElementById("number-trigger")?.value
      }
    }

    if (actionCondition === "STRING" && actiondata !== "status" && actiondata !== "ticketPriority") {

      newRuleObject.stringAction = {
        operation: actionoperation,
        nextString: document.getElementById("string-action")?.value
      };

    } else if (actiondata === "status") {

      newRuleObject.stringAction = {
        operation: actionoperation,
        nextString: document.getElementById("status-action")?.value
      };

    }else if (actiondata === "ticketPriority"){

      newRuleObject.stringAction = {
        operation: actionoperation,
        nextString: document.getElementById("ticketPriority-action")?.value
      };

    }else if (actionCondition === "STAGE"){

      newRuleObject.stageAction = {
        operation: actionoperation,
        newId: document.getElementById("stage-action")?.value
      };
    }else if(actionCondition === "PROJECT"){
      
      newRuleObject.projectAction = {
        operation: actionoperation,
        projectId : document.getElementById("project-action")?.value,
        stageId : document.getElementById("project-stage-action")?.value,
      }
    }

    console.log(newRuleObject);
    axios
      .post(`http://localhost:8080/projects/${projectId}/rules`, newRuleObject)
      .then((response) => {
        console.log("Response------", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching rules: ", error);
      });
    handleClose();
  };

  let modalTitle, modalContent;
  modalTitle = "Add Rule";

  const renderTrigger = (
    <div className="row">
      <div className="col">
        <strong>CONDITION_TRIGGER</strong>
        <select
          className="form-control"
          onChange={handleConditionTrigger}
        // value={conditionTrigger}
        >
          {triggerCondition === "STRING" && (
            <>
              <option value="set">Set</option>
              <option value="change">Change</option>
              <option value="remove">Remove</option>
            </>
          )}

          {triggerCondition === "NUMBER" && (
            <>
              <option value="less">Less</option>
              <option value="equall">Equall</option>
              <option value="greater">Greater</option>
            </>
          )}
          {triggerCondition === "DATE" && (
            <>
              <option value="on">On</option>
              <option value="before">Before</option>
              <option value="after">After</option>
            </>
          )}
          {triggerCondition === "STAGE" && (
            <>
              <option value="set">add to the stage</option>
              <option value="change">on change in stage</option>
              <option value="remove">remove from the stage</option>
            </>
          )}

        </select>
      </div>
      <div className="col">
        <strong>CONDITION_ACTION</strong>
        <select
          className="form-control"
          onChange={handleConditionAction}
        >
          {actionCondition === "STRING" && (
            <>
              <option value="set">Set</option>
              <option value="remove">Remove</option>
            </>
          )}

          {actionCondition === "NUMBER" && (
            <>
              <option value="set">Set</option>
            </>
          )}
          {actionCondition === "DATE" && (
            <>
              <option value="on">set</option>
              <option value="after">remove</option>
            </>
          )}

          {actionCondition === "STAGE" && (
            <>
              <option value="set">add to the stage</option>
              <option value="remove">remove from the stage</option>
            </>
          )}

          {actionCondition === "PROJECT" && (
            <>
              <option value="set">Add to The project</option>
              <option value="after">remove from the Project</option>
            </>
          )}
        </select>
      </div>
    </div>
  );


  const Fields = (
    <div className="row">
      <div className="col">
        <strong>Field Trigger </strong>
        <br />

        {(triggerCondition === "STAGE") && (
          <>
            {(triggeroperation === "change" || triggeroperation === "remove") && (
              <>
                <label>previous </label>
                <select
                  className="form-control"
                  id="previous-stage-trigger"
                // value={conditionTrigger}
                >
                  {stageList.map((stage) => (
                    <option value={stage.stageId}>{stage.stageName}</option>
                  ))}
                </select>
              </>
            )}
            {(triggeroperation === "change" || triggeroperation === "set") && (
              <>
                <label>current </label>
                <select
                  className="form-control"
                  id="current-stage-trigger"
                >
                  {stageList.map((stage) => (
                    <option value={stage.stageId}>{stage.stageName}</option>
                  ))}
                </select>
              </>
            )}
          </>
        )}

        {(triggerdata === "status") && (
          <>
            {(triggeroperation === "change" || triggeroperation === "remove") && (
              <>
                <label>previous </label>
                <select
                  className="form-control"
                  id="previous-status-trigger"
                // value={conditionTrigger}
                >
                  {status.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
                </select>
              </>
            )}
            {(triggeroperation === "change" || triggeroperation === "set") && (
              <>
                <label>current </label>
                <select
                  className="form-control"
                  id="current-status-trigger"
                >
                  {status.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
                </select>
              </>
            )}
          </>
        )}

        {/* {(triggerdata === "ticketPriority") && (
          <>
            {(triggeroperation === "change" || triggeroperation === "set") && (
              <>
                <label>previous </label>
                <select
                  className="form-control"
                  id="previous-ticketPriority-trigger"
                // value={conditionTrigger}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Mediume</option>
                  <option value="High">High</option>

                </select>
              </>
            )}
            {(triggeroperation === "change" || triggeroperation === "remove") && (
              <>
                <label>current </label>
                <select
                  className="form-control"
                  id="current-ticketPriority-trigger"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Mediume</option>
                  <option value="High">High</option>
                </select>
              </>
            )}
          </>
        )} */}

        {triggerCondition === "STRING" && triggerdata !== "status"  && (
          <>
            {(triggeroperation === "change" || triggeroperation === "remove") && (
              <>
                <label>previous </label>
                <input
                  className="form-control"
                  id="previous-string-trigger"
                  type="text"
                />
              </>
            )}

            {(triggeroperation === "change" || triggeroperation === "set") && (
              <>
                <label>current </label>
                <input
                  id="current-string-trigger"
                  className="form-control"
                  type="text"
                />
              </>
            )}
          </>
        )}


        {(triggerCondition === "NUMBER") && (
          <>
          <label>value </label>
                <input
                  className="form-control"
                  id="number-trigger"
                  type="number"
                />

            {/* {(triggeroperation === "change" || triggeroperation === "remove") && (
              <>
                <label>previous </label>
                <input
                  className="form-control"
                  id="previous-number-trigger"
                  type="number"
                />
              </>
            )}
            {(triggeroperation === "change" || triggeroperation === "set") && (
              <>
                <label>current </label>
                <input
                  id="current-number-trigger"
                  className="form-control"
                  type="number"
                />
              </>
            )} */}
          </>
        )}


        {(triggerCondition === "DATE") && (
          <>
            {(triggeroperation === "before" || triggeroperation === "after") && (
              <>
                <label>days </label>
                <input
                  className="form-control"
                  id="day-trigger"
                  type="number"
                />
              </>
            )}
            {(triggeroperation === "before" || triggeroperation === "after") && (
              <>
                <label>hours </label>
                <input
                  id="hours-trigger"
                  className="form-control"
                  type="number"
                />
              </>
            )}
            {(triggeroperation === "before" || triggeroperation === "after") && (
              <>
                <label>minutes </label>
                <input
                  id="minute-trigger"
                  className="form-control"
                  type="number"
                />
              </>
            )}

          </>
        )}

      </div>
      <div className="col">
        <strong>ACTIION FIELD</strong>

        {(actiondata === "status") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label>current </label>
                <select
                  className="form-control"
                  id="status-action"
                >
                  {status.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
                </select>
              </>
            )}
          </>
        )}

        {(actiondata === "ticketPriority") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label>current </label>
                <select
                  className="form-control"
                  id="ticketPriority-action"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Mediume</option>
                  <option value="High">High</option>

                </select>
              </>
            )}
          </>
        )}

        {(actionCondition === "STRING" && actiondata !== "status" && actiondata !== "ticketPriority") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label> set to </label>
                <input
                  className="form-control"
                  id="string-action"
                  type="text"
                />
              </>
            )}
          </>
        )}


        {(actionCondition === "STAGE") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label>Stage </label>
                <select
                  className="form-control"
                  id="stage-action"
                // value={conditionTrigger}
                >
                  {stageList?.map((stage) => (
                    <option value={stage?.stageId}>{stage?.stageName}</option>
                  ))}
                </select>
              </>
            )}
          </>
        )}

        {(actionCondition === "NUMBER") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label> number </label>
                <input
                  className="form-control"
                  id="number-action"
                  type="number"
                />
              </>
            )}
          </>
        )}


        {(actionCondition === "PROJECT") && (
          <>
            {(actionoperation === "set") && (
              <>
                <label>Project </label>
                <select
                  className="form-control"
                  id="project-action"
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                // value={conditionTrigger}
                >
                  {projects?.map((project) => (
                    <option value={project?.projectId}>{project?.projectName}</option>
                  ))}
                </select>
                <br />
                <label>stage  </label>
                <select
                  className="form-control"
                  id="project-stage-action"
                // value={conditionTrigger}
                >
                  {stages?.map((stage) => (
                    <option value={stage?.stageId}>{stage?.stageName}</option>
                  ))}
                </select>

              </>
            )}
          </>
        )}


        {(actionCondition === "DATE") && (
          <>

          </>
        )}


      </div>

    </div>
  );


  useEffect(() => {
    if (selectedProjectId) {
      // Fetch stages for the selected project
      axios
        .get(`http://localhost:8080/projects/${selectedProjectId}/stages`)
        .then((response) => {
          setStages(response.data.data); // Assuming response.data contains the list of stages
        })
        .catch((error) => {
          console.error("Error fetching stages: ", error);
        });
    }
  }, [selectedProjectId]);

  modalContent = (
    <div>
      <div className="row">
        <div className="col">
          <label>Select Trigger Type:</label>
          <select className="form-control"
            onChange={handleTriggerTypeChange}
            value={triggerType}
          >
            <option value="">Select trigger Type</option>
            {FieldList.map((fields) => (
              <option value={fields.id}>{fields.name}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label>Select Action Type:</label>
          <select className="form-control"
            onChange={handleActionTypeChange}
            value={actionType}
          >
            <option value="">Select Action Type</option>
            {FieldList.map((fields) => (
              <option value={fields.id}>{fields.name}</option>
            ))}
          </select>
        </div>
      </div>
      {renderTrigger}
      {Fields}
    </div>
  );

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalContent}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateRule}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRule;
