import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/auth`,
        credentials: "include"
    }),
    tagTypes: ["user"],
    endpoints: (builder)=>({

        // Login User
        loginUser: builder.mutation({
            query: (userData)=>({
                url: "/login",
                method: "POST",
                body: userData
            })
        }),

        // Login User
        signupUser: builder.mutation({
            query: (userData)=>({
                url: "/signup",
                method: "POST",
                body: userData
            })
        }),

        // Verify OTP
        verifyOtp: builder.mutation({
            query: (otp)=>({
                url: "/otp/verify",
                method: "POST",
                body: otp
            })
        }),

        // Resend OTP
        resendOtp: builder.mutation({
            query: (otp)=>({
                url: "/otp/resend",
                method: "POST",
            })
        }),

        // Forgot Password
        forgotPassword: builder.mutation({
            query: (data)=>({
                url: "/forgot-password",
                method: "POST",
                body: data
            })
        }),

        // Reset Password
        resetPassword: builder.mutation({
            query: (data)=>({
                url: "/reset-password",
                method: "POST",
                body: data
            })
        }),

        // Log Out User
        logoutUser: builder.mutation({
            query: ()=>({
                url: "/logout",
                method: "POST"
            })
        })


    })

})

export const {
    useLoginUserMutation,
    useSignupUserMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutUserMutation,
} = authApi
export default authApi