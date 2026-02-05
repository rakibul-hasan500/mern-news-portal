"use client"
import {useGetCommentsByPostIdQuery} from "@/redux/comment/commentApi";
import Image from "next/image";
import ParentCommentCard from "@/components/comment/ParentCommentCard";
import {useState} from "react";

function AllComments({postId=""}){

    // Limit
    const [limit, setLimit] = useState(5);

    // Call Get All Comments API
    const {data: commentsByPostIdData} = useGetCommentsByPostIdQuery({postId, limit})

    return(
        <div className="mt-10 space-y-8">
            {/* Title */}
            <h3 className="text-lg font-semibold">Comments ({commentsByPostIdData?.data?.commentsCount || 0})</h3>

            {/* No Comments */}
            {commentsByPostIdData?.data?.commentCount === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}

            {/*  Parent Comment Card  */}
            <div className="-mt-3 flex flex-col gap-8 w-full">
                {commentsByPostIdData?.data?.comments.map((comment)=>(
                    <ParentCommentCard key={comment?._id} comment={comment}/>
                ))}
            </div>

            {/*  See More CommentS Button  */}
            <div className="flex justify-center -mt-2">
                {
                    (commentsByPostIdData?.data?.commentsCount || 0) > limit ? (
                        <button onClick={()=>setLimit(limit + 10)} className="mt-2 px-4 py-2 bg-gray-700 text-white rounded text-xs font-medium cursor-pointer">See more</button>
                    ) : (commentsByPostIdData?.data?.commentsCount) > 5 ? (
                        <button onClick={()=>limit >= 10 && setLimit(limit-5)} className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-xs font-medium cursor-pointer">See less</button>
                    ) : null
                }
            </div>
        </div>
    )
}

export default AllComments;