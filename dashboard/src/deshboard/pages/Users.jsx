import {Link, useNavigate} from "react-router";
import {AiFillCaretDown, AiOutlineClose} from "react-icons/ai";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {IoIosArrowBack, IoIosArrowForward, IoMdEye} from "react-icons/io";
import {FiEdit3} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useEffect, useState} from "react";
import ProfileImage from "../../assets/images/profile.png"
import {useGetAllUsersQuery} from "../../redux/auth/authApi.js";
import Loader from "../../utils/Loader.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    handleGetDeleteIdAndType,
    handleToggleDeleteWarningShow
} from "../../redux/app/appSlice.js";
import {handleSelectUserForEdit} from "../../redux/auth/authSlice.js";

function Users(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state)=>state.App.userInfo)
    const deleteLoading = useSelector((state)=>state.App.deleteLoading);

    // Role Selector
    const [roleSelectorOpen, setRoleSelectorOpen] = useState(false);
    // Status Selector
    const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);
    // Limit Selector
    const [limitsSelectorOpen, setLimitsSelectorOpen] = useState(false);

    // Filter States
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setselectedStatus] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [limits, setLimits] = useState(10)
    const [page, setPage] = useState(1);

    // Handle Clear Filter
    const handleClearFilter = ()=>{
        setSelectedRole("")
        setselectedStatus(null);
        setSearchText("")
        setLimits(10)
        setPage(1)
    }

    // Call Get All Users API
    const {data: usersData, isLoading: usersLoading} = useGetAllUsersQuery({
        role: selectedRole,
        status: selectedStatus,
        search: searchText,
        limit: limits,
        page: page,
    })

    // Reset Page Number
    useEffect(() => {
        if(usersData?.data?.usersCount <= limits && page !== 1){
            setPage(1)
        }
    }, [usersData?.data?.usersCount, limits, page]);

    // Go Next Page
    const handleNext = ()=>{
        if(usersData?.data?.usersCount > limits && usersData?.data?.usersCount > limits * page){
            return setPage(page + 1)
        }
    }

    // Go Prev Page
    const handlePrev = ()=>{
        if(page <= 1){
            return
        }
        setPage(page - 1)
    }

    // Paginaton Item Start
    const start = ()=>{
        if(usersData?.data?.usersCount > 0){
            return (limits * page + 1) - limits
        }
    }

    // Paginaton Item End
    const end = ()=>{
        if(usersData?.data?.usersCount <= limits){
            return usersData?.data?.usersCount
        }else{
            return (limits * page)
        }
    }

    return(
        <div className="bg-white rounded-md">
            {/*  Section Header  */}
            <div className="flex justify-between p-4">
                {/*  Title  */}
                <h2 className="text-xl font-semibold">Users</h2>

                {/*  Writer Navigate  */}
                <Link to={"/dashboard/user/add"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">Add User</Link>
            </div>

            {/*  Users  */}
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="overflow-x-auto min-h-screen">
                    {/*  User Filter  */}
                    <div className="flex items-center gap-4 mb-6 mt-1 ml-[2px] relative">
                        {/*  User Role Selector  */}
                        <div className="relative flex flex-col min-w-[250px] w-[250px]">
                            {/*  Selected  */}
                            <div onClick={()=>setRoleSelectorOpen((open)=>!open)} className={`${roleSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2 uppercase`}>
                                {selectedRole === "" ? "Select Role" : selectedRole}
                                {roleSelectorOpen ? <AiOutlineClose/> : <AiFillCaretDown className="text-sm"/>}
                            </div>

                            {/*  Selector Options  */}
                            {roleSelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-white border border-gray-300 rounded-lg">
                                {/*  Reset Select  */}
                                <button onClick={()=> {
                                    setRoleSelectorOpen((open)=>!open);
                                    setSelectedRole("")
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Select option</button>
                                {/*  Admin  */}
                                <button onClick={()=> {
                                    setRoleSelectorOpen((open)=>!open);
                                    setSelectedRole("admin")
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Admin</button>
                                {/*  Editor  */}
                                <button onClick={()=> {
                                    setRoleSelectorOpen((open)=>!open);
                                    setSelectedRole("editor")
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Editor</button>
                                {/*  Writer  */}
                                <button onClick={()=> {
                                    setRoleSelectorOpen((open)=>!open);
                                    setSelectedRole("writer")
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Writer</button>
                                {/*  User  */}
                                <button onClick={()=> {
                                    setRoleSelectorOpen((open)=>!open);
                                    setSelectedRole("user")
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200">User</button>
                            </div>}
                        </div>

                        {/*  User Status Selector  */}
                        <div className="relative flex flex-col min-w-[250px] w-[250px]">
                            {/*  Selected  */}
                            <div onClick={()=>setStatusSelectorOpen((open)=>!open)} className={`${statusSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2 uppercase`}>
                                {selectedStatus === null ? "Select Status" : selectedStatus === true ? "Verified" : selectedStatus === false ? "Not Verified" : "Select Status"}
                                {statusSelectorOpen ? <AiOutlineClose/> : <AiFillCaretDown className="text-sm"/>}
                            </div>

                            {/*  Selector Options  */}
                            {statusSelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-white border border-gray-300 rounded-lg">
                                {/*  Clear Select  */}
                                <button onClick={()=> {
                                    setStatusSelectorOpen((open)=>!open);
                                    setselectedStatus(null)
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Select option</button>
                                {/*  Verified  */}
                                <button onClick={()=> {
                                    setStatusSelectorOpen((open)=>!open);
                                    setselectedStatus(true)
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Verified</button>
                                {/*  Not Verified  */}
                                <button onClick={()=> {
                                    setStatusSelectorOpen((open)=>!open);
                                    setselectedStatus(false)
                                }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-b border-gray-200">Not Verified</button>
                            </div>}
                        </div>

                        {/*  Search Input  */}
                        <div className="relative w-[calc(100%-2px)]">
                            <input value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder="Search" className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none p-2 rounded-md placeholder:uppercase"/>
                            <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2"/>
                        </div>

                        {/*  News Limits  */}
                        <div className="relative min-w-[250px] w-[250px]">
                            {/*  Selected  */}
                            <div onClick={()=>setLimitsSelectorOpen((open)=>!open)} className={`${limitsSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2`}>
                                <div className="flex items-center gap-2 uppercase">
                                    Post per page:
                                    <span className="capitalize">{limits}</span>
                                </div>
                                {limitsSelectorOpen ? <AiOutlineClose/> : <AiFillCaretDown className="text-sm"/>}
                            </div>

                            {/*  Selector Options  */}
                            {limitsSelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-white border border-gray-300 rounded-lg">
                                <button onClick={()=> {
                                    setLimitsSelectorOpen((open)=>!open);
                                    setLimits(10)
                                }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200">10</button>
                                <button onClick={()=> {
                                    setLimitsSelectorOpen((open)=>!open);
                                    setLimits(20)
                                }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">20</button>
                                <button onClick={()=> {
                                    setLimitsSelectorOpen((open)=>!open);
                                    setLimits(30)
                                }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">30</button>
                                <button onClick={()=> {
                                    setLimitsSelectorOpen((open)=>!open);
                                    setLimits(usersData?.data?.usersCount)
                                }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">All</button>
                            </div>}
                        </div>

                        {/*  Clear Filter  */}
                        <button onClick={handleClearFilter} className="flex items-center justify-center gap-1 bg-red-500 px-6 py-2 text-white font-semibold rounded-md cursor-pointer uppercase">Clear</button>
                    </div>

                    {/*  User Item Header & User Items  */}
                    <div>
                        {/*  User Items Header  */}
                        <div className="grid grid-cols-12 gap-2 w-full bg-gray-200 p-4 rounded-t-lg">
                            {/*  Serial Number  */}
                            <div className="col-span-1 uppercase font-medium">
                                NO
                            </div>

                            {/*  Image  */}
                            <div className="col-span-1 uppercase font-medium">
                                Image
                            </div>

                            {/*  Name  */}
                            <div className="col-span-3 uppercase font-medium">
                                Name
                            </div>

                            {/*  Role  */}
                            <div className="col-span-1 uppercase font-medium">
                                Role
                            </div>

                            {/*  Email  */}
                            <div className="col-span-3 uppercase font-medium">
                                Email
                            </div>

                            {/*  Status  */}
                            <div className="col-span-1 uppercase font-medium">
                                Status
                            </div>

                            {/*  Actions  */}
                            <div className="col-span-2 uppercase font-medium text-center">
                                Action
                            </div>
                        </div>

                        {/*  Loading  */}
                        {/*{usersLoading && <div className="mt-20 flex justify-center p-6 text-lg">*/}
                        {/*    <Loader*/}
                        {/*        color={"#191919"}*/}
                        {/*        size={30}*/}
                        {/*    />*/}
                        {/*</div>}*/}

                        {/*  User Items  */}
                        <div>
                            {
                                usersData?.data?.users?.length > 0 && usersData?.data?.users?.map((user, index)=>(
                                    <div key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-white"} grid grid-cols-12 gap-4 w-full min-w-[1490px] p-4 rounded-t-lg items-center border-b border-gray-200`}>
                                        {/*  Serial Number  */}
                                        <div className="col-span-1 text-gray-600 font-medium">
                                            {limits * (page - 1) + index + 1}
                                        </div>

                                        {/*  Image  */}
                                        <div className="col-span-1 text-gray-600">
                                            <img src={user.image || ProfileImage} alt={user.name} className="border border-gray-300 w-12 h-12 rounded-full object-cover object-center"/>
                                        </div>

                                        {/*  Name  */}
                                        <div className="col-span-3 text-gray-600">
                                            {user.name} {userInfo?.id === user?._id?.toString() && <span className="bg-green-100 text-sm py-1 px-3 rounded-full text-green-600 font-medium">You</span>}
                                        </div>

                                        {/*  Role  */}
                                        <div className="col-span-1 text-gray-600">
                                            {user.role}
                                        </div>

                                        {/*  Email  */}
                                        <div className="col-span-3 text-gray-600">
                                            {user.email}
                                        </div>

                                        {/*  Status  */}
                                        <div className={`${user.isVerified === true ? "bg-green-100 text-green-700 px-4 py-1 rounded-full w-max" : "bg-red-100 text-red-700 px-4 py-1 rounded-full w-max" } col-span-1 text-gray-600 text-sm capitalize`}>
                                            {user.isVerified === true ? "Verified" : "Not Verified"}
                                        </div>

                                        {/*  Actions  */}
                                        <div className="col-span-2 text-gray-600 flex items-center justify-center gap-4">
                                            {/*  Edit  */}
                                            <div>
                                                {
                                                    userInfo?.id !== user?._id?.toString() ? (
                                                        <button onClick={()=>{
                                                            dispatch(handleSelectUserForEdit(user))
                                                            navigate("/dashboard/user/add")
                                                        }} className="h-9 w-9 bg-yellow-500 hover:bg-yellow-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                            <FiEdit3 />
                                                        </button>
                                                    ) : (
                                                        <Link to={"/dashboard/profile"} className="px-4 py-2 font-semibold bg-indigo-500 hover:bg-indigo-700 text-white rounded">Profile</Link>
                                                    )
                                                }
                                            </div>

                                            {/*  Delete  */}
                                            {userInfo?.id !== user?._id?.toString() && <button disabled={deleteLoading} onClick={()=>{
                                                dispatch(handleToggleDeleteWarningShow())
                                                dispatch(handleGetDeleteIdAndType({id: user._id.toString(), type: "user"}))
                                            }}
                                                className={`${deleteLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} h-9 w-9 bg-red-500 hover:bg-red-700 rounded-md flex items-center justify-center text-xl text-white`}>
                                                {deleteLoading ? <Loader color={"#fff"} size={20}/> : <RiDeleteBin6Line/>}
                                            </button>}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/*  Pagination  */}
                    <div className="flex items-center gap-6 justify-between mt-4">
                        {/*  Item Show Count  */}
                        <div>
                            {
                                start() === end() ? (
                                    <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                                        {start() || 0} / {usersData?.data?.usersCount || 0} Items
                                    </p>
                                ) : (
                                    <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                                        {start() || 0}–{end() || 0} / {usersData?.data?.usersCount || 0} Items
                                    </p>
                                )
                            }
                        </div>

                        {/*  Prev & Next Button  */}
                        <div className="flex items-center gap-4">
                            {/*  Prev Button  */}
                            <button onClick={handlePrev} className={`${page === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} h-9 w-9 bg-black rounded flex items-center justify-center text-2xl text-white`}>
                                <IoIosArrowBack />
                            </button>

                            {/*  Page Number  */}
                            <p className="font-semibold text-gray-600">{page}</p>

                            {/*  Next Button  */}
                            <button onClick={handleNext} className={`${usersData?.data?.usersCount <= limits || (limits * page) >= usersData?.data?.usersCount ? "cursor-not-allowed opacity-50" : "cursor-pointer"} h-9 w-9 bg-black rounded flex items-center justify-center text-2xl text-white`}>
                                <IoIosArrowForward />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users;