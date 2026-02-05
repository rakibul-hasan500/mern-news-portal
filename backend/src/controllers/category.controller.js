const responseHandler = require("../../utils/responseHandler")
const slugGenerator = require("../../utils/slugGenerator")
const Category = require("../models/category.model")


// Add Category
const addCategory = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get Data From Body
        const {name, slug, description, isActive=true} = req.body

        // Validate
        if(!name || !name.trim()){
            return responseHandler(res, 400, 'Category name is required.')
        }
        if(description && description.length > 255){
            return responseHandler(res, 400, "Description can't exceed 255 characters.")
        }
        if(typeof isActive !== 'boolean'){
            return responseHandler(res, 400, 'Invalid isActive value.')
        }

        // Generate Slug
        const newSlug = slugGenerator(slug || name)

        // Find Category By Slug
        const existingCategory = await Category.findOne({slug: newSlug})
        if(existingCategory){
            return responseHandler(res, 409, 'Category slug already exists.')
        }

        // Create Category
        const category = await Category.create({
            name,
            slug: newSlug,
            description,
            isActive
        })

        return responseHandler(res, 201, 'Category added successfully.', category)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Update Category
const updateCategory = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get Data From Body
        const {id, name, slug, description, isActive=true} = req.body

        // Validate
        if(!id || !id.trim()){
            return responseHandler(res, 400, 'Category ID is required.')
        }
        if(!name || !name.trim()){
            return responseHandler(res, 400, 'Category name is required.')
        }
        if(description && description.length > 255){
            return responseHandler(res, 400, "Description can't exceed 255 characters.")
        }
        if(typeof isActive !== 'boolean'){
            return responseHandler(res, 400, 'Invalid isActive value.')
        }

        // Generate Slug
        const newSlug = slugGenerator(slug || name)

        // Find Category By Slug
        const existingCategory = await Category.findOne({
            slug: newSlug,
            _id: {$ne: id}
        })
        if(existingCategory){
            return responseHandler(res, 409, 'Category slug already exists.')
        }

        // Find Category
        const category = await Category.findById(id)
        if(!category){
            return responseHandler(res, 404, 'Category not found.')
        }

        // Save Data To DB
        category.name = name
        category.slug = newSlug
        category.description = description
        category.isActive = isActive
        await category.save()

        return responseHandler(res, 200, 'Category updated successfully.', category)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Delete Category
const deleteCategory = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Id From Params
        const {id} = req.params

        // Validate
        if(!id || !id.trim()){
            return responseHandler(res, 400, "Category ID is required!")
        }

        // Find Category By ID
        const category = await Category.findByIdAndDelete(id)
        if(!category){
            return responseHandler(res, 404, 'Category not found.')
        }

        return responseHandler(res, 200, 'Category deleted successfully!')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Get Categories
const getAllCategories = async (req, res)=>{
    try{
        // Get Filter Data From req.query
        const {searchText='', limits=10, page=1} = req.query

        // Filter
        let filter = {}
        if(searchText){
            filter.name = {$regex: searchText, $options: 'i'}
        }

        // Categories Count
        const categoriesCount = await Category.countDocuments(filter)

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limits)

        // Categories
        const categories = await Category.find(filter)
        .skip(skip)
        .limit(parseInt(limits))
        .collation({locale: 'en', strength: 2})
        .sort({name: 1})

        return responseHandler(res, 200, 'Categories fetched successfully.', {
            categories,
            categoriesCount
        })
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Get SIngle Category
const getSingleCategory = async (req, res)=>{
    try{
        // Get Slug From Params
        const {slug} = req.params

        // Categories
        const category = await Category.findOne({slug})

        return responseHandler(res, 200, 'Category fetched successfully.', category)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}







module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getSingleCategory
}