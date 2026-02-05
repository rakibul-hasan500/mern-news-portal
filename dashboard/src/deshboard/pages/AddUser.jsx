import {Link, useNavigate} from "react-router";
import React, {useEffect, useState} from "react";
import {IoMdArrowDropdown, IoMdClose, IoMdEye, IoMdEyeOff} from "react-icons/io";
import responseHandler from "../../utils/responseHandler.jsx";
import {useAddUserMutation, useUpdateUserMutation} from "../../redux/auth/authApi.js";
import Loader from "../../utils/Loader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {handleSelectUserForEdit} from "../../redux/auth/authSlice.js";

function AddUser(){

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Password Visible
    const [showPassword, setShowPassword] = useState(false);

    // User STates
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");

    // Selected User Data Show
    const selectedUserForEdit = useSelector((state)=>state.Auth.selectedUserForEdit);
    useEffect(()=>{
        if(selectedUserForEdit?._id){
            setId(selectedUserForEdit?._id.toString());
            setName(selectedUserForEdit?.name || "");
            setEmail(selectedUserForEdit?.email || "");
            setRole(selectedUserForEdit?.role || "");
        }
    }, [selectedUserForEdit]);

    // Role Selector
    const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);

    // Call Add User API
    const [addUser, {isLoading: addUserLoading}] = useAddUserMutation();

    // Handle Submit Add User Form
    const handleSubmitAddUserForm = async (e)=>{
        e.preventDefault()
        try{
            // Validate User Data
            if(!name || !name.trim()){
                return responseHandler(false, 'Name is required.')
            }
            if(!email || !email.trim()){
                return responseHandler(false, 'Email is required.')
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return responseHandler(false, 'Invalid email address.')
            }
            if(!role || !role.trim()){
                return responseHandler(false, 'Select a user role.')
            }
            const roles = ["user", "editor", "writer"]
            if(!roles.includes(role)){
                return responseHandler(false, "Invalid user role selected.")
            }
            if(!password){
                return responseHandler(false, 'Password is required.')
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if(!passwordRegex.test(password)){
                return responseHandler(false, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
            }

            // Hit Add User API
            const response = await addUser({
                name,
                email,
                role,
                password
            }).unwrap()

            // Reset User States
            setName("")
            setEmail("")
            setRole("")
            setPassword("")

            // Navigate To Users Page
            navigate("/dashboard/users")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Update User API
    const [updateUser, {isLoading: updateUserLoading}] = useUpdateUserMutation()

    // Handle Submit Update User Form
    const handleSubmitUpdateUserForm = async (e)=>{
        e.preventDefault()
        try{
            // Validate User Data
            if(!id || !id?.trim()){
                return responseHandler(false, 'User ID not found. Please try again.')
            }
            if(!name || !name.trim()){
                return responseHandler(false, 'Name is required.')
            }
            if(!email || !email.trim()){
                return responseHandler(false, 'Email is required.')
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return responseHandler(false, 'Invalid email address.')
            }
            if(!role || !role.trim()){
                return responseHandler(false, 'Select a user role.')
            }
            const roles = ["user", "editor", "writer"]
            if(!roles.includes(role)){
                return responseHandler(false, "Invalid user role selected.")
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if(password && !passwordRegex.test(password)){
                return responseHandler(false, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
            }

            // Hit Add User API
            const response = await updateUser({
                id,
                name,
                email,
                role,
                password
            }).unwrap()

            // Reset User States
            setId("")
            setName("")
            setEmail("")
            setRole("")
            setPassword("")

            // Remove Selected User
            dispatch(handleSelectUserForEdit(null))

            // Navigate To Users Page
            navigate("/dashboard/users")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className="bg-white rounded-md">
            {/*  Section Header  */}
            <div className="flex justify-between p-4">
                {/*  Title  */}
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{selectedUserForEdit?._id ? "Update" : "Add"} User</h2>
                    {selectedUserForEdit?._id && <button onClick={()=>{
                        dispatch(handleSelectUserForEdit(null))
                        setId("")
                        setName("")
                        setEmail("")
                        setRole("")
                        setPassword("")
                    }} className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-full text-xs uppercase cursor-pointer">Cancel</button>}
                </div>

                {/*  Writer Navigate  */}
                <Link to={"/dashboard/users"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">Users</Link>
            </div>

            {/*  Add User Form  */}
            <div className="p-4">
                <form onSubmit={selectedUserForEdit?._id ? handleSubmitUpdateUserForm : handleSubmitAddUserForm}>
                    {/*  Name & Role  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-3">
                        {/*  Name  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Name*</label>
                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Name" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        {/*  Role  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Role</label>
                            <div className="relative z-10">
                                {/*  Selected Role  */}
                                <div onClick={()=>setRoleSelectorOpen((open)=>!open)} className={`${roleSelectorOpen && "ring-2 ring-indigo-500"} flex items-center justify-between px-3 py-2 rounded-md outline-none border border-gray-300 cursor-pointer`}>
                                    {role === "" ? "Select role" : <span className="capitalize">{role}</span>}
                                    {roleSelectorOpen ? <IoMdClose /> : <IoMdArrowDropdown className="text-xl"/>}
                                </div>

                                {/*  Role Selector  */}
                                {roleSelectorOpen && <div className="absolute left-0 top-full mt-1 w-full border-x border-t border-gray-300">
                                    {/*  User  */}
                                    <button onClick={()=>{
                                        setRole("user")
                                        setRoleSelectorOpen((open)=>!open)
                                    }} className="cursor-pointer bg-gray-50 border-b border-gray-300 hover:bg-gray-100 p-2 w-full text-start">User</button>

                                    {/*  Writer  */}
                                    <button onClick={()=>{
                                        setRole("writer")
                                        setRoleSelectorOpen((open)=>!open)
                                    }} className="cursor-pointer bg-gray-50 border-b border-gray-300 hover:bg-gray-100 p-2 w-full text-start">Writer</button>

                                    {/*  Editor  */}
                                    <button onClick={()=>{
                                        setRole("editor")
                                        setRoleSelectorOpen((open)=>!open)
                                    }} className="cursor-pointer bg-gray-50 border-b border-gray-300 hover:bg-gray-100 p-2 w-full text-start">Editor</button>
                                </div>}
                            </div>
                        </div>
                    </div>

                    {/*  Email & Password  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-3">
                        {/*  Email  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Email*</label>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Email" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        {/*  Password  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Password{selectedUserForEdit?._id ? " (optional)" : "*"}</label>
                            <div className="relative w-full">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"/>
                                {showPassword ? <IoMdEye onClick={()=>setShowPassword((show)=>!show)} className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer text-gray-600"/> : <IoMdEyeOff className="absolute top-1/2 right-2 text-2xl -translate-y-1/2 cursor-pointer text-gray-600" onClick={()=>setShowPassword((show)=>!show)}/>}
                            </div>
                        </div>
                    </div>

                    {/*  Submit  */}
                    <button disabled={addUserLoading || updateUserLoading} className={`${(addUserLoading || updateUserLoading) && "opacity-50"} text-white font-semibold px-5 py-2 bg-indigo-500 hover:bg-indigo-700 cursor-pointer rounded-md min-w-[110px]`}>{(addUserLoading || updateUserLoading) ? <Loader size={20}/> : `${selectedUserForEdit?._id ? "Update" : "Add"} User`}</button>
                </form>
            </div>
        </div>
    )
}

export default AddUser;