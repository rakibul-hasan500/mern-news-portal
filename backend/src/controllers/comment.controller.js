const { ReturnDocument } = require("mongodb")
const responseHandler = require("../../utils/responseHandler")
const Comment = require("../models/comment.model")
const News = require("../models/news.model")


// Post Comment
const postComment = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Data From Body
        const {comment='', postId=''} = req.body

        // Validate
        if(!comment?.trim()){
            return responseHandler(res, 400, 'Please write a comment.')
        }
        if(!postId?.trim()){
            return responseHandler(res, 400, 'Invalid news.')
        }

        // Find Post By ID
        const post = await News.findById(postId)
        if(!post){
            return responseHandler(res, 404, 'Invalid news.')
        }

        // Create Comment
        const createdComment = await Comment.create({
            author: crrUser?.id,
            post: postId,
            content: comment?.trim()
        })

        return responseHandler(res, 201, 'Comment posted successfully.', createdComment)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Post Comment Replay
const postCommentReplay = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Data From Body
        const {postId, commentReplay, parentCommentId, replayToCommentId} = req.body

        // Validate
        if(!commentReplay?.trim()){
            return responseHandler(res, 400, 'Please write a comment replay.')
        }
        if(!postId?.trim()){
            return responseHandler(res, 400, 'Invalid news.')
        }
        if(!parentCommentId?.trim()){
            return responseHandler(res, 400, 'Something went wrong. Parent comment not found.')
        }
        if(!replayToCommentId?.trim()){
            return responseHandler(res, 400, 'Unable to reply to this comment.')
        }

        // Find Post By ID
        const post = await News.findById(postId)
        if(!post){
            return responseHandler(res, 404, 'Invalid news.')
        }

        // Find Parent Comment By Parent Comment ID
        const parentComment = await Comment.findById(parentCommentId)
        if(!parentComment){
            return responseHandler(res, 404, 'Parent comment not found.')
        }

        // Find Replay To Comment By Replay To Comment ID
        const replayToComment = await Comment.findById(replayToCommentId)
        if(!replayToComment){
            return responseHandler(res, 404, 'Reply target comment not found.')
        }

        // Check if user/writer can reply
        if(['user', 'writer'].includes(crrUser?.role)){
            if(parentComment?.status !== 'approved' || replayToComment?.status !== 'approved'){
                return responseHandler(res, 400, 'You cannot reply to unapproved comments.')
            }
        }

        // Create Comment
        const createdCommentReplay = await Comment.create({
            author: crrUser?.id,
            post: postId,
            content: commentReplay?.trim(),
            parentComment: parentCommentId,
            replayToComment: replayToCommentId
        })

        return responseHandler(res, 201, 'Comment posted successfully.', createdCommentReplay)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Get Comments By Post ID
const getCommentsByPostId = async (req, res)=>{
    try{
        // Get Post ID From Params
        const {postId=''} = req.params
        if(!postId?.trim()){
            return responseHandler(res, 400, 'invalid news.')
        }

        // get Limit From Query
        let {limit=10} = req.query
        limit = Number(limit)
        if(isNaN(limit) || limit <= 0){
            return responseHandler(res, 400, 'Invalid limit.')
        }

        // Find News By Post ID
        const news = await News.findById(postId)
        if(!news){
            return responseHandler(res, 404, 'invalid news.')
        }

        // Get Comments
        const commentsCount = await Comment.countDocuments({
            status: 'approved',
            post: postId,
            parentComment: null,
            replayToComment: null
        })
        const comments = await Comment.find({
            status: 'approved',
            post: postId,
            parentComment: null,
            replayToComment: null
        })
        .populate('author', '_id name image role')
        .limit(limit)
        .sort({createdAt: -1})
        .lean()

        return responseHandler(res, 200, 'Comments fetched successfully.', {
            comments,
            commentsCount
        })
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Get Comment Replies
const getCommentReplies = async (req, res)=>{
    try{
        // Get Data Drom Query
        let {postId='', parentCommentId='', limit=5} = req.query
        limit = Number(limit)

        // Validate
        if(!postId?.trim()){
            return responseHandler(res, 400, 'Post ID is required.')
        }
        if(!parentCommentId?.trim()){
            return responseHandler(res, 400, 'Parent comment ID is required.')
        }
        if(isNaN(limit) || limit < 0){
            return responseHandler(res, 400, 'Invalid limit.')
        }

        // Find Post By Post Id
        const post = await News.findById(postId)
        if(!post){
            return responseHandler(res, 404, 'News item not found.')
        }

        // Find Parent Comment By Parent Comment ID
        const parentComment = await Comment.findById(parentCommentId)
        if(!parentComment){
            return responseHandler(res, 404, 'Parent comment not found.')
        }

        // Find Replies
        const commentRepliesCount = await Comment.countDocuments({
            post: postId,
            parentComment: parentCommentId,
            status: 'approved'
        })
        const commentReplies = await Comment.find({
            post: postId,
            parentComment: parentCommentId,
            status: 'approved'
        })
        .populate([
            {path: 'author', select: '_id name image role'},
            {
                path: 'replayToComment',
                select: '_id author',
                populate: {
                    path: 'author',
                    select: '_id name role'
                }
            }
        ])
        .limit(limit)
        .sort({createdAt: 1})
        .lean()

        return responseHandler(res, 200, 'Comment replies fetched successfully.', {
            commentReplies,
            commentRepliesCount
        })
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// React On Comment
const reactOnComment = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Data From Body
        const {commentId='', mode=''} = req.body

        // Validate
        if(!commentId?.toString()?.trim()){
            return responseHandler(res, 400, 'Comment not found.')
        }
        if(!mode?.toString()?.trim()){
            return responseHandler(res, 400, 'Reaction type is required.')
        }
        if(!['like', 'dislike'].includes(mode)){
            return responseHandler(res, 400, 'Invalid reaction type. Allowed values are like or dislike.')
        }

        // Find Comment By Comment Id
        const comment = await Comment.findById(commentId)
        if(!comment){
            return responseHandler(res, 404, 'Comment not found.')
        }

        // Unapproved Comment
        if(['user', 'writer'].includes(crrUser?.role) && comment?.status !== 'approved'){
            return responseHandler(res, 400, 'You cannot react to unapproved comments.')
        }

        // Find Liked Or Disliked
        const liked = comment?.likes?.includes(crrUser?.id)
        const disliked = comment?.dislikes?.includes(crrUser?.id)

        // If No Reacts
        if(!liked && ! disliked){
            if(mode === 'like'){
                comment.likes.push(crrUser?.id)
            }

            if(mode === 'dislike'){
                comment.dislikes.push(crrUser?.id)
            }
        }

        // If Liked
        if(liked){
            if(mode === 'like'){
                const filteredItems = comment?.likes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                comment.likes = filteredItems
            }

            if(mode === 'dislike'){
                const filteredItems = comment?.likes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                comment.likes = filteredItems
                comment.dislikes.push(crrUser?.id)
            }
        }

        // If Disliked
        if(disliked){
            if(mode === 'like'){
                const filteredItems = comment?.dislikes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                comment.dislikes = filteredItems
                comment.likes.push(crrUser?.id)
            }

            if(mode === 'dislike'){
                const filteredItems = comment?.dislikes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                comment.dislikes = filteredItems
            }
        }

        // Save Data To DB
        await comment.save()

        return responseHandler(res, 200, 'Updated.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Update Comment
const updateComment = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        
        // Get Comment Data From Body
        const {commentId='', content=''} = req.body

        // Validate
        if(!commentId){
            return responseHandler(res, 400, 'Invalid comment.')
        }
        if(!content?.toString()?.trim()){
            return responseHandler(res, 400, 'Enter your comment.')
        }

        // Find Comment By Comment Id
        const comment = await Comment.findById(commentId?.toString()?.trim())
        if(!comment){
            return responseHandler(res, 404, 'Comment not found.')
        }

        // Match Author -- User, Writer
        if(['user', 'writer'].includes(crrUser?.role)){
            if(crrUser?.id?.toString() !== comment?.author?.toString()){
                return responseHandler(res, 403, 'Access denied.')
            }

            if(comment?.status !== 'approved'){
                return responseHandler(res, 400, "You can't update unapproved comment.")
            }
        }

        // Update Data
        comment.content = content?.trim()
        await comment.save()

        return responseHandler(res, 200, 'Comment updated.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Delete Comment
const deleteComment = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Comment Id From Params
        const {commentId=''} = req.params

        // Validate
        if(!commentId?.toString()?.trim()){
            return responseHandler(res, 400, 'Invalid comment.')
        }

        // Find Comment By Id
        const comment = await Comment.findById(commentId?.toString()?.trim()).populate('post')
        if(!comment){
            return responseHandler(res, 404, 'Comment not found.')
        }

        // Check Author - User
        if(crrUser?.role === 'user'){
            if(crrUser?.id !== comment?.author?.toString()){
                return responseHandler(res, 403, 'Access denied.')
            }

            if(comment?.status !== 'approved'){
                return responseHandler(res, 400, 'You cannot delete unapproved comments.')
            }
        }
        
        // Check Author - Writer
        if(crrUser?.role === 'writer'){
            if(comment?.post?.author?.toString() !== crrUser?.id && crrUser?.id !== comment?.author?.toString()){
                return responseHandler(res, 403, 'Access denied.')
            }

            if(comment?.status !== 'approved'){
                return responseHandler(res, 400, 'You cannot delete unapproved comments.')
            }
        }

        // Check Linked Comments
        const commentReplies = await Comment.find({
            $or: [
                {parentComment: comment?._id?.toString()?.trim()},
                {replayToComment: comment?._id?.toString()?.trim()}
            ]
        })
        const commentReplayId = commentReplies?.length > 0 ? commentReplies?.map((c)=>c?._id?.toString()) : []

        // Delete Comments
        if(commentReplayId?.length > 0){
            await Comment.deleteMany({
                _id: {$in: commentReplayId}
            })
        }
        await Comment.findByIdAndDelete(comment?._id?.toString())
        
        return responseHandler(res, 200, 'Comment deleted.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Get All Comments
const getAllComments = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(crrUser?.role === 'user'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Filter Data From Query
        const {status='', search=''} = req.query

        // Filter
        const filter = {}
        if(['approved', 'pending', 'rejected'].includes(status)){
            filter.status = status
        }

        // Find All Comments
        let comments = await Comment.find(filter)
        .populate({
            path: 'post',
            select: 'title',
            match: search?.trim() ? {title: {$regex: search?.trim(), $options: 'i'}} : {}
        })
        .populate('author', 'name _id')
        .populate({
            path: 'replayToComment',
            select: '_id author',
            populate: {
                path: 'author',
                select: 'name'
            }
        })
        .sort({createdAt: -1})
        comments = comments?.filter((c)=>c?.post !== null)

        // Comments Count
        const commentsCount = comments?.length

        return responseHandler(res, 200, 'Comments fetched successfully,', {
            comments,
            commentsCount
        })
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Update Comment Status
const updateCommentStatus = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(!['admin', 'editor'].includes(crrUser?.role)){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Data From Body
        const {commentId, status} = req.body
        if(!commentId?.toString().trim()){
            return responseHandler(res, 400, 'Comment ID not found.')
        }
        if(!status?.trim()){
            return responseHandler(res, 400, 'Select comment status.')
        }
        if(!['approved', 'pending', 'rejected'].includes(status?.trim())){
            return responseHandler(res, 400, 'Invalid comment status.')
        }

        // Find Comment By ID
        const comment = await Comment.findById(commentId?.toString()?.trim())
        if(!comment){
            return responseHandler(res, 404, 'Comment not found.')
        }

        // Update Comment Status
        comment.status = status?.toString()?.trim()
        await comment.save()

        return responseHandler(res, 200, 'Comment status updated.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



module.exports = {
    postComment,
    postCommentReplay,
    getCommentsByPostId,
    getCommentReplies,
    reactOnComment,
    updateComment,
    deleteComment,
    getAllComments,
    updateCommentStatus
}