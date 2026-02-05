import {Link, NavLink, useLocation, useNavigate} from "react-router";
import demoLogo from "../../assets/images/272 x 90.jpg"
import {BiNews} from "react-icons/bi";
import {FiSettings, FiUsers} from "react-icons/fi";
import {FaRegUserCircle} from "react-icons/fa";
import {LuLayoutDashboard} from "react-icons/lu";
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import {RiLogoutBoxRLine} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {MdOutlineCategory, MdOutlinePostAdd} from "react-icons/md";
import {useLogoutMutation} from "../../redux/auth/authApi.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {handleGetUserData} from "../../redux/app/appSlice.js";
import {TbCategoryPlus} from "react-icons/tb";
import {LiaCommentSolid} from "react-icons/lia";
import {handleSelectUserForEdit} from "../../redux/auth/authSlice.js";
import Loader from "../../utils/Loader.jsx";
import {useState} from "react";
import {useGetSettingsDataQuery} from "../../redux/settings/settingsApi.js";

function Sidebar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const {pathname} = useLocation()

    // User Data
    const userInfo = useSelector((state)=>state.App.userInfo)

    // Call Get Settings Data API
    const {data: settingsData} = useGetSettingsDataQuery()

    // Call User Log Out API
    const [logout, {isLoading: logoutLoading}] = useLogoutMutation()

    // Handle Logout User
    const handleLogout = async ()=>{
        try{
            // Hit Logout User API
            await logout()

            // Clear User Data From Redux
            dispatch(handleGetUserData(null))

            // Clear Selected User To Edit
            dispatch(handleSelectUserForEdit(null))

            // Hide Logout Warning Modal
            setShowLogoutModal(false);

            return navigate('/', {replace: true})
        }catch(error){
            console.error("Error: ", error)
            return responseHandler(error?.data?.message)
        }
    }

  return (
    <div className="px-4 w-[300px] h-screen fixed left-0 bg-[#f1f1fb] flex flex-col gap-4">
        {/*  Top Logo  */}
        <div className="flex items-center justify-center h-[70px] p-4 mt-6">
            <Link to={"/"}>
                <img src={settingsData?.data?.logo?.url || demoLogo} alt={"news-portal-logo"} className="w-[190px] object-center object-cover rounded-md"/>
            </Link>
        </div>

        {/*  Nav Links  */}
        <ul className="flex flex-col gap-y-4 font-medium mt-4">
            {/*  Dashboard  */}
            <li>
                {
                    userInfo && userInfo?.role === "admin" ? (
                        <NavLink to="/dashboard/admin" className={`${(pathname === "/dashboard/admin" || pathname === "/dashboard/writer") ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                            <LuLayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                    ) : userInfo?.role === "editor" ? (
                        <NavLink to="/dashboard/editor" className={`${(pathname === "/dashboard/admin" || pathname === "/dashboard/editor") ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                            <LuLayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>) : (
                        <NavLink to="/dashboard/writer"  className={`${(pathname === "/dashboard/admin" || pathname === "/dashboard/writer") ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                            <LuLayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                    )
                }
            </li>

            {/*  All News  */}
            <li>
                <NavLink to="/dashboard/news" className={`${pathname === "/dashboard/news" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <BiNews />
                    <span>News</span>
                </NavLink>
            </li>

            {/*  Add News  */}
            {userInfo && (userInfo?.role === "admin" || userInfo?.role === "writer") && <li>
                <NavLink to="/dashboard/news/create" className={`${pathname === "/dashboard/news/create" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-1 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <MdOutlinePostAdd className="text-[22px]"/>
                    <span>Add News</span>
                </NavLink>
            </li>}

            {/*  Categories  */}
            {userInfo && (userInfo?.role === "admin") && <li>
                <NavLink to="/dashboard/categories" className={`${pathname === "/dashboard/categories" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <MdOutlineCategory className="text-lg"/>
                    <span>Categories</span>
                </NavLink>
            </li>}

            {/*  Add Category  */}
            {userInfo && userInfo?.role === "admin" && <li>
                <NavLink to="/dashboard/category/add" className={`${pathname === "/dashboard/category/add" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-1 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <TbCategoryPlus className="text-[20px]"/>
                    <span>Add Category</span>
                </NavLink>
            </li>}

            {/*  Comments  */}
            {userInfo && (userInfo?.role === "admin" || userInfo?.role === "writer") && <li>
                <NavLink to="/dashboard/comments" className={`${pathname === "/dashboard/comments" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-1 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <LiaCommentSolid className="text-[20px]"/>
                    <span>Comments</span>
                </NavLink>
            </li>}

            {/*  Users  */}
            {userInfo && userInfo?.role === "admin" && <li>
                <NavLink to="/dashboard/users" className={`${pathname === "/dashboard/users" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <FiUsers />
                    <span>Users</span>
                </NavLink>
            </li>}

            {/*  Add User  */}
            {userInfo && userInfo?.role === "admin" && <li>
                <NavLink to="/dashboard/user/add" className={`${pathname === "/dashboard/user/add" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-1 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <AiOutlineUsergroupAdd className="text-[22px]"/>
                    <span>Add User</span>
                </NavLink>
            </li>}

            {/*  Profile  */}
            <li>
                <NavLink to="/dashboard/profile" className={`${pathname === "/dashboard/profile" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <FaRegUserCircle />
                    <span>Profile</span>
                </NavLink>
            </li>

            {/*  Settings  */}
            {userInfo && userInfo?.role === "admin" && <li>
                <NavLink to="/dashboard/settings" className={`${pathname === "/dashboard/settings" ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-start gap-2 w-full rounded-lg px-4 py-[10px] text-[18px]`}>
                    <FiSettings />
                    <span>Settings</span>
                </NavLink>
            </li>}
        </ul>

        {/*  Log Out Warning  */}
        {showLogoutModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-5000">
                <div className="bg-white rounded-xl p-6 w-[320px] text-center shadow-lg">
                    <h2 className="text-xl font-semibold mb-2">Confirm Logout</h2>
                    <p className="text-gray-600 mb-5">Are you sure you want to logout?</p>

                    <div className="flex justify-center gap-4">
                        <button onClick={()=>setShowLogoutModal(false)} className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>

                        <button onClick={handleLogout} disabled={logoutLoading} className={`${logoutLoading && "opacity-50"} px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600`}>{logoutLoading ? <Loader color={"#fff"} size={20}/> : "Logout"}</button>
                    </div>
                </div>
            </div>
        )}

        {/*  Log Out Button  */}
        <button onClick={()=>setShowLogoutModal((show)=>!show)} className={`${logoutLoading && "opacity-50"} absolute bottom-8 left-4 w-[calc(100%-32px)] bg-indigo-500 text-white hover:shadow-lg hover:shadow-gray-500/10 flex items-center justify-center gap-2 rounded-lg px-4 py-[10px] text-[18px] font-semibold cursor-pointer`}>
            <RiLogoutBoxRLine />
            <span>Logout</span>
        </button>
    </div>
  )
}

export default Sidebar