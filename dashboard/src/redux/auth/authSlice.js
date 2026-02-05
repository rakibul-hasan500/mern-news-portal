import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {

        // Selected User
        selectedUserForEdit: null,

    },
    reducers: {

        // Select User For Edit
        handleSelectUserForEdit: (state, action)=>{
            state.selectedUserForEdit = action.payload;
        }

    }
})


export const {
    handleSelectUserForEdit,
} = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;