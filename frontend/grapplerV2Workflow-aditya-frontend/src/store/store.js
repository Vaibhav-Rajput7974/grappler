import { configureStore } from "@reduxjs/toolkit";
import ProjectSlice from "../slice/ProjectSlice";

const store=configureStore(
    {
        reducer:{
            Project:ProjectSlice,
        }
    }
)

export default store;