import {configureStore} from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { jobReducer } from "./reducers/jobReducer";


const store = configureStore({
    reducer:{
        user: userReducer,
        job: jobReducer
    },
});

export default store;

export const server = 'https://ready2go-nine.vercel.app/api/v1';
