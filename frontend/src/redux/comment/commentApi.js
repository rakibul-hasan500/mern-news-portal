import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/comment`,
        credentials: "include"
    }),
    tagTypes: ["comment"],
    endpoints: (builder)=>({

        // Post Comment
        postComment: builder.mutation({
            query: (commentData)=>({
                url: "/post",
                method: "POST",
                body: commentData
            }),
            invalidatesTags: ["comment"]
        }),

        // Get Comments By Post Id
        getCommentsByPostId: builder.query({
            query: ({postId, limit})=>({
                url: `/${postId}?limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["comment"]
        }),

        // Get Comments By Post Id
        getCommentReplies: builder.query({
            query: ({postId, parentCommentId, limit})=>({
                url: `/replies?postId=${postId}&parentCommentId=${parentCommentId}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["comment"]
        }),

        // Post Comment Replay
        postCommentReplay: builder.mutation({
            query: (commentData)=>({
                url: "/replay/post",
                method: "POST",
                body: commentData
            }),
            invalidatesTags: ["comment"]
        }),

        // React On Comment
        reactOnComment: builder.mutation({
            query: (commentData)=>({
                url: "/react",
                method: "POST",
                body: commentData
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

        // Delete Comment
        deleteComment: builder.mutation({
            query: ({commentId})=>({
                url: `/delete/${commentId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["comment"]
        })


    })
})

export const {
    usePostCommentMutation,
    useGetCommentsByPostIdQuery,
    useGetCommentRepliesQuery,
    usePostCommentReplayMutation,
    useReactOnCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApi;
export default commentApi;