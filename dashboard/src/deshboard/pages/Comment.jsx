import { FaMagnifyingGlass } from "react-icons/fa6";
import { AiFillCaretDown, AiOutlineClose } from "react-icons/ai";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useEffect, useState} from "react";
import {useGetAllCommentsQuery} from "../../redux/comment/commentApi.js";
import CommentCard from "../components/CommentCard.jsx";

function Comment() {

    // Filter States
    const [selectedOption, setSelectedOption] = useState("");
    const [searchText, setSearchText] = useState("");
    const [limits, setLimits] = useState(10);
    const [page, setPage] = useState(1);

    // Status Selector
    const [limitsSelectorOpen, setLimitsSelectorOpen] = useState(false);
    const options = ["pending", "rejected", "published"];
    const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);
    useEffect(() => {
        setPage(1);
    }, [limits]);

    // Handle Clear Filter
    const handleClearFilter = ()=>{
        setSelectedOption("");
        setSearchText("")
        setLimits(10)
        setPage(1)
    }

    // Call get All Comments API
    const {data: allCommentsData} = useGetAllCommentsQuery({
        status: selectedOption,
        search: searchText
    })

    // Prev
    const handlePrev = ()=>{
        if(page > 1){
            setPage(page - 1)
        }
    };
    // Next
    const handleNext = ()=>{
        if(page * limits < allCommentsData?.data?.commentsCount){
            setPage(page + 1)
        }
    };


    // Pagination helpers
    const start = ()=>{
        return (page - 1) * limits + 1;
    }
    const end = ()=>{
        return Math.min(page * limits)
    }

    
    return (
        <div className="bg-white rounded-md min-h-screen">
            {/* Section Header */}
            <div className="flex justify-between p-4">
                <h2 className="text-xl font-semibold">Comments</h2>
            </div>

            {/* Filter & Comment Item Header & Comment Items & Pagination */}
            <div className="bg-gray-50 p-6">
                {/*  Filter  */}
                <div className="flex items-center gap-4 mb-6">
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
                        <input value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder="Search by name" className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none p-2 rounded-md placeholder:uppercase"/>
                        <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2"/>
                    </div>

                    {/*  News Limits  */}
                    <div className="relative min-w-[250px] w-[250px]">
                        {/*  Selected  */}
                        <div onClick={()=>setLimitsSelectorOpen((open)=>!open)} className={`${limitsSelectorOpen && "ring-2 ring-indigo-400"} border border-gray-300 px-3 py-2 rounded-md flex items-center justify-between gap-2`}>
                            <div className="flex items-center gap-2 uppercase">
                                Comment per page:
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
                                setLimits(allCommentsData?.data?.commentsCount)
                            }} className="capitalize text-start py-2 px-4 text-sm cursor-pointer hover:bg-gray-200 border-t border-gray-200">All</button>
                        </div>}
                    </div>

                    {/*  Clear Filter  */}
                    <button onClick={handleClearFilter} className="flex items-center justify-center gap-1 bg-red-500 px-6 py-2 text-white font-semibold rounded-md cursor-pointer uppercase">Clear</button>
                </div>

                {/* Comment Table Header */}
                <div className="grid grid-cols-12 gap-6 w-full bg-gray-200 p-4 rounded-t-lg font-bold">
                    <div className="uppercase col-span-1">No</div>
                    <div className="uppercase col-span-2">User</div>
                    <div className="uppercase col-span-3">Comment</div>
                    <div className="uppercase col-span-3">Post</div>
                    <div className="uppercase col-span-2">Status</div>
                    <div className="uppercase text-center col-span-1">POST</div>
                </div>

                {/* Comment Items */}
                {allCommentsData?.data?.comments?.slice(start()-1, end())?.map((comment, index)=>(
                    <CommentCard
                        key={index}
                        index={index}
                        page={page}
                        limits={limits}
                        comment={comment}
                    />
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    {/*  Show Count  */}
                    <div>
                        <p className="text-sm text-gray-500 font-medium">
                            {
                                limits === allCommentsData?.data?.commentsCount
                                    ? `${limits} / ${allCommentsData?.data?.commentsCount}`
                                    : limits > allCommentsData?.data?.commentsCount
                                        ? `${allCommentsData?.data?.commentsCount} / ${allCommentsData?.data?.commentsCount}` : `${start() + "-" + end()} / ${allCommentsData?.data?.commentsCount}`
                            }
                        </p>
                    </div>

                    {/*  Next | Prev  */}
                    <div className="flex items-center gap-4">
                        <button onClick={handlePrev} disabled={page === 1} className={`h-9 w-9 bg-black text-white rounded flex items-center justify-center text-2xl ${page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                            <IoIosArrowBack />
                        </button>
                        <span className="font-semibold">{page}</span>
                        <button onClick={handleNext} disabled={page * limits >= allCommentsData?.data?.commentsCount} className={`h-9 w-9 bg-black text-white rounded flex items-center justify-center text-2xl ${page * limits >= allCommentsData?.data?.commentsCount ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                            <IoIosArrowForward />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
