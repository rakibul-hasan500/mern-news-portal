"use client"
import SectionTitle from "@/components/common/SectionTitle";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import ResponsiveNewsCard from "@/components/news/ResponsiveNewsCard";

function NewsSectionFive(){

    // News Item State
    const [newsItemsList, setNewsItemsList] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const filteredNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "lifestyle"))
            if(filteredNews.length > 0){
                setNewsItemsList(filteredNews.slice(0, 4))
            }
        }
    }, [newsData]);

    return(
        <section className="pb-6">
            {/*  Title  */}
            <SectionTitle title={"Life Style"} slug={"lifestyle"}/>

            {/*  News Items  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {
                    newsItemsList?.map((news, index)=>(
                        <ResponsiveNewsCard
                            key={index}
                            news={news}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default NewsSectionFive;