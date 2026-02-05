const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},

    url: {type: String, required: true},

    publicId: {type: String, required: true}

}, {timestamps: true})

const Gallery = mongoose.model('Gallery', gallerySchema)
module.exports = Gallery