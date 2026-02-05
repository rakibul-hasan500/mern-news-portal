import {FaImage} from "react-icons/fa";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import responseHandler from "../../utils/responseHandler.jsx";
import {useChangePasswordMutation, useChangeProfileImageMutation} from "../../redux/auth/authApi.js";
import Loader from "../../utils/Loader.jsx";
import {IoIosImage, IoMdEye, IoMdEyeOff} from "react-icons/io";

function Profile(){

    const userInfo = useSelector((state)=>state.App.userInfo)

    // Selected Image
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");

    // Call Change Profile Image API
    const [changeProfileImage, {isLoading: changeProfileImageLoading}] = useChangeProfileImageMutation()

    // Handle Change Profile Image
    const handleChangeProfileImage = async ()=>{
        try{
            // Get File From Form Data
            let formData = new FormData()
            formData.append("profileImage", selectedImage)

            // Hit Change Profile Image API
            const response  = await changeProfileImage(formData).unwrap();

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error)
            return responseHandler(false, error?.data?.message);
        }
    }
    useEffect(()=>{
        if(selectedImage){
            const url = URL.createObjectURL(selectedImage)
            setSelectedImageUrl(url)
            handleChangeProfileImage()
        }
    }, [selectedImage])

    // Password Show/Hide States
    const [oldPassShow, setOldPassShow] = useState(false)
    const [newPassShow, setNewPassShow] = useState(false)
    const [confirmPassShow, setConfirmPassShow] = useState(false)

    // Password States
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    // Call Change Password API
    const [changePassword, {isLoading: changePasswordLoading}] = useChangePasswordMutation()

    // Handle Change Password
    const handleChangePassword = async (e)=>{
        e.preventDefault()
        try {
            // Validate
            if(!oldPassword.trim()){
                return responseHandler(false, "Old password is required.")
            }
            if(!newPassword.trim()){
                return responseHandler(false, "New password is required.")
            }
            if(!confirmNewPassword.trim()){
                return responseHandler(false, "Confirm password is required.")
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if(!passwordRegex.test(newPassword)){
                return responseHandler(false, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
            }
            if(newPassword !== confirmNewPassword){
                return responseHandler(false, "New password and confirm password do not match")
            }
            if(oldPassword === newPassword){
                return responseHandler(false, "New password must be different from old password")
            }

            // Hit Change Password API
            const response = await changePassword({
                oldPassword,
                newPassword,
                confirmNewPassword,
            }).unwrap()

            // Reset Password States
            setOldPassword("")
            setNewPassword("")
            setConfirmNewPassword("")

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
            {/*  User Image & Data  */}
            <div className="bg-white p-6 rounded-lg flex items-center justify-center shadow-md">
                {/*  Select Image  */}
                <div className={`${changeProfileImageLoading && "pointer-events-none"} flex-shrink-0`}>
                    <label htmlFor="img" className="w-[150px] h-[150px] flex flex-col justify-center items-center rounded-full bg-gray-100 border-2 border-gray-300 text-gray-600 cursor-pointer hover:bg-gray-200 transition-all duration-200 border-dashed">
                        {
                            (userInfo && userInfo?.image) ?
                            <div className="relative group h-[150px] w-[150px]">
                                <img src={selectedImageUrl !== "" ? selectedImageUrl : userInfo?.image} alt={userInfo?.name} className={`${changeProfileImageLoading ? "opacity-50" : ""} h-full w-full object-cover object-center rounded-full`}/>
                                <IoIosImage className="text-4xl hidden group-hover:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-500 bg-white/70 h-13 w-13 p-3 rounded-full"/>
                                {changeProfileImageLoading && <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"><Loader size={24} color={"#fff"}/></div>}
                            </div>
                                :
                            <>
                                <FaImage className="text-4xl text-"/>
                                <span className="mt-2 font-semibold">Select Image</span>
                            </>
                        }
                    </label>
                    <input type="file" onChange={(e)=>setSelectedImage(e.target.files[0])} id="img" className="hidden overflow-hidden"/>
                </div>

                {/*  User Data  */}
                <div className="ml-6 text-gray-700 flex flex-col gap-2">
                    <h3 className="text-xl font-bold">{userInfo?.name}</h3>
                    <p className="text-sm">Email: <span className="text-gray-600">{userInfo?.email}</span></p>
                    <p className="text-sm">Role: <span className="text-indigo-600 uppercase font-medium">{userInfo?.role}</span></p>
                </div>
            </div>

            {/*  User Password Change  */}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center shadow-md text-gray-700">
                {/*  Title  */}
                <h2 className="text-lg font-bold text-center mb-5">Change Password</h2>

                {/*  Password Change Form  */}
                <form onSubmit={handleChangePassword} className="w-full flex flex-col gap-4">
                    {/*  Old Password  */}
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="old_password" className="block text-md font-semibold text-gray-600">Old Password</label>
                        <div className="relative">
                            <input type={oldPassShow ? "text" : "password"} value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} id="old_password" placeholder="Enter Old Password" className="px-3 py-2 border border-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 rounded-md w-full"/>
                            {oldPassShow ? <IoMdEye onClick={()=>setOldPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/> : <IoMdEyeOff onClick={()=>setOldPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/>}
                        </div>
                    </div>

                    {/*  New Password  */}
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="new_password" className="block text-md font-semibold text-gray-600">New Password</label>
                        <div className="relative">
                            <input type={newPassShow ? "text" : "password"} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} id="new_password" placeholder="Enter New Password" className="px-3 py-2 border border-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 rounded-md w-full"/>
                            {newPassShow ? <IoMdEye onClick={()=>setNewPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/> : <IoMdEyeOff onClick={()=>setNewPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/>}
                        </div>
                    </div>

                    {/*  Confirm New Password  */}
                    <div className="flex flex-col gap-1 w-full">
                        <label htmlFor="confirm_new_password" className="block text-md font-semibold text-gray-600">Confirm Password</label>
                        <div className="relative">
                            <input type={confirmPassShow ? "text" : "password"} value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} id="confirm_new_password" placeholder="Confirm New Password" className="px-3 py-2 border border-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 rounded-md w-full"/>
                            {confirmPassShow ? <IoMdEye onClick={()=>setConfirmPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/> : <IoMdEyeOff onClick={()=>setConfirmPassShow((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer"/>}
                        </div>
                    </div>

                    {/*  Button  */}
                    <button disabled={changePasswordLoading} type="submit" className={`${changePasswordLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} flex items-center justify-center w-full h-[45px] px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200 mt-2`}>{changePasswordLoading ? <Loader size={20} color={"#fff"}/> : "Change Password"}</button>
                </form>
            </div>
        </div>
    )
}

export default Profile;