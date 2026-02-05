"use client"
import {useResetPasswordMutation} from "@/redux/auth/authApi";
import demoLogo from "../../../assets/images/272 x 90.jpg";
import Loader from "@/utils/Loader";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {useState} from "react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {FaFacebookF, FaGoogle} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import responseHandler from "@/utils/responseHandler";

function ResetPassword(){

    // Router
    const router = useRouter()

    // Get Settings Data From Redux
    const settingsData = useSelector((state) => state.Settings.settingsData);

    // Form States
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Utils States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Call Reset Password API
    const [resetPassword, {isLoading: resetPasswordLoading}] = useResetPasswordMutation()

    // Handle Reset Password
    const handleResetPassword = async (e)=>{
        e.preventDefault();
        setPasswordError("")
        setConfirmPasswordError("")
        try{
            // Validate
            if(!password){
                return setPasswordError("Enter your new password.")
            }
            if(password.length < 8){
                return setPasswordError("Password must be at least 8 characters long.")
            }
            if(!/[A-Z]/.test(password)){
                return setPasswordError("Password must contain at least one uppercase letter.")
            }
            if(!/[a-z]/.test(password)){
                return setPasswordError("Password must contain at least one lowercase letter.")
            }
            if(!/[0-9]/.test(password)){
                return setPasswordError("Password must contain at least one number.")
            }
            if(!/[^A-Za-z0-9]/.test(password)){
                return setPasswordError("Password must contain at least one special character.")
            }
            if(!confirmPassword){
                return setConfirmPasswordError("Confirm your new password.")
            }
            if(password !== confirmPassword){
                return setConfirmPasswordError("Passwords do not match.")
            }

            // Hit Signup User API
            const response = await resetPassword({
                newPassword: password,
                confirmNewPassword: confirmPassword,
            }).unwrap();

            // Clear All States
            setPassword("")
            setConfirmPassword("")
            setShowPassword(false)
            setShowConfirmPassword(false)

            // Navigate To Verify OTP Page
            router.push("/login")

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
                    Enter your new password below
                </p>

                {/* Reset Password Form */}
                <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
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
                    <button type="submit" disabled={resetPasswordLoading} className={`${resetPasswordLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} w-full bg-red-600 text-white py-[10px] rounded-md font-semibold hover:bg-red-700 transition uppercase`}>{resetPasswordLoading ? <Loader/> : "Reset Password"}</button>
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
                    Back to{" "}
                    <Link href="/login" className="text-red-600 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    );
}

export default ResetPassword;