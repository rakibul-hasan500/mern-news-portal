"use client"
import SectionTitle from "@/components/common/SectionTitle";
import VerticalNewsCard from "@/components/news/VerticalNewsCard";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";

function NewsSectionOne(){

    // News Item State
    const [singleNewsItem, setSingleNewsItem] = useState({});
    const [newsItemsList, setNewsItemsList] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const internationalNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "international-news"))
            if(internationalNews.length > 0){
                setSingleNewsItem(internationalNews[0])
                setNewsItemsList(internationalNews.slice(1, 6))
            }
        }
    }, [newsData]);

    return(
        <section className="pb-6">
            {/*  Title  */}
            <SectionTitle title={"International News"} slug={"international-news"}/>

            {/*  News Items  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-[18px]">
                {/*  Single News Item  */}
                <VerticalNewsCard news={singleNewsItem}/>

                {/*  News List Items  */}
                <div className="flex flex-col gap-6">
                    {
                        newsItemsList?.map((news, index)=>(
                            <HorizontalNewsCard
                                key={index}
                                news={news}
                                categoryShow={false}
                                authorShow={false}
                                descShow={false}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default NewsSectionOne;