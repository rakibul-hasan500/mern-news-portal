import {createSlice} from "@reduxjs/toolkit";

const newsSlice = createSlice({
    name: "news",
    initialState: {
        newsData: [],
    },
    reducers: {

        // Set News Data
        handleSetNewsData: (state, action)=>{
            state.newsData = action.payload;
        }

    }
})

export const {
    handleSetNewsData,
} = newsSlice.actions;
const newsReducer = newsSlice.reducer;
export default newsReducer;