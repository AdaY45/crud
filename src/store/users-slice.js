import { createSlice } from "@reduxjs/toolkit";

const initialState = { users: [], profiles: []};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUsers(state, action) {
            state.users = action.payload;
        },
        addProfiles(state, action) {
            state.profiles = action.payload;
        },
    }
});

export const usersActions = usersSlice.actions;

export default usersSlice.reducer;