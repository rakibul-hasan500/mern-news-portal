const formidable = require('formidable')
const responseHandler = require("../../utils/responseHandler")
const cloudinary = require('../../config/cloudinary')
const News = require('../models/news.model')
const slugGenerator = require('../../utils/slugGenerator')
const Category = require('../models/category.model')
const Gallery = require('../models/gallery.model')


// Add News
const addNews = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin' && crrUser.role !== 'writer'){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get News Data as FormData
        const form = new formidable.IncomingForm({multiples: false})
        const {fields, files} = await new Promise((resolve, reject)=>{
            form.parse(req, (err, fields, files)=>{
                if(err){
                    reject(err)
                    return responseHandler(res, 500, 'Form data parsing error.', null, err)
                }else{
                    resolve({fields, files})
                }
            })
        })

        // Extract Data & Validate
        let title = fields?.title[0] || ''
        let description = fields?.description[0] || ''
        let categories = JSON.parse(fields?.categories[0]) || []
        let keywords = JSON.parse(fields?.keywords[0]) || []
        let metaDescription = fields?.metaDescription[0] || ''
        let image = files?.featuredImage[0]?.filepath || ''

        if(!title || !title?.trim()){
            return responseHandler(res, 400, 'Enter a news title.')
        }
        if(!description || !description?.trim()){
            return responseHandler(res, 400, 'Enter news description.')
        }
        if(!Array.isArray(categories)){
            return responseHandler(res, 400, 'Invalid category format.')
        }
        if(categories?.length === 0){
            return responseHandler(res, 400, 'Please select a category.')
        }
        if(categories?.length > 0){
            const checkValidCategories = await Category.countDocuments({
                _id: {$in: categories}
            })
            if(checkValidCategories !== categories?.length){
                return responseHandler(res, 400, 'Invalid categories selected.')
            }
        }
        if(keywords && !Array.isArray(keywords)){
            return responseHandler(res, 400, 'Invalid keywords format.')
        }
        if(keywords.length > 10){
            return responseHandler(res, 400, 'You can add up to 10 keywords only.')
        }
        if(keywords.length !== 0){
            for(let keyword of keywords){
                if(keyword?.length > 160){
                    return responseHandler(res, 400, 'Each keyword cannot exceed 160 characters.')
                }
            }
        }
        if(metaDescription?.trim() !== '' && metaDescription?.length > 160){
            return responseHandler(res, 400, 'Meta description cannot exceed 160 characters.')
        }
        if(!image){
            return responseHandler(res, 400, 'Please select a featured image.')
        }

        // Upload Image to Cloudinary
        let uploadedImage
        try{
            uploadedImage = await cloudinary.uploader.upload(image, {
                folder: 'news_images',
                resource_type: 'image'
            })
        }catch(err){
            return responseHandler(res, 500, 'Image upload failed.', null, err)
        }
        
        // Check Slug is Exist
        let generatedSlug = slugGenerator(title)
        const news = await News.findOne({slug: generatedSlug})
        if(news){
            generatedSlug = generatedSlug + '_' + Date.now()
        }

        // Save Data To DB
        const createdNews = await News.create({
            author: crrUser?.id,
            title: title?.trim(),
            slug: generatedSlug,
            description: description?.trim(),
            categories,
            keywords: keywords.length > 0 ? keywords : [],
            metaDescription: metaDescription?.trim(),
            featuredImage: uploadedImage?.secure_url,
            publicId: uploadedImage?.public_id
        })
        if(!createdNews){
            return responseHandler(res, 500, 'News creation failed.')
        }

        return responseHandler(res, 201, 'News created successfully.', createdNews)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Get All News
const getAllNews = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Filter Data From Query
        const {category='', status='', search='', limits=10, page=1} = req.query

        // Filter
        let filter = {}
        if(category?.trim() !== ''){
            filter.categories = {$in: [category?.trim()]}
        }
        const statusOptions = ['pending', 'rejected', 'published']
        if(status?.trim() !== '' && statusOptions.includes(status?.trim())){
            filter.status = status?.trim()
        }
        if(search?.trim() !== ''){
            filter.title = {$regex: search.trim(), $options: 'i'}
        }

        // Pagination
        const skip = parseInt(limits) * (parseInt(page) - 1)

        // Not Loged IN
        if(!crrUser || !crrUser?.id || crrUser?.role === 'user'){
            filter.status = 'published'
            const allNewsCount = await News.countDocuments(filter)
            const allNews = await News.find(filter)
                .populate('categories author')
                .skip(skip)
                .limit(parseInt(limits))
                .sort({'createdAt': -1})

            return responseHandler(res, 200, '', {
                allNews,
                allNewsCount
            })
        }

        // If Crrent User Is Admin
        if(crrUser && crrUser?.role === 'admin'){
            const allNewsCount = await News.countDocuments(filter)
            const allNews = await News.find(filter)
                .populate('categories author')
                .skip(skip)
                .limit(parseInt(limits))
                .sort({'createdAt': -1})

            return responseHandler(res, 200, '', {
                allNews,
                allNewsCount
            })
        }

        // If Crrent User Is Editor
        if(crrUser && crrUser?.role === 'editor'){
            const allNewsCount = await News.countDocuments(filter)
            const allNews = await News.find(filter)
                .populate('categories author')
                .skip(skip)
                .limit(parseInt(limits))
                .sort({'createdAt': -1})

            return responseHandler(res, 200, '', {
                allNews,
                allNewsCount
            })
        }

        // If Crrent User Is Writer
        if(crrUser && crrUser?.role === 'writer'){
            filter.author = crrUser.id
            const allNewsCount = await News.countDocuments(filter)
            const allNews = await News.find(filter)
                .populate('categories author')
                .skip(skip)
                .limit(parseInt(limits))
                .sort({'createdAt': -1})

            return responseHandler(res, 200, '', {
                allNews,
                allNewsCount
            })
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Delete News
const deleteNews = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(!crrUser || (crrUser.role !== 'admin' && crrUser.role !== 'writer')){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Id From Params
        const {id} = req.params
        if(!id){
            return responseHandler(res, 400, 'News ID is required.')
        }

        // Find News
        const news = await News.findById(id)
        if(!news){
            return responseHandler(res, 404, 'News not found.')
        }

        // If Admin
        if(crrUser.role === 'admin'){
            // Delete Featured Image From Cloudinary
            try{
                await cloudinary.uploader.destroy(news?.publicId)
            }catch(err){
                return responseHandler(res, 500, 'Image delete failed.', null, err)
            }

            // Delete News
            await News.findByIdAndDelete(id)
            
            return responseHandler(res, 200, 'News deleted successfully.')
        }

        // Writer Can Delete Only Own News
        if(crrUser.role === 'writer'){
            // Check Author
            if(news.author.toString() !== crrUser.id) {
                return responseHandler(res, 403, 'Access denied.');
            }
            
            // Delete Featured Image From Cloudinary
            try{
                await cloudinary.uploader.destroy(news?.publicId)
            }catch(err){
                return responseHandler(res, 500, 'Image delete failed.', null, err)
            }

            // Delete News
            await News.findByIdAndDelete(id)

            return responseHandler(res, 200, 'News deleted successfully.')
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Get News Details
const getNewsDetails = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(!crrUser || crrUser?.role === 'user'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Slug From Params
        const {slug=''} = req.params
        if(!slug || !slug.trim()){
            return responseHandler(res, 400, 'News slug is required.')
        }

        // Find Query
        const query = {slug}

        // If Writer
        if(crrUser.role === 'writer'){
            query.author = crrUser.id
        }

        // Get News Details
        const newsDetails = await News.findOne(query).populate('categories  author')

        return responseHandler(res, 200, 'News details fetched successfully.', newsDetails)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Update News
const updateNews = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(!crrUser || !['admin', 'writer', 'editor'].includes(crrUser.role)){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get News Data as FormData
        const form = new formidable.IncomingForm({multiples: false})
        const {fields, files} = await new Promise((resolve, reject)=>{
            form.parse(req, (err, fields, files)=>{
                if(err){
                    reject(err)
                    return responseHandler(res, 500, 'Form data parsing error.', null, err)
                }else{
                    resolve({fields, files})
                }
            })
        })

        // Extract Data & Validate
        let id = fields?.newsId[0] || ''
        let title = fields?.title[0] || ''
        let slug = fields?.slug[0] || ''
        let description = fields?.description[0] || ''
        let categories = JSON.parse(fields?.categories[0]) || []
        let keywords = JSON.parse(fields?.keywords[0]) || []
        let metaDescription = fields?.metaDescription[0] || ''
        let status = fields?.status[0] || 'pending'

        let imageFilePath
        let imageUrl
        if(files?.featuredImage && files?.featuredImage.length > 0 && files?.featuredImage[0] !== ''){
            imageFilePath = files?.featuredImage[0]?.filepath
        }else{
            imageUrl = fields?.featuredImageUrl[0]
        }

        // Validate Fields
        if(!id || !id.trim()){
            return responseHandler(res, 400, 'News ID is missing.')
        }
        if(!title || !title?.trim()){
            return responseHandler(res, 400, 'Enter a news title.')
        }
        if(!slug || !slug?.trim()){
            return responseHandler(res, 400, 'Enter a news slug.')
        }
        if(!description || !description?.trim()){
            return responseHandler(res, 400, 'Enter news description.')
        }
        if(!Array.isArray(categories)){
            return responseHandler(res, 400, 'Invalid category format.')
        }
        if(categories?.length === 0){
            return responseHandler(res, 400, 'Please select a category.')
        }
        if(categories?.length > 0){
            const checkValidCategories = await Category.countDocuments({
                _id: {$in: categories}
            })
            if(checkValidCategories !== categories?.length){
                return responseHandler(res, 400, 'Invalid categories selected.')
            }
        }
        if(keywords && !Array.isArray(keywords)){
            return responseHandler(res, 400, 'Invalid keywords format.')
        }
        if(keywords.length > 10){
            return responseHandler(res, 400, 'You can add up to 10 keywords only.')
        }
        if(keywords.length !== 0){
            for(let keyword of keywords){
                if(keyword?.length > 160){
                    return responseHandler(res, 400, 'Each keyword cannot exceed 160 characters.')
                }
            }
        }
        if(metaDescription?.trim() !== '' && metaDescription?.length > 160){
            return responseHandler(res, 400, 'Meta description cannot exceed 160 characters.')
        }
        if(!status || !status.trim()){
            return responseHandler(res, 400, 'Please select a news status.')
        }
        if(!imageFilePath && !imageUrl){
            return responseHandler(res, 400, 'Please select a featured image.')
        }

        // Check News Exist or Not
        let news
        if(crrUser.role === 'admin' || crrUser.role === 'editor'){
            news = await News.findById(id)
        }else if(crrUser.role === 'writer'){
            news = await News.findOne({_id: id, author: crrUser.id})
        }
        if(!news){
            return responseHandler(res, 404, 'News item not found.')
        }

        // If Current User Role Is EDITOR
        if(crrUser.role === 'editor'){
            if(status.trim() !== news?.status?.trim()){
                news.status = status
                await news.save()
                return responseHandler(res, 200, `News status updated to ${status} successfully.`)
            }else{
                return responseHandler(res, 200, `News status already ${status}.`)
            }
        }

        // Upload Image To Cloudinary
        let uploadedImage
        if(imageFilePath && imageFilePath !== ''){
            // Upload
            try{
                uploadedImage = await cloudinary.uploader.upload(imageFilePath, {
                    folder: 'news_images',
                    resource_type: 'image'
                })
            }catch(err){
                return responseHandler(res, 500, 'Image upload failed.', null, err)
            }

            // Delete Prev
            try{
                if(news?.publicId){
                    await cloudinary.uploader.destroy(news?.publicId)
                }
            }catch(err){
                return responseHandler(res, 500, 'Image delete failed.', null, err)
            }
        }

        // Update Data To DB
        if(crrUser.role === 'admin' || crrUser.role === 'writer'){
            // Title
            if(title.trim() !== news?.title?.trim()){
                news.title = title
            }
            // Slug
            if(slug.trim() !== news?.slug?.trim()){
                const generatedSlug = slugGenerator(slug)
                const newsBySlug = await News.findOne({slug: generatedSlug, _id: {$ne: id}})
                if(newsBySlug){
                    // news.slug = generatedSlug + '_' + Date.now()
                    return responseHandler(res, 409, 'Slug already exists.')
                }else{
                    news.slug = generatedSlug
                }
            }
            // Description
            if(description.trim() !== news?.description?.trim()){
                news.description = description
            }
            // Categories
            if(JSON.stringify(categories) !== JSON.stringify(news.categories.map((cat)=>cat.toString()))){
                news.categories = categories
            }
            // Keywords
            if(JSON.stringify(keywords) !== JSON.stringify(news.keywords.map((keyWord)=>keyWord.toString()))){
                news.keywords = keywords
            }
            // Meta Description
            if(metaDescription.trim() !== news?.metaDescription?.trim()){
                news.metaDescription = metaDescription
            }
            // Status
            if(crrUser.role === 'admin'){
                if(status.trim() !== news?.status?.trim()){
                    news.status = status
                }
            }
            // Image
            if(uploadedImage && uploadedImage.secure_url){
                news.featuredImage = uploadedImage.secure_url
                news.publicId = uploadedImage.public_id
            }
        }
        await news.save()

        return responseHandler(res, 200, 'News updated successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Update News Status
const updateNewsSTatus = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(crrUser?.role !== 'admin' && crrUser?.role !== 'editor'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Id From Params
        const {id} = req.params
        if(!id || !id.trim()){
            return responseHandler(res, 400, "Invalid news ID.")
        }

        // Get Data From Body
        const {status} = req.body
        if(!status || !status.trim()){
            return responseHandler(res, 400, "Status is required.")
        }
        const statusOptions = ["pending", "rejected", "published"];
        if(!statusOptions.includes(status)){
            return responseHandler(res, 400, "Invalid status value.")
        }

        // Find News By ID
        const news = await News.findById(id)
        if(!news){
            return responseHandler(res, 404, 'News item not found.')
        }

        // Avoid unnecessary update
        if(news.status === status){
            return responseHandler(res, 200, `News status already ${status}.`)
        }

        // Update Status
        news.status = status
        await news.save()

        return responseHandler(res, 200, `News status updated to ${status} successfully.`)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Upload News Images
const uploadNewsImages = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin' && crrUser.role !== 'writer'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Images From Formidable Form Data
        const form = new formidable.IncomingForm({multiples: true})
        const {fields, files} = await new Promise((resolve, reject)=>{
            form.parse(req, (err, fields, files)=>{
                if(err){
                    reject(err)
                    return responseHandler(res, 500, 'Form data parsing error.', null, err)
                }else{
                    resolve({fields, files})
                }
            })
        })
        if(!files.images || files.images.length === 0){
            return responseHandler(res, 400, "Please select image to upload.")
        }

        // Extract Image
        let allImages = []
        for(let image of files.images){
            // Images File Path
            const filePath = image.filepath

            // Upload Image To Cloudinary
            try{
                // Upload
                const uploadedImage = await cloudinary.uploader.upload(filePath, {
                    folder: 'news_images',
                    resource_type: 'image'
                })

                // Save Cloudinary URL To All Images
                allImages.push({
                    author: crrUser?.id,
                    url: uploadedImage?.secure_url,
                    publicId: uploadedImage?.public_id
                })
            }catch(err){
                return responseHandler(res, 500, 'Image upload failed.', null, err)
            }
        }

        // Save Data To MongoDb
        const savedImages = await Gallery.insertMany(allImages)

        return responseHandler(res, 200, 'Images uploaded successfully.', savedImages)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Get News Images
const getNewsImages = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin' && crrUser.role !== 'writer'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Image From Gallery
        const images = await Gallery.find({author: crrUser.id})
            .sort({createdAt: -1})

        return responseHandler(res, 200, 'Images fetched successfully.', images)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Delete News Image
const deleteNewsImage = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin' && crrUser.role !== 'writer'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Image Id From Params
        const {id} = req.params
        if(!id){
            return responseHandler(res, 400, 'Image ID is required.')
        }

        // Find Image By ID
        const image = await Gallery.findById(id)
        if(!image){
            return responseHandler(res, 404, 'Image not found.')
        }
        if(image?.author?.toString() !== crrUser?.id){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Delete Image From Cloudinary
        try{
            await cloudinary.uploader.destroy(image?.publicId)
        }catch(err){
            return responseHandler(res, 500, 'Image delete failed.', null, err)
        }

        // Delete Image Data From DB
        await Gallery.findByIdAndDelete(id)

        return responseHandler(res, 200, 'Image deleted.',)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Get Single News Details
const getSingleNewsDetails = async (req, res)=>{
    try{
        // Get Slug From Params
        const {slug} = req.params

        // Get Single News Data
        const newsDetails = await News.findOneAndUpdate(
            {slug, status: 'published'},
            {$inc: {viewCount: 1}},
            {new: true}
        ).populate('categories author')

        return responseHandler(res, 200, 'News details fetched successfully.', newsDetails)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// React On News
const reactOnNews = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        
        // Get Data From Body
        const {newsId='', mode=''} = req.body
        
        // Validate
        if(!newsId?.toString()?.trim()){
            return responseHandler(res, 400, 'News not found.')
        }
        if(!mode?.toString()?.trim()){
            return responseHandler(res, 400, 'Reaction type is required.')
        }
        if(!['like', 'dislike'].includes(mode)){
            return responseHandler(res, 400, 'Invalid reaction type. Allowed values are like or dislike.')
        }
        
        // Find News By News Id
        const news = await News.findById(newsId)
        if(!news){
            return responseHandler(res, 404, 'News item not found.')
        }
        
        // Find Liked Or Disliked
        const liked = news?.likes?.includes(crrUser?.id)
        const disliked = news?.dislikes?.includes(crrUser?.id)
        
        // If No Reacts
        if(!liked && ! disliked){
            if(mode === 'like'){
                news.likes.push(crrUser?.id)
            }
        
            if(mode === 'dislike'){
                news.dislikes.push(crrUser?.id)
            }
        }
        
        // If Liked
        if(liked){
            if(mode === 'like'){
                const filteredItems = news?.likes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                news.likes = filteredItems
            }
        
            if(mode === 'dislike'){
                const filteredItems = news?.likes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                news.likes = filteredItems
                news.dislikes.push(crrUser?.id)
            }
        }
        
        // If Disliked
        if(disliked){
            if(mode === 'like'){
                const filteredItems = news?.dislikes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                news.dislikes = filteredItems
                news.likes.push(crrUser?.id)
            }
        
            if(mode === 'dislike'){
                const filteredItems = news?.dislikes?.filter((item)=>item?.toString() !== crrUser?.id?.toString())
                news.dislikes = filteredItems
            }
        }
        
        // Save Data To DB
        await news.save()
        
        return responseHandler(res, 200, 'Updated.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}








module.exports = {
    addNews,
    getAllNews,
    deleteNews,
    getNewsDetails,
    updateNews,
    updateNewsSTatus,
    getNewsImages,
    uploadNewsImages,
    deleteNewsImage,
    getSingleNewsDetails,
    reactOnNews
}