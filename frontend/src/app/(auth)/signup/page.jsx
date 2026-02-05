"use client";
import { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import Image from "next/image";
import { useSelector } from "react-redux";
import demoLogo from "../../../assets/images/272 x 90.jpg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Link from "next/link";
import responseHandler from "@/utils/responseHandler";
import {useSignupUserMutation} from "@/redux/auth/authApi";
import {useRouter} from "next/navigation";
import {registerSchema} from "@/utils/zodValidator";
import Loader from "@/utils/Loader";

function Signup() {

    // Router
    const router = useRouter()

    // Get Settings Data From Redux
    const settingsData = useSelector((state) => state.Settings.settingsData);

    // Form States
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Utils States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Call Signup User API
    const [signupUser, {isLoading: signupUserLoading}] = useSignupUserMutation()

    // Handle Signup
    const handleSignup = async (e)=>{
        e.preventDefault();
        setNameError("")
        setEmailError("")
        setPasswordError("")
        setConfirmPasswordError("")
        try{
            // User Data
            const userData = {
                name,
                email,
                password,
                confirmPassword,
            };

            // Validate
            const zodValidation = registerSchema.safeParse(userData);
            if(!zodValidation?.success){
                const formattedErrors = zodValidation?.error.format()

                if(formattedErrors?.name?._errors?.length > 0){
                    setNameError(formattedErrors?.name?._errors[0])
                }

                if(formattedErrors?.email?._errors?.length > 0){
                    setEmailError(formattedErrors?.email?._errors[0])
                }

                if(formattedErrors?.password?._errors?.length > 0){
                    setPasswordError(formattedErrors?.password?._errors[0])
                }

                if(formattedErrors?.confirmPassword?._errors?.length > 0){
                    setConfirmPasswordError(formattedErrors?.confirmPassword?._errors[0])
                }

                return
            }

            // Hit Signup User API
            const response = await signupUser(userData).unwrap();

            // Clear All States
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setShowPassword(false)
            setShowConfirmPassword(false)

            // Navigate To Verify OTP Page
            router.push("/verify-otp")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error);
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
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>

                {/* Title */}
                <p className="text-gray-500 font-light text-lg text-center mb-6">
                    Enter your details to create your account
                </p>

                {/* Signup Form */}
                <form className="flex flex-col gap-6" onSubmit={handleSignup}>
                    {/* Name */}
                    <div>
                        {/*  Field  */}
                        <div className="relative bg-gray-50">
                            {/*  Input  */}
                            <input
                                type="text"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                placeholder=""
                                id="name"
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 peer text-sm"
                            />

                            {/*  Label  */}
                            <label htmlFor="name" className={`absolute left-3 -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-red-500 peer-focus:text-sm bg-gray-50 px-1 ${name !== "" ? "top-0" : "top-1/2"}`}>Name</label>
                        </div>

                        {/*  Error  */}
                        {nameError !== "" && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        {/* Field */}
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

                        {/*  Error  */}
                        {emailError !== "" && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
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
                            <label htmlFor="password" className={`absolute left-3 -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-red-500 peer-focus:text-sm bg-gray-50 px-1 ${password !== "" ? "top-0" : "top-1/2"}`}>Password</label>

                            {/*  Show Button  */}
                            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition text-xl">
                                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                            </button>
                        </div>

                        {/*  Error  */}
                        {passwordError !== "" && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        {/*  Field  */}
                        <div className="relative bg-gray-50">
                            {/*  Input  */}
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                placeholder=""
                                id="confirm-password"
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 peer text-sm"
                            />

                            {/*  Label  */}
                            <label htmlFor="confirm-password" className={`absolute left-3 -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-red-500 peer-focus:text-sm bg-gray-50 px-1 ${confirmPassword !== "" ? "top-0" : "top-1/2"}`}>Confirm Password</label>

                            {/*  Show Button  */}
                            <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition text-xl">
                                {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
                            </button>
                        </div>

                        {/*  Error  */}
                        {confirmPasswordError !== "" && <p className="text-red-600 text-sm mt-1">{confirmPasswordError}</p>}
                    </div>

                    {/* Signup Button */}
                    <button type="submit" disabled={signupUserLoading} className={`${signupUserLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} w-full bg-red-600 text-white py-[10px] rounded-md font-semibold hover:bg-red-700 transition uppercase`}>{signupUserLoading ? <Loader/> : "Sign Up"}</button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="mx-2 text-gray-400 text-sm">or</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* Social Login Buttons */}
                <div className="flex gap-3">
                    {/*  Google  */}
                    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100 font-semibold transition text-gray-600 cursor-pointer">
                        <FaGoogle /> Google
                    </button>

                    {/*  Facebook  */}
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
    );
}

export default Signup;
