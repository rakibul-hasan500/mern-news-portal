import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import base_url from "../../config/config.js";

const commentApi = createApi({
    reducerPath: "comment",
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/comment`,
        credentials: "include"
    }),
    tagTypes: ["comment"],
    endpoints: (builder)=>({

        // Get All Comment
        getAllComments: builder.query({
            query: ({status, search, limit, page})=>({
                url: `/all?status=${status}&search=${search}&limit=${limit}&page=${page}`,
                method: "GET"
            }),
            providesTags: ["comment"]
        }),

        // Update Comment Status
        updateCommentStatus: builder.mutation({
            query: (commentData)=>({
                url: "status/update",
                method: "PUT",
                body: commentData
            }),
            invalidatesTags: ["comment"]
        }),

        // Delete Comment
        deleteComment: builder.mutation({
            query: ({id})=>({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["comment"]
        }),

        // Update Comment
        updateComment: builder.mutation({
            query: (commentData)=>({
                url: "/update",
                method: "PUT",
                body: commentData
            }),
            invalidatesTags: ["comment"]
        }),

        // Replay Comment
        replayComment: builder.mutation({
            query: (commentData)=>({
                url: "/replay/post",
                method: "POST",
                body: commentData
            }),
            invalidatesTags: ["comment"]
        })

    })
})

export const {
    useGetAllCommentsQuery,
    useUpdateCommentStatusMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
    useReplayCommentMutation,
} = commentApi
export default commentApi;