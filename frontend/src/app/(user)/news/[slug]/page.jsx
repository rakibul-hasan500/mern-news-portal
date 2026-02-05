import {IoIosArrowForward} from "react-icons/io";
import Link from "next/link";
import {baseUrl} from "@/utils/baseUrl";
import SideBarOne from "@/components/sideBar/SideBarOne";
import SideBarTwo from "@/components/sideBar/SideBarTwo";
import {FaRegClock, FaRegUser} from "react-icons/fa";
import {IoEyeSharp} from "react-icons/io5";
import Image from "next/image";
import SectionTitle from "@/components/common/SectionTitle";
import VerticalNewsCard from "@/components/news/VerticalNewsCard";
import SocialShare from "@/components/post/SocialShare";
import PostComment from "@/components/comment/PostComment";
import AllComments from "@/components/comment/AllComments";
import PostLike from "@/components/post/PostLike";

// Call Get Single News Details Data API
async function getSingleNewsDetailsData(slug) {
    let data
    const res = await fetch(`${baseUrl}/api/news/${slug}`, {cache: "no-store"});
    if(!res.ok){
        data = null
    }else{
        data = await res.json();
    }

    return data
}

// Set Meta Data
export async function generateMetadata({params}){

    // Get Post Slug From Params
    const {slug} = await params

    // Get Data
    const data = await getSingleNewsDetailsData(slug);

    return{
        title: data?.data?.title,
        description: data?.data?.metaDescription,
        keywords: data?.data?.keywords,
    }
}

// Recent News
async function getRecentNewsItems() {
    let data
    const res = await fetch(`${baseUrl}/api/news/all?limits=4`, {cache: "no-store"});
    if(!res.ok){
        data = null
    }else{
        data = await res.json();
    }

    return data
}


async function SingleNewsDetails({params}){

    // Get Post Slug From Params
    const {slug} = await params
    const newsDetails = await getSingleNewsDetailsData(slug);

    // Recent News Items
    const recentNewsItems = await getRecentNewsItems();

    return(
        <main className="bg-white px-4 lg:px-12 flex flex-col lg:flex-row justify-between gap-12 min-h-screen pb-[60px]">
            {/*  Content  */}
            <div className="flex-1">
                {/*  Breadcrumb  */}
                <div className="hidden sm:flex items-center gap-2 py-7">
                    <Link href={"/"} className="text-[13px] text-gray-500 font-medium hover:text-red-600 transition duration-200">Home</Link>
                    <IoIosArrowForward className="text-[13px] text-gray-500"/>
                    <span className="text-[13px] text-gray-500 font-medium">News</span>
                    <IoIosArrowForward className="text-[13px] text-gray-500"/>
                    <span className="text-[13px] text-gray-500 font-medium">{newsDetails?.data?.title}</span>
                </div>

                {/*  Categories  */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                    {
                        newsDetails?.data?.categories?.map((category, index)=>(
                            <Link href={`/category/${category?.slug}`} key={index} className={`${category?.slug === "breaking-news" && "hidden"} text-[13px] sm:text-[15px] uppercase hover:text-red-600 transition duration-200 font-medium`}>{category?.name}</Link>
                        ))
                    }
                </div>

                {/*  Title  */}
                <div className="mt-4">
                    <h1 className="text-[26px] sm:text-[32px] font-bold">{newsDetails?.data?.title}</h1>
                </div>

                {/*  Author, Data & View  */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    {/*  Author & Date  */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {/*  Author  */}
                        <span className="flex items-center gap-1 font-bold text-sm text-gray-700">
                            <FaRegUser />
                            {newsDetails?.data?.author?.name}
                        </span>

                        {/*  Date  */}
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FaRegClock />
                            {new Date(newsDetails?.data?.createdAt).toLocaleDateString("en-us", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    {/*  View Count  */}
                    <span className="flex items-center gap-1 font-bold text-sm text-gray-700">
                        <IoEyeSharp className="text-lg"/>
                        {newsDetails?.data?.viewCount}
                    </span>
                </div>

                {/*  Share To Social Media  */}
                <div className="mt-9">
                    <SocialShare mediaUrl={newsDetails?.data?.featuredImage}/>
                </div>

                {/*  Image -- Full Width  */}
                <div className="mt-6 relative h-[400] sm:h-[500px] w-full">
                    <Image
                        src={newsDetails?.data?.featuredImage}
                        alt={newsDetails?.data?.title || "News Featured Image"}
                        fill={true}
                        loading={"lazy"}
                        className="object-center object-cover"
                    />
                </div>

                {/*  Description  */}
                <div className="mt-[26px]">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: newsDetails?.data?.description
                        }}
                    />
                </div>

                {/*  Like & Dislike  */}
                <PostLike/>

                {/*  Recent News  */}
                <div className="mt-[120px]">
                    {/*  Section Title  */}
                    <SectionTitle title={"Recent News"}/>

                    {/*  News Items  */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {
                            recentNewsItems?.data?.allNews?.map((news, index)=>(
                                <VerticalNewsCard key={index} news={news}/>
                            ))
                        }
                    </div>
                </div>

                {/*  Comment  */}
                <PostComment postId={newsDetails?.data?._id?.toString()}/>

                {/*  All Comments  */}
                <AllComments postId={newsDetails?.data?._id?.toString()}/>
            </div>

            {/*  Sidebar  */}
            <div className="w-full lg:w-[324px] py-7 flex flex-col gap-8">
                <SideBarOne/>
                <SideBarTwo/>
            </div>
        </main>
    )
}

export default SingleNewsDetails;