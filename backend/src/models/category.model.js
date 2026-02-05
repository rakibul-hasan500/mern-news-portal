const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({

    name: {type: String, required: true, trim: true},

    slug: {type: String, required: true, trim: true},

    description: {type: String, trim: true, maxLength: [255, "Description can't exceed 255 characters."]},

    isActive: {type: Boolean, required: true, default: true}

}, {timestamps: true})


const Category = mongoose.model('Category', categorySchema)
module.exports = Category