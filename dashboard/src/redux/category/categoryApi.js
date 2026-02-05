import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import base_url from "../../config/config.js";

const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/category`,
        credentials: "include",
    }),
    tagTypes: ["category"],
    endpoints: (builder)=>({

        // Add Category
        addCategory: builder.mutation({
            query: (categoryData)=>({
                url: '/create',
                method: "POST",
                body: categoryData
            }),
            invalidatesTags: ["category"],
        }),

        // Update Category
        updateCategory: builder.mutation({
            query: (categoryData)=>({
                url: '/update',
                method: "PATCH",
                body: categoryData
            }),
            invalidatesTags: ["category"],
        }),

        // Delete Category
        deleteCategory: builder.mutation({
            query: ({id})=>({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),

        // Get All Categories
        allCategories: builder.query({
            query: ({searchText='', limits=10, page=1})=>({
                url: `/all?searchText=${searchText}&limits=${limits}&page=${page}`,
                method: "GET"
            }),
            providesTags: ["category"],
        })

    })
})


export const {
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useUpdateStatusMutation,
    useDeleteCategoryMutation,
    useAllCategoriesQuery,
} = categoryApi;
export default categoryApi