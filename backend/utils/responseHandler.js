const responseHandler = (res, statusCode, message, data={}, error=null)=>{
    if(statusCode >= 400){
        console.log(error)
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            error: error ? error.message : null
        })
    }else{
        return res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data
        })
    }
}

module.exports = responseHandler



