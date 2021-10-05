import { createSlice } from "@reduxjs/toolkit";

const initialState = { userId: "", user: {}, profiles: [], auth: "", profile: {} };

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser(state, action) {
            state.user = action.payload;
        },
        addProfiles(state, action) {
            state.profiles = action.payload;
        },
        addAuth(state, action) {
            state.auth = action.payload;
        },
        addProfile(state, action) {
            state.profile = action.payload;
        },
        setUserId(state, action){
            state.userId = action.payload;
        } 
    }
});

export const userActions = userSlice.actions;

export default userSlice.reducer;