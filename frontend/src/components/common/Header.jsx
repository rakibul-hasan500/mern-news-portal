"use client"
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Link from "next/link";
import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import {IoMdClose} from "react-icons/io";
import {FaBars, FaFacebookF, FaInstagram, FaPinterest, FaYoutube} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import bannerAdsImg from "../../assets/images/728 x 90.jpg"
import demoLogo from "../../assets/images/272 x 90.jpg"
import Image from "next/image";
import {RiUser3Line} from "react-icons/ri";
import {useRouter} from "next/navigation";
import ProfileCard from "@/components/profile/ProfileCard";
import {useLogoutUserMutation} from "@/redux/auth/authApi";
import {IoAlertSharp} from "react-icons/io5";
import Loader from "@/utils/Loader";

function Header(){

    // Get CurrentUserData From Redux
    const currentUserData = useSelector((state)=>state.User.currentUserData);

    // Get Settings Data From Redux
    const settingsData = useSelector((state)=>state.Settings.settingsData);

    // Pages Link
    const pages = [
        {name: "Home", link:"/"},
        {name: "Blog", link:"/blog"},
        // {name: "About", link:"/about"},
        // {name: "Contact", link:"/contact"},
    ]

    // Search Bar Open
    const [searchBarOpen, setSearchBarOpen] = useState(false);

    // Logout Warning Open
    const [logoutWarningOpen, setLogoutWarningOpen] = useState(false);

    // Mobile Nav Bar Open
    const [mobileNavBarOpen, setMobileNavBarOpen] = useState(false);

    // Category State
    const [allCategories, setAllCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState([]);
    // Categories From Redux
    const categoryData = useSelector((state)=>state.Category.categoryData);
    useEffect(()=>{
        if(categoryData && categoryData?.data?.categories.length > 0){
            setCategoryItems(categoryData?.data?.categories?.slice(0, 4));
            setAllCategories(categoryData?.data?.categories);
        }
    },[categoryData]);

    // Page & Category Links Show States
    const [activeTab, setActiveTab] = useState(1);

    // Router
    const router = useRouter()
    // Search State
    const [searchText, setSearchText] = useState("");
    // Handle Search
    const handleSearch = ()=>{
        if(!searchText?.trim()) return;
        router.push(`/search?query=${encodeURIComponent(searchText)}`)
        setSearchText("")
        setSearchBarOpen(false)
    }

    // Call Logout User API
    const [logoutUser, {isLoading: logoutUserLoading}] = useLogoutUserMutation()

    // Handle Lohout
    const handleLogout = async ()=>{
        try{
            // Hit Logout User API
            const response = await logoutUser().unwrap();

            // Close Logout Warning
            setLogoutWarningOpen(false);

            // Navigate To Login Page
            router.push("/login");

            return responseHandler(true, response?.message)
        }catch(error){
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <header className="relative">
            {/*  Banner  */}
            <div className="bg-white flex lg:hidden items-center justify-center gap-4 w-full p-4">
                <a href={settingsData?.bannerAd?.link || "#"} target="_blank" className="relative">
                    <Image
                        src={settingsData?.bannerAd?.url || bannerAdsImg}
                        alt="Banner Ads Image"
                        width={728}
                        height={90}
                        loading={"eager"}
                        className="object-cover object-center"
                    />
                </a>
            </div>

            {/*  Top Bar  */}
            <div className="bg-gray-100 px-4 lg:px-12 py-2 flex items-center justify-center sm:justify-between border-b border-gray-300">
                {/*  Date  */}
                <p className="hidden sm:block text-[11px] font-bold">{new Date().toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</p>

                {/*  Pages  */}
                <div className="hidden sm:flex items-center gap-4">
                    {
                        pages?.map((page, index)=>(
                            <Link key={index} href={page?.link} className="text-[11px] font-bold">{page?.name}</Link>
                        ))
                    }
                </div>

                {/*  Social Icons  */}
                <div className="flex items-center gap-4">
                    <a href={settingsData?.socialLinks?.facebook || "#"} target={"_blank"} className="text-[12px]"><FaFacebookF/></a>
                    <a href={settingsData?.socialLinks?.instagram || "#"} target={"_blank"} className="text-[12px]"><FaInstagram/></a>
                    <a href={settingsData?.socialLinks?.x || "#"} target={"_blank"} className="text-[12px]"><FaXTwitter/></a>
                    <a href={settingsData?.socialLinks?.pinterest || "#"} target={"_blank"} className="text-[12px]"><FaPinterest/></a>
                    <a href={settingsData?.socialLinks?.youtube || "#"} target={"_blank"} className="text-[12px]"><FaYoutube/></a>
                </div>
            </div>

            {/*  Logo & Banner  */}
            <div className="bg-white px-4 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-4 py-4">
                {/* Logo */}
                <Link href="/public" className="relative">
                    <Image
                        src={settingsData?.logo?.url || demoLogo}
                        alt={settingsData?.logo?.altTag || "Website Logo"}
                        width={272}
                        height={90}
                        className="object-cover object-center"
                    />
                </Link>

                {/* Banner Ads */}
                <div className="hidden lg:flex">
                    <a href={settingsData?.bannerAd?.link || "#"} rel={"noopener noreferrer"} target="_blank" className="relative">
                        <Image
                            src={settingsData?.bannerAd?.url || bannerAdsImg}
                            alt="Banner Ads Image"
                            width={728}
                            height={90}
                            className="object-cover object-center"
                        />
                    </a>
                </div>
            </div>

            {/*  Nav Bar  */}
            <div className="bg-black px-4 lg:px-12 py-[13px] flex items-center justify-between border-b-3 border-red-600">
                {/*  Hamburger & Links  */}
                <div className="flex items-center gap-6">
                    {/*  Hamburger  */}
                    <button onClick={()=>setMobileNavBarOpen((open)=>!open)} className="text-gray-200 hover:text-white text-xl cursor-pointer transition duration-200 h-9 w-9 bg-white/20 flex items-center justify-center">
                        <FaBars />
                    </button>

                    {/*  Links  */}
                    <div className="hidden md:flex items-center gap-6">
                        {/*  Home Page Url  */}
                        <Link href={`/`} className="text-gray-200 text-[13px] font-semibold hover:text-white transition duration-200">Home</Link>

                        {/*  Categories  */}
                        {
                            categoryItems?.map((category, index)=>(
                                <Link href={`/category/${category?.slug}`} key={index} className="text-gray-200 text-[13px] font-semibold hover:text-white transition duration-200">{category?.name}</Link>
                            ))
                        }
                    </div>
                </div>

                {/*  Search & User  */}
                <div className="flex items-center gap-4">
                    {/*  Search Icon  */}
                    <button onClick={()=>setSearchBarOpen((open)=>!open)} className="text-gray-200 hover:text-white transition duration-200 cursor-pointer h-9 w-9 bg-white/20 flex items-center justify-center rounded-full text-[17px]">
                        {searchBarOpen ? <IoMdClose /> : <HiMiniMagnifyingGlass/>}
                    </button>

                    {/*  User Icon  */}
                    <div>
                        {
                            currentUserData ? (
                                <div className="group">
                                    <div className="text-gray-200 hover:text-white transition duration-200 cursor-pointer h-9 w-9 flex items-center justify-center rounded-full bg-white/20">
                                        <RiUser3Line />
                                    </div>

                                    <ProfileCard
                                        currentUserData={currentUserData}
                                        setLogoutWarningOpen={setLogoutWarningOpen}
                                    />
                                </div>

                            ) : (
                                <Link href={"/login"} className="text-gray-200 hover:text-white transition duration-200 cursor-pointer h-9 w-9 flex items-center justify-center rounded-full bg-white/20">
                                    <RiUser3Line />
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>

            {/*  Mobile Nav Bar  */}
            <div>
                {/*  Overlay  */}
                {mobileNavBarOpen && <div onClick={()=>setMobileNavBarOpen((open)=>!open)} className="bg-black/40 fixed top-0 left-0 h-screen w-screen z-[12]"></div>}

                {/*  Menu Items Bar  */}
                <div className={`${mobileNavBarOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 h-screen w-screen sm:w-[400px] bg-white p-4 transition-all duration-200 z-[15] overflow-y-auto sidebar-scroll pb-20`}>
                    {/*  Top Bar  */}
                    <div className="flex items-center justify-between gap-4 border-b-2 border-gray-300 pb-2">
                        <p className="text-lg uppercase font-bold">Menu</p>
                        <IoMdClose onClick={()=>setMobileNavBarOpen((open)=>!open)} className="text-xl cursor-pointer"/>
                    </div>

                    {/*  Tab Bar  */}
                    <div className="grid grid-cols-2 divide-x divide-gray-300 mt-5">
                        {/*  Pages Button  */}
                        <button onClick={()=>setActiveTab(1)} className={`${activeTab === 1 ? "bg-red-500" : "bg-gray-600"} mb-4 text-gray-200 px-3 py-3 cursor-pointer text-sm font-bold uppercase tracking-wider text-center flex items-center justify-center`}>Pages</button>

                        {/*  Categories Button  */}
                        <button onClick={()=>setActiveTab(2)} className={`${activeTab === 2 ? "bg-red-500" : "bg-gray-600"} mb-4 flex items-center justify-center bg-gray-600 text-gray-200 px-3 py-3 cursor-pointer text-sm font-bold uppercase tracking-wider text-center`}>Categories</button>
                    </div>

                    {/* Pages */}
                    {activeTab === 1 && <div className="flex flex-col gap-3">
                        {
                            pages?.map((page, index)=>(
                                <Link href={page?.link} onClick={()=>setMobileNavBarOpen((open)=>!open)} key={index} className="flex items-center justify-between px-4 py-1 rounded-lg text-gray-800 font-medium transition group">
                                    <span className="group-hover:text-red-600 transition">{page?.name}</span>
                                    <span className="text-gray-400 group-hover:text-red-600 transition">→</span>
                                </Link>
                            ))
                        }
                    </div>}

                    {/*  Categories  */}
                    {activeTab === 2 && <div className="flex flex-col gap-3">
                        {
                            allCategories?.map((category, index)=>(
                                <Link href={`/category/${category?.slug}`} onClick={()=>setMobileNavBarOpen((open)=>!open)} key={index} className="flex items-center justify-between px-4 py-1 rounded-lg text-gray-800 font-medium transition group">
                                    <span className="group-hover:text-red-600 transition">{category?.name}</span>
                                    <span className="text-gray-400 group-hover:text-red-600 transition">→</span>
                                </Link>
                            ))
                        }
                    </div>}
                </div>
            </div>

            {/*  Search Input  */}
            {searchBarOpen && <div className="fixed right-0 sm:right-0 top-0 p-4 w-screen h-screen flex flex-col items-center justify-center z-[10] shadow-lg bg-black/90">
                {/*  Search Input & Search Button  */}
                <div className="w-[calc(100%-60px)] max-w-[510px]">
                    {/*  Search Input  */}
                    <input type="text" placeholder="Search" value={searchText} onChange={(e)=>setSearchText(e.target.value)} className="w-full p-2 outline-none border-b border-gray-300 text-white bg-white/20"/>

                    {/*  Search Button  */}
                    <button onClick={handleSearch} className="bg-red-600 text-white hover:bg-red-700 transition duration-200 w-full py-[11px] rounded-r flex items-center justify-center cursor-pointer mt-2 text-[13px] font-bold">SEARCH</button>
                </div>

                {/*  Close Button  */}
                <button onClick={()=> {
                    setSearchBarOpen((open) => !open)
                    setSearchText("")
                }} className="h-9 w-9 bg-white/80 rounded-full flex items-center justify-center cursor-pointer text-red-600 z-[11] border border-red-100 mt-10">
                    <IoMdClose />
                </button>
            </div>}

            {/*  Logout Warning  */}
            {logoutWarningOpen && <div className="fixed top-0 left-0 h-screen w-screen bg-black/60 z-[11] flex items-center justify-center">
                <div className="w-[calc(100vw-20%)] sm:w-[400px] bg-white rounded-lg shadow-2xl p-6 flex flex-col items-center border-2 border-red-600">
                    {/*  Icon & Title  */}
                    <div className="flex items-center gap-2 mb-2">
                        {/* Alert Icon */}
                        <div className="bg-red-100 text-red-600 rounded-full p-[6px] text-xl">
                            <IoAlertSharp />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-red-600">Logout</h2>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-center mb-6">Are you sure you want to logout?</p>

                    {/* Buttons */}
                    <div className="flex gap-4 w-full">
                        {/* Cancel Button */}
                        <button onClick={()=>setLogoutWarningOpen(false)} className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition">Cancel</button>

                        {/* Logout Button */}
                        <button onClick={handleLogout} disabled={logoutUserLoading} className={`${logoutUserLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium transition`}>
                            {logoutUserLoading ? <Loader/> : "Logout"}
                        </button>
                    </div>
                </div>
            </div>}
        </header>
    )
}

export default Header;