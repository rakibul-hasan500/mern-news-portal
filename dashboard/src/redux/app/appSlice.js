import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'App',
    initialState: {
        deleteWarning: false,
        deleteType: null,
        deleteId: null,
        deleteLoading: false,

        userInfo: null,
    },
    reducers: {

        // Handle Show / Hide Delete Warning
        handleToggleDeleteWarningShow: (state)=>{
            state.deleteWarning = !state.deleteWarning;
        },

        // Handle Get Delete Id And Type
        handleGetDeleteIdAndType: (state, action)=>{
            state.deleteType = action.payload.type;
            state.deleteId = action.payload.id;
        },

        // Handle Toggle Delete Loading
        handleToggleDeleteLoading: (state, action)=>{
            state.deleteLoading = action.payload;
        },


        // Handle Get User Data
        handleGetUserData: (state, action)=>{
            state.userInfo = action.payload;
        }


    }
})

export const {
    handleToggleDeleteWarningShow,
    handleGetDeleteIdAndType,
    handleToggleDeleteLoading,

    handleGetUserData
} = appSlice.actions;
const appReducer = appSlice.reducer
export default appReducer;


