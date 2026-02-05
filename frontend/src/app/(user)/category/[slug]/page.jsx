"use client"
import Link from "next/link";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import SideBarOne from "@/components/sideBar/SideBarOne";
import SideBarTwo from "@/components/sideBar/SideBarTwo";
import ResponsiveNewsCard from "@/components/news/ResponsiveNewsCard";
import {useState} from "react";
import {useGetAllNewsQuery} from "@/redux/news/newsApi";
import {useParams} from "next/navigation";
import {useGetSingleCategoryQuery} from "@/redux/category/categoryApi";


function BlogByCategoryPage(){

    // Get Slug
    const {slug} = useParams();

    // Filter State
    const [limits, setLimits] = useState(10);
    const [page, setPage] = useState(1)

    // Call Get Single Category
    const {data: singleCategoryData} = useGetSingleCategoryQuery({slug});

    // Call Get All News API
    const {data: newsItems} = useGetAllNewsQuery({
        category: singleCategoryData?.data?._id?.toString(),
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

    return(
        <main className="bg-white px-4 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 min-h-screen pb-[60px]">
            {/*  Content  */}
            <div className="flex-1">
                {/*  Breadcrumb  */}
                <div className="flex items-center gap-2 py-7">
                    <Link href={"/public"} className="text-[13px] text-gray-500 font-medium hover:text-red-600 transition duration-200">Home</Link>
                    <IoIosArrowForward className="text-[13px] text-gray-500"/>
                    <span className="text-[13px] text-gray-500 font-medium">Category</span>
                    <IoIosArrowForward className="text-[13px] text-gray-500"/>
                    <span className="text-[13px] text-gray-500 font-medium">{slug}</span>
                </div>

                {/*  News Items  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    {
                        newsItems?.data?.allNews?.map((news, index)=>(
                            <ResponsiveNewsCard key={index} news={news}/>
                        ))
                    }
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

export default BlogByCategoryPage;