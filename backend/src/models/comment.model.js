const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},

    post: {type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true},

    content: {type: String, required: true},

    parentComment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null},

    replayToComment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null},

    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    status: {type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved'},

}, {timestamps: true})


const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment