import {createSlice} from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        settingsData: null
    },
    reducers: {

        // Handle Get Settings Data
        handleSetSettingsData: (state, action)=>{
            state.settingsData = action.payload;
        }

    }
})

export const {
    handleSetSettingsData
} = settingsSlice.actions;
const settingsReducer = settingsSlice.reducer
export default settingsReducer
