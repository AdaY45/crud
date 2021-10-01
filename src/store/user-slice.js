import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: {}, profiles: [], auth: "" };

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser(state, action) {
            state.user = action.payload;
        },
        addProfiles(state, action) {
            state.profiles = state.profiles.concat(action.payload);
        },
        addAuth(state, action) {
            state.auth = action.payload;
        }
    }
});

export const userActions = userSlice.actions;

export default userSlice.reducer;