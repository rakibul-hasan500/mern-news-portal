const mongoose = require('mongoose')
const { FaBullseye } = require('react-icons/fa')

const userSchema = new mongoose.Schema({

    name: {type: String, required: true, trim: true},

    email: {type: String, required: true, unique: true, lowercase: true, trim: true},

    password: {type: String, required: true, select: false},

    role: {type: String, enum: ['admin', 'editor', 'writer', 'user'], default: 'user'},

    image: {type: String, default: ''},

    publicId: {type: String, default: ''},

    isVerified: {type: Boolean, default: false},

    otp: {type: String, default: ''},

    otpType: {type: String, enum: ['login', 'signup', 'forgot-password']},

    otpExpireTime: {type: Date},

    wrongOtpCount: {type: Number, default: 0},

    wrongPasswordCount: {type: Number, default: 0},

    blockedTime: {type: Date}

}, {timestamps: true})


const User = mongoose.model('User', userSchema)
module.exports = User