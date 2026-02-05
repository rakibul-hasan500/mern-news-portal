"use client"
import Image from "next/image";
import demoLogo from "@/assets/images/272 x 90.jpg";
import Loader from "@/utils/Loader";
import {useEffect, useRef, useState} from "react";
import responseHandler from "@/utils/responseHandler";
import {useResendOtpMutation, useVerifyOtpMutation} from "@/redux/auth/authApi";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

function VerifyOtp(){

    // Router
    const router = useRouter()

    // Input Fields Ref
    const otpInputRef = useRef(null);

    // Get Settings Data From Redux
    const settingsData = useSelector((state)=>state.Settings.settingsData)

    // OTP State
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState("");

    // On Change OTP
    const onChangeOtp = (index, value)=>{
        if(!/^[0-9]?$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp);
        if(value !== ""){
            if(index < 5){
                otpInputRef.current[index + 1].focus()
            }
        }else{
            if(index > 0){
                otpInputRef.current[index].focus()
            }
        }
    }
    // Auto Focus 1st Field
    useEffect(()=>{
        otpInputRef.current[0].focus()
    }, [otpInputRef])
    // Handle Key Down
    const handleKeyDown = (index, e)=>{
        if(e.key === "Backspace"){
            if(otp[index] === "" && index > 0){
                otpInputRef.current[index - 1].focus()
            }
        }
    }

    // Call Verify OTP API
    const [verifyOtp, {isLoading: verifyOtpLoading}] = useVerifyOtpMutation()

    // Handle Verify OTP
    const handleVerifyOTP = async (e)=>{
        e.preventDefault()
        setOtpError("")
        try{
            // Get OTP
            const newOtp = otp.join("")
            if(newOtp.length < 6){
                return setOtpError("Please enter the 6 digit OTP sent to your email.")
            }
            if(!/^[0-9]{6}$/.test(newOtp)){
                return setOtpError("OTP must contain only numbers.")
            }

            // Hit Verify Otp API
            const response = await verifyOtp({otp: newOtp}).unwrap();

            // Reset OTP State
            setOtp(["", "", "", "", "", ""])

            // Navigate
            if(response?.data?.verifyType === "login"){
                router.push("/")
            }else if(response?.data?.verifyType === "forgot-password"){
                router.push("/reset-password")
            }else{
                router.push("/login")
            }

            return responseHandler(true, response?.message);
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Resend OTP API
    const [resendOtp, {isLoading: resendOtpLoading}] = useResendOtpMutation()

    // Handle Resend Otp
    const handleResendOtp = async ()=>{
        try{
            // Hit Resend Otp API
            const response = await resendOtp().unwrap()

            return responseHandler(true, response?.message);
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // OTP Expire Time From Cookie
    const otpExpireTime = Cookies.get("otpExpireTime") || null
    const [remainingTime, setRemainingTime] = useState(0)
    useEffect(()=>{
        if(!otpExpireTime) return;
        const interval = setInterval(()=>{
            const now = Date.now()
            const diff = otpExpireTime - now
            if(diff <= 0){
                clearInterval(interval)
                setRemainingTime(0)
            }else{
                setRemainingTime(diff)
            }
            ()=>clearInterval(interval)
        }, 1000)
    }, [otpExpireTime])
    const minutes = Math.floor(remainingTime / 1000 / 60)
    const seconds = Math.floor((remainingTime / 1000) % 60)

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
                <p className="text-gray-500 font-light text-lg text-center mb-6">Enter the 6-digit OTP sent to your email or phone to verify your account</p>

                {/* Login Form */}
                <form className="flex flex-col gap-6" ref={otpInputRef} onSubmit={handleVerifyOTP}>
                    {/*  Expire Time  */}
                    <div className="flex items-center justify-center -mb-2">
                        {
                            remainingTime > 0 ?
                                <p className="tracking-wider font-semibold">{String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, 0)}</p>
                                :
                                <p className="text-red-600 font-semibold">Expired</p>
                        }
                    </div>

                    {/*  OTP Fields  */}
                    <div>
                        {/*  Fields  */}
                        <div className="flex items-center justify-between flex-wrap">
                            {
                                otp?.map((item, index)=>(
                                    <input
                                        type="text"
                                        maxLength={1}
                                        key={index}
                                        value={otp[index]}
                                        onKeyDown={(e)=>handleKeyDown(index, e)}
                                        onChange={(e)=>onChangeOtp(index, e.target.value)}
                                        className="w-12 h-12 text-2xl rounded p-2 bg-gray-50 border border-gray-300 text-center outline-none focus:ring-2 ring-red-500 font-bold"
                                    />
                                ))
                            }
                        </div>

                        {/*  Error  */}
                        {otpError !== "" && <p className="text-sm text-red-600 mt-2 text-center">{otpError}</p>}
                    </div>

                    {/* Login Button */}
                    <button type="submit" disabled={verifyOtpLoading} className={`${verifyOtpLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} w-full bg-red-600 text-white py-[10px] rounded-md font-semibold hover:bg-red-700 transition uppercase`}>{verifyOtpLoading ? <Loader/> : "Verify OTP"}</button>
                </form>

                {/* Resend OTP */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Didn't receive the OTP?{" "}
                    <button onClick={handleResendOtp} disabled={resendOtpLoading} className={`${resendOtpLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} text-red-600 hover:underline`}>{resendOtpLoading ? "Sending.." : "Resend"}</button>
                </p>
            </div>
        </main>
    )
}

export default VerifyOtp;