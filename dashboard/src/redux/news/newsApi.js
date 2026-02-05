import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import base_url from"../../config/config.js"

const newsApi = createApi({
    reducerPath: "newsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/news`,
        credentials: "include",
    }),
    tagTypes: ["news", "newsImages"],
    endpoints: (builder)=>({

        // Add News
        addNews: builder.mutation({
           query: (newsData)=>({
               url: "/create",
               method: "POST",
               body: newsData
           }),
           invalidatesTags: ["news"],
        }),

        // Get All News
        allNews: builder.query({
            query: ({selectedCategory="", selectedOption="", searchText="", limits=10, page=1})=>({
                url: `all?category=${selectedCategory}&status=${selectedOption}&search=${searchText}&limits=${limits}&page=${page}`,
                method: "GET",
            }),
            providesTags: ["news"],
        }),

        // Delete News
        deleteNews: builder.mutation({
            query: ({id})=>({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["news"],
        }),

        // Update News
        updateNews: builder.mutation({
            query: (newsData)=>({
                url: `/update`,
                method: "PUT",
                body: newsData
            }),
            invalidatesTags: ["news"],
        }),

        // Single News Details
        getNewsDetails: builder.query({
           query: ({slug=''})=>({
               url: `/details/${slug}`,
               method: "GET",
           }),
           providesTags: ["news"],
        }),


        // Update News Status
        updateNewsStatus: builder.mutation({
            query: ({id='', status=''})=>({
                url: `/update/status/${id}`,
                method: "PATCH",
                body: {status}
            }),
            invalidatesTags: ["news"],
        }),

        // Get News Images
        getNewsImages: builder.query({
            query: ()=>({
                url: `/images`,
                method: "GET",
            }),
            providesTags: ["newsImages"],
        }),

        // Upload News Images
        uploadNewsImages: builder.mutation({
            query: (images)=>({
                url: `/images/upload`,
                method: "POST",
                body: images,
            }),
            invalidatesTags: ["newsImages"],
        }),

        // Delete News Image
        deleteNewsImage: builder.mutation({
            query: ({id})=>({
                url: `/image/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["newsImages"],
        })

    })
})


export const {
    useAddNewsMutation,
    useAllNewsQuery,
    useDeleteNewsMutation,
    useUpdateNewsMutation,
    useGetNewsDetailsQuery,
    useUpdateNewsStatusMutation,
    useGetNewsImagesQuery,
    useUploadNewsImagesMutation,
    useDeleteNewsImageMutation,
} = newsApi;
export default newsApi;


