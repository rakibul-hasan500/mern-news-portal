import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import base_url from "../../config/config.js";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/auth`,
        credentials: "include"
    }),
    tagTypes: ["user", "myInfo"],
    endpoints: (builder)=>({

        // Login
        login: builder.mutation({
            query: (userDate)=>({
                url: "/login",
                method: "POST",
                body: userDate
            })
        }),

        // OTP Verify
        otpVerify: builder.mutation({
            query: (otp)=>({
                url: '/otp/verify',
                method: "POST",
                body: otp
            })
        }),

        // Otp Resend
        otpResend: builder.mutation({
           query: ()=>({
               url: '/otp/resend',
               method: "POST",
           })
        }),

        // Get User Data
        logout: builder.mutation({
            query: ()=>({
                url: "/logout",
                method: "POST",
            })
        }),



        // Get User Data
        getUser: builder.query({
            query: ()=>({
                url: "/me",
                method: "GET",
            }),
            providesTags: ["myInfo"]
        }),

        // Change Password
        changePassword: builder.mutation({
            query: (data)=>({
                url: "/me/change/password",
                method: "PATCH",
                body: data
            })
        }),

        // Change Profile Image
        changeProfileImage: builder.mutation({
            query: (data)=>({
                url: "/me/change/profile",
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["myInfo"]
        }),




        // Add User
        addUser: builder.mutation({
            query: (userData)=>({
                url: "/user/add",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["user"]
        }),

        // Update User
        updateUser: builder.mutation({
            query: (userData)=>({
                url: "/user/update",
                method: "PATCH",
                body: userData
            }),
            invalidatesTags: ["user"]
        }),

        // Get All Users Data
        getAllUsers: builder.query({
            query: ({role="", status=null, search="", page=1, limit=10})=>({
                url: `/users?role=${role}&status=${status}&search=${search}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["user"]
        }),

        // Delete User
        deleteUser: builder.mutation({
            query: ({id})=>({
                url: `/user/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"]
        })


    })
})



export const {
    useLoginMutation,
    useOtpVerifyMutation,
    useOtpResendMutation,
    useLogoutMutation,

    useGetUserQuery,
    useChangePasswordMutation,
    useChangeProfileImageMutation,

    useAddUserMutation,
    useUpdateUserMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
} = authApi
export default authApi