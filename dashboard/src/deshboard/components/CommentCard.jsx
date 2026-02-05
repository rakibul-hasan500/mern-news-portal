import {IoMdArrowDropdown} from "react-icons/io";
import {FiEdit3} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import {IoClose} from "react-icons/io5";
import {
    useReplayCommentMutation,
    useUpdateCommentMutation,
    useUpdateCommentStatusMutation
} from "../../redux/comment/commentApi.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    handleGetDeleteIdAndType,
    handleToggleDeleteWarningShow
} from "../../redux/app/appSlice.js";

function CommentCard({page, limits, index, comment}){

    const dispatch = useDispatch();

    // Get User From Redux
    const userInfo = useSelector((state)=>state.App.userInfo);

    // Show Status Selector
    const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);

    // Call Update Comment Status API
    const [updateCommentStatus] = useUpdateCommentStatusMutation()

    // Handle Update Comment Status
    const handleUpdateCommentStatus = async (selectedStatus)=>{
        try{
            // Validate
            if(!comment || !comment?._id){
                return responseHandler(false, 'Comment ID not found.')
            }
            if(!selectedStatus?.trim()){
                return responseHandler(false, 'Status not found.')
            }
            if(!["approved", "pending", "rejected"].includes(selectedStatus?.toString().trim())){
                return responseHandler(false, "Invalid comment status.")
            }

            // Hit Update Comment Status API
            const response = await updateCommentStatus({
                commentId: comment?._id?.toString()?.trim(),
                status: selectedStatus?.toString()?.trim(),
            }).unwrap()

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Comment Edit Mode
    const [commentEditMode,setCommentEditMode]=useState(false)
    const [commentData, setCommentData]=useState("")
    const [commentId, setCommentId]=useState("")
    useEffect(()=>{
        if(commentEditMode && comment && comment?._id && comment?.content){
            setCommentData(comment?.content)
            setCommentId(comment?._id?.toString())
        }
    }, [comment, commentEditMode])

    // Call Update Comment API
    const [updateComment, {isLoading: updateCommentLoading}] = useUpdateCommentMutation()

    // Handle Update Comment
    const handleUpdateComment = async ()=>{
        try{
            // Validate
            if(!commentData){
                return responseHandler(false, "Enter your comment.")
            }
            if(!commentId){
                return responseHandler(false, "Comment ID not found.")
            }

            // Hit Update Comment API
            const response = await updateComment({
                commentId: commentId,
                content: commentData
            }).unwrap()

            // Reset States
            setCommentId("")
            setCommentData("")
            setCommentEditMode(false)

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Replay Comment
    const [replayCommentOpen, setReplayCommentOpen]=useState(false)
    const [replayCommentData, setReplayCommentData]=useState("")

    // Call Replay Comment API
    const [replayComment, {isLoading: replayCommentLoading}] = useReplayCommentMutation()

    // Handle Replay Comment
    const handleReplayComment = async ()=>{
        try{
            // Validate
            if(!comment || !comment?._id){
                return responseHandler(false, "")
            }
            if(!replayCommentData?.trim()){
                return responseHandler(false, "")
            }

            // Hit Replay Comment API
            const response = await replayComment({
                postId: comment?.post?._id?.toString(),
                commentReplay: replayCommentData?.trim(),
                parentCommentId: comment?.parentComment ? comment?.parentComment?.toString() : comment?._id?.toString(),
                replayToCommentId: comment?.replayToComment?._id ? comment?.replayToComment?._id?.toString() : comment?._id?.toString()
            }).unwrap()

            // Reset States
            setReplayCommentData("")
            setReplayCommentOpen(false)

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className={`grid grid-cols-12 gap-6 w-full p-4 border-b border-gray-200 items-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
            {/*  Page Number  */}
            <div className="col-span-1 font-semibold">{(page - 1) * limits + index + 1}</div>

            {/*  Author Name  */}
            <div className="col-span-2 font-semibold flex items-center gap-2">
                {comment?.author?.name}
                {comment?.author?._id?.toString() === userInfo?.id && <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full">ME</span>}
            </div>

            {/*  Content  */}
            <div className="col-span-3 w-full">
                {
                    commentEditMode ? (
                            <div>
                                <p>Edit comment</p>
                                <textarea value={commentData} onChange={(e)=>setCommentData(e.target.value)} className={`outline-none focus:ring-2 ring-indigo-500 w-full rounded border border-gray-300 p-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}></textarea>
                                <div className="flex items-center justify-end gap-5 mt-1">
                                    <button onClick={()=>setCommentEditMode((edit)=>!edit)} disabled={updateCommentLoading} className="text-red-600 cursor-pointer font-semibold text-xs bg-gray-100 bg-gray-100 py-1 px-2">Cancel</button>
                                    <button onClick={handleUpdateComment} disabled={updateCommentLoading} className={`${updateCommentLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} text-white font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded`}>{updateCommentLoading ? "Loading.." : "Update"}</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="flex items-center gap-2"><span className={`${(comment && comment?.replayToComment && comment?.replayToComment?.author && comment?.replayToComment?.author?.name) ? "block" : "hidden"} text-gray-400 font-bold`}>@{comment?.replayToComment?.author?.name}</span>{comment?.content}</p>
                                {replayCommentOpen ? <p className="mt-1">Replay comment</p> : <button onClick={()=>setReplayCommentOpen((open)=>!open)} className="uppercase font-semibold text-xs text-indigo-600 cursor-pointer">Replay</button>}
                                {replayCommentOpen && <>
                                    <textarea value={replayCommentData} onChange={(e)=>setReplayCommentData(e.target.value)} className={`outline-none focus:ring-2 ring-indigo-500 w-full rounded border border-gray-300 p-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}></textarea>
                                    <div className="flex items-center justify-end gap-5 mt-1">
                                        <button onClick={()=> {
                                            replayCommentData("")
                                            setReplayCommentOpen((open) => !open)
                                        }} disabled={updateCommentLoading} className="text-red-600 cursor-pointer font-semibold text-xs bg-gray-100 py-1 px-2">Cancel</button>
                                        <button onClick={handleReplayComment} disabled={replayCommentLoading} className={`${replayCommentLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} text-white font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded`}>
                                            {replayCommentLoading ? "Loading.." : "Replay"}
                                        </button>
                                    </div>
                                </>}
                            </div>
                        )
                }
            </div>

            {/*  Post Title  */}
            <div className="col-span-3 text-gray-600">{comment?.post?.title}</div>

            {/*  Status  */}
            <div className="w-full col-span-2">
                {
                    userInfo?.role === "writer" ? (
                        <div className={`${comment?.status === "approved" ? "text-green-600 bg-green-50 border-green-600" : comment?.status === "pending" ? "text-yellow-600 bg-yellow-50 border-yellow-600" : "text-red-600 bg-red-50 border-red-600"} flex items-center justify-center gap-4 uppercase font-semibold w-full border-2 border-gray-300 bg-gray-100 p-2`}>
                            {comment?.status}
                        </div>
                    ) : (
                        <div className="relative">
                            {/*  Current Status  */}
                            <div onClick={()=>setStatusSelectorOpen((open)=>!open)} className={`${comment?.status === "approved" ? "text-green-600 bg-green-50 border-green-600" : comment?.status === "pending" ? "text-yellow-600 bg-yellow-50 border-yellow-600" : "text-red-600 bg-red-50 border-red-600"} flex items-center justify-between gap-4 uppercase font-semibold w-full border-2 border-gray-300 bg-gray-100 p-2`}>
                                {comment?.status}
                                {statusSelectorOpen ? <IoClose className="text-xl"/> : <IoMdArrowDropdown className="text-xl"/>}
                            </div>

                            {/*  Selector  */}
                            {statusSelectorOpen && <div className=" border-2 border-gray-200 absolute w-full top-full left-0 z-[20]">
                                <button onClick={()=>{
                                    setStatusSelectorOpen((open)=>!open);
                                    handleUpdateCommentStatus("approved")
                                }} className="p-2 bg-gray-50 hover:bg-gray-100 w-full text-left font-medium text-sm uppercase cursor-pointer">Approve</button>
                                <button onClick={()=>{
                                    setStatusSelectorOpen((open)=>!open);
                                    handleUpdateCommentStatus("pending")
                                }} className="p-2 bg-gray-50 hover:bg-gray-100 w-full text-left font-medium text-sm uppercase cursor-pointer">Pending</button>
                                <button onClick={()=>{
                                    setStatusSelectorOpen((open)=>!open);
                                    handleUpdateCommentStatus("rejected")
                                }} className="p-2 bg-gray-50 hover:bg-gray-100 w-full text-left font-medium text-sm uppercase cursor-pointer">Rejact</button>
                            </div>}
                        </div>
                    )
                }
            </div>

            {/*  Actions  */}
            <div className="flex justify-center gap-2 col-span-1">
                {/*  Edit  */}
                {userInfo?.id === comment?.author?._id?.toString() && <button onClick={()=>setCommentEditMode((edit)=>!edit)} className="h-9 w-9 bg-yellow-500 hover:bg-yellow-700 rounded-md flex items-center justify-center text-white">
                    <FiEdit3 />
                </button>}

                {/*  Delete  */}
                <button onClick={()=>{
                    dispatch(handleToggleDeleteWarningShow())
                    dispatch(handleGetDeleteIdAndType({type: 'comment', id: comment?._id?.toString()}))
                }} className="h-9 w-9 bg-red-500 hover:bg-red-700 rounded-md flex items-center justify-center text-white cursor-pointer">
                    <RiDeleteBin6Line />
                </button>
            </div>
        </div>
    )
}

export default CommentCard;