import {createSlice} from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "categorySlice",
    initialState: {
        selectedCategoryForEdit: null,
    },
    reducers: {

        // Handle Select Category For Edit
        handleSelectCategoryForEdit: (state, action)=>{
            state.selectedCategoryForEdit = action.payload;
        }

    }
})


export const {
    handleSelectCategoryForEdit,
} = categorySlice.actions;
const categoryReducer = categorySlice.reducer;
export default categoryReducer;