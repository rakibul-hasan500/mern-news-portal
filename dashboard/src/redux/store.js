import {configureStore} from "@reduxjs/toolkit";
import appReducer from "./app/appSlice.js";
import authApi from "./auth/authApi.js";
import authReducer from "./auth/authSlice.js";
import categoryReducer from "./category/categorySlice.js";
import categoryApi from "./category/categoryApi.js";
import newsApi from "./news/newsApi.js";
import settingsApi from "./settings/settingsApi.js";
import dashboardApi from "./dashboard/dashboardApi.js";
import commentApi from "./comment/commentApi.js";

const store = configureStore({
    reducer: {

        // App
        App: appReducer,

        // Dashboard
        [dashboardApi.reducerPath]: dashboardApi.reducer,

        // Auth
        Auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        // Category
        Category: categoryReducer,
        [categoryApi.reducerPath]: categoryApi.reducer,

        // News
        [newsApi.reducerPath]: newsApi.reducer,

        // Settings
        [settingsApi.reducerPath]: settingsApi.reducer,

        // Comment
        [commentApi.reducerPath]: commentApi.reducer,

    },

    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
        .concat(dashboardApi.middleware)
        .concat(authApi.middleware)
        .concat(categoryApi.middleware)
        .concat(newsApi.middleware)
        .concat(settingsApi.middleware)
        .concat(commentApi.middleware)
})

export default store;