"use client"
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Image from "next/image";
import FeaturedNewsCard from "@/components/news/FeaturedNewsCard";

function NewsSectionFour(){

    // News Items State
    const [newsItems, setNewsItems] = useState([]);

    // Get News Daata From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const filteredNewsItems = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "opinion"))
            setNewsItems(filteredNewsItems?.slice(0, 4));
        }
    },[newsData])

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[6px] py-6">
            {
                newsItems?.map((news, index)=>(
                    <FeaturedNewsCard
                        key={index}
                        news={news}
                        height={"315px"}
                    />
                ))
            }
        </div>
    )
}

export default NewsSectionFour;