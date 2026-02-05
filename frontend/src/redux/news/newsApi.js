import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/news`,
        credentials: "include"
    }),
    tagTypes: ["news"],
    endpoints: (builder)=>({

        // Get All News
        getAllNews: builder.query({
            query: ({category="", status="", search="", limits=10, page=1})=>({
                url: `/all?category=${category}&status=${status}&search=${search}&limits=${limits}&page=${page}`,
                method: 'GET',
            }),
            providesTags: ['news']
        }),

        // Get Single News Details
        getSingleNewsDetails: builder.query({
            query: ({slug})=>({
                url: `/${slug}`,
                method: 'GET',
            }),
            providesTags: ['news']
        }),

        // React On News
        reactOnNews: builder.mutation({
            query: (reactData)=>({
                url: "/react",
                method: "POST",
                body: reactData
            }),
            invalidatesTags: ['news']
        })


    })
})

export const {
    useGetAllNewsQuery,
    useGetSingleNewsDetailsQuery,
    useReactOnNewsMutation,
} = newsApi;
export default newsApi;