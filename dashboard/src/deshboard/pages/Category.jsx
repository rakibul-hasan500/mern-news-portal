import {Link, useNavigate} from "react-router";
import {AiFillCaretDown, AiOutlineClose} from "react-icons/ai";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {
    useAllCategoriesQuery,
} from "../../redux/category/categoryApi.js";
import {useEffect, useState} from "react";
import {handleSelectCategoryForEdit} from "../../redux/category/categorySlice.js";
import {useDispatch, useSelector} from "react-redux";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FiEdit3} from "react-icons/fi";
import {
    handleGetDeleteIdAndType,
    handleToggleDeleteWarningShow
} from "../../redux/app/appSlice.js";
import Loader from "../../utils/Loader.jsx";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

function Category(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const deleteLoading = useSelector((state)=>state.App.deleteLoading);

    // Limit Selector
    const [limitsSelectorOpen, setLimitsSelectorOpen] = useState(false);

    // Category Filter States
    const [searchText, setSearchText] = useState("");
    const [limits, setLimits] = useState(10)
    const [page, setPage] = useState(1);

    // Handle Clear Filter
    const handleClearFilter = ()=>{
        setSearchText("");
        setLimits(10)
        setPage(1)
    }

    // Call Get All Categories API
    const {data: categoriesData, isLoading: categoriesLoading} = useAllCategoriesQuery({
        searchText,
        page,
        limits
    })

    // Handle Prev
    const handlePrev = ()=>{
        if(page >= 2){
            setPage(page - 1)
        }
    }

    // Handle Next
    const handleNext = ()=>{
        if(Math.ceil(categoriesData?.data?.categoriesCount / limits) > page){
            setPage(page + 1)
        }
    }

    // Start
    const start = ()=>{
        return (page - 1) * limits + 1
    }

    // End
    const end = ()=>{
        return page * limits
    }

    // Reset Page On Limit Change
    useEffect(()=>{
        setPage(1)
    }, [limits])

    return (
        <div className="bg-white rounded-md">
            {/*  Section Header  */}
            <div className="flex justify-between p-4">
                {/*  Title  */}
                <h2 className="text-xl font-semibold">Categories</h2>

                {/*  Writer Navigate  */}
                <Link to={"/dashboard/user/add"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">Add Category</Link>
            </div>

            {/*  Categories  */}
            <div className="bg-gray-50 min-h-screen p-6">
                <div className="overflow-x-auto min-h-screen">
                    {/*  Category Filter  */}
                    <div className="flex items-center gap-4 mb-6 mt-1 ml-[2px] relative">
                        {/*  Search Input  */}
                        <div className="relative w-[calc(100%-2px)]">
                            <input value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder="Search" className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none p-2 rounded-md placeholder:uppercase"/>
                            <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2"/>
                        </div>

                        {/*  Categories Limits  */}
                        <div className="relative min-w-[250px] w-[250px]">
                            {/*  Selected  */}
                            <div onClick={()=>setLimitsSelectorOpen((open)=>!open)} className={`${limitsSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2`}>
                                <div className="flex items-center gap-2 uppercase">
                                    Category per page:
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
                                    setLimits(categoriesData?.data?.categoriesCount || 0)
                                }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">All</button>
                            </div>}
                        </div>

                        {/*  Clear Filter  */}
                        <button onClick={handleClearFilter} className="flex items-center justify-center gap-1 bg-red-500 px-6 py-2 text-white font-semibold rounded-md cursor-pointer uppercase">Clear</button>
                    </div>

                    {/*  Category Item Header & User Items  */}
                    <div>
                        {/*  Category Items Header  */}
                        <div className="grid grid-cols-13 gap-2 w-full bg-gray-200 p-4 rounded-t-lg">
                            {/*  Serial Number  */}
                            <div className="col-span-1 uppercase font-medium">
                                NO
                            </div>

                            {/*  Name  */}
                            <div className="col-span-3 uppercase font-medium">
                                Name
                            </div>

                            {/*  Slug  */}
                            <div className="col-span-3 uppercase font-medium">
                                Slug
                            </div>

                            {/*  Description  */}
                            <div className="col-span-4 uppercase font-medium">
                                Description
                            </div>

                            {/*  Actions  */}
                            <div className="col-span-2 uppercase font-medium text-center">
                                Action
                            </div>
                        </div>

                        {/*  User Items  */}
                        <div>
                            {
                                categoriesData?.data?.categories?.length > 0 && categoriesData?.data?.categories?.map((category, index)=>(
                                    <div key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-white"} grid grid-cols-13 gap-4 w-full min-w-[1490px] p-4 rounded-t-lg items-center border-b border-gray-200`}>
                                        {/*  Serial Number  */}
                                        <div className="col-span-1 text-gray-600 font-medium">
                                            {limits * (page - 1) + index + 1}
                                        </div>

                                        {/*  Name  */}
                                        <div className="col-span-3 text-gray-600">
                                            {category?.name}
                                        </div>

                                        {/*  Slug  */}
                                        <div className="col-span-3 text-gray-600">
                                            {category?.slug}
                                        </div>

                                        {/*  Description  */}
                                        <div className="col-span-4 text-gray-600">
                                            {category?.description}
                                        </div>

                                        {/*  Actions  */}
                                        <div className="col-span-2 text-gray-600 flex items-center justify-center gap-4">
                                            {/*  Edit  */}
                                            <div>
                                                <button onClick={()=>{
                                                    dispatch(handleSelectCategoryForEdit(category))
                                                    navigate("/dashboard/category/add")
                                                }} className="h-9 w-9 bg-yellow-500 hover:bg-yellow-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                                    <FiEdit3 />
                                                </button>
                                            </div>

                                            {/*  Delete  */}
                                            <button disabled={deleteLoading} onClick={()=>{
                                                dispatch(handleToggleDeleteWarningShow())
                                                dispatch(handleGetDeleteIdAndType({id: category._id.toString(), type: "category"}))
                                            }} className={`${deleteLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} h-9 w-9 bg-red-500 hover:bg-red-700 rounded-md flex items-center justify-center text-xl text-white`}>
                                                {deleteLoading ? <Loader color={"#fff"} size={20}/> : <RiDeleteBin6Line/>}
                                            </button>
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
                                        {start() || 0} / {categoriesData?.data?.categoriesCount || 0} Items
                                    </p>
                                ) : (
                                    <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                                        {start() || 0}–{end() || 0} / {categoriesData?.data?.categoriesCount || 0} Items
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
                            <button onClick={handleNext} className={`${categoriesData?.data?.categoriesCount <= limits || (limits * page) >= categoriesData?.data?.categoriesCount ? "cursor-not-allowed opacity-50" : "cursor-pointer"} h-9 w-9 bg-black rounded flex items-center justify-center text-2xl text-white`}>
                                <IoIosArrowForward />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category;