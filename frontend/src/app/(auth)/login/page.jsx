"use client";
import { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import Image from "next/image";
import {useSelector} from "react-redux";
import demoLogo from "../../../assets/images/272 x 90.jpg"
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import Link from "next/link";
import responseHandler from "@/utils/responseHandler";
import {loginSchema} from "@/utils/zodValidator";
import {useLoginUserMutation} from "@/redux/auth/authApi";
import {useRouter} from "next/navigation";
import Loader from "@/utils/Loader";

function Login(){

    // Router
    const router = useRouter()

    // Get Settings Data From Redux
    const settingsData = useSelector((state)=>state.Settings.settingsData);

    // Form States
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    // Utils States
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    // Call Login User API
    const [loginUser, {isLoading: loginUserLoading}] = useLoginUserMutation()

    // Handle Login
    const handleLogin = async (e)=>{
        e.preventDefault();
        setEmailErrorMessage("")
        setPasswordErrorMessage("")
        try{
            // Validation
            const zodValidation = loginSchema.safeParse({
                email: email,
                password: password,
            })
            if(!zodValidation?.success){
                const formattedErrors = zodValidation?.error?.format()

                // Email Error
                if(formattedErrors?.email?._errors?.length > 0){
                    setEmailErrorMessage(formattedErrors?.email?._errors[0])
                }

                // Password Error
                if(formattedErrors?.password?._errors?.length > 0){
                    setPasswordErrorMessage(formattedErrors?.password?._errors[0])
                }

                return;
            }

            // Login Data
            const loginData = {
                email: email,
                password: password,
                remember: remember,
            }

            // Hit Login User API
            const response = await loginUser(loginData).unwrap();

            // Clear Login States
            setEmail("")
            setEmailErrorMessage("")
            setPassword("")
            setShowPassword(false)
            setPasswordErrorMessage("")
            setRemember(false)

            // Navigate To Verify OTP
            router.push("/verify-otp")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    };

    return (
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
                <p className="text-gray-500 font-light text-lg text-center mb-6">Enter your email and password to login</p>

                {/* Login Form */}
                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
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

                    {/* Password */}
                    <div>
                        {/*  Field  */}
                        <div className="relative bg-gray-50">
                            {/*  Input  */}
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder=""
                                id="password"
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 peer text-sm"

                            />

                            {/*  Label  */}
                            <label htmlFor="password" className={`absolute left-3 -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-red-500 peer-focus:text-sm bg-gray-50 px-1 ${email !== "" ? "top-0" : "top-1/2"}`}>Password</label>

                            {/*  Show Button  */}
                            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition text-xl">
                                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                            </button>
                        </div>

                        {/*  Error Message  */}
                        {passwordErrorMessage !== "" && <p className="text-red-600 text-sm mt-1">{passwordErrorMessage}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm -mt-3">
                        {/*  Remember Me  */}
                        <label className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={()=>setRemember(!remember)}
                                className="w-4 h-4 accent-red-600"
                            />
                            Remember me
                        </label>

                        {/*  Forgot Password  */}
                        <Link href={"/forgot-password"} className="text-red-600 hover:underline transition duration-200">Forgot Password?</Link>
                    </div>

                    {/* Login Button */}
                    <button type="submit" disabled={loginUserLoading} className={`${loginUserLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} w-full bg-red-600 text-white py-[10px] rounded-md font-semibold hover:bg-red-700 transition uppercase`}>{loginUserLoading ? <Loader/> : "Login"}</button>
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

                {/* Sign Up */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-red-600 hover:underline">Sign Up</Link>
                </p>
            </div>
        </main>
    );
}

export default Login;
