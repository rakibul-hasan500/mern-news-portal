const jwt = require("jsonwebtoken")
const responseHandler = require("../../utils/responseHandler")
const User = require("../models/user.model")
const bcrypt = require('bcrypt')
const formidable = require('formidable')
const fs = require('fs/promises')
const path = require('path')
const sendMail = require("../../config/nodemailer")
const cloudinary = require('../../config/cloudinary')
const Settings = require("../models/settings.model")


// Login
const login = async (req, res)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    try{
        // Get Data From Body
        const {email, password, remember=false} = req.body

        // Validation
        if(!email || email.trim() === ""){
            return responseHandler(res, 400, "Enter your email address.")
        }
        if(!emailRegex.test(email)){
            return responseHandler(res, 400, "Enter a valid email address.")
        }
        if(!password){
            return responseHandler(res, 400, "Enter your password.")
        }
        if(password.length < 8){
            return responseHandler(res, 400, "Password must be at least 8 characters long.")
        }
        if(typeof remember !== 'boolean'){
            return responseHandler(res, 400, "Remember me must be true or false.")
        }

        // Find User
        const user = await User.findOne({email}).select('+password')
        if(!user){
            return responseHandler(res, 404, 'User not registered.')
        }

        // Temporary Block Checker
        if(user.blockedTime && user.blockedTime > Date.now()){
            const remainingTime = Math.ceil((user.blockedTime - Date.now()) / (60 * 1000))

            return responseHandler(res, 403, `Account blocked. Try again after ${remainingTime} minutes.`)
        }

        // Match Password
        const matchPassword = await bcrypt.compare(password, user.password)
        if(!matchPassword){
            // Update Wrong Password Count
            user.wrongPasswordCount += 1

            // Update Wrong Password Block Time
            if(user.wrongPasswordCount >= 5){
                user.blockedTime = new Date(Date.now() + 30 * 60 * 1000)
                user.wrongPasswordCount = 0
                await user.save()

                return responseHandler(res, 401, 'Password is incorrect. Account temporarily blocked.')
            }

            // Save User
            await user.save()

            return responseHandler(res, 401, 'Email or password is incorrect.')
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000)

        // Get App Name
        const settings = await Settings.findOne()
        const appName = settings?.appName || 'YourAppName'
        // Send Otp To Email
        let subject = `${appName} Security Verification: One-Time Password (OTP)`
        let text = `Your OTP for ${appName} is: ${otp}. It is valid for 5 minutes. Do not share it with anyone.`

        let html = await fs.readFile(path.join(process.cwd(), '/templates', 'otpTemplate.html'), 'utf-8')
        html = html.replace('[YourAppName]', appName)
        html = html.replace('[OTP]', otp)
        try{
            await sendMail(user.email, subject, text, html)
        }catch(error){
            return responseHandler(res, 500, 'Failed to send OTP email.', null, error)
        }

        // Hash OTP & Save To DB
        const hashedOtp = await bcrypt.hash(otp.toString(), 10)
        user.otp = hashedOtp
        user.otpType = 'login'
        user.remember = remember
        user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()

        // Verify Mode Cookie
        res.cookie('verifyMode', true, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 20 * 60 * 1000
        })

        // Resend Otp Token
        const resendOtpToken = jwt.sign({id: user._id.toString(), email: user.email, remember}, process.env.JWT_RESEND_OTP_SECRET, {expiresIn: process.env.RESEND_OTP_EXPIRES})
        res.cookie('resendOtpToken', resendOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.RESEND_OTP_EXPIRES_COUNT)
        })

        // Verify Otp Token
        const verifyOtpToken = jwt.sign({id: user._id.toString(), email: user.email, remember}, process.env.JWT_VERIFY_OTP_SECRET, {expiresIn: process.env.VERIFY_OTP_EXPIRES})
        res.cookie('verifyOtpToken', verifyOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.VERIFY_OTP_EXPIRES_COUNT)
        })

        // Save OTP Expire Time To Cookie
        res.cookie('otpExpireTime', Date.now() + 5 * 60 * 1000, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
        })

        return responseHandler(res, 200, 'Login successful! OTP has been sent to your email.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Signup
const signup = async (req, res)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    try{
        // Get User Data From Body
        const {name, email, password, confirmPassword} = req.body

        // Validate
        if(!name?.trim()){
            return responseHandler(res, 400, 'Enter your name.')
        }
        if(!email?.trim()){
            return responseHandler(res, 400, 'Enter your email address.')
        }
        if(!emailRegex.test(email)){
            return responseHandler(res, 400, 'Invalid email address.')
        }
        if(!password){
            return responseHandler(res, 400, 'Enter your password.')
        }
        if(password.length < 8){
            return responseHandler(res, 400, 'Password must be at least 8 characters long.')
        }
        if(!/[A-Z]/.test(password)){
            return responseHandler(res, 400, 'Password must contain at least one uppercase letter.')
        }
        if(!/[a-z]/.test(password)){
            return responseHandler(res, 400, 'Password must contain at least one lowercase letter.')
        }
        if(!/[0-9]/.test(password)){
            return responseHandler(res, 400, 'Password must contain at least one number.')
        }
        if(!/[^A-Za-z0-9]/.test(password)){
            return responseHandler(res, 400, 'Password must contain at least one special character.')
        }
        if(!confirmPassword){
            return responseHandler(res, 400, 'Confirm your password.')
        }
        if(password !== confirmPassword){
            return responseHandler(res, 400, 'Passwords do not match.')
        }

        // Chect Exist User
        const existingUser = await User.findOne({email})
        if(existingUser){
            return responseHandler(res, 409, 'User already registered.')
        }

        // Generate OTP & Password
        const otp = Math.floor(100000 + Math.random() * 900000)
        
        // Sent OTP To Email // Get App Name
        const settings = await Settings.findOne()
        const appName = settings?.appName || 'YourAppName'
        // Send Otp To Email
        let subject = `${appName} Security Verification: One-Time Password (OTP)`
        let text = `Your OTP for ${appName} is: ${otp}. It is valid for 5 minutes. Do not share it with anyone.`
        let html = await fs.readFile(path.join(process.cwd(), 'templates', 'otpTemplate.html'), 'utf-8')
        html = html.replace('[YourAppName]', appName)
        html = html.replace('[OTP]', otp)
        try{
            await sendMail(email, subject, text, html)
        }catch(error){
            return responseHandler(res, 500, 'Failed to send OTP email.', null, error)
        }

        // Hashed
        const hashedOtp = await bcrypt.hash(otp.toString(), 10)
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create Account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpType: 'signup',
            otpExpireTime: Date.now() + 5 * 60 * 1000
        })

        // Verify Mode Cookie
        res.cookie('verifyMode', true, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 20 * 60 * 1000
        })

        // Resend Otp Token
        const resendOtpToken = jwt.sign({id: user._id.toString(), email: user.email}, process.env.JWT_RESEND_OTP_SECRET, {expiresIn: process.env.RESEND_OTP_EXPIRES})
        res.cookie('resendOtpToken', resendOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.RESEND_OTP_EXPIRES_COUNT)
        })

        // Verify Otp Token
        const verifyOtpToken = jwt.sign({id: user._id.toString(), email: user.email}, process.env.JWT_VERIFY_OTP_SECRET, {expiresIn: process.env.VERIFY_OTP_EXPIRES})
        res.cookie('verifyOtpToken', verifyOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.VERIFY_OTP_EXPIRES_COUNT)
        })

        // Save OTP Expire Time To Cookie
        res.cookie('otpExpireTime', Date.now() + 5 * 60 * 1000, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
        })

        return responseHandler(res, 201, 'Signup successful! OTP has been sent to your email.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Verify User By OTP
const verifyOtp = async (req, res)=>{
    try{
        // Get Otp From Body
        const {otp} = req.body

        // Validate OTP
        if(!otp){
            return responseHandler(res, 400, 'Please enter the OTP code.')
        }
        if(typeof otp !== 'string'){
            return responseHandler(res, 400, 'Invalid OTP format.')
        }
        if(otp.length !== 6){
            return responseHandler(res, 400, 'OTP must be 6 digits long.')
        }
        if(!/^[0-9]{6}$/.test(otp)){
            return responseHandler(res, 400, 'OTP should contain only numbers.')
        }

        // Get Verify OTP Token
        const verifyOtpToken = req.cookies.verifyOtpToken
        if(!verifyOtpToken){
            return responseHandler(res, 401, 'OTP expired. Please resend OTP.')
        }

        // Decode Token
        let decode
        try{
            // Decode
            decode = jwt.verify(verifyOtpToken, process.env.JWT_VERIFY_OTP_SECRET)
            if(!decode){
                return responseHandler(res, 401, 'OTP expired. Please resend OTP.') 
            }

            // Find User
            const user = await User.findById(decode.id)
            if(!user){
                return responseHandler(res, 404, 'User not found.')
            }

            // User Block Check
            if(user.blockedTime && user.blockedTime > Date.now()){
                const remainingTime = Math.ceil((user.blockedTime - Date.now()) / (60 * 1000))
                return responseHandler(res, 403, `Account temporarily blocked. Try again after ${remainingTime} minutes.`)
            }

            // Check OTP Exist
            if(!user.otp){
                return responseHandler(res, 401, 'OTP not found. Please login again.')  
            }

            // Check OTP Expire Time
            if(!user.otpExpireTime || user.otpExpireTime < Date.now()){
                return responseHandler(res, 401, 'OTP expired. Please resend OTP.')
            }

            // Match OTP
            const matchOtp = await bcrypt.compare(otp, user.otp)
            if(!matchOtp){
                user.wrongOtpCount +=1

                // Wronk Otp Atempt 5 Times
                if(user.wrongOtpCount >= 5){
                    user.blockedTime = new Date(Date.now() + 30 * 60 * 1000)
                    user.wrongOtpCount = 0
                    await user.save()
                    return responseHandler(res, 403, 'Invalid OTP. Account temporarily blocked for 30 minutes.');
                }

                await user.save()
                return responseHandler(res, 401, 'Invalid OTP. Please try again.')
            }

            // Login
            if(user.otpType === 'login'){
                // Generate Tokens & Set To Cookie
                const userObj = {
                    id: user._id.toString(),
                    name: user.name,
                    role: user.role
                }
                // Refresh Token
                const refreshToken = jwt.sign({id: userObj.id}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES})
                // Access Token
                const accessToken = jwt.sign(userObj, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES})
                // Refresh - Save To Cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    // secure: true,
                    secure: process.env.MODE === 'production',
                    sameSite: 'strict',
                    maxAge: decode?.remember ? parseInt(process.env.REFRESH_TOKENEXPIRES_COUNT) : undefined
                })
                // Access - Save To Cookie
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    // secure: true,
                    secure: process.env.MODE === 'production',
                    sameSite: 'strict',
                    maxAge: decode.remember ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_COUNT) : undefined
                })

                // Reset Fields
                user.otp = ''
                user.otpType = null
                user.otpExpireTime = null
                user.wrongOtpCount = 0
                user.blockedTime = null
                user.isVerified = true
                await user.save()

                // Clear All Cookies
                res.clearCookie('verifyOtpToken')
                res.clearCookie('resendOtpToken')
                res.clearCookie('verifyMode')
                res.clearCookie('otpExpireTime')

                return responseHandler(res, 200, 'Logged in successfully.', {
                    userObj,
                    verifyType: 'login'
                })
            }

            // Forgot Password
            if(user.otpType === 'forgot-password'){
                // Generate Reset Password Token
                const userObj = {
                    id: user?._id?.toString(),
                    name: user?.name,
                    email: user?.email
                }
                const resetPassToken = await jwt.sign(userObj, process.env.JWT_RESET_PASSWORD_SECRET, {expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES})

                // Set Token To Cookie
                res.cookie('resetPasswordToken', resetPassToken, {
                    httpOnly: true,
                    secure: process.env.MODE === 'production',
                    sameSite: 'strict',
                    maxAge: process.env.RESET_PASSWORD_TOKEN_EXPIRES_COUNT
                })

                // Reset Fields
                user.otp = ''
                user.otpType = null
                user.otpExpireTime = null
                user.wrongOtpCount = 0
                user.blockedTime = null
                user.isVerified = true
                user.remember = null
                await user.save()

                // Clear All Cookies
                res.clearCookie('verifyOtpToken')
                res.clearCookie('resendOtpToken')
                res.clearCookie('verifyMode')
                res.clearCookie('otpExpireTime')

                return responseHandler(res, 200, 'OTP verified successfully. You can now reset your password.', {
                    verifyType: 'forgot-password'
                })
            }

            // Reset Fields
            user.otp = ''
            user.otpType = null
            user.otpExpireTime = null
            user.wrongOtpCount = 0
            user.blockedTime = null
            user.isVerified = true
            user.remember = null
            await user.save()

            // Clear All Cookies
            res.clearCookie('verifyOtpToken')
            res.clearCookie('resendOtpToken')
            res.clearCookie('verifyMode')
            res.clearCookie('otpExpireTime')

            return responseHandler(res, 200, 'Signed up successfully.', {
                verifyType: 'signup'
            })
        }catch(error){
            return responseHandler(res, 401, 'OTP expired. Please resend OTP.', null, error)
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Resend Otp
const resendOtp = async (req, res)=>{
    try{
        // Get Resend OTP Token
        const resendOtpToken = req.cookies.resendOtpToken || null
        if(!resendOtpToken){
            return responseHandler(res, 401, 'Session expired. Please login again.')
        }

        // Verify Resend Otp Token
        try{
            // Decode
            const decode = jwt.verify(resendOtpToken, process.env.JWT_RESEND_OTP_SECRET)
            if(!decode){
                return responseHandler(res, 401, 'Session expired. Please login again.')
            }

            // Find User
            const user = await User.findById(decode.id)
            if(!user){
                return responseHandler(res, 404, 'User account not found.')
            }

            // Check Account Block
            if(user.blockedTime && user.blockedTime > Date.now()){
                return responseHandler(res, 403, 'Account temporarily blocked. Try again later.')
            }

            // Check Otp Expires Or Not
            if(user.otp && user.otpExpireTime > Date.now()){
                const remainingTime = Math.ceil((user.otpExpireTime - Date.now()) / (60 * 1000))
                return responseHandler(res, 429, `OTP already sent. Please wait ${remainingTime} minutes before requesting again.`)
            }

            // Generate New Otp
            const otp = Math.floor(100000 + Math.random() * 900000)

            // Settings Data
            const settings = await Settings.findOne()
            const appName = settings?.appName

            // Send Otp To Email
            let subject = `${appName} Security Verification: One-Time Password (OTP)`
            let text = `Your OTP for ${appName} is: ${otp}. It is valid for 5 minutes. Do not share it with anyone.`

            let html = await fs.readFile(path.join(process.cwd(), '/templates', 'otpTemplate.html'), 'utf-8')
            html = html.replace('[YourAppName]', appName)
            html = html.replace('[OTP]', otp)
            try{
                await sendMail(user.email, subject, text, html)
            }catch(error){
                return responseHandler(res, 500, 'Failed to send OTP email.', null, error)
            }

            // Hash OTP & Save To DB
            const hashedOtp = await bcrypt.hash(otp.toString(), 10)
            user.otp = hashedOtp
            user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000)
            await user.save()

            // Verify Otp Token
            const verifyOtpToken = jwt.sign({id: user._id.toString(), email: user.email, remember: decode?.remember}, process.env.JWT_VERIFY_OTP_SECRET, {expiresIn: process.env.VERIFY_OTP_EXPIRES})
            res.cookie('verifyOtpToken', verifyOtpToken, {
                httpOnly: true,
                secure: process.env.MODE === 'production',
                sameSite: 'strict',
                maxAge: Number(process.env.VERIFY_OTP_EXPIRES_COUNT)
            })

            // Save OTP Expire Time To Cookie
            res.cookie('otpExpireTime', Date.now() + 5 * 60 * 1000, {
                httpOnly: false,
                secure: false,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000
            })

            return responseHandler(res, 200, 'A new OTP has been sent to your email.')
        }catch(error){
            return responseHandler(res, 401, 'Session expired. Please try again.', null, error)
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Log Out User
const logOutUser = async (req, res)=>{
    try{
        // Delete Access Token
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict'
        })

        // Delete Refresh Token
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict'
        })

        return responseHandler(res, 200, 'Logged out successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Forgot Password
const forgotPassword = async (req, res)=>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    try{
        // Get Email From Body
        const {email} = req.body

        // Validate
        if(!email?.trim()){
            return responseHandler(res, 400, 'Please enter your email address.')
        }
        if(!emailRegex.test(email)){
            return responseHandler(res, 400, 'Please enter a valid email address.')
        }

        // Email Is Registered
        const user = await User.findOne({email})
        if(!user){
            return responseHandler(res, 404, 'User is not registered, Please signup.')
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000)

        // Get App Name
        const settings = await Settings.findOne()
        const appName = settings?.appName || 'YourAppName'
        // Send Otp To Email
        let subject = `${appName} Security Verification: One-Time Password (OTP)`
        let text = `Your OTP for ${appName} is: ${otp}. It is valid for 5 minutes. Do not share it with anyone.`

        let html = await fs.readFile(path.join(process.cwd(), '/templates', 'otpTemplate.html'), 'utf-8')
        html = html.replace('[YourAppName]', appName)
        html = html.replace('[OTP]', otp)
        try{
            await sendMail(user.email, subject, text, html)
        }catch(error){
            return responseHandler(res, 500, 'Failed to send OTP email.', null, error)
        }

        // Hash OTP & Save To DB
        const hashedOtp = await bcrypt.hash(otp.toString(), 10)
        user.otp = hashedOtp
        user.otpType = 'forgot-password'
        user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()

        // Verify Mode Cookie
        res.cookie('verifyMode', true, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 20 * 60 * 1000
        })

        // Resend Otp Token
        const resendOtpToken = jwt.sign({id: user._id.toString(), email: user.email}, process.env.JWT_RESEND_OTP_SECRET, {expiresIn: process.env.RESEND_OTP_EXPIRES})
        res.cookie('resendOtpToken', resendOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.RESEND_OTP_EXPIRES_COUNT)
        })

        // Verify Otp Token
        const verifyOtpToken = jwt.sign({id: user._id.toString(), email: user.email}, process.env.JWT_VERIFY_OTP_SECRET, {expiresIn: process.env.VERIFY_OTP_EXPIRES})
        res.cookie('verifyOtpToken', verifyOtpToken, {
            httpOnly: true,
            secure: process.env.MODE === 'production',
            sameSite: 'strict',
            maxAge: Number(process.env.VERIFY_OTP_EXPIRES_COUNT)
        })

        // Save OTP Expire Time To Cookie
        res.cookie('otpExpireTime', Date.now() + 5 * 60 * 1000, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
        })

        return responseHandler(res, 200, 'OTP has been sent to your email.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Reset Password
const resetPassword = async (req, res)=>{
    try{
        // Get Passwords From Body
        const {newPassword, confirmNewPassword} = req.body

        // Validate
        if(!newPassword){
            return responseHandler(res, 400, 'Enter your new password.')
        }
        if(newPassword.length < 8){
            return responseHandler(res, 400, 'Password must be at least 8 characters long.')
        }
        if(!/[A-Z]/.test(newPassword)){
            return responseHandler(res, 400, 'Password must contain at least one uppercase letter.')
        }
        if(!/[a-z]/.test(newPassword)){
            return responseHandler(res, 400, 'Password must contain at least one lowercase letter.')
        }
        if(!/[0-9]/.test(newPassword)){
            return responseHandler(res, 400, 'Password must contain at least one number.')
        }
        if(!/[^A-Za-z0-9]/.test(newPassword)){
            return responseHandler(res, 400, 'Password must contain at least one special character.')
        }
        if(!confirmNewPassword){
            return responseHandler(res, 400, 'Confirm your new password.')
        }
        if(newPassword !== confirmNewPassword){
            return responseHandler(res, 400, 'Passwords do not match.')
        }

        // Get Reset Password Token From Cookie
        const resetPasswordToken = req.cookies.resetPasswordToken || null
        if(!resetPasswordToken){
            return responseHandler(res, 400, 'Reset token missing or expired. Please request a new password reset.')
        }

        try{
            // Decode
            const decoded = jwt.verify(resetPasswordToken, process.env.JWT_RESET_PASSWORD_SECRET)
            if(!decoded){
                return responseHandler(res, 400, 'Reset token is invalid or expired. Please request a new password reset.')
            }

            // Find User
            const user = await User.findOne({email: decoded?.email})
            if(!user){
                return responseHandler(res, 404, 'User not found.')
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            // Update Password To Db
            user.password = hashedPassword
            await user.save()

            // Remove Reset Password Token From Cookie
            res.clearCookie("resetPasswordToken", {
                httpOnly: true,
                secure: process.env.MODE === 'production',
                sameSite: 'strict'
            })

            return responseHandler(res, 200, 'Password reset successfully.')
        }catch(error){
            return responseHandler(res, 400, 'Reset token is invalid or expired. Please request a new password reset.', null, error)
        }
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}






// Get User Data
const getUserData = async (req, res)=>{
    try{
        // User Data
        const {id} = req.user

        // Find User By ID
        const userData = await User.findById(id)
        if(!userData){
            return responseHandler(res, 404, 'User not found.')
        }

        // User Data
        const user = {
            id: userData?._id.toString(),
            name: userData?.name,
            email: userData?.email,
            role: userData?.role,
            image: userData?.image
        }

        return responseHandler(res, 200, 'User data.', user)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Change Password
const changePassword = async (req, res)=>{
    try{
        // Get User
        const crrUser = req.user

        // Get Data From Body
        const {oldPassword, newPassword, confirmNewPassword} = req.body
        
        // Validate
        if(!oldPassword){
            return responseHandler(res, 400, "Old password is required.")
        }
        if(!newPassword.trim()){
            return responseHandler(res, 400, "New password is required.")
        }
        if(!confirmNewPassword.trim()){
            return responseHandler(res, 400, "Confirm password is required.")
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(newPassword)){
            return responseHandler(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
        }
        if(newPassword !== confirmNewPassword){
            return responseHandler(res, 400, "New password and confirm password do not match")
        }
        if(oldPassword === newPassword){
            return responseHandler(res, 400, "New password must be different from old password")
        }

        // Find User By ID
        const user = await User.findById(crrUser?.id).select('+password')
        if(!user){
            return responseHandler(res, 404, 'User not found.')
        }

        // Match Old Password
        const matchOldPassword = await bcrypt.compare(oldPassword, user.password)
        if(!matchOldPassword){
            return responseHandler(res, 401, 'Old password is incorrect.')
        }

        // Change Password
        const hashedPass = await bcrypt.hash(newPassword, 10)
        user.password = hashedPass
        await user.save()

        return responseHandler(res, 200, 'Password changed successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Change Profile Image
const changeProfileImage = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Form Data From Formidable
        const form = new formidable.IncomingForm({multiples: false})

        // Extract File From Form
        const {fields, files} = await new Promise((resolve, reject)=>{
            form.parse(req, (err, fields, files)=>{
                if(err){
                    return reject(err)
                }
                return resolve({fields, files})
            })
        })
        
        // Extract Image
        const image = files?.profileImage[0]?.filepath
        if(!image){
            return responseHandler(res, 400, 'Please select an image.')
        }

        // Upload Image to Cloudinary
        let uploadedImage
        try{
            uploadedImage = await cloudinary.uploader.upload(image, {
                folder: 'profile_images',
                resource_type: 'image'
            })
        }catch(err){
            return responseHandler(res, 500, 'Profile image upload failed.', null, err)
        }

        // FInd Current User By ID
        const user = await User.findById(crrUser.id)
        if(!user){
            return responseHandler(res, 404, 'User not found.')
        }

        // Delete Old Image From Cloudinary
        if(user?.publicId){
            try{
                await cloudinary.uploader.destroy(user?.publicId)
            }catch(err){
                return responseHandler(res, 500, 'Image delete failed.', null, err)
            }
        }

        // Save Image URL To DB
        user.image = uploadedImage?.secure_url || ''
        user.publicId = uploadedImage?.public_id || ''
        await user.save()

        return responseHandler(res, 200, 'Profile image updated successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Update Profile
const updateProfile = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user

        // Get Data From Formidable
        const form = new formidable.IncomingForm({multiples: false})
        let fields
        let files
        try{
            [fields, files] = await form.parse(req)
        }catch(error){
            responseHandler(res, 500, 'Form data parse failed.', null, error)
        }

        // Get Data
        const profileImage = files?.profileImage?.length > 0 ? files?.profileImage[0]?.filepath : ''
        const name = fields?.name[0] || ''
        const oldPassword = fields?.oldPassword[0] || ''
        const newPassword = fields?.newPassword[0] || ''
        const confirmNewPassword = fields?.confirmNewPassword[0] || ''

        // Validate
        if(!name?.trim()){
            return responseHandler(res, 400, 'Name is required.')
        }
        if(oldPassword || newPassword || confirmNewPassword){
            // Old Password
            if(!oldPassword){
                return responseHandler(res, 400, 'Current password is required.')
            }
            if(oldPassword?.length < 8){
                return responseHandler(res, 400, 'Password must be at least 8 characters.')
            }
            // New Password
            if(!newPassword){
                return responseHandler(res, 400, 'New password is required.')
            }
            if(newPassword?.length < 8){
                return responseHandler(res, 400, 'Password must be at least 8 characters.')
            }
            if(!/[A-Z]/.test(newPassword)){
                return responseHandler(res, 400, 'Password must contain at least one uppercase letter.')
            }
            if(!/[a-z]/.test(newPassword)){
                return responseHandler(res, 400, 'Password must contain at least one lowercase letter.')
            }
            if(!/[0-9]/.test(newPassword)){
                return responseHandler(res, 400, 'Password must contain at least one number.')
            }
            if(!/[^A-Za-z0-9]/.test(newPassword)){
                return responseHandler(res, 400, 'Password must contain at least one special character.')
            }
            // Confirm New Password
            if(!confirmNewPassword){
                return responseHandler(res, 400, 'Please confirm your new password.')
            }
            if(newPassword !== confirmNewPassword){
                return responseHandler(res, 400, 'Passwords do not match.')
            }
        }

        // Find User From DB
        const user = await User.findById(crrUser?.id).select('+password')
        if(!user){
            return responseHandler(res, 404, 'User not found.')
        }

        // Validate
        if((!name || name === user?.name) && !profileImage && !oldPassword && !newPassword && !confirmNewPassword){
            return responseHandler(res, 400, 'Nothing to update.')
        }

        // Match Password
        let matchedPassword = null
        if(oldPassword && newPassword){
            matchedPassword = await bcrypt.compare(oldPassword, user?.password)
        }
        if(oldPassword && newPassword && !matchedPassword){
            return responseHandler(res, 403, 'Current password is incorrect.')
        }

        // Cloudinary
        let uploadedImage
        if(profileImage !== ''){
            // Upload New
            try{
                uploadedImage = await cloudinary.uploader.upload(profileImage, {
                    folder: 'profile_images',
                    resource_type: 'image'
                })
            }catch(error){
                return responseHandler(res, 500, 'Profile image upload failed.')
            }

            // Delete Old
            if(user?.image && user?.publicId){
                try{
                    await cloudinary.uploader.destroy(user?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Old profile image delete failed.')
                }
            }
        }

        // Save Data To DB
        if(uploadedImage){
            user.image = uploadedImage?.secure_url
            user.publicId = uploadedImage?.public_id
        }
        if(user?.name !== name){
            user.name = name
        }
        if(oldPassword && matchedPassword && newPassword){
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            user.password = hashedPassword
        }
        await user.save()

        return responseHandler(res, 200, 'Profile updated successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}






// Add User
const addUser = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get Data From Body
        const {name, email, role, password} = req.body

        // Validate User Data
        if(!name || !name.trim()){
            return responseHandler(res, 400, 'Name is required.')
        }
        if(!email || !email.trim()){
            return responseHandler(res, 400, 'Email is required.')
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return responseHandler(res, 400, 'Invalid email address.')
        }
        if(!role || !role.trim()){
            return responseHandler(res, 400, 'Select a user role.')
        }
        const roles = ["user", "editor", "writer"]
        if(!roles.includes(role)){
            return responseHandler(res, 400, "Invalid user role selected.")
        }
        if(!password){
            return responseHandler(res, 400, 'Password is required.')
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)){
            return responseHandler(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
        }

        // Check User Exist
        const isExist = await User.findOne({email})
        if(isExist){
            return responseHandler(res, 409, 'User already exists with this email.')
        }

        // Hash Password
        const hashedPass = await bcrypt.hash(password, 10)

        // Save Data To DB
        const user = await User.create({
            name,
            email,
            role,
            password: hashedPass,
            isVerified: true
        })

        return responseHandler(res, 201, 'User added successfully.', user);
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Update User
const updateUser = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }
        
        // Get Data From Body
        const {id, name, email, role, password} = req.body

        // Validate User Data
        if(!id || !id?.trim()){
            return responseHandler(res, 400, 'User ID not found. Please try again.')
        }
        if(!name || !name.trim()){
            return responseHandler(res, 400, 'Name is required.')
        }
        if(!email || !email.trim()){
            return responseHandler(res, 400, 'Email is required.')
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return responseHandler(res, 400, 'Invalid email address.')
        }
        if(!role || !role.trim()){
            return responseHandler(res, 400, 'Select a user role.')
        }
        const roles = ["user", "editor", "writer"]
        if(!roles.includes(role)){
            return responseHandler(res, 400, "Invalid user role selected.")
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(password && !passwordRegex.test(password)){
            return responseHandler(res, 400, 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character.')
        }

        // Check User Exist
        const isExist = await User.findById(id)
        if(!isExist){
            return responseHandler(res, 404, 'User not found.')
        }

        // Check Email Exist
        const isEmailExist = await User.findOne({
            email,
            _id: {$ne: isExist._id}
        })
        if(isEmailExist){
            return responseHandler(res, 400, 'Email already exists.')
        }

        // Hash Password
        let hashedPass
        if(password){
            hashedPass = await bcrypt.hash(password, 10)
        }
        
        // Save Data To DB
        isExist.name = name
        isExist.email = email
        isExist.role = role
        if(password){
            isExist.password = hashedPass
        }
        if(isExist.isVerified !== true){
            isExist.isVerified = true;
        }
        await isExist.save()

        return responseHandler(res, 200, 'User updated successfully.');
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// All Users
const allUsers = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Filter Data From Query
        const {role='', status=null, search='', page=1, limit=10} = req.query

        // Filter Obj
        let filter = {}

        // Validate Role
        const roles = ['admin', 'writer', 'editor', 'user']
        if(role && !roles.includes(role)){
            return responseHandler(res, 400, 'Invalid role selected.')
        }
        if(role){
            filter.role = role
        }

        // Validate Status
        if(status && status === 'true'){
            filter.isVerified = true
        }else if(status && status === 'false'){
            filter.isVerified = false
        }

        // Validate Search
        if(search){
            filter.name = {$regex: search, $options: 'i'}
        }

        // Validate Page & Limit
        const pageNum = parseInt(page) || 1
        const limitNum = parseInt(limit) || 10
        if(pageNum < 1) return responseHandler(res, 400, 'Invalid page number.');
        if(limitNum < 1) return responseHandler(res, 400, 'Invalid limit.');

        // Pagination
        const skip = (pageNum - 1) * limitNum

        // Users Count
        const usersCount = await User.countDocuments(filter)

        // Get All Users
        const users = await User.find(filter)
            .skip(skip)
            .limit(limitNum)
            .sort({createdAt: -1})

        responseHandler(res, 200, 'Users fetched successfully.', {users, usersCount})
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}


// Delete User
const deleteUser = async (req, res)=>{
    try{
        // Get User From Middleware
        const crrUser = req.user
        if(crrUser.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get User Id From Params
        const {id} = req.params
        if(!id || !id.trim()){
            return responseHandler(res, 400, "Invalid user ID.")
        }

        // Find User By Id
        const user = await User.findByIdAndDelete(id)
        if(!user){
            return responseHandler(res, 404, 'User not found.')
        }

        return responseHandler(res, 200, 'User deleted successfully.')
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}





module.exports = {
    login,
    signup,
    verifyOtp,
    resendOtp,
    logOutUser,

    getUserData,
    changePassword,
    changeProfileImage,
    updateProfile,

    addUser,
    updateUser,
    allUsers,
    deleteUser,

    forgotPassword,
    resetPassword
}