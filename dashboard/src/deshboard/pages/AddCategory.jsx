import {Link, useNavigate} from "react-router";
import Loader from "../../utils/Loader.jsx";
import React, {useEffect, useState} from "react";
import responseHandler from "../../utils/responseHandler.jsx";
import {useDispatch, useSelector} from "react-redux";
import {handleSelectCategoryForEdit} from "../../redux/category/categorySlice.js";
import {useAddCategoryMutation, useUpdateCategoryMutation} from "../../redux/category/categoryApi.js";
import slugGenerator from "../../utils/slugGenerator.js";

function AddCategory(){

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedCategoryForEdit = useSelector((state)=>state.Category.selectedCategoryForEdit)

    // Category States
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Set Selected Category Data To Category States
    useEffect(() => {
        if(selectedCategoryForEdit){
            setId(selectedCategoryForEdit?._id?.toString());
            setName(selectedCategoryForEdit?.name);
            setSlug(selectedCategoryForEdit?.slug);
            setDescription(selectedCategoryForEdit?.description);
            setIsActive(selectedCategoryForEdit?.isActive);
        }
    }, [selectedCategoryForEdit]);

    // Call Add Category API
    const [addCategory, {isLoading: addCategoryLoading}] = useAddCategoryMutation()

    // Handle Submit Add Category Form
    const handleSubmitAddCategoryForm = async (e)=>{
        e.preventDefault();
        try{
            // Validate
            if(!name || !name.trim()){
                return responseHandler(false, "Category name is required.")
            }
            if(description && description.length > 255){
                return responseHandler(false, "Description can't exceed 255 characters.")
            }

            // Generate Slug
            const newSlug = slugGenerator(slug || name)

            // Hit Add Category API
            const response = await addCategory({
                name,
                slug: newSlug,
                description,
                isActive,
            }).unwrap()

            // Reset Category States
            setId("")
            setName("")
            setSlug("")
            setDescription("")

            // Navigate To Categories
            navigate("/dashboard/categories")

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error);
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Update Category API
    const [updateCategory, {isLoading: updateCategoryLoading}] = useUpdateCategoryMutation()

    // Handle Submit Update Category Form
    const handleSubmitUpdateCategoryForm = async (e)=>{
        e.preventDefault();
        try{
            // Validate
            if(!id || !id.trim()){
                return responseHandler(false, "Category id is required.")
            }
            if(!name || !name.trim()){
                return responseHandler(false, "Category name is required.")
            }
            if(description && description.length > 255){
                return responseHandler(false, "Description can't exceed 255 characters.")
            }

            // Generate Slug
            const newSlug = slugGenerator(slug || name)

            // Hit Update Category API
            const response = await updateCategory({
                id,
                name,
                slug: newSlug,
                description,
                isActive,
            }).unwrap()

            // Reset Category States
            setId("")
            setName("")
            setSlug("")
            setDescription("")

            // Navigate To Categories
            navigate("/dashboard/categories")

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error);
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className="bg-white rounded-md">
            {/*  Section Header  */}
            <div className="flex justify-between p-4">
                {/*  Title  */}
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{selectedCategoryForEdit?._id ? "Update" : "Add"} Category</h2>
                    {selectedCategoryForEdit?._id && <button onClick={()=>{
                        dispatch(handleSelectCategoryForEdit(null))
                        setId("")
                        setName("")
                        setSlug("")
                        setDescription("")
                    }} className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-full text-xs uppercase cursor-pointer">Cancel</button>}
                </div>

                {/*  Writer Navigate  */}
                <Link to={"/dashboard/categories"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">Categories</Link>
            </div>

            {/*  Add User Form  */}
            <div className="p-4">
                <form onSubmit={selectedCategoryForEdit?._id ? handleSubmitUpdateCategoryForm : handleSubmitAddCategoryForm} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/*  Name & Slug  */}
                    <div className="grid grid-cols-1 gap-y-6">
                        {/*  Name  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Name*</label>
                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} disabled={addCategoryLoading || updateCategoryLoading} required placeholder="Name" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        {/*  Slug  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Slug</label>
                            <input type="text" value={slug} onChange={(e)=>setSlug(e.target.value)} disabled={addCategoryLoading || updateCategoryLoading} placeholder="Slug" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        {/*  Status  */}
                        <div className="flex gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Status:</label>

                            {/*  Radio Inputs  */}
                            <div className="ml-5">
                                {/*  Active  */}
                                <div className="flex items-center gap-1">
                                    <input checked={isActive} type="radio" value={true} onChange={()=>setIsActive(true)} name="status" id="active" className="accent-indigo-500 h-4 w-4"/>
                                    <label htmlFor="active">Active</label>
                                </div>

                                {/*  Dective  */}
                                <div className="flex items-center gap-1 mt-2">
                                    <input checked={!isActive} type="radio" value={false} onChange={()=>setIsActive(false)} name="status" id="deactive" className="accent-indigo-500 h-4 w-4"/>
                                    <label htmlFor="deactive">Deactive</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Description  */}
                    <div className="grid grid-cols-1 gap-x-8 mb-3">
                        {/*  Description  */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[15px] font-semibold text-gray-600">Description</label>
                            <textarea type="text" value={description} onChange={(e)=>setDescription(e.target.value)} maxLength={255} disabled={addCategoryLoading || updateCategoryLoading} placeholder="Description" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-[100px]"></textarea>
                        </div>
                    </div>

                    {/*  Submit  */}
                    <button disabled={addCategoryLoading || updateCategoryLoading} className={`${(addCategoryLoading || updateCategoryLoading) && "opacity-50"} text-white font-semibold px-5 py-2 bg-indigo-500 hover:bg-indigo-700 cursor-pointer rounded-md min-w-[110px] w-max`}>{(addCategoryLoading || updateCategoryLoading) ? <Loader size={20}/> : `${selectedCategoryForEdit?._id ? "Update" : "Add"} Category`}</button>
                </form>
            </div>
        </div>
    )
}

export default AddCategory;