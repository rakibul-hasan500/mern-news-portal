"use client"
import Link from "next/link";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import SideBarOne from "@/components/sideBar/SideBarOne";
import SideBarTwo from "@/components/sideBar/SideBarTwo";
import ResponsiveNewsCard from "@/components/news/ResponsiveNewsCard";
import {useState} from "react";
import {useGetAllNewsQuery} from "@/redux/news/newsApi";
import {useRouter, useSearchParams} from "next/navigation";
import {FiSearch} from "react-icons/fi";


function SearchPage(){

    // Get Search Text From Query
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    // Filter State
    const [limits, setLimits] = useState(10);
    const [page, setPage] = useState(1)

    // Call Get All News API
    const {data: newsItems} = useGetAllNewsQuery({
        search: query,
        category: "",
        limits,
        page
    })

    // Next Page
    const next = ()=>{
        if(newsItems?.data?.allNewsCount > page * limits){
            setPage(page + 1);
        }
    }

    // Prev Page
    const prev = ()=>{
        if(page > 1){
            setPage(page - 1);
        }
    }

    // Items Show Count
    const itemsShowCount = ()=>{
        const start = (page - 1) * limits + 1
        const end = page * limits;
        return start + "-" + end
    }

    // Search State
    const [searchText, setSearchText] = useState("");
    // Router
    const router = useRouter()
    // Handle Search
    const handleSearch = ()=>{
        if(!searchText?.trim()) return
        router.push(`/search?query=${encodeURIComponent(searchText)}`)
        setSearchText("");
    }

    return(
        <main className="bg-white px-4 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 min-h-screen pb-[60px]">
            {/*  Content  */}
            <div className="flex-1">
                {/*  Breadcrumb  */}
                <div className="flex items-center gap-2 py-7">
                    <Link href={"/"} className="text-[13px] text-gray-500 font-medium hover:text-red-600 transition duration-200">Home</Link>
                    <IoIosArrowForward className="text-[13px] text-gray-500"/>
                    <span className="text-[13px] text-gray-500 font-medium">Search</span>
                    {/*<IoIosArrowForward className="text-[13px] text-gray-500"/>*/}
                    {/*<span className="text-[13px] text-gray-500 font-medium">{query}</span>*/}
                </div>

                {/*  Search Bar  */}
                <div className="mt-1 rounded-lg flex items-center mb-7">
                    <input type="text" placeholder="search" value={searchText} onChange={(e)=>setSearchText(e.target.value)} className="outline-none bg-gray-100 p-2 flex-1 sm:w-[calc(100%-130px)] border border-gray-300"/>
                    <button onClick={handleSearch} className="font-semibold bg-red-600 px-6 sm:px-2 py-[10px] text-white sm:w-[130px] border border-red-600 hover:bg-red-700 transition duration-200 cursor-pointer text-sm">
                        <span className="hidden sm:block">SEARCH</span>
                        <FiSearch className="sm:hidden text-[19px]"/>
                    </button>
                </div>

                {/*  News Items  */}
                <div>
                    {/*  No News Found  */}
                    {newsItems?.data?.allNews?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <p className="text-2xl font-semibold text-gray-700">No results found</p>
                            <p className="mt-2 text-sm text-gray-500 max-w-md">
                                We couldn’t find any news matching{" "}
                                <span className="font-medium text-gray-700">“{query}”</span>.
                                Try a different keyword or check your spelling.
                            </p>
                        </div>
                    )}

                    {/*  Search Text  */}
                    {newsItems?.data?.allNews?.length !== 0 && <p className="text-xl font-semibold">Search results for <span className="text-red-600">“{query}”</span></p>}

                    {/*  Searched Items  */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 mt-3">
                        {
                            newsItems?.data?.allNews?.map((news, index)=>(
                                <ResponsiveNewsCard key={index} news={news}/>
                            ))
                        }
                    </div>
                </div>

                {/*  Pagination  */}
                <div className="mt-6 flex items-start justify-between gap-4">
                    {/*  Items Show Count  */}
                    <div>
                        <span className="text-sm font-light">{newsItems?.data?.allNewsCount <= limits ? newsItems?.data?.allNewsCount : itemsShowCount()} / {newsItems?.data?.allNewsCount || 0}</span>
                    </div>

                    {/*  Navigation  */}
                    <div className="flex items-center gap-4">
                        {/*  Prev  */}
                        <button onClick={prev} className={`${page < 2 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} bg-red-600 text-white h-8 w-8 flex items-center justify-center hover:bg-red-700 transition duration-200 text-lg`}><IoIosArrowBack /></button>

                        {/*  Page  */}
                        <span className="flex items-center justify-center">{page}</span>

                        {/*  Next  */}
                        <button onClick={next} className={`${newsItems?.data?.allNewsCount > page * limits ? "cursor-pointer" : "cursor-not-allowed opacity-50"} bg-red-600 text-white h-8 w-8 flex items-center justify-center hover:bg-red-700 transition duration-200 text-lg`}><IoIosArrowForward /></button>
                    </div>
                </div>
            </div>

            {/*  Sidebar  */}
            <div className="w-full lg:w-[324px] py-7 flex flex-col gap-8">
                <SideBarOne/>
            </div>
        </main>
    )
}

export default SearchPage;