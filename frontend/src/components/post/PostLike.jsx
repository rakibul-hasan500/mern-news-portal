"use client"
import {AiFillDislike, AiFillLike} from "react-icons/ai";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useGetSingleNewsDetailsQuery, useReactOnNewsMutation} from "@/redux/news/newsApi";
import responseHandler from "@/utils/responseHandler";
import {useParams} from "next/navigation";
import Link from "next/link";

function PostLike(){

    // Get Current User From Redux
    const currentUserData = useSelector((state)=>state.User.currentUserData);

    // Get Slug From Params
    const {slug} = useParams()

    // States
    const [newsId, setNewsId] = useState("");
    const [newsLikes, setNewsLikes] = useState([]);
    const [newsDislikes, setNewsDislikes] = useState([]);

    // Call Get Single News Details API
    const {data: singleNewsDetailsData} = useGetSingleNewsDetailsQuery({slug})
    useEffect(()=>{
        if(singleNewsDetailsData && singleNewsDetailsData?.data?._id){
            setNewsId(singleNewsDetailsData?.data?._id?.toString())
            setNewsLikes(singleNewsDetailsData?.data?.likes)
            setNewsDislikes(singleNewsDetailsData?.data?.dislikes)
        }
    }, [singleNewsDetailsData])

    // Call Like On News API
    const [reactOnNews, {isLoading: reactOnNewsLoading}] = useReactOnNewsMutation()

    // Handle React On News
    const handleReactOnNews = async (mode)=>{
        try{
            // Validate
            if(!newsId?.trim()){
                return responseHandler(false, "News not found.")
            }
            if(!mode?.toString()?.trim()){
                return responseHandler(false, "Reaction type is required.")
            }
            if(!["like", "dislike"].includes(mode)){
                return responseHandler(false, "Invalid reaction type. Allowed values are like or dislike.")
            }

            // Hit React On News API
            const response = await reactOnNews({
                newsId: newsId?.trim(),
                mode
            }).unwrap()

            // return responseHandler(true, response?.message)
            return
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }


    return(
        <div className="flex items-center gap-4 text-gray-600 text-2xl mt-6">
            {/*  Likes  */}
            <>
                {
                    currentUserData && currentUserData?.id ? (
                        <button disabled={reactOnNewsLoading} onClick={()=>handleReactOnNews('like')} className={`${reactOnNewsLoading ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-between gap-1 bg-gray-50 px-2 py-1 border border-gray-100 shadow`}>
                            <AiFillLike className={`${newsLikes?.includes(currentUserData?.id?.toString()) && "text-red-600"}`}/>
                            <span className="text-lg font-semibold">{newsLikes?.length < 1000 ? newsLikes?.length : newsLikes?.length >= 1000 ? `${Math.floor(newsLikes?.length / 1000)}K` : 0}</span>
                        </button>
                    ) : (
                        <Link href={"/login"} className="cursor-pointer flex items-center justify-between gap-1 bg-gray-50 px-2 py-1 border border-gray-100 shadow">
                            <AiFillLike />
                            <span className="text-lg font-semibold">{newsLikes?.length < 1000 ? newsLikes?.length : newsLikes?.length >= 1000 ? `${Math.floor(newsLikes?.length / 1000)}K` : 0}</span>
                        </Link>
                    )
                }
            </>

            {/*  Dislikes  */}
            <>
                {
                    currentUserData && currentUserData?.id ? (
                        <button disabled={reactOnNewsLoading} onClick={()=>handleReactOnNews('dislike')} className={`${reactOnNewsLoading ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-between gap-1 bg-gray-50 px-2 py-1 border border-gray-100 shadow`}>
                            <AiFillDislike className={`${newsDislikes?.includes(currentUserData?.id?.toString()) && "text-red-600"}`}/>
                            <span className="text-lg font-semibold">{newsDislikes?.length < 1000 ? newsDislikes?.length : newsDislikes?.length >= 1000 ? `${Math.floor(newsDislikes?.length / 1000)}K` : 0}</span>
                        </button>
                    ) : (
                        <Link href={"/login"} className="cursor-pointer flex items-center justify-between gap-1 bg-gray-50 px-2 py-1 border border-gray-100 shadow">
                            <AiFillDislike />
                            <span className="text-lg font-semibold">{newsLikes?.length < 1000 ? newsLikes?.length : newsLikes?.length >= 1000 ? `${Math.floor(newsLikes?.length / 1000)}K` : 0}</span>
                        </Link>
                    )
                }
            </>
        </div>
    )
}

export default PostLike;