"use client"
import SectionTitle from "@/components/common/SectionTitle";
import VerticalNewsCard from "@/components/news/VerticalNewsCard";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";
import Image from "next/image";
import Link from "next/link";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

function NewsSectionTwo(){

    // Pagination States
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(3);

    // News Item State
    const [newsItemsList, setNewsItemsList] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const entertainmentNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "entertainment"))
            if(entertainmentNews.length > 0){
                setNewsItemsList(entertainmentNews.slice(1, 4))
            }
        }
    }, [newsData]);

    // Get Pagination Data
    const newsItems = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "entertainment"))
    useEffect(()=>{
        if(newsItems?.length > 3){
            setNewsItemsList(newsItems.slice(startIndex, endIndex));
        }
    }, [startIndex, endIndex]);

    // Prev
    const prev = ()=>{
        if(startIndex > 0){
            setStartIndex(startIndex - 3);
            setEndIndex(endIndex - 3);
        }
    }

    // Next
    const next = ()=>{
        if(newsItems?.length - 1 > endIndex){
            setStartIndex(startIndex + 3);
            setEndIndex(endIndex + 3);
        }
    }

    return(
        <section className="py-6">
            {/*  Title  */}
            <SectionTitle title={"Entertainment"} slug={"entertainment"}/>

            {/*  News Items  */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[6px]">
                {
                    newsItemsList?.map((news, index)=>(
                        <Link href={`/news/${news?.slug}`} key={index} className="relative group h-[274px] w-full overflow-hidden">
                            {/*  Image  */}
                            {(news && news._id) && <Image
                                src={news?.featuredImage || ""}
                                alt={news?.title || ""}
                                fill={true}
                                loading="eager"
                                className="object-cover object-center group-hover:scale-[1.1] transition duration-[1s]"
                            />}

                            {/*  Data  */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 flex flex-col gap-2 items-center">
                                {/*  Category  */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {
                                        news?.categories?.map((category, index)=>(
                                            <span className={`${category?.name === "Breaking News" && "hidden"} uppercase text-white text-[11px] font-semibold`} key={index}>{category?.name}</span>
                                        ))
                                    }
                                </div>
                                {/*  Title  */}
                                <h2 className="text-white font-bold text-[14px] text-center">{news?.title}</h2>
                            </div>
                        </Link>
                    ))
                }
            </div>

            {/*  Pagination  */}
            <div className="mt-[25px] flex items-center gap-3">
                {/*  Prev  */}
                <button onClick={prev} className={`${startIndex === 0 && "opacity-50 cursor-not-allowed"} h-7 w-7 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center cursor-pointer hover:bg-red-600 hover:text-white transition duration-200`}>
                    <IoIosArrowBack />
                </button>

                {/*  Next  */}
                <button onClick={next} className={`${endIndex >= newsItems?.length-1 && "opacity-50 cursor-not-allowed"} h-7 w-7 rounded-md border border-gray-200 text-gray-400 flex items-center justify-center cursor-pointer hover:bg-red-600 hover:text-white transition duration-200`}>
                    <IoIosArrowForward />
                </button>
            </div>
        </section>
    )
}

export default NewsSectionTwo;