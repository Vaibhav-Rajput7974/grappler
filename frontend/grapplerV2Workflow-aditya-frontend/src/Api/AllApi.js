import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getProjects = () => {
  return api.get('/projects');
};

export const getProjectId = (projectId) => {
  return api.get(`/projects/${projectId}`);
};

export const addProject = (projectData) => {
  return api.post('/projects', projectData);
};

export const addStage = (projectId , stageId , addTicket) => {
  return api.post(`/projects/${projectId}/stages/${stageId}/tickets` , addTicket);
};

export const deleteStageById= (projectId,stageId) => {
  return api.delete(`/projects/${projectId}/stages/${stageId}`);
};

export const updateStage = (projectId , updateStage) => {
  return api.put(`/projects/${projectId}/stages` , updateStage);
};

export const updateStagePosition = (projectId , sourceIndex , destinationIndex) => {
  return api.put(`/projects/${projectId}/changeStagePosition/${sourceIndex}/to/${destinationIndex}`);
};

export const createTask = (projectId , stageId , addTask) => {
  return api.post(`/projects/${projectId}/stages/${stageId}/tickets` , addTask);
};