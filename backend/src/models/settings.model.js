const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({

    appName: {type: String, trim: true, default: ''},

    title: {type: String, trim: true, default: ''},

    logo: {

        url: {type: String, default: ''},

        publicId: {type: String, default: ''},

        altTag: {type: String, default: ''}

    },

    siteIcon: {

        url: {type: String, default: ''},

        publicId: {type: String, default: ''}

    },

    cardAdOne: {

        url: {type: String, default: ''},

        publicId: {type: String, default: ''},

        link: {type: String, default: ''}

    },

    cardAdTwo: {

        url: {type: String, default: ''},

        publicId: {type: String, default: ''},

        link: {type: String, default: ''}

    },

    bannerAd: {

        url: {type: String, default: ''},

        publicId: {type: String, default: ''},

        link: {type: String, default: ''}

    },

    metaDescription: {type: String, trim: true, default: ''},

    keywords: [{type: String, trim: true}],

    socialLinks: {

        facebook: {type: String, default: ''},

        instagram: {type: String, default: ''},

        x: {type: String, default: ''},

        pinterest: {type: String, default: ''},

        youtube: {type: String, default: ''}
        
    }

}, {timestamps: true})


const Settings = mongoose.model('Settings', settingsSchema)
module.exports = Settings