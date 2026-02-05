
import React, {useState} from 'react'
import responseHandler from "../../utils/responseHandler.jsx";
import {useLoginMutation} from "../../redux/auth/authApi.js";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {useNavigate} from "react-router";
import Loader from "../../utils/Loader.jsx";
import {useGetSettingsDataQuery} from "../../redux/settings/settingsApi.js";
import demoLogo from "../../assets/images/272 x 90.jpg";

function Login() {

    const navigate = useNavigate();

    // Password Visible
    const [showPassword, setShowPassword] = useState(false);

    // Login Data
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    })

    // Input Login Data
    const onChangeHandler = (name, value)=>{
        setLoginFormData({
            ...loginFormData,
            [name]: value,
        })
    }

    // Call Login User Api
    const [login, {isLoading: loginLoading}] = useLoginMutation()

    // Handle Submit Login Form
    const handleSubmitLoginForm = async (e)=>{

        e.preventDefault()
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        try{
            // Validation
            if(!loginFormData.email || loginFormData.email.trim() === ""){
                return responseHandler(false, "Enter your email address.")
            }
            if(!emailRegex.test(loginFormData.email)){
                return responseHandler(false, "Enter a valid email address.")
            }
            if(!loginFormData.password){
                return responseHandler(false, "Enter your password")
            }
            if(loginFormData.password.length < 8){
                return responseHandler(false, "Password must be at least 8 characters long.")
            }

            // Hit Login Api
            const response = await login(loginFormData).unwrap()

            // Reset Login Form Data
            setLoginFormData({email: "", password: ""})
            setShowPassword(false)

            // Navigate To Home Page
            navigate("/verify", {replace: true})
            
            return responseHandler(true, response.message)
        }catch(error){
            console.error("Error: ", error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Get Settings Data API
    const {data: settingsData} = useGetSettingsDataQuery()

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
        <form onSubmit={handleSubmitLoginForm} className="w-[calc(100%-10%)] max-w-[450px] justify-center sm:w-[450px] px-6 py-8 bg-white flex flex-col gap-6 shadow-lg">
            {/*  Logo  */}
            <div className="flex items-center justify-center">
                <img src={settingsData?.data?.logo?.url || demoLogo} alt={"logo"} className="w-[200px]"/>
            </div>

            {/*  Email  */}
            <div className="flex flex-col gap-2 mt-2">
                <label className="font-medium">Email</label>
                <input type="email" value={loginFormData.email} onChange={(e)=>onChangeHandler(e.target.name, e.target.value)} name="email" className="p-3 outline-none border-1 border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email"/>
            </div>

            {/*  Password  */}
            <div className="flex flex-col gap-2">
                <label className="font-medium">Password</label>
                <div className="relative w-full">
                    <input type={showPassword ? "text" : "password"} value={loginFormData.password} onChange={(e)=>onChangeHandler(e.target.name, e.target.value)} name="password" className="w-full p-3 outline-none border-1 border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password"/>
                    {showPassword ? <IoMdEye onClick={()=>setShowPassword((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer text-gray-600"/> : <IoMdEyeOff className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer text-gray-600" onClick={()=>setShowPassword((show)=>!show)}/>}
                </div>
            </div>

            {/*  Button  */}
            <button disabled={loginLoading} type="submit" className={`${loginLoading && "opacity-50"} bg-indigo-500 hover:bg-indigo-700 text-white font-semibold p-3 transition duration-200 cursor-pointer rounded-md`}>{loginLoading ? <Loader size={20}/> : "Login"}</button>
        </form>
    </div>
  )
}

export default Login