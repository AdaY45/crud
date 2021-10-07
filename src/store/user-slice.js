import { createSlice } from "@reduxjs/toolkit";

const initialState = { username: "", userId: "", user: {}, profiles: [], auth: "", profile: {}, selectedUserId: null };

const userSlice = createSlice({
    name: "user",
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
        },
        setUsername(state, action) {
            state.username = action.payload;
        },
        setSelectedUserId(state, action) {
            state.selectedUserId = action.payload;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice.reducer;