import { createSlice, current } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
const intialize = {
  projects: [],
  projectById: {
    stageList: [], // Add this property  
  },
};

const ProjectSlice = createSlice({
  name: "ProjectSlicer",
  initialState: intialize,
  reducers: {
    getAllProject: (state, action) => {
      state.projects = action.payload;
    },
    getProjectById: (state, action) => {
      state.projectById = action.payload;
    },
    createProject: (state, action) => {
      state.projects.push(action.payload);
    },
    addStage: (state, action) => {
      const { index, data } = action.payload;
      state.projectById.stageList.push(data);
    },
    updateSliceStage(state, action) {
      const { index, updateStage } = action.payload;
      state.projectById.stageList[index] = {
        ...updateStage,
        id: state.projectById.stageList[index].stageId,
      };
    },
    addSliceTicket(state, action) {
      state.projectById.stageId.push(action.payload);
    },
    deleteStage: (state, action) => {
      const stageIndex = action.payload;
      console.log(stageIndex);
      if (stageIndex !== -1) {
        state.projectById.stageList.splice(stageIndex, 1);
      }
    },
    updateStageOrder: (state, action) => {
      const reorderedStages = action.payload;
      state.projectById.stageList = reorderedStages;
    },
    updateSliceTicket: (state, action) => {
      const { previous, data } = action.payload;
      if (previous !== data.stageId) {
        // Find the index of the previous and new stages
        const previousStageIndex = state.projectById.stageList.findIndex(stage => stage.stageId === previous);
        const newStageIndex = state.projectById.stageList.findIndex(stage => stage.stageId === data.stageId);

        // Find the index of the ticket in the previous stage
        const ticketIndex = state.projectById.stageList[previousStageIndex].ticketList.findIndex(ticket => ticket.ticketId === data.ticketId);

        if (ticketIndex !== -1) {
          // Remove the ticket from the previous stage
          const [movedTicket] = state.projectById.stageList[previousStageIndex].ticketList.splice(ticketIndex, 1);

          // Add the ticket to the new stage
          if (newStageIndex !== -1) {
            state.projectById.stageList[newStageIndex].ticketList.push(data);
          }
        }
      }
      else {
        const previousStageIndex = state.projectById.stageList.findIndex(stage => stage.stageId === previous);
        const ticketIndex = state.projectById.stageList[previousStageIndex].ticketList.findIndex(ticket => ticket.ticketId === data.ticketId);

        state.projectById.stageList[previousStageIndex].ticketList[ticketIndex] = data;
      }
    },
    addTicketToStage: (state, action) => {
      const { stageId, ticketData } = action.payload;
      console.log(ticketData,'ssss');
      const stageIndex = state.projectById.stageList.findIndex(stage => stage.stageId == ticketData.stageId);
      console.log(stageIndex);
      state.projectById?.stageList[stageIndex]?.ticketList.push(ticketData);
    },
    timeTicket: (state, action) => {
      const ticketData=action.payload;
      state.projectById.stageList.forEach((stage) => {
        stage.ticketList = stage.ticketList.filter(
          (ticket) => ticket.ticketId !== ticketData.ticketId
        );
      });
      const stageIndex = state.projectById.stageList.findIndex(stage => stage.stageId == ticketData.stageId);
      console.log(stageIndex);
      state.projectById?.stageList[stageIndex]?.ticketList.push(ticketData);
    },
  }
});
export const {
  getAllProject,
  getProjectById,
  createProject,
  addStage,
  deleteStage,
  updateSliceStage,
  updateSliceTicket,
  updateStageOrder,
  addTicketToStage,
  timeTicket
} = ProjectSlice.actions;
export default ProjectSlice.reducer;
