const jwt = require("jsonwebtoken")
const responseHandler = require("../../utils/responseHandler")
const User = require("../models/user.model")


const verifyLogin = async (req, res, next)=>{
    try{
        // Get Refresh Token
        const refreshToken = req.cookies.refreshToken || null
        if(!refreshToken){
            return responseHandler(res, 401, 'Authentication required. Please login to continue.')
        }

        // Verify Refresh Token
        let verifyRefresh
        try{
            verifyRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        }catch(error){
            return responseHandler(res, 401, "Session expired. Please login again.")
        }

        // Get Access Token
        const accessToken = req.cookies.accessToken || null

        if(accessToken){
            try{
                // Verify Access Token
                let verifyAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)

                // Get User Id From Verify Token & Find User
                // const {id} = verifyAccess
                // const user = await User.findById(id)
                // if(!user){
                //     return responseHandler(res, 404, 'User not registered.')
                // }

                // Send User Data
                req.user = {
                    id: verifyAccess.id,
                    name: verifyAccess.name,
                    role: verifyAccess.role
                }

                return next()
            }catch(error){
                // Get User Id From Verify Token & Find User
                const {id} = verifyRefresh
                const user = await User.findById(id)
                if(!user){
                    return responseHandler(res, 404, 'User not registered.')
                }

                // Generate New Access Token And Set On Cookie
                const userObj = {
                    id: user._id.toString(),
                    name: user.name,
                    role: user.role
                }
                // Access Token
                const accessToken = jwt.sign(userObj, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES})
                // Access - Save To Cookie
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.MODE === 'production',
                    sameSite: 'strict',
                    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_COUNT)
                })

                // Send User Data
                req.user = userObj

                return next()
            }
        }else{
            // Get User Id From Verify Token & Find User
            const {id} = verifyRefresh
            const user = await User.findById(id)
            if(!user){
                return responseHandler(res, 404, 'User not registered.')
            }

            // Generate New Access Token And Set On Cookie
            const userObj = {
                id: user._id.toString(),
                name: user.name,
                role: user.role
            }
            // Access Token
            const accessToken = jwt.sign(userObj, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES})
            // Access - Save To Cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.MODE === 'production',
                sameSite: 'strict',
                maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_COUNT)
            })

            // Send User Data
            req.user = userObj

            return next()
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}




module.exports = verifyLogin