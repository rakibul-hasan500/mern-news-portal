import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/category`,
        credentials: "include"
    }),
    tagTypes: ["category"],
    endpoints: (builder)=>({

        // Get All News
        getAllCategories: builder.query({
            query: ({searchText="", limits=10, page=1})=>({
                url: `/all?searchText=${searchText}&limits=${limits}&page=${page}`,
                method: 'GET',
            }),
            providesTags: ['category']
        }),

        // Get Single Category
        getSingleCategory: builder.query({
            query: ({slug})=>({
                url: `/${slug}`,
                method: 'GET',
            }),
            providesTags: ["category"]
        })


    })
})

export const {
    useGetAllCategoriesQuery,
    useGetSingleCategoryQuery,
} = categoryApi;
export default categoryApi;