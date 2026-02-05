import {IoIosCloseCircle, IoMdClose} from "react-icons/io";
import {FaImage} from "react-icons/fa";
import Loader from "../../utils/Loader.jsx";
import {IoClose, IoCopyOutline} from "react-icons/io5";
import copy from "copy-to-clipboard";
import {useDeleteNewsImageMutation} from "../../redux/news/newsApi.js";
import responseHandler from "../../utils/responseHandler.jsx";

function Gallery({setShowModal, images, selectedImagesToUpload, setSelectedImagesToUpload, uploadNewsImagesLoading}){

    // Call Delete News Image API
    const [deleteNewsImage, {isLoading: deleteNewsImageLoading}] = useDeleteNewsImageMutation()

    // Handle Delete News Image
    const handleDeleteNewsImage = async (id)=>{
        try{
            // Validation
            if(!id){
                return responseHandler(false, 'Image ID is required.')
            }

            // Hit Delete News Image API
            const response = await deleteNewsImage({id}).unwrap()

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    return(
        <div className={`${deleteNewsImageLoading && "pointer-events-none cursor-not-allowed"} w-screen h-screen fixed top-0 left-0 z-[999]`}>
            <div className="w-full h-full relative">
                <div className="bg-gray-400/80 w-full h-full absolute top-0 left-0 z-[998]">
                    <div className="absolute bg-white opacity-100! w-[50%] p-4 rounded-sm h-[85vh] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-[1000] overflow-y-auto">
                        {/*  Header  */}
                        <div className="pb-3 flex justify-between items-center w-full">
                            {/*  Title  */}
                            <h2>Gallery</h2>

                            {/*  Close Button  */}
                            <div onClick={()=> {
                                setShowModal((show) => !show)
                                setSelectedImagesToUpload([])
                            }} className="text-xl cursor-pointer">
                                <IoIosCloseCircle />
                            </div>
                        </div>

                        {/*  Select Image  */}
                        <label htmlFor="images" className={`${uploadNewsImagesLoading && "cursor-not-allowed"} w-full h-[180px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed`}>
                            <div className="flex justify-center items-center flex-col gap-2">
                                <span className="text-2xl"><FaImage/></span>
                                <span>{selectedImagesToUpload?.length === 0 ? "Select Image" : `${selectedImagesToUpload?.length-1} image ${uploadNewsImagesLoading ? "uploading..." : "selected"}`}</span>
                            </div>
                        </label>

                        {/*  Uploaded Images  */}
                        <div className="mt-3 font-semibold">
                            Uploaded Images
                        </div>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-4 mt-3">
                            {
                                images?.length > 0 && images?.map((image, index)=>(
                                    <div className="relative group border border-gray-400" key={index}>
                                        <img src={image?.url} alt="images" className="w-full h-[160px] object-center object-cover overflow-hidden"/>
                                        <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-max gap-2">
                                            <IoCopyOutline onClick={()=>copy(image?.url)} className="bg-white/90 text-gray 700 h-12 w-12 rounded-full p-3 cursor-pointer active:opacity-50"/>
                                            <IoClose onClick={()=>handleDeleteNewsImage(image?._id?.toString())} className="bg-white/90 text-red-600 h-12 w-12 rounded-full p-3 cursor-pointer active:opacity-50"/>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gallery;