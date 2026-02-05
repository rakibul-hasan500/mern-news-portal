const responseHandler = require("../../utils/responseHandler")
const News = require("../models/news.model")
const User = require("../models/user.model")

// Get States
const getStates = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(!['admin', 'editor', 'writer'].includes(crrUser?.role)){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get States
        let stats = {}
        let newsItems = null

        // Admin || Editor
        if(crrUser?.role === 'admin' || crrUser?.role === 'editor'){
            stats.totalNews = await News.countDocuments()
            stats.pendingNews = await News.countDocuments({status: 'pending'})
            stats.publishedNews = await News.countDocuments({status: 'published'})
            stats.rejectedNews = await News.countDocuments({status: 'rejected'})

            newsItems = await News.find()
            .populate('categories')
            .sort({createdAt: -1})
            .limit(10)
        }

        // Admin
        if(crrUser?.role === 'admin'){
            stats.totalUsers = await User.countDocuments()
        }

        // Writer
        if(crrUser?.role === 'writer'){
            stats.totalNews = await News.countDocuments({author: crrUser?.id})
            stats.pendingNews = await News.countDocuments({author: crrUser?.id, status: 'pending'})
            stats.publishedNews = await News.countDocuments({author: crrUser?.id, status: 'published'})
            stats.rejectedNews = await News.countDocuments({author: crrUser?.id, status: 'rejected'})

            newsItems = await News.find({author: crrUser?.id})
            .populate('categories')
            .sort({createdAt: -1})
            .limit(10)
        }

        return responseHandler(res, 200, 'Stats fetched successfully.', {
            stats,
            newsItems
        })
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


module.exports = {
    getStates,
}

