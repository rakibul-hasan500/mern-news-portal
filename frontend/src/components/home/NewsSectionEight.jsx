"use client"
import SectionTitle from "@/components/common/SectionTitle";
import VerticalNewsCard from "@/components/news/VerticalNewsCard";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";

function NewsSectionEight(){

    // News Item State
    const [newsItemsList, setNewsItemsList] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const internationalNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "business-and-economy"))
            if(internationalNews.length > 0){
                setNewsItemsList(internationalNews.slice(1, 7))
            }
        }
    }, [newsData]);

    return(
        <section className="pb-6">
            {/*  Title  */}
            <SectionTitle title={"Business & Economy"} slug={"business-and-economy"}/>

            {/*  News Items  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {
                    newsItemsList?.map((news, index)=>(
                        <VerticalNewsCard
                            key={index}
                            news={news}
                        />
                    ))
                }
            </div>
        </section>
    )
}

export default NewsSectionEight;