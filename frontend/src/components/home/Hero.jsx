"use client"
import FeaturedNewsCard from "@/components/news/FeaturedNewsCard";
import {useEffect, useState} from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import {useSelector} from "react-redux";

function Hero(){

    // News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData)

    // News States
    const [singleNewsItem, setSingleNewsItem] = useState({});
    const [gridNewsItems, setGridNewsItems] = useState([]);
    const [breakingNewsItems, setBreakingNewsItems] = useState([]);

    // Set Data To STates
    useEffect(() => {
        if(newsData && newsData?.data?.allNews?.length > 0){
            setSingleNewsItem(newsData?.data?.allNews[0])
            if(newsData?.data?.allNews?.length > 1){
                setGridNewsItems(newsData?.data?.allNews?.slice(1, 5))
            }
            const breakingNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "breaking-news"))
            setBreakingNewsItems(breakingNews)
        }
    }, [newsData]);

    return(
        <section className="py-5">
            {/*  Animated News Headings  */}
            <div className="mb-4 flex items-center">
                <span className="uppercase text-xs font-semibold bg-red-600 px-4 py-2 text-white w-max min-w-max">Breaking News</span>

                {/*  Animated Titles  */}
                <Marquee pauseOnHover={true} pauseOnClick={true}>
                    {
                        breakingNewsItems?.map((news, index)=>(
                            <Link href={`/news/${news?.slug}`} className="mr-[200px] hover:text-red-600 font-light" key={index}>{news?.title}</Link>
                        ))
                    }
                </Marquee>
            </div>

            {/*  Grid News Items  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
                {/*  Big One Card  */}
                <FeaturedNewsCard
                    height={"445px"}
                    news={singleNewsItem}
                    titleFontSize={"24px"}
                />

                {/*  4 news Grid  */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
                    {
                        gridNewsItems?.length > 0 && gridNewsItems?.map((news, index)=>(
                            <FeaturedNewsCard
                                key={index}
                                height={"220px"}
                                titleFontSize={"16px"}
                                news={news}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Hero;