import {useEffect, useState} from "react";
import {AiFillCaretDown, AiOutlineClose} from "react-icons/ai";
import {IoIosArrowBack, IoIosArrowForward, IoMdEye} from "react-icons/io";
import {FiEdit3} from "react-icons/fi";
import {RiCheckDoubleFill, RiDeleteBin6Line, RiProgress1Line} from "react-icons/ri";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import {handleGetDeleteIdAndType, handleToggleDeleteWarningShow} from "../../redux/app/appSlice.js";
import Loader from "../../utils/Loader.jsx";
import {useAllNewsQuery, useUpdateNewsStatusMutation} from "../../redux/news/newsApi.js";
import {useAllCategoriesQuery} from "../../redux/category/categoryApi.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {IoCloseOutline} from "react-icons/io5";
import {Link} from "react-router";

function NewsContent(){

    const dispatch = useDispatch();
    const deleteLoading = useSelector((state)=>state.App.deleteLoading);
    const userInfo = useSelector((state)=>state.App.userInfo);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState({});
    const [selectedOption, setSelectedOption] = useState("");
    const [searchText, setSearchText] = useState("");
    const [limits, setLimits] = useState(10)
    const [page, setPage] = useState(1);

    // Category Selector
    const [categorySelectorOpen, setCategorySelectorOpen] = useState(false);
    // Status Selector
    const options = ["pending", "rejected", "published"];
    const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);
    // Limit Selector
    const [limitsSelectorOpen, setLimitsSelectorOpen] = useState(false);

    // Handle Clear Filter
    const handleClearFilter = ()=>{
        setSelectedCategory({})
        setSelectedOption("");
        setSearchText("")
        setLimits(10)
        setPage(1)
    }

    // Call Get Categories API
    const [categoryLimits, setCategoryLimits] = useState(10)
    const {data: categoriesData} = useAllCategoriesQuery({
        searchText: "",
        limits: categoryLimits,
        page: 1,
    })

    // Call All News API
    const {data: allNewsData, isLoading: allNewsLoading} = useAllNewsQuery({
        selectedCategory: selectedCategory?.id || "",
        selectedOption,
        searchText,
        limits,
        page
    })

    // Start
    const start = ()=>{
        return (page * limits) - limits + 1
    }

    // End
    const end = ()=>{
        return (page - 1) * limits + limits
    }

    // Prev Page
    const handlePrev = ()=>{
        if(page > 1){
            setPage(page - 1)
        }
    }

    // Next Page
    const handleNext = ()=>{
        if((page * limits) < allNewsData?.data?.allNewsCount){
            setPage(page + 1)
        }
    }

    // Page Reset On Limits Change
    useEffect(() => {
        setPage(1)
    }, [limits]);

    // Call Update News Status API
    const [updateNewsStatus, {isLoading: updateNewsStatusLoading}] = useUpdateNewsStatusMutation()

    // Handle Update News STatus
    const handleUpdateNewsStatus = async (id, status)=>{
        try{
            // Validate
            if(!id || !id.trim()){
                return responseHandler(false, "Invalid news ID.")
            }
            if(!status || !status.trim()){
                return responseHandler(false, "Status is required.")
            }
            const statusOptions = ["pending", "rejected", "published"];
            if(!statusOptions.includes(status)){
                return responseHandler(false, "Invalid status value.")
            }

            // Hit Update News Status API
            const response = await updateNewsStatus({id, status}).unwrap()

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="relative overflow-x-auto min-h-screen">
                {/*  News Filter  */}
                <div className="flex items-center gap-4 mb-6 mt-1 ml-[2px]">
                    {/*  News Category Selector  */}
                    <div className="relative flex flex-col min-w-[290px] w-[250px]">
                        {/*  Selected  */}
                        <div onClick={()=>setCategorySelectorOpen((open)=>!open)} className={`${categorySelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2 uppercase`}>
                            {!selectedCategory.name || selectedCategory?.name === "" ? "Select Category" : selectedCategory.name}
                            {categorySelectorOpen ? <AiOutlineClose/> : <AiFillCaretDown className="text-sm"/>}
                        </div>

                        {/*  Selector Options  */}
                        {categorySelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-gray-100 border border-gray-300 rounded-lg max-h-[440px] overflow-y-auto">
                            <button onClick={()=> {
                                setCategorySelectorOpen((open)=>!open);
                                setSelectedCategory({})
                            }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200">Select option</button>
                            {
                                categoriesData?.data?.categories?.map((category, index)=>(
                                    <button key={index} onClick={()=> {
                                        setCategorySelectorOpen((open)=>!open);
                                        setSelectedCategory({name: category.name, id: category._id.toString()})
                                    }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">{category.name}</button>
                                ))
                            }
                            {/*  Category Pagination  */}
                            <div>
                                {
                                    (categoryLimits === categoriesData?.data?.categoriesCount) ? (
                                        <button onClick={()=>setCategoryLimits(10)} className="text-indigo-400 font-semibold mt-1 cursor-pointer text-sm px-2 text-center w-full py-1">See Less</button>
                                    ) : (
                                        <button onClick={()=>setCategoryLimits(categoriesData?.data?.categoriesCount)} className="text-indigo-400 font-semibold mt-1 cursor-pointer text-sm px-2 text-center w-full py-1">See All</button>
                                    )
                                }
                            </div>
                        </div>}
                    </div>

                    {/*  News Status Selector  */}
                    <div className="relative flex flex-col min-w-[250px] w-[250px]">
                        {/*  Selected  */}
                        <div onClick={()=>setStatusSelectorOpen((open)=>!open)} className={`${statusSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2 uppercase`}>
                            {selectedOption === "" ? "Select Status" : selectedOption}
                            {statusSelectorOpen ? <AiOutlineClose/> : <AiFillCaretDown className="text-sm"/>}
                        </div>

                        {/*  Selector Options  */}
                        {statusSelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-gray-100 border border-gray-300 rounded-lg">
                            <button onClick={()=> {
                                setStatusSelectorOpen((open)=>!open);
                                setSelectedOption("")
                            }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200">Select option</button>
                            {
                                options.map((option, index)=>(
                                    <button key={index} onClick={()=> {
                                        setStatusSelectorOpen((open)=>!open);
                                        setSelectedOption(option)
                                    }} className="capitalize text-start p-2 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">{option}</button>
                                ))
                            }
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
                        {limitsSelectorOpen && <div className="absolute top-full left-0 mt-2 w-full flex flex-col bg-gray-100 border border-gray-300 rounded-lg">
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
                                setLimits(allNewsData?.data?.allNewsCount || 100)
                            }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">All</button>
                        </div>}
                    </div>

                    {/*  Clear Filter  */}
                    <button onClick={handleClearFilter} className="flex items-center justify-center gap-1 bg-red-500 px-6 py-2 text-white font-semibold rounded-md cursor-pointer uppercase">Clear</button>
                </div>

                {/*  News Item Header & News Items  */}
                <div>
                    {/*  News Items Header  */}
                    <div className="grid grid-cols-12 gap-2 w-full bg-gray-200 p-4 rounded-t-lg">
                        {/*  Serial Number  */}
                        <div className="col-span-1 uppercase font-medium">
                            NO
                        </div>

                        {/*  Title  */}
                        <div className="col-span-3 uppercase font-medium">
                            Title
                        </div>

                        {/*  Image  */}
                        <div className="col-span-1 uppercase font-medium">
                            IMAGE
                        </div>

                        {/*  Category  */}
                        <div className="col-span-2 uppercase font-medium">
                            Category
                        </div>

                        {/*  Date  */}
                        <div className="col-span-2 uppercase font-medium">
                            Date
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

                    {/*  News Items  */}
                    <div>
                        {
                            allNewsData?.data?.allNews?.map((news, index)=>(
                                <div key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-white"} grid grid-cols-12 gap-4 w-full min-w-[1490px] p-4 rounded-t-lg items-center border-b border-gray-200`}>
                                    {/*  Serial Number  */}
                                    <div className="col-span-1 text-gray-600 font-medium">
                                        {(page - 1) * limits + index + 1}
                                    </div>

                                    {/*  Title  */}
                                    <div className="col-span-3 text-gray-600">
                                        {news.title}
                                    </div>

                                    {/*  Image  */}
                                    <div className="col-span-1 text-gray-600">
                                        <img src={news.featuredImage} alt={news.title} className="w-18 h-12 rounded object-cover object-center border border-gray-400"/>
                                    </div>

                                    {/*  Category  */}
                                    <div className="col-span-2 text-gray-600 flex flex-wrap gap-x-4 gap-y-4">
                                        {news?.categories?.map((category, index)=>(
                                            <span key={index} className="bg-gray-100 px-2 rounded-full shadow text-sm uppercase">{category?.name}</span>
                                        ))}
                                    </div>

                                    {/*  Date  */}
                                    <div className="col-span-2 text-gray-600">
                                        {new Date(news.createdAt).toLocaleDateString("en-us", {
                                            timeZone: "Asia/Dhaka",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>

                                    {/*  Status  */}
                                    <div className={`${news.status === "published" ? "bg-green-100 text-green-700 px-4 py-1 rounded-full w-max" : news.status === "pending" ? "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full w-max" : "bg-red-100 text-red-700 px-4 py-1 rounded-full w-max" } col-span-1 text-gray-600 text-sm capitalize`}>
                                        {news.status}
                                    </div>

                                    {/*  Actions  */}
                                    <div className="col-span-2">
                                        {/*  Preview, Edit, Delete  */}
                                        <div className="relative col-span-2 text-gray-600 flex items-center justify-center gap-4">
                                            {/*  Preview  */}
                                            <Link to={`/dashboard/news/${news?.slug}`} className="h-9 w-9 bg-indigo-500 hover:bg-indigo-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                <IoMdEye />
                                            </Link>

                                            {/*  Edit  */}
                                            <Link to={`/dashboard/news/edit/${news?.slug}`} className="h-9 w-9 bg-yellow-500 hover:bg-yellow-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                <FiEdit3 />
                                            </Link>

                                            {/*  Delete  */}
                                            {userInfo?.role !== "editor" && <button onClick={()=>{
                                                dispatch(handleToggleDeleteWarningShow())
                                                dispatch(handleGetDeleteIdAndType({
                                                    id: news?._id?.toString(), type: "news"
                                                }))
                                            }} className="h-9 w-9 bg-red-500 hover:bg-red-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                {deleteLoading ? <Loader color={"#fff"} size={20}/> : <RiDeleteBin6Line/>}
                                            </button>}
                                        </div>

                                        {/*  Publish, Pending, Reject  */}
                                        <div className={`${updateNewsStatusLoading && "opacity-50 pointer-events-none"} relative col-span-2 text-gray-600 flex items-center justify-center gap-4 hidden`}>
                                            {/*  Publish  */}
                                            <button onClick={()=>handleUpdateNewsStatus(news?._id?.toString(), 'published')} className="h-9 w-9 bg-green-600 hover:bg-green-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                <RiCheckDoubleFill />
                                            </button>

                                            {/*  Pending  */}
                                            <button onClick={()=>handleUpdateNewsStatus(news?._id?.toString(), 'pending')} className="h-9 w-9 bg-yellow-500 hover:bg-yellow-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                <RiProgress1Line />
                                            </button>

                                            {/*  Reject  */}
                                            <button onClick={()=>handleUpdateNewsStatus(news?._id?.toString(), 'rejected')} className="h-9 w-9 bg-red-500 hover:bg-red-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                <IoCloseOutline />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/*  Pagination  */}
                    <div className="flex items-center gap-6 justify-between mt-4">
                        {/*  Item Show Count  */}
                        <div>
                            {
                                start() === end() ? (
                                    <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                                        {start() || 0} / {categoriesData?.data?.categoriesCount || 0} Items
                                    </p>
                                ) : (
                                    <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                                        {start() || 0}–{end()} / {allNewsData?.data?.allNewsCount || 0} Items
                                    </p>
                                )
                            }
                        </div>

                        {/*  Prev & Next Button  */}
                        <div className="flex items-center gap-4">
                            {/*  Prev Button  */}
                            <button onClick={handlePrev} className={`${page > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"} h-9 w-9 bg-black rounded flex items-center justify-center text-2xl text-white`}>
                                <IoIosArrowBack />
                            </button>

                            {/*  Page Number  */}
                            <p className="font-semibold text-gray-600">{page}</p>

                            {/*  Next Button  */}
                            <button onClick={handleNext} className={`${(page * limits) < allNewsData?.data?.allNewsCount ? "cursor-pointer" : "cursor-not-allowed opacity-50"} h-9 w-9 bg-black rounded flex items-center justify-center text-2xl text-white`}>
                                <IoIosArrowForward />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsContent;