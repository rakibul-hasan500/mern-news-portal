"use client";
import { RiCameraLine } from "react-icons/ri";
import {useEffect, useState} from "react";
import {SlUser} from "react-icons/sl";
import {useSelector} from "react-redux";
import responseHandler from "@/utils/responseHandler";
import {useUpdateProfileMutation} from "@/redux/user/userApi";
import Loader from "@/utils/Loader";
import {useRouter} from "next/navigation";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

function EditProfileForm(){

    // Router
    const router = useRouter();

    // Form States
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const [name, setName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Field Errors
    const [nameError, setNameError] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

    // Handle Image Change
    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setSelectedImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    }

    // Password Show - Hide
    const [oldPasswordShow, setOldPasswordShow] = useState(false);
    const [newPasswordShow, setNewPasswordShow] = useState(false);
    const [confirmNewPasswordShow, setConfirmNewPasswordShow] = useState(false);

    // Get User Data From Redux
    const currentUserData = useSelector((state)=>state.User.currentUserData)
    useEffect(()=>{
        if(currentUserData && currentUserData?.id){
            setImageUrl(currentUserData?.image);
            setName(currentUserData?.name);
        }
    }, [currentUserData])

    // Call Update Profile API
    const [updateProfile, {isLoading: updateProfileLoading}] = useUpdateProfileMutation()

    // Handle Update Profile
    const handleUpdateProfile = async (e)=>{
        e.preventDefault()
        setOldPasswordError("")
        setNewPasswordError("")
        setConfirmNewPasswordError("")
        try{
            // Validate
            if(!name && !selectedImage && !oldPassword && !newPassword && !confirmNewPassword){
                return
            }
            if(!name?.trim()){
                return setNameError("Name is required.")
            }
            if(oldPassword || newPassword || confirmNewPassword){
                // Old Password
                if(!oldPassword){
                    return setOldPasswordError("Current password is required.")
                }
                if(oldPassword?.length < 8){
                    return setOldPasswordError("Password must be at least 8 characters.")
                }
                // New Password
                if(!newPassword){
                    return setNewPasswordError("New password is required.")
                }
                if(newPassword?.length < 8){
                    return setNewPasswordError("Password must be at least 8 characters.")
                }
                if(!/[A-Z]/.test(newPassword)){
                    return setNewPasswordError("Password must contain at least one uppercase letter.")
                }
                if(!/[a-z]/.test(newPassword)){
                    return setNewPasswordError("Password must contain at least one lowercase letter.")
                }
                if(!/[0-9]/.test(newPassword)){
                    return setNewPasswordError("Password must contain at least one number.")
                }
                if(!/[^A-Za-z0-9]/.test(newPassword)){
                    return setNewPasswordError("Password must contain at least one special character.")
                }
                // Confirm New Password
                if(!confirmNewPassword){
                    return setConfirmNewPasswordError("Please confirm your new password.")
                }
                if(newPassword !== confirmNewPassword){
                    return setConfirmNewPasswordError("Passwords do not match.")
                }
            }

            // Get Form Data
            const formData = new FormData()
            formData.append("profileImage", selectedImage);
            formData.append("name", name);
            formData.append("oldPassword", oldPassword);
            formData.append("newPassword", newPassword);
            formData.append("confirmNewPassword", confirmNewPassword);

            // Hit Update Profile API
            const response = await updateProfile(formData).unwrap()

            // Reset All States
            setSelectedImage(null)
            setImageUrl("")
            setName("")
            setOldPassword("")
            setNewPassword("")
            setConfirmNewPassword("")

            // Back To Prev Page
            router.back()

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error);
            return responseHandler(false, error?.data?.message)
        }
    }

    return (
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT – Profile Image */}
            <div className="flex flex-col items-center">
                {/*  Image  */}
                <div className="relative">
                    {/*  Selected Image  */}
                    <label htmlFor="profile-image">
                        {imageUrl ? (
                            <img src={imageUrl} alt="Profile" className="w-36 h-36 rounded-full object-cover border-2 border-red-600"/>
                        ) : (
                            <div className="w-36 h-36 flex items-center justify-center rounded-full border-2 border-red-600 bg-gray-50 text-4xl">
                                <SlUser />
                            </div>
                        )}
                    </label>

                    {/*  Image Input  */}
                    <label className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700">
                        <RiCameraLine />
                        <input id="profile-image" type="file" className="hidden" onChange={handleImageChange}/>
                    </label>
                </div>

                {/*  Image Select Text  */}
                <p className="text-sm text-gray-500 mt-3 text-center">Click to change profile image</p>
            </div>

            {/* RIGHT – Fields */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your full name" className="w-full border border-gray-300 p-3 rounded bg-gray-50 focus:ring-2 focus:ring-red-600 outline-none"/>
                    {nameError !== "" && <p className="text-sm font-medium text-red-600 mt-1">{nameError}</p>}
                </div>

                {/*  Current Password & New Password  */}
                <div className="md:col-span-2 grid md:grid-cols-2 gap-6 mt-2">
                    {/* Current Password */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Current Password</label>
                        <div className="relative">
                            <input type={oldPasswordShow ? "text" : "password"} value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder="Current password" className="w-full border border-gray-300 p-3 rounded bg-gray-50 focus:ring-2 focus:ring-red-600 outline-none"/>
                            {oldPasswordShow ? <IoMdEye onClick={()=>setOldPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/> : <IoMdEyeOff onClick={()=>setOldPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/>}
                        </div>
                        {oldPasswordError !== "" && <p className="text-sm font-medium text-red-600 mt-1">{oldPasswordError}</p>}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <input type={newPasswordShow ? "text" : "password"} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="New password" className="w-full border border-gray-300 p-3 rounded bg-gray-50 focus:ring-2 focus:ring-red-600 outline-none"/>
                            {newPasswordShow ? <IoMdEye onClick={()=>setNewPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/> : <IoMdEyeOff onClick={()=>setNewPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/>}
                        </div>
                        {newPasswordError !== "" && <p className="text-sm font-medium text-red-600 mt-1">{newPasswordError}</p>}
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <input type={confirmNewPasswordShow ? "text" : "password"} value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} placeholder="Confirm new password" className="w-full border border-gray-300 p-3 rounded bg-gray-50 focus:ring-2 focus:ring-red-600 outline-none"/>
                        {confirmNewPasswordShow ? <IoMdEye onClick={()=>setConfirmNewPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/> : <IoMdEyeOff onClick={()=>setConfirmNewPasswordShow((show)=>!show)} className="absolute top-1/2 -translate-y-1/2 right-3 text-[22px] hover:text-red-600 transition duration-200"/>}
                    </div>
                    {confirmNewPasswordError !== "" && <p className="text-sm font-medium text-red-600 mt-1">{confirmNewPasswordError}</p>}
                </div>

                {/* Button */}
                <div className="md:col-span-2">
                    <button type="submit" disabled={updateProfileLoading} className={`px-12 py-3 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition ${updateProfileLoading && "opacity-50 cursor-not-allowed"}`}>
                        {updateProfileLoading ? <Loader /> : "Save Changes"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default EditProfileForm;