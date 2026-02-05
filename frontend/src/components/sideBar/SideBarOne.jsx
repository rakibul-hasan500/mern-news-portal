"use client"
import Image from "next/image";
import SectionTitle from "@/components/common/SectionTitle";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";
import boxAdsImg from "../../assets/images/324 x 250.jpg"

function SideBarOne(){

    //Get Settings Data From Redux
    const settingsData = useSelector((state)=>state.Settings.settingsData)

    // News Items State
    const [newsItems, setNewsItems] = useState([]);

    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const filteredNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "national-news"))
            if(filteredNews.length > 0){
                setNewsItems(filteredNews.slice(0, 10))
            }
        }
    },[newsData])

    return(
        <section className="flex flex-col gap-6">
            {/*  Ads  */}
            <div className="flex flex-col items-center justify-center">
                <p className="text-center text-xs text-gray-500">- Advertisement -</p>
                <a href={settingsData?.cardAdOne?.link || "#"} target={"_blank"} className="flex items-center justify-center">
                    <Image
                        src={settingsData?.cardAdOne?.url || boxAdsImg}
                        alt={"Box Ads Image"}
                        height={250}
                        width={324}
                        className="object-center object-cover"
                    />
                </a>
            </div>

            {/*  News Items  */}
            <div>
                {/*  Title  */}
                <SectionTitle title={"National News"} slug={"national-news"}/>

                {/*  News Items  */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {
                        newsItems.map((news, index)=>(
                            <HorizontalNewsCard
                                key={index}
                                news={news}
                            />
                        ))
                    }
                </div>
            </div>

            {/*  Ads  */}
            <div className="flex flex-col items-center justify-center">
                <p className="text-center text-xs text-gray-500">- Advertisement -</p>
                <a href={settingsData?.cardAdTwo?.link || "#"} target={"_blank"} className="flex items-center justify-center bg-gray-100">
                    <Image
                        src={settingsData?.cardAdTwo?.url || boxAdsImg}
                        alt={"Box Ads Image"}
                        height={250}
                        width={324}
                        className="object-center object-cover"
                    />
                </a>
            </div>
        </section>
    )
}

export default SideBarOne;