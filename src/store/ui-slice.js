import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  isEditProfileOpen: false,
  isEditUserOpen: false,
  isAuth: false,
  isAddNewProfile: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    modalOpen(state, action) {
      if (action.payload === "profile") {
        state.isEditProfileOpen = true;
      } else if(action.payload === "user"){
        state.isEditUserOpen = true;
      }
    },
    modalClose(state, action) {
        if (action.payload === "profile") {
            state.isEditProfileOpen = false;
          } else if(action.payload === "user"){
            state.isEditUserOpen = false;
          }
    },
    adminHandler(state, action) {
      state.isAdmin = action.payload;
    },
    authHandler(state, action) {
      state.isAuth = action.payload;
    },
    addNewProfilePress(state, action) {
        state.isAddNewProfile = action.payload;
    }
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
