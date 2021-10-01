import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui-slice";
import usersReducer from "./users-slice";
import userReducer from './user-slice';

const store = configureStore({ reducer: {ui: uiReducer, users: usersReducer, user: userReducer} });

export default store;
