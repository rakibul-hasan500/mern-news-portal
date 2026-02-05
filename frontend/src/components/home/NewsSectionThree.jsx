"use client"
import SectionTitle from "@/components/common/SectionTitle";
import VerticalNewsCard from "@/components/news/VerticalNewsCard";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";

function NewsSectionThree(){

    // News Item State
    const [singleNewsItem1st, setSingleNewsItem1st] = useState({});
    const [newsItemsList1st, setNewsItemsList1st] = useState([]);

    const [singleNewsItem2nd, setSingleNewsItem2nd] = useState({});
    const [newsItemsList2nd, setNewsItemsList2nd] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const sportsNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "sports"))
            if(sportsNews.length > 0){
                setSingleNewsItem1st(sportsNews[0])
                setNewsItemsList1st(sportsNews.slice(1, 3))
            }

            const educationNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "education"))
            if(sportsNews.length > 0){
                setSingleNewsItem2nd(educationNews[0])
                setNewsItemsList2nd(educationNews.slice(1, 3))
            }
        }
    }, [newsData]);

    return(
        <section className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/*  1st Items  */}
            <div>
                {/*  Title  */}
                <SectionTitle title={"Sports"} slug={"sports"}/>

                <div className="grid grid-cols-1 gap-6">
                    {/*  Single News Item  */}
                    <VerticalNewsCard news={singleNewsItem1st}/>

                    {/*  News List Items  */}
                    <div className="flex flex-col gap-6">
                        {
                            newsItemsList1st?.map((news, index)=>(
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
            </div>

            {/*  2nd Items  */}
            <div>
                {/*  Title  */}
                <SectionTitle title={"Education"} slug={"education"}/>

                <div className="grid grid-cols-1 gap-6">
                    {/*  Single News Item  */}
                    <VerticalNewsCard news={singleNewsItem2nd}/>

                    {/*  News List Items  */}
                    <div className="flex flex-col gap-6">
                        {
                            newsItemsList2nd?.map((news, index)=>(
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
            </div>
        </section>
    )
}

export default NewsSectionThree;