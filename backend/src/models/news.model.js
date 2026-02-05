const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

    title: {type: String, required: true, trim: true, maxlength: 150},

    slug: {type: String, required: true, unique: true, trim: true, maxlength: 150},

    description: {type: String, required: true},

    featuredImage: {type: String, required: true},

    publicId: {type: String, required: true},

    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true}],

    status: {type: String, enum: ['pending', 'rejected', 'published'], default: 'pending'},

    keywords: [{type: String, maxlength: 160, default: ''}],

    metaDescription: {type: String, trim: true, maxlength: 160, default: ''},

    viewCount: {type: Number, default: 0},

    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

}, {timestamps: true})


const News = mongoose.model('News', newsSchema)
module.exports = News