import toast from "react-hot-toast";

const responseHandler = (isSuccess, message)=>{
    if(isSuccess){
        return toast.success(message)
    }else{
        return toast.error(message)
    }
}

export default responseHandler