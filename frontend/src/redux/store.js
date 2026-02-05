import {configureStore} from "@reduxjs/toolkit";
import newsApi from "@/redux/news/newsApi";
import newsReducer from "@/redux/news/newsSlice";
import categoryReducer from "@/redux/category/categorySlice";
import categoryApi from "@/redux/category/categoryApi";
import settingsReducer from "@/redux/settings/settingsSlice";
import settingsApi from "@/redux/settings/settingsApi";
import authApi from "@/redux/auth/authApi";
import userReducer from "@/redux/user/userSlice";
import userApi from "@/redux/user/userApi";
import commentApi from "@/redux/comment/commentApi";

const store = configureStore({
    reducer: {
        // User
        User: userReducer,
        [userApi.reducerPath]: userApi.reducer,

        // Auth
        [authApi.reducerPath]: authApi.reducer,

        // Category
        Category: categoryReducer,
        [categoryApi.reducerPath]: categoryApi.reducer,

        // News
        News: newsReducer,
        [newsApi.reducerPath]: newsApi.reducer,

        // Settings
        Settings: settingsReducer,
        [settingsApi.reducerPath]: settingsApi.reducer,

        // Comment
        [commentApi.reducerPath]: commentApi.reducer,

    },

    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(authApi.middleware)
        .concat(categoryApi.middleware)
        .concat(newsApi.middleware)
        .concat(settingsApi.middleware)
        .concat(commentApi.middleware)


})

export default store;