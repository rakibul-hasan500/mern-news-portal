import {RiDeleteBin5Line} from "react-icons/ri";
import {IoCloseSharp} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {
    handleGetDeleteIdAndType,
    handleToggleDeleteLoading,
    handleToggleDeleteWarningShow
} from "../../redux/app/appSlice.js";
import responseHandler from "../../utils/responseHandler.jsx";
import {useDeleteCategoryMutation} from "../../redux/category/categoryApi.js";
import {useDeleteUserMutation} from "../../redux/auth/authApi.js";
import {useEffect} from "react";
import {useDeleteNewsMutation} from "../../redux/news/newsApi.js";
import {useDeleteCommentMutation} from "../../redux/comment/commentApi.js";

function DeleteWarning(){

    const dispatch = useDispatch();
    const deleteLoading = useSelector((state)=>state.App.deleteLoading)
    const deleteType = useSelector((state)=>state.App.deleteType);
    const deleteId = useSelector((state)=>state.App.deleteId);

    // Call Delete Category API
    const [deleteCategory, {isLoading: deleteCategoryLoading}] = useDeleteCategoryMutation()

    // Call Delete User API
    const [deleteUser, {isLoading: deleteUserLoading}] = useDeleteUserMutation({})

    // Call Delete News API
    const [deleteNews, {isLoading: deleteNewsLoading}] = useDeleteNewsMutation()

    // Call Delete Comment API
    const [deleteComment, {isLoading: deleteCommentLoading}] = useDeleteCommentMutation()

    // Trigger Delete API
    const triggerApi = async ()=>{
        try{
            // Validate
            if(!deleteId || !deleteId.trim()){
                return responseHandler(false, "Invalid user ID.")
            }
            if(!deleteType || !deleteType.trim()){
                return responseHandler(false, "Invalid API type.")
            }

            // Response
            let response

            // Hit Delete API
            if(deleteType && deleteType === "category"){
                response = await deleteCategory({id: deleteId}).unwrap()
            }else if(deleteType && deleteType === "user"){
                response = await deleteUser({id: deleteId}).unwrap()
            }else if(deleteType && deleteType === "news"){
                response = await deleteNews({id: deleteId}).unwrap()
            }else if(deleteType && deleteType === "comment"){
                response = await deleteComment({id: deleteId}).unwrap()
            }

            // Clear Delete Data
            dispatch(handleGetDeleteIdAndType({id: null, type: null}))

            return responseHandler(true, response?.message)
        }catch(error){
            console.error(error)
            return responseHandler(false, error?.data?.message)
        }
    }

    // Delete Loading
    useEffect(()=>{
        dispatch(handleToggleDeleteLoading(deleteUserLoading || deleteCategoryLoading || deleteNewsLoading))
        if(!deleteUserLoading && !deleteCategoryLoading && !deleteNewsLoading){
            dispatch(handleToggleDeleteLoading(false))
        }
    }, [dispatch, deleteUserLoading, deleteCategoryLoading, deleteNewsLoading]);

    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10000">
            {/* Modal */}
            <div className="bg-white rounded-2xl p-8 w-11/12 max-w-md relative shadow-xl transform scale-100">
                {/* Close Button */}
                <button onClick={()=> {
                    dispatch(handleToggleDeleteWarningShow())
                    dispatch(handleGetDeleteIdAndType({id: null, type: null}))
                }} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    <IoCloseSharp className="cursor-pointer rounded-full text-xl"/>
                </button>

                {/* Modal Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RiDeleteBin5Line className="text-3xl text-red-600"/>
                    </div>

                    {/* Title & Message */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Delete</h2>
                    <p className="text-gray-500 mb-8">Are you sure you want to delete?</p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={()=> {
                            dispatch(handleToggleDeleteWarningShow())
                            dispatch(handleGetDeleteIdAndType({id: null, type: null}))
                        }} className="bg-gray-100 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 cursor-pointer">Cancel</button>

                        <button onClick={()=>{
                            dispatch(handleToggleDeleteWarningShow())
                            triggerApi()
                        }} disabled={deleteLoading} className={`${deleteLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 cursor-pointer`}>{deleteLoading ? "Deleting..." : "Confirm"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteWarning;