"use client"
import SectionTitle from "@/components/common/SectionTitle";
import HorizontalNewsCard from "@/components/news/HorizontalNewsCard";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Link from "next/link";
import {MdArrowRightAlt} from "react-icons/md";

function SideBarTwo(){

    // News Item State
    const [newsItemsList, setNewsItemsList] = useState([]);
    // Get News Data From Redux
    const newsData = useSelector((state)=>state.News.newsData);
    useEffect(()=>{
        if(newsData && newsData?.data?.allNews?.length > 0){
            const filteredNews = newsData?.data?.allNews?.filter((news)=>news?.categories?.some((category)=>category?.slug === "technology"))
            if(filteredNews.length > 0){
                setNewsItemsList(filteredNews.slice(1, 9))
            }
        }
    }, [newsData]);

    // Category State
    const [categories, setCategories] = useState([]);
    // Get Category Data From Redux
    const categoryData = useSelector((state)=>state.Category.categoryData);
    useEffect(()=>{
        if(categoryData?.data?.categories?.length > 0){
            setCategories(categoryData?.data?.categories);
        }
    }, [categoryData]);

    return(
        <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
            {/*  News Items  */}
            <div>
                {/*  Title  */}
                <SectionTitle title={"Technology"} slug={"technology"}/>

                {/*  News Items  */}
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

            {/*  Categories Items  */}
            <div className="">
                {/*  Title  */}
                <SectionTitle title={"Categories"}/>

                {/*  Categories  */}
                <div className="flex flex-col gap-3">
                    {
                        categories?.map((category, index)=>(
                            <Link href={`/category/${category?.slug}`} key={index} className="hover:text-red-600 flex items-center justify-between gap-3 transition duration-200">
                                <p className="font-medium text-sm">{category?.name}</p>
                                <MdArrowRightAlt/>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default SideBarTwo;