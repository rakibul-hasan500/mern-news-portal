"use client"
import Image from "next/image";
import {useEffect, useState} from "react";
import {FaRegClock} from "react-icons/fa";
import {
    useDeleteCommentMutation,
    useGetCommentRepliesQuery,
    usePostCommentReplayMutation, useReactOnCommentMutation, useUpdateCommentMutation,
} from "@/redux/comment/commentApi";
import responseHandler from "@/utils/responseHandler";
import ReplayCommentCard from "@/components/comment/ReplayCommentCard";
import {AiFillDislike, AiFillLike} from "react-icons/ai";
import {useSelector} from "react-redux";
import Link from "next/link";

function ParentCommentCard({comment}){

    // Get Current User Data From Redux
    const currentUserData = useSelector((state)=>state.User.currentUserData)

    // Show Replay Input Box
    const [replayInputShow, setReplayInputShow] = useState(false);

    // Comment State
    const [commentReplay, setCommentReplay] = useState("");
    const [commentReplayError, setCommentReplayError] = useState("");

    // Comment Data ID State
    const [postId, setPostId] = useState("");
    const [parentCommentId, setParentCommentId] = useState("");
    const [replayToCommentId, setReplayToCommentId] = useState("");
    useEffect(()=>{
        if(replayInputShow){
            setPostId(comment?.post?.toString())
            setParentCommentId(comment?._id?.toString())
            setReplayToCommentId(comment?._id?.toString())
        }else{
            setPostId("")
            setCommentReplay("")
            setParentCommentId("")
            setReplayToCommentId("");
        }
    }, [replayInputShow])

    // Call Get Replay Comment API
    const [showReplies, setShowReplies] = useState(false)
    const [limit, setLimit] = useState(5)
    const {data: commentRepliesData} = useGetCommentRepliesQuery({
        postId: comment?.post,
        parentCommentId: comment?._id?.toString(),
        limit,
    })

    // Call Post Comment Replay API
    const [postCommentReplay, {isLoading: postCommentReplayLoading}] = usePostCommentReplayMutation()

    // Handle Post Comment Replay
    const handlePostCommentReplay = async ()=>{
        try{
            // Validate
            if(!postId){
                return responseHandler(false, "Unable to identify the post. Please try again.")
            }
            if(!commentReplay?.trim()){
                return setCommentReplayError("Reply cannot be empty.");
            }
            if(!parentCommentId){
                return responseHandler(false, "Something went wrong. Please try again.")
            }
            if(!replayToCommentId){
                return responseHandler(false, "Unable to reply to this comment.")
            }

            // Hit Post Comment Replay API
            const response = await postCommentReplay({
                postId,
                commentReplay,
                parentCommentId,
                replayToCommentId,
            }).unwrap()

            // Reset States
            setPostId("")
            setCommentReplay("")
            setParentCommentId("")
            setReplayToCommentId("")
            setReplayInputShow(false)

            // Update STates
            setShowReplies(true)
            setLimit(commentRepliesData?.data?.commentRepliesCount+1)

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call React On Comment API
    const [reactOnComment, {isLoading: reactOnCommentLoading}] = useReactOnCommentMutation()

    // Handle React On Comment
    const handleReactOnComment = async (mode)=>{
        try{
            // Validate
            if(!comment || (comment && !comment?._id?.toString()?.trim())){
                return responseHandler(false, "Comment not found.")
            }
            if(!mode?.toString()?.trim()){
                return responseHandler(false, "Reaction type is required.")
            }
            if(!["like", "dislike"].includes(mode)){
                return responseHandler(false, "Invalid reaction type. Allowed values are like or dislike.")
            }

            // Hit React On Comment API
            const response = await reactOnComment({
                commentId: comment?._id?.toString(),
                mode
            }).unwrap()

            // return responseHandler(true, response?.message)
            return
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Edit
    const [editFormShow, setEditFormShow] = useState(false)
    // Edit States
    const [editCommentId, setEditCommentId] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editContentError, setEditContentError] = useState("");
    // Set Edit Data
    useEffect(()=>{
        if(comment && comment?._id && editFormShow){
            setEditCommentId(comment?._id)
            setEditContent(comment?.content)
        }else{
            setEditCommentId("")
            setEditContent("")
        }
    }, [editFormShow]);
    // Call Update Comment API
    const [updateComment, {isLoading: updateCommentLoading}] = useUpdateCommentMutation()
    // Handle Update Comment
    const handleUpdateComment = async ()=>{
        setEditContentError("")
        try{
            // Validate
            if(!editCommentId?.toString()?.trim()){
                return responseHandler(false, "Invalid comment.")
            }
            if(!editContent?.trim()){
                return setEditContentError("Cmment can't be empty.")
            }

            // Hit Edit Comment API
            const response = await updateComment({
                commentId: editCommentId.toString(),
                content: editContent,
            }).unwrap()

            // Reset Fields
            setEditCommentId("")
            setEditFormShow(false)
            setEditContent("")

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }


    // Delete
    const [deleteWarningShow, setDeleteWarningShow] = useState(false);
    // Delete State
    const [deleteCommentId, setDeleteCommentId] = useState("");
    // Set Comment Id
    useEffect(()=>{
        if(comment && comment?._id && deleteWarningShow){
            setDeleteCommentId(comment?._id?.toString()?.trim())
        }else{
            setDeleteCommentId("")
        }
    }, [deleteWarningShow]);
    // Cal Delete Comment API
    const [deleteComment, {isLoading: deleteCommentLoading}] = useDeleteCommentMutation()
    // Handle Delete COmment
    const handleDeleteComment = async ()=>{
        try{
            // Validate
            if(!deleteCommentId?.toString()?.trim()){
                return responseHandler(false, "Invalid comment.")
            }

            // Hit Delete Comment API
            const response = await deleteComment({commentId: deleteCommentId.toString().trim()}).unwrap()

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div>
            {/*  Parent Comment  */}
            <div className="flex gap-3 px-4 pt-4 pb-6 border border-gray-200 rounded-md bg-gray-50 relative w-full">
                {/* Author Image */}
                <div>
                    {/*  Image  */}
                    <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-200">
                        {comment?.author?.image !== "" ? (
                            <Image
                                src={comment?.author?.image}
                                alt={comment?.author?.name}
                                fill
                                className="object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                {comment?.author?.name?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {comment?.author?._id?.toString() === currentUserData?.id && (
                        <span className="text-gray-600 flex items-center justify-center uppercase text-[10px] mt-1 font-semibold bg-gray-100 px-2 py-1 text-center">ME</span>
                    )}
                </div>

                {/* Comment Body */}
                <div className="flex-1">
                    {/*  Name  */}
                    <p className="text-sm font-semibold flex items-center gap-2">
                        {comment?.author?.name || "Anonymous"}
                        {(comment?.author?.role === "admin" || comment?.author?.role === "editor" || comment?.author?.role === "writer") && (
                            <span className="text-green-600 bg-green-100 px-3 py-1 flex items-center uppercase text-[10px]">
                                {comment?.author?.role}
                            </span>
                        )}
                    </p>

                    {/*  Content  */}
                    <p className="text-sm text-gray-700 mt-1">{comment?.content}</p>

                    {/* Actions */}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        {/*  Replay  */}
                        <>
                            {
                                currentUserData && currentUserData?.id ? (
                                    <>
                                        {replayInputShow ? (
                                            <button onClick={()=> {
                                                setPostId("")
                                                setCommentReplay("")
                                                setParentCommentId("")
                                                setReplayToCommentId("")
                                                setReplayInputShow((show) => !show)
                                            }} className="text-red-600 hover:text-red-800 font-semibold cursor-pointer">Cancel Replay</button>
                                        ) : (
                                            <button onClick={()=> {
                                                setEditFormShow(false)
                                                setDeleteWarningShow(false)
                                                setReplayInputShow((show) => !show)
                                            }} className="hover:text-gray-800 font-semibold cursor-pointer">Reply</button>
                                        )}
                                    </>
                                ) : (
                                    <Link href={"/login"} className="hover:text-gray-800 font-semibold cursor-pointer">Replay</Link>
                                )
                            }
                        </>

                        {/*  Edit  */}
                        <>
                            {(currentUserData && (currentUserData?.id?.toString() === comment?.author?._id?.toString())) && (
                                <>
                                    {editFormShow ? (
                                        <button onClick={()=> {
                                            setEditCommentId("")
                                            setEditContent("")
                                            setEditFormShow((show)=>!show)
                                        }} className="text-red-600 hover:text-red-800 font-semibold cursor-pointer">Cancel Edit</button>
                                    ) : (
                                        <button onClick={()=> {
                                            setReplayInputShow(false)
                                            setDeleteWarningShow(false)
                                            setEditFormShow((show)=>!show)
                                        }} className="text-yellow-600 hover:text-yellow-700 font-semibold cursor-pointer">Edit</button>
                                    )}
                                </>
                            )}
                        </>

                        {/*  Delete  */}
                        <>
                            {(currentUserData && (currentUserData?.id?.toString() === comment?.author?._id?.toString())) && (
                                <>
                                    {deleteWarningShow ? (
                                        <button onClick={()=> {
                                            setReplayInputShow(false)
                                            setEditFormShow(false)
                                            setDeleteWarningShow((show)=>!show)
                                        }} className="text-red-600 hover:text-red-800 font-semibold cursor-pointer">Cancel Delete</button>
                                    ) : (
                                        <button onClick={()=> {
                                            setReplayInputShow(false)
                                            setEditFormShow(false)
                                            setDeleteWarningShow((show)=>!show)
                                        }} className="text-red-600 hover:text-red-700 font-semibold cursor-pointer">Delete</button>
                                    )}
                                </>
                            )}
                        </>
                    </div>

                    {/*  Comment Time  */}
                    <span className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <FaRegClock className="text-gray-400"/>
                        {comment?.createdAt && new Date(comment?.createdAt).toLocaleString("en-us", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        })}
                    </span>

                    {/*  Replay Field  */}
                    {replayInputShow && <div className="mt-2 w-full flex flex-col items-end justify-end gap-2">
                        {/*  Replay Input  */}
                        <div className="flex flex-col gap-1 w-full">
                            {/*  Text Area  */}
                            <textarea type={"text"} value={commentReplay} onChange={(e)=>setCommentReplay(e.target.value)} placeholder={"Replay"} className="p-2 w-full border border-gray-300 text-sm outline-none focus:ring-2 ring-red-600 rounded max-h-[58px]"></textarea>
                            {/*  Comment Error  */}
                            {commentReplayError !== "" && <p className="text-red-600 text-xs font-medium">{commentReplayError}</p>}
                        </div>

                        {/*  Add Replay Button  */}
                        <button onClick={handlePostCommentReplay} disabled={postCommentReplayLoading} className={`${postCommentReplayLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} py-2 px-5 bg-gray-700 text-white w-max text-xs font-semibold rounded`}>{postCommentReplayLoading ? "LOADING..." : "POST REPLAY"}</button>
                    </div>}

                    {/*  Update Comment Field  */}
                    {editFormShow && <div className="mt-2 w-full flex flex-col items-end justify-end gap-2">
                        {/*  Replay Input  */}
                        <div className="flex flex-col gap-1 w-full">
                            {/*  Text Area  */}
                            <textarea type={"text"} value={editContent} onChange={(e)=>setEditContent(e.target.value)} placeholder={"Update"} className="p-2 w-full border border-gray-300 text-sm outline-none focus:ring-2 ring-red-600 rounded max-h-[58px]"></textarea>
                            {/*  Comment Error  */}
                            {editContentError !== "" && <p className="text-red-600 text-xs font-medium">{commentReplayError}</p>}
                        </div>

                        {/*  Update Comment Button  */}
                        <button onClick={handleUpdateComment} disabled={updateCommentLoading} className={`${updateCommentLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} py-2 px-5 bg-gray-700 text-white w-max text-xs font-semibold rounded`}>{updateCommentLoading ? "LOADING..." : "Update"}</button>
                    </div>}

                    {/*  Delete Warning  */}
                    {deleteWarningShow && <div className="mt-2 max-w-[280px] flex flex-col gap-2 border border-gray-300 p-4 mb-4 rounded">
                        {/*  Titles  */}
                        <div className="flex flex-col gap-1">
                            <h5 className="text-sm font-bold text-red-600">DELETE</h5>
                            <p className="text-xs text-gray-600">Are you sure you want to delete?</p>
                        </div>

                        {/*  Buttons  */}
                        <div className="flex items-center justify-end gap-3">
                            {/*  Cancel  */}
                            <button onClick={()=>{
                                setDeleteCommentId("")
                                setDeleteWarningShow(false)
                            }} className="py-1 px-3 bg-gray-700 text-white w-max text-xs font-semibold rounded cursor-pointer">Cancel</button>

                            {/*  Delete  */}
                            <button onClick={handleDeleteComment} disabled={deleteCommentLoading} className={`${deleteCommentLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} py-1 px-3 bg-red-600 hover:bg-red-700 text-white w-max text-xs font-semibold rounded`}>{deleteCommentLoading ? "LOADING..." : "Delete"}</button>
                        </div>
                    </div>}
                </div>

                {/*  Likes & Dislike & Replay Count  */}
                <div className="absolute bottom-0 left-3 -mb-4 flex items-center gap-4 ml-2 text-gray-600 bg-white py-1 px-3 border border-gray-200">
                    {/*  Likes  */}
                    <>
                        {
                            currentUserData && currentUserData?.id ? (
                                <button disabled={reactOnCommentLoading} onClick={()=>handleReactOnComment('like')} className={`${reactOnCommentLoading ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-between gap-1 text-sm`}>
                                        <AiFillLike className={`${comment?.likes?.includes(currentUserData?.id?.toString()) && "text-red-600"}`}/> {comment?.likes?.length < 1000 ? comment?.likes?.length : comment?.likes?.length >= 1000 ? `${Math.floor(comment?.likes?.length / 1000)}K` : 0}
                                    </button>
                            ) : (
                                <Link href={"/login"} className="cursor-pointer flex items-center justify-between gap-1 text-sm">
                                    <AiFillLike/> {comment?.likes?.length < 1000 ? comment?.likes?.length : comment?.likes?.length >= 1000 ? `${Math.floor(comment?.likes?.length / 1000)}K` : 0}
                                </Link>
                            )
                        }
                    </>

                    {/*  Dislikes  */}
                    <>
                        {
                            currentUserData && currentUserData?.id ? (
                                <button disabled={reactOnCommentLoading} onClick={()=>handleReactOnComment('dislike')} className={`${reactOnCommentLoading ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-between gap-1 text-sm`}>
                                    <AiFillDislike className={`${comment?.dislikes?.includes(currentUserData?.id?.toString()) && "text-red-600"}`}/> {comment?.dislikes?.length < 1000 ? comment?.dislikes?.length : comment?.dislikes?.length >= 1000 ? `${Math.floor(comment?.dislikes?.length / 1000)}K` : 0}
                                </button>
                            ) : (
                                <Link href={"/login"} className="cursor-pointer flex items-center justify-between gap-1 text-sm">
                                    <AiFillDislike /> {comment?.dislikes?.length < 1000 ? comment?.dislikes?.length : comment?.dislikes?.length >= 1000 ? `${Math.floor(comment?.dislikes?.length / 1000)}K` : 0}
                                </Link>
                            )
                        }
                    </>

                    {/*  Replies Button  */}
                    {commentRepliesData?.data?.commentRepliesCount > 0 && <button onClick={()=> {
                        setShowReplies((show) => !show)
                        setLimit(5)
                    }} className="text-xs font-medium hover:underline cursor-pointer">{showReplies ? "Hide" : "View"} {commentRepliesData?.data?.commentRepliesCount || 0} Replay</button>}
                </div>
            </div>

            {/*  Replay Comments  */}
            {showReplies && <div className="ml-8 mt-8 flex flex-col gap-8">
                {/*  Replay Items  */}
                <>
                    {
                        commentRepliesData?.data?.commentReplies?.map((commentReplayItem)=>(
                            <ReplayCommentCard
                                key={commentReplayItem?._id}
                                commentReplayItem={commentReplayItem}
                                setLimit={setLimit}
                                setShowReplies={setShowReplies}
                                replayCount={commentRepliesData?.data?.commentRepliesCount}
                            />
                        ))
                    }
                </>

                {/*  Pabination  */}
                <>
                    {
                        commentRepliesData?.data?.commentRepliesCount > limit ? (
                            <button onClick={()=>setLimit(limit+5)} className="text-xs font-medium text-end hover:underline -mt-6 cursor-pointer">See more</button>
                        ) : (
                            <button onClick={()=> {
                                    setShowReplies(false)
                                    setLimit(5)
                                }} className="text-xs font-medium text-end hover:underline -mt-6 cursor-pointer">Hide</button>
                        )
                    }
                </>
            </div>}
        </div>
    )
}

export default ParentCommentCard;