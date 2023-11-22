import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import axios from "axios";
import "./RuleModal.css"; // Import your custom CSS file for modal styles

const RuleModal = ({ show, handleClose }) => {
  const { projectById } = useSelector((state) => state.Project);
  const { stageList } = projectById
  const handleCreateRule = () => {
   
  };
  const {projectId} = projectById;

  const [rules, setRules] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/projects/${projectId}/rules`)
      .then((response) => {
        setRules(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching rules: ", error);
      });
  }, [projectId]);

  let modalTitle, modalContent;
      modalTitle = "Rules ";
      modalContent = (
        <div>
          <div className="modal-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>trigger filed</th>
                  <th>opertation </th>
                  <th>previous </th>
                  <th>current </th>
                  <th>action filed</th>
                  <th> New Stage </th>
                  <th> New String </th>
                  
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, index) => (
                  <tr key={index}>
                    <td>{rule?.triggerField?.name || "N/A"}</td>
                    <td>{rule?.trigger?.operation || "N/A"}</td>
                    <td>{rule?.trigger?.previousString || "N/A"}</td>
                    <td>{rule?.trigger?.currentString || "N/A"}</td>
                    <td>{rule?.actionField?.name || "N/A"}</td>
                    <td>{rule?.action?.newId || "N/A"}</td>
                    <td>{rule?.action?.nextString || "N/A"}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
        
      </Modal.Header>
      <Modal.Body>
        {modalContent}
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleCreateRule}>
          Add Rule
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RuleModal;