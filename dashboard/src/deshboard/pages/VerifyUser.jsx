import demoLogo from "../../assets/images/272 x 90.jpg";
import Cookie from "js-cookie";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useOtpResendMutation, useOtpVerifyMutation} from "../../redux/auth/authApi.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {handleGetUserData} from "../../redux/app/appSlice.js";
import {useDispatch} from "react-redux";
import Loader from "../../utils/Loader.jsx";
import {useGetSettingsDataQuery} from "../../redux/settings/settingsApi.js";

function VerifyUser(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get Verify Mode Cookie
    const verifyMode = Cookie.get("verifyMode") || null;

    // If No Verify Mode
    useEffect(() => {
        if(!verifyMode){
            return navigate('/login', {replace: true});
        }
    }, [verifyMode, navigate]);

    // Otp Expire Time
    const [remainingTime, setRemainingTime] = useState(0);
    const otpExpireTime = Cookie.get("otpExpireTime") || null;
    useEffect(()=>{
        // Get Expire Time From Cookie
        if(!otpExpireTime) return;

        const interval = setInterval(()=>{
            const now = Date.now();
            const diff = otpExpireTime - now;

            if(diff <= 0){
                setRemainingTime(0)
                clearInterval(interval);
            }else{
                setRemainingTime(diff)
            }

            ()=>clearInterval(interval);
        }, 1000)
    }, [otpExpireTime])

    // Count Minute & Second
    const minutes = Math.floor(remainingTime / 1000 / 60)
    const seconds = Math.floor((remainingTime / 1000) % 60)

    // OTP State
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRef = useRef([]);

    // Auto Focus 1st Input
    useEffect(()=>{
        inputRef.current[0].focus();
    }, [])

    // Handle On Change
    const handleOnChange = (index, value)=>{
        if(!/^[0-9]?$/.test(value)){
            return
        }

       const newOtp = [...otp];
       newOtp[index] = value;
       setOtp(newOtp);

       if(value && index < 5){
           inputRef.current[index + 1].focus();
       }
    }

    // Call OTP Verify API
    const [otpVerify, {isLoading: otpVerifyLoading}] = useOtpVerifyMutation()

    // Handle Submit OTP Form
    const handleSubmitOtpVerifyForm = async (e)=>{
        e.preventDefault();
        try{
            // OTP Code
            const otpCode = otp.join("")

            // Validate Otp
            if(!otpCode){
                return responseHandler(false, "Please enter the OTP code.")
            }
            if(otpCode.length !== 6){
                return responseHandler(false, "OTP must be 6 digits long.")
            }
            if(!/^[0-9]{6}$/.test(otpCode)){
                return responseHandler(false, "OTP should contain only numbers.")
            }

            // Hit Otp Verify API
            const response = await otpVerify({otp: otpCode}).unwrap();

            // Reset Fields
            setOtp(["", "", "", "", "", ""])

            // Set User Data To Redux
            dispatch(handleGetUserData(response?.data?.userObj))

            // Redirect To Dashboard
            navigate("/", {replace: true});

            return responseHandler(true, response?.message);
        }catch(error){
            console.error(error);
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Resend Otp API
    const [otpResend, {isLoading: resendOtpLoading}] = useOtpResendMutation()

    // Handle Resend OTP
    const handleResendOtp = async ()=>{
        try{
            // Hit Resend Otp API
            const response = await otpResend().unwrap()

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error);
            return responseHandler(false, error?.data?.message);
        }
    }

    // Call Get Settings Data API
    const {data: settingsData} = useGetSettingsDataQuery()

    return(
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <form onSubmit={handleSubmitOtpVerifyForm} className="w-[calc(100%-10%)] max-w-[450px] justify-center sm:w-[450px] px-6 py-8 bg-white flex flex-col gap-6 shadow-lg">
                {/*  Logo  */}
                <div className="flex items-center justify-center">
                    <img src={settingsData?.data?.logo?.url || demoLogo} alt={"logo"} className="w-[200px]"/>
                </div>

                {/*  Text  */}
                <div>
                    <p className="text-center text-gray-600">Please enter the 6-digit OTP we sent to your email to verify your account.</p>
                </div>

                {/*  OTP Expire Time  */}
                <div>
                    <p className={`${remainingTime > 0 ? "text-gray-600" : "text-red-500"} text-center font-semibold text-lg`}>{remainingTime > 0 ? `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` : "Expired"}</p>
                </div>

                {/*  OTP Input  */}
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    {
                        otp.map((item, index) => (
                            <input
                                ref={(element)=>inputRef.current[index] = element}
                                type="text"
                                key={index}
                                value={item}
                                onChange={(e)=>handleOnChange(index, e.target.value)}
                                className="bg-gray-100 border-2 border-gray-300 h-[50px] w-[51px] rounded text-center text-2xl font-medium"
                            />
                        ))
                    }
                </div>

                {/*  Button  */}
                <button disabled={otpVerifyLoading} type="submit" className={`${otpVerifyLoading && "opacity-50"} bg-indigo-500 hover:bg-indigo-700 text-white font-semibold p-3 transition duration-200 cursor-pointer rounded-md`}>{otpVerifyLoading ? <Loader size={20}/> : "Verify"}</button>

                {/*  Resend OTP  */}
                <div className="mt-1 flex items-center justify-center gap-1">
                    <p className="text-gray-600 font-light">Didn't receive OTP?</p>
                    <button disabled={resendOtpLoading} onClick={handleResendOtp} className={`${resendOtpLoading && "opacity-50"} text-gray-800 font-semibold cursor-pointer`}>{resendOtpLoading ? "Loading..." : "Resend"}</button>
                </div>
            </form>
        </div>
    )
}

export default VerifyUser;