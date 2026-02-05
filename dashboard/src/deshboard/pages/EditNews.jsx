import {Link, useNavigate, useParams} from "react-router";
import {FaImage} from "react-icons/fa";
import JoditEditor from "jodit-react";
import {useEffect, useRef, useState} from "react";
import Gallery from "../components/Gallery.jsx";
import {useAllCategoriesQuery} from "../../redux/category/categoryApi.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {
    useGetNewsDetailsQuery,
    useGetNewsImagesQuery,
    useUpdateNewsMutation,
    useUploadNewsImagesMutation
} from "../../redux/news/newsApi.js";
import Loader from "../../utils/Loader.jsx";
import {IoMdArrowDropdown} from "react-icons/io";
import {useSelector} from "react-redux";

function EditNews(){

    const navigate = useNavigate();
    const userInfo = useSelector((state)=>state.App.userInfo);

    // Filter States
    const [limits, setLimits] = useState(10);

    // Call Get Categories API
    const {data: categoriesData, isLoading: categoriesLoading} = useAllCategoriesQuery({
        searchText: "",
        limits,
        page: 1
    })

    // Images
    const [selectedImagesToUpload, setSelectedImagesToUpload] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [images, setImages] = useState([]);

    // Call Upload News Images API
    const [uploadNewsImages, {isLoading: uploadNewsImagesLoading}] = useUploadNewsImagesMutation()

    // Handle Images Change
    const handleImagesChange = async (e)=>{
        try{
            // Get Selected Files
            const files = e.target.files
            if(!files || files.length === 0){
                return responseHandler(false, "Please select image to upload.")
            }

            // Set Files To selectedImagesToUpload
            setSelectedImagesToUpload([selectedImagesToUpload, ...files])

            // Create Form Data
            const formData = new FormData()

            // Add Files To Form Data
            for(let i = 0; i < files.length; i++){
                formData.append("images", files[i]);
            }

            // Hit Upload News API
            const response = await uploadNewsImages(formData).unwrap();

            // Clear selectedImagesToUpload
            setSelectedImagesToUpload([])

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error);
            return responseHandler(false, error?.data?.message)
        }
    }

    // Call Get News Images API
    const {data: getNewsImages, isLoading: getNewsImagesLoading} = useGetNewsImagesQuery()
    useEffect(() => {
        if(getNewsImages?.data?.length > 0){
            setImages(getNewsImages?.data || []);
        }else{
            setImages([])
        }
    }, [getNewsImages]);

    // Form States
    const editor = useRef(null)
    const [imgUrl, setImgUrl] = useState("");

    const [newsId, setNewsId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [metaDescription, setMetaDescription] = useState("");
    const [newsStatus, setNewsStatus] = useState("")

    // Call Single News Details API
    const params = useParams();
    const newsSlug = params.slug;
    const {data: newsDetails, isLoading: newsDetailsLoading} = useGetNewsDetailsQuery({slug: newsSlug})
    useEffect(() => {
        if(newsDetails && newsDetails?.data?._id){
            setNewsId(newsDetails?.data?._id);
            setTitle(newsDetails?.data?.title);
            setSlug(newsDetails?.data?.slug);
            setImgUrl(newsDetails?.data?.featuredImage);
            setDescription(newsDetails?.data?.description);
            const categoriesItems = newsDetails?.data?.categories?.map((cat)=>cat._id.toString())
            setCategories(categoriesItems)
            setKeywords(newsDetails?.data?.keywords || []);
            setMetaDescription(newsDetails?.data?.metaDescription || '');
            setNewsStatus(newsDetails?.data?.status)
        }
    }, [newsDetails]);

    // Featured Image Selector Handler
    const handleImageChange = (e)=>{
        const {files} = e.target;
        if(files && files.length > 0){
            setImgUrl(URL.createObjectURL(files[0]));
            setImage(files[0]);
        }
    }

    // Category Selector
    const handleSelectCategories = (id)=>{
        if(categories.includes(id)){
            const filteredCategories = categories.filter((category) => category !== id);
            setCategories(filteredCategories);
        }else{
            setCategories([...categories, id]);
        }
    }

    // Call Add News API
    const [updateNews, {isLoading: updateNewsLoading}] = useUpdateNewsMutation()

    // Handle Add Post
    const handdleUpdateNews = async (e)=>{
        e.preventDefault();
        try{
            // Validation
            if(!newsId || !newsId.trim()){
                return responseHandler(false, "News ID not found.");
            }
            if(!title || !title.trim()){
                return responseHandler(false, "Enter a news title.");
            }
            if(!description || !description.trim()){
                return responseHandler(false, "Enter news description.");
            }
            if(!categories || categories.length === 0){
                return responseHandler(false, "Please select a category.");
            }
            if(keywords.length > 10){
                return responseHandler(false, 'You can add up to 10 keywords only.')
            }
            if(keywords.length !== 0){
                for(let keyword of keywords){
                    if(keyword?.length > 160){
                        return responseHandler(false, 'Each keyword cannot exceed 160 characters.')
                    }
                }
            }
            if(metaDescription?.trim() !== '' && metaDescription?.length > 160){
                return responseHandler(false, 'Meta description cannot exceed 160 characters.')
            }
            if((!image || !imgUrl.trim()) && !imgUrl){
                return responseHandler(false, "Please select a featured image.");
            }
            if(!["pending", "rejected", "published"].includes(newsStatus)){
                return responseHandler(false, "Please select a valid news status.");
            }
            if(!newsStatus || !newsStatus.trim()){
                return responseHandler(false, "Please select a news status.");
            }

            // Get Form Data
            const formData = new FormData()
            formData.append("newsId", newsId);
            formData.append("title", title)
            formData.append("slug", slug)
            image && formData.append("featuredImage", image)
            formData.append("featuredImageUrl", imgUrl)
            formData.append("description", description)
            formData.append("categories", JSON.stringify(categories))
            formData.append("keywords", JSON.stringify(keywords))
            formData.append("metaDescription", metaDescription)
            formData.append("status", newsStatus)

            // Hit Add News API
            const response = await updateNews(formData).unwrap();

            // Reset States
            setImages("")
            setImgUrl("")

            setNewsId("")
            setTitle("")
            setImage("")
            setDescription("")
            setCategories([])
            setNewsStatus("")
            setKeywords([])
            setMetaDescription("")

            // Navigate
            navigate("/dashboard/news")

            return responseHandler(true, response?.message);
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
                <h2 className="text-xl font-semibold">Edit News</h2>

                {/*  Writer Navigate  */}
                <Link to={"/dashboard/news"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">View All</Link>
            </div>

            {/*  Add News  */}
            <div className="flex flex-col lg:flex-row">
                {/*  Contents  */}
                <div className="flex-1 p-4">
                    {/*  Add News Form  */}
                    <div className="">
                        {/*  Title  */}
                        <div>
                            <label htmlFor="title" className="block font-medium text-gray-600 mb-2">Title</label>
                            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter news title" id="title" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>

                        {/*  Slug  */}
                        <div className="mt-3">
                            <label htmlFor="slug" className="block font-medium text-gray-600 mb-2">Slug</label>
                            <input type="text" value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="Enter news slug" id="slug" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>

                        {/*  Description  */}
                        <div>
                            {/*  Label & Image Icon  */}
                            <div className="flex justify-between items-center mb-2 mt-4">
                                <label htmlFor="desc" className="block font-medium text-gray-600 mb-2">Description</label>
                                {userInfo?.role !== "editor" && <div onClick={()=>setShowModal((show)=>!show)} className="text-indigo-500 hover:text-indigo-700 cursor-pointer">
                                    <FaImage className="text-2xl"/>
                                </div>}
                            </div>

                            {/*  Text Editor  */}
                            <JoditEditor
                                ref={editor}
                                value={description}
                                onBlur={(desc)=>setDescription(desc)}
                                onChange={()=>{}}
                                tabIndex={1}
                                config={{
                                    height: "700",
                                }}
                                className="w-full border border-gray-400 rounded-md"
                            />
                        </div>

                        {/* Keywords */}
                        <div className="mt-4">
                            <label className="block font-medium text-gray-600 mb-2">Keywords</label>

                            {/* Keywords Tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {keywords.map((keyword, idx) => (
                                    <div key={idx} className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                                        <span>{keyword}</span>
                                        <button type="button" onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setKeywords(keywords.filter((k, i) => i !== idx))
                                        }} className="ml-1 hover:text-red-500 font-bold">&times;</button>
                                    </div>
                                ))}
                            </div>

                            {/* Input Box */}
                            <input type="text" placeholder="Type keyword and press Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.stopPropagation()
                                        const value = e.target.value.trim();
                                        if (value && !keywords.includes(value)) {
                                            setKeywords([...keywords, value]);
                                            e.target.value = "";
                                        }
                                    }
                                }} maxLength={160}/>
                            <p className="text-gray-400 text-sm mt-1">Press Enter to add keywords. Each max 160 characters.</p>
                        </div>

                        {/* Meta Description */}
                        <div className="mt-4">
                            <label htmlFor="metaDescription" className="block font-medium text-gray-600 mb-2">Meta Description</label>
                            <textarea value={metaDescription} onChange={(e)=>setMetaDescription(e.target.value)} placeholder="Add meta description for SEO" id="metaDescription" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none"/>
                            <p className="text-gray-400 text-sm mt-1">Max 160 characters.</p>
                        </div>
                    </div>

                    {/*  Image Modal  */}
                    <div className={`${uploadNewsImagesLoading && "pointer-events-none"}`}>
                        {
                            showModal &&
                            <Gallery
                                setShowModal={setShowModal}
                                images={images}
                                selectedImagesToUpload={selectedImagesToUpload}
                                setSelectedImagesToUpload={setSelectedImagesToUpload}
                                uploadNewsImagesLoading={uploadNewsImagesLoading}
                            />
                        }
                        <input type="file" multiple onChange={handleImagesChange} name="images" id="images" className="hidden overflow-hidden"/>
                    </div>

                    {/*  Submit Button  */}
                    <button disabled={updateNewsLoading} onClick={handdleUpdateNews} className={`${updateNewsLoading  ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} hidden lg:block text-white bg-indigo-500 hover:bg-indigo-700 px-5 py-2 rounded-md mt-4 font-semibold`}>{updateNewsLoading ? <Loader color={"#fff"} size={20}/> : "Update News"}</button>
                </div>

                {/*  Content Bar  */}
                <div className="w-full lg:w-[400px] p-4 mt-4">
                    {/*  Status Selector  */}
                    <label className={`${userInfo?.role === "writer" && "hidden"} block font-medium text-gray-600 mb-2 mt-5`}>Status</label>
                    <div className={`${userInfo?.role === "writer" && "hidden"} relative group w-full`}>
                        <div className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-100 text-gray-700 capitalize flex items-center justify-between font-semibold">
                            {newsStatus || "Select Status"}
                            <IoMdArrowDropdown className="text-lg"/>
                        </div>

                        {/* Dropdown */}
                        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 divide-y divide-gray-300">
                            {["pending", "published", "rejected"].map((status) => (
                                <div key={status} onClick={()=>setNewsStatus(status)} className={`px-4 py-2 cursor-pointer hover:bg-gray-700 hover:text-white ${newsStatus === status ? "bg-white text-gray-700" : ""}`}>{status}</div>
                            ))}
                        </div>
                    </div>

                    {/*  Image  */}
                    <label className="block font-medium text-gray-600 mb-2 mt-5">Featured Image</label>
                    <div>
                        {
                            imgUrl !== "" ? (
                                <label htmlFor="img" className="w-full h-[240px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-500 rounded-lg text-gray-500 hover:border-indigo-500 mt-4 overflow-hidden">
                                    <img src={imgUrl} alt="" className="object-cover object-center"/>
                                </label>
                            ) : (
                                <label htmlFor="img" className="w-full h-[240px] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-500 rounded-lg text-gray-500 hover:border-indigo-500 mt-4 bg-gray-50">
                                    <FaImage className="text-4xl mb-2"/>
                                    <span className="font-medium">Select Image</span>
                                </label>
                            )
                        }
                    </div>
                    <input type="file" onChange={handleImageChange} id="img" className="hidden overflow-hidden" required/>

                    {/*  Category Selector  */}
                    <div className="mt-6">
                        <label htmlFor="description" className="block font-medium text-gray-600 mb-2">Categories</label>

                        {/*  Categories  */}
                        <div>
                            {
                                categoriesData?.data?.categories?.map((category, index)=>(
                                    <div className="flex items-center gap-1.5 mt-1.5" key={index}>
                                        <input type={"checkbox"} name={"category"} id={category?._id?.toString()}  checked={categories?.includes(category?._id?.toString())} onChange={()=>handleSelectCategories(category?._id?.toString())} className="h-4 w-4 accent-red-500"/>
                                        <label htmlFor={category?._id?.toString()} className="text-base text-gray-500">{category?.name}</label>
                                    </div>
                                ))
                            }
                        </div>

                        {/*  Category Pagination  */}
                        <div>
                            {
                                (limits === categoriesData?.data?.categoriesCount) ? (
                                    <button onClick={()=>setLimits(10)} className="text-indigo-400 font-semibold mt-1 cursor-pointer">See Less</button>
                                ) : (
                                    <button onClick={()=>setLimits(categoriesData?.data?.categoriesCount)} className="text-indigo-400 font-semibold mt-1 cursor-pointer">See All</button>
                                )
                            }
                        </div>

                        {/*  Submit Button  */}
                        <button disabled={updateNewsLoading} onClick={handdleUpdateNews} className={`${updateNewsLoading  ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} block lg:hidden text-white bg-indigo-500 hover:bg-indigo-700 px-5 py-2 rounded-md mt-4 font-semibold`}>{updateNewsLoading ? <Loader color={"#fff"} size={20}/> : "Update News"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditNews;