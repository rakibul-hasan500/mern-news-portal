import {createSlice} from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categoryData: [],
    },
    reducers: {

        // Set News Data
        handleSetCategoryData: (state, action)=>{
            state.categoryData = action.payload;
        }

    }
})

export const {
    handleSetCategoryData,
} = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;