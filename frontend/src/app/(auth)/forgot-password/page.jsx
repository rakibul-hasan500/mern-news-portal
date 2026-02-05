"use client"
import Image from "next/image";
import demoLogo from "@/assets/images/272 x 90.jpg";
import Link from "next/link";
import Loader from "@/utils/Loader";
import {FaFacebookF, FaGoogle} from "react-icons/fa";
import {useForgotPasswordMutation} from "@/redux/auth/authApi";
import {useSelector} from "react-redux";
import {useState} from "react";
import responseHandler from "@/utils/responseHandler";
import {useRouter} from "next/navigation";

function ForgotPassword(){

    // Router
    const router = useRouter();

    // Settings Data
    const settingsData = useSelector((state)=>state.Settings.settingsData)

    // Email State
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    // Call Forgot Password API
    const [forgotPassword, {isLoading: forgotPasswordLoading}] = useForgotPasswordMutation()

    // Handle Reset Password
    const handleResetPassword = async (e)=>{
        e.preventDefault();
        setEmailErrorMessage("")
        try{
            // Validate
            if(!email?.trim()){
                return setEmailErrorMessage("Please enter your email address.");
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if(!emailRegex.test(email)){
                return setEmailErrorMessage("Please enter a valid email address.");
            }

            // Hit Forgot Password API
            const response = await forgotPassword({email}).unwrap()

            // Navigate to Reset Password Page
            router.push("/verify-otp")

            // Reset States
            setEmail("")
            setEmailErrorMessage("")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <div className="relative h-[80px] w-[272px]">
                        <Image
                            src={settingsData?.logo?.url || demoLogo}
                            alt={settingsData?.logo?.altTag || settingsData?.appName || "Logo"}
                            fill={true}
                            className="object-cover object-center"
                        />
                    </div>
                </div>

                {/* Title */}
                <p className="text-gray-500 font-light text-lg text-center mb-6">Enter your email to reset your password</p>

                {/* Forgot Password Form */}
                <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
                    {/* Email */}
                    <div>
                        {/*  Field  */}
                        <div className="relative bg-gray-50">
                            {/*  Input  */}
                            <input
                                type="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder=""
                                id="email"
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 peer text-sm"

                            />

                            {/*  Label  */}
                            <label htmlFor="email" className={`absolute left-3 -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-red-500 peer-focus:text-sm bg-gray-50 px-1 ${email !== "" ? "top-0" : "top-1/2"}`}>Email</label>
                        </div>

                        {/*  Error Message  */}
                        {emailErrorMessage !== "" && <p className="text-red-600 text-sm mt-1">{emailErrorMessage}</p>}
                    </div>

                    {/* Login Button */}
                    <button type="submit" disabled={forgotPasswordLoading} className={`${forgotPasswordLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} w-full bg-red-600 text-white py-[10px] rounded-md font-semibold hover:bg-red-700 transition uppercase`}>{forgotPasswordLoading ? <Loader/> : "Send OTP"}</button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="mx-2 text-gray-400 text-sm">or</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* Social Login Buttons */}
                <div className="flex  gap-3">
                    {/*  Google Login  */}
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 font-semibold transition text-gray-600 cursor-pointer">
                        <FaGoogle /> Google
                    </button>

                    {/*  Facebook Login  */}
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 font-semibold transition text-gray-600 cursor-pointer">
                        <FaFacebookF /> Facebook
                    </button>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-red-600 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    )
}

export default ForgotPassword;