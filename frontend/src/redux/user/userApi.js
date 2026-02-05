import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/auth`,
        credentials: "include",
    }),
    tagTypes: ["user"],
    endpoints: (builder)=>({

        // Get Current User
        getCurrentUser: builder.query({
            query: ()=>({
                url: "/me",
                method: "GET",
            }),
            providesTags: ["user"],
        }),

        // Update Profile
        updateProfile: builder.mutation({
            query: (userData)=>({
                url: "/me/profile/update",
                method: "PUT",
                body: userData,
            }),
            invalidatesTags: ["user"],
        })


    })
})

export const {
    useGetCurrentUserQuery,
    useUpdateProfileMutation,
} = userApi;
export default userApi;