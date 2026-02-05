import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUserData: null
    },
    reducers: {

        // Handle Set User Data
        handleSetUserData: (state, action)=>{
            state.currentUserData = action.payload
        }


    }
})

export const {
    handleSetUserData,
} = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;