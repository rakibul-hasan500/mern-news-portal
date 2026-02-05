"use client"
import {useState} from "react";
import {useSelector} from "react-redux";
import Link from "next/link";
import {usePostCommentMutation} from "@/redux/comment/commentApi";
import responseHandler from "@/utils/responseHandler";

function PostComment({postId=""}){

    // Get User Data From Redux
    const currentUserData = useSelector((state)=>state.User.currentUserData);

    // Comment
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");

    // Call Post Comment API
    const [postComment, {isLoading: postCommentLoading}] = usePostCommentMutation()

    // Handle Post Comment
    const handlePostComment = async (e)=>{
        e.preventDefault()
        setCommentError("")
        try{
            // Validate
            if(!comment?.trim()){
                return setCommentError("Please write a comment.")
            }
            if(!postId){
                return responseHandler(false, "Invalid news.")
            }

            // Hit Post Comment API
            const response = await postComment({comment, postId}).unwrap()

            // Clear States
            setComment("")
            setCommentError("")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className="mt-[58px] p-6 bg-gray-50">
            {/*  Title  */}
            <p className="font-medium">LEAVE A REPLAY</p>

            {/*  Form  */}
            <form onSubmit={handlePostComment} className="mt-[7px] flex flex-col gap-[12px]">
                {/*  Comment  */}
                <div>
                    <textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Comment" className="h-[160px] w-full p-2 border border-gray-300 focus:ring-2 ring-red-500 outline-none rounded text-sm"></textarea>
                    {commentError !== "" && <p className="text-sm text-red-600 mt-1 font-medium">{commentError}</p>}
                </div>

                {/*  Submit Button  */}
                <>
                    {
                        currentUserData && currentUserData?.id ? (
                            <button type="submit" disabled={postCommentLoading} className={`${postCommentLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} py-2 px-5 bg-gray-700 text-white w-max text-xs font-semibold min-w-[140px]`}>{postCommentLoading ? "LOADING..." : "POST COMMENT"}</button>
                        ) : (
                            <Link href={"/login"} className="py-2 px-5 bg-gray-700 text-white w-max text-xs font-semibold cursor-pointer">POST COMMENT</Link>
                        )
                    }
                </>
            </form>
        </div>
    )
}

export default PostComment;