const formidable = require("formidable")
const responseHandler = require("../../utils/responseHandler")
const Settings = require("../models/settings.model")
const cloudinary = require('../../config/cloudinary')


// Update Settings
const updateSettings = async (req, res)=>{
    try{
        // Get Current User From Middleware
        const crrUser = req.user
        if(crrUser?.role !== 'admin'){
            return responseHandler(res, 403, 'Access denied.')
        }

        // Get Form Data From Formidable
        const form = new formidable.IncomingForm({multiples: true})

        // Extract Files & Fields From Form
        const {fields, files} = await new Promise((resolve, reject)=>{
            form.parse(req, (err, fields, files)=>{
                if(err){
                    return reject(err)
                }
                resolve({fields, files})
            })
        })

        // Website Data
        const appName = fields?.name[0] || ''
        const title = fields?.title[0] || ''
        let logo = ''
        if(files && files?.logo && files?.logo?.length > 0){
            logo = files?.logo[0]?.filepath || ''
        }
        let logoAltTag = ''
        if(fields && fields?.logoAltTag && fields?.logoAltTag?.length > 0){
            logoAltTag = fields?.logoAltTag[0]
        }
        let siteIcon = ''
        if(files && files?.siteIcon && files?.siteIcon?.length > 0){
            siteIcon = files?.siteIcon[0]?.filepath || ''
        }

        // ADS
        let cardAds1 = ''
        if(files && files?.cardAdsOne && files?.cardAdsOne?.length > 0){
            cardAds1 = files?.cardAdsOne[0]?.filepath || ''
        }
        let cardAds1Link = ''
        if(fields && fields?.cardAdsOneLink && fields?.cardAdsOneLink?.length > 0){
            cardAds1Link = fields?.cardAdsOneLink[0] || ''
        }

        let cardAds2 = ''
        if(files && files?.cardAdsTwo && files?.cardAdsTwo?.length > 0){
            cardAds2 = files?.cardAdsTwo[0]?.filepath || ''
        }
        let cardAds2Link = ''
        if(fields && fields?.cardAdsTwoLink && fields?.cardAdsTwoLink?.length > 0){
            cardAds2Link = fields?.cardAdsTwoLink[0] || ''
        }

        let bannerAds = ''
        if(files && files?.bannerAds && files?.bannerAds?.length > 0){
            bannerAds = files?.bannerAds[0]?.filepath || ''
        }
        let bannerAdsLink = ''
        if(fields && fields?.bannerAdsLink && fields?.bannerAdsLink?.length > 0){
            bannerAdsLink = fields?.bannerAdsLink[0] || ''
        }

        // SEO
        const metaDescription = fields?.metaDescription[0] || ''
        let keywords = []
        if(fields && fields?.keywords && fields?.keywords?.length > 0){
            keywords = JSON.parse(fields?.keywords[0]) || []
        }

        // Social Links
        const facebook = fields?.facebookUrl[0]
        const instagram = fields?.instagramUrl[0]
        const x = fields?.xUrl[0]
        const pinterest = fields?.pinterestUrl[0]
        const youtube = fields?.youtubeUrl[0]

        // Get Setting From DB
        let settings = await Settings.findOne()

        // Validation
        if(appName === '' && title === '' && logo === '' && siteIcon === '' && logoAltTag === '' && cardAds1 === '' && cardAds1Link === '' && cardAds2 === '' && cardAds2Link === '' && bannerAds === '' && bannerAdsLink === '' && metaDescription === '' && keywords?.length === 0 && facebook === '' && instagram === '' && x === '' && pinterest === '' && youtube === ''){
            return
        }
        if(logoAltTag?.trim() !== ''){
            if(!logo && settings?.logo?.url === ''){
                return responseHandler(res, 400, 'Please upload a logo if Alt Tag is provided.')
            }
        }
        if(cardAds1Link.trim() !== ''){
            if(!cardAds1 && settings?.cardAdOne?.url === ''){
                return responseHandler(res, 400, 'Please upload Card Ads 1 image if link is provided.');
            }
        }
        if(cardAds2Link.trim() !== ''){
            if(!cardAds2 && settings?.cardAdTwo?.url === ''){
                return responseHandler(res, 400, 'Please upload Card Ads 2 image if link is provided.')
            }
        }
        if(bannerAdsLink.trim() !== ''){
            if(!bannerAds && settings?.bannerAd?.url === ''){
                return responseHandler(res, 400, 'Please upload Banner Ads image if link is provided.')
            }
        }

        // If No Setting Exist
        if(!settings){
            // Cloudinary
            let uploadedLogo
            if(logo !== ''){
                try{
                    uploadedLogo = await cloudinary.uploader.upload(logo, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Logo upload failed', null, error)
                }
            }
            let uploadedSiteIcon
            if(siteIcon !== ''){
                try{
                    uploadedSiteIcon = await cloudinary.uploader.upload(siteIcon, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Site icon upload failed', null, error)
                }
            }
            let uploadedCardAds1
            if(cardAds1 !== ''){
                try{
                    uploadedCardAds1 = await cloudinary.uploader.upload(cardAds1, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Card ads 1 upload failed', null, error)
                }
            }
            let uploadedCardAds2
            if(cardAds2 !== ''){
                try{
                    uploadedCardAds2 = await cloudinary.uploader.upload(cardAds2, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Card ads 2 upload failed', null, error)
                }
            }
            let uploadedBannerAds
            if(bannerAds !== ''){
                try{
                    uploadedBannerAds = await cloudinary.uploader.upload(bannerAds, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Banner ads upload failed', null, error)
                }
            }

            // Save Data To DB
            settings = new Settings()
            if(appName?.trim() !== ''){
                settings.appName = appName
            }
            if(title?.trim() !== ''){
                settings.title = title
            }
            if(uploadedLogo){
                settings.logo.url = uploadedLogo?.secure_url
                settings.logo.publicId = uploadedLogo?.public_id
                if(logoAltTag?.trim() !== ''){
                    settings.logo.altTag = logoAltTag
                }
            }
            if(uploadedSiteIcon){
                settings.siteIcon.url = uploadedSiteIcon?.secure_url
                settings.siteIcon.publicId = uploadedSiteIcon?.public_id
            }
            if(uploadedCardAds1){
                settings.cardAdOne.url = uploadedCardAds1?.secure_url
                settings.cardAdOne.publicId = uploadedCardAds1?.public_id
                if(cardAds1Link !== ''){
                    settings.cardAdOne.link = cardAds1Link
                }
            }
            if(uploadedCardAds2){
                settings.cardAdTwo.url = uploadedCardAds2?.secure_url
                settings.cardAdTwo.publicId = uploadedCardAds2?.public_id
                if(cardAds2Link !== ''){
                    settings.cardAdTwo.link = cardAds2Link
                }
            }
            if(uploadedBannerAds){
                settings.bannerAd.url = uploadedBannerAds?.secure_url
                settings.bannerAd.publicId = uploadedBannerAds?.public_id
                if(bannerAdsLink !== ''){
                    settings.bannerAd.link = bannerAdsLink
                }
            }
            if(metaDescription?.trim() !== ''){
                settings.metaDescription = metaDescription
            }
            if(Array.isArray(keywords) && keywords?.length > 0){
                settings.keywords = keywords
            }
            if(facebook?.trim() !== ''){
                settings.socialLinks.facebook = facebook
            }
            if(instagram?.trim() !== ''){
                settings.socialLinks.instagram = instagram
            }
            if(x?.trim() !== ''){
                settings.socialLinks.x = x
            }
            if(pinterest?.trim() !== ''){
                settings.socialLinks.pinterest = pinterest
            }
            if(youtube?.trim() !== ''){
                settings.socialLinks.youtube = youtube
            }
            await settings.save()

            return responseHandler(res, 200, 'Settings updated successfully.')
        }

        // Settings Exist
        if(settings?.appName !== appName){
            settings.appName = appName?.trim()
        }
        if(settings?.title !== title){
            settings.title = title?.trim()
        }
        if(logo){
            // Delete Old
            if(settings?.logo?.url && settings?.logo?.publicId){
                try{
                    await cloudinary.uploader.destroy(settings?.logo?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Logo delete failed.', null, error)
                }
            }

            // Upload New
            let uploadedLogo
            if(logo !== ''){
                try{
                    uploadedLogo = await cloudinary.uploader.upload(logo, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Logo upload failed', null, error)
                }
            }

            settings.logo.url = uploadedLogo?.secure_url
            settings.logo.publicId = uploadedLogo?.public_id
        }
        if(siteIcon){
            // Upload To Local Directory

            // Delete Old
            if(settings?.siteIcon?.url && settings?.siteIcon?.publicId){
                try{
                    await cloudinary.uploader.destroy(settings?.siteIcon?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Logo delete failed.', null, error)
                }
            }

            // Upload New
            let uploadedSiteIcon
            if(siteIcon !== ''){
                try{
                    uploadedSiteIcon = await cloudinary.uploader.upload(siteIcon, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Site icon upload failed', null, error)
                }
            }

            settings.siteIcon.url = uploadedSiteIcon?.secure_url
            settings.siteIcon.publicId = uploadedSiteIcon?.public_id
        }
        if(settings?.logo?.altTag !== logoAltTag){
            settings.logo.altTag = logoAltTag
        }

        if(cardAds1){
            // Delete Old
            if(settings?.cardAdOne?.url && settings?.cardAdOne?.publicId){
                try{
                    await cloudinary.uploader.destroy(settings?.cardAdOne?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Card ad 1 delete failed.', null, error)
                }
            }

            // Upload New
            let uploadedCardAds1
            if(cardAds1 !== ''){
                try{
                    uploadedCardAds1 = await cloudinary.uploader.upload(cardAds1, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Card ads 1 upload failed', null, error)
                }
            }

            settings.cardAdOne.url = uploadedCardAds1?.secure_url
            settings.cardAdOne.publicId  = uploadedCardAds1?.public_id
        }
        if(settings?.cardAdOne?.link !== cardAds1Link){
            settings.cardAdOne.link = cardAds1Link
        }
        if(cardAds2){
            // Delete Old
            if(settings?.cardAdTwo?.url && settings?.cardAdTwo?.publicId){
                try{
                    await cloudinary.uploader.destroy(settings?.cardAdTwo?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Card ad 2 delete failed.', null, error)
                }
            }

            // Upload New
            let uploadedCardAds2
            if(cardAds2 !== ''){
                try{
                    uploadedCardAds2 = await cloudinary.uploader.upload(cardAds2, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Card ads 2 upload failed', null, error)
                }
            }

            settings.cardAdTwo.url = uploadedCardAds2?.secure_url
            settings.cardAdTwo.publicId  = uploadedCardAds2?.public_id
        }
        if(settings?.cardAdTwo?.link !== cardAds2Link){
            settings.cardAdTwo.link = cardAds2Link
        }
        if(bannerAds){
            // Delete Old
            if(settings?.bannerAd?.url && settings?.bannerAd?.publicId){
                try{
                    await cloudinary.uploader.destroy(settings?.bannerAd?.publicId)
                }catch(error){
                    return responseHandler(res, 500, 'Banner ad delete failed.', null, error)
                }
            }

            // Upload New
            let uploadedBannerAds
            if(bannerAds !== ''){
                try{
                    uploadedBannerAds = await cloudinary.uploader.upload(bannerAds, {
                        folder: 'uploads',
                        resource_type: 'image'
                    })
                }catch(error){
                    return responseHandler(res, 500, 'Banner ads upload failed', null, error)
                }
            }

            settings.bannerAd.url = uploadedBannerAds?.secure_url
            settings.bannerAd.publicId = uploadedBannerAds?.public_id
        }
        if(settings?.bannerAd?.link !== bannerAdsLink){
            settings.bannerAd.link = bannerAdsLink
        }

        if(settings.metaDescription !== metaDescription){
            settings.metaDescription = metaDescription
        }
        if(keywords?.length > 0){
            settings.keywords = keywords
        }

        if(settings.socialLinks.facebook !== facebook){
            settings.socialLinks.facebook = facebook
        }
        if(settings.socialLinks.instagram !== instagram){
            settings.socialLinks.instagram = instagram
        }
        if(settings.socialLinks.x !== x){
            settings.socialLinks.x = x
        }
        if(settings.socialLinks.pinterest !== pinterest){
            settings.socialLinks.pinterest = pinterest
        }
        if(settings.socialLinks.youtube !== youtube){
            settings.socialLinks.youtube = youtube
        }
        await settings.save()

        return responseHandler(res, 200, 'Settings updated successfully.', settings)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}



// Get Settings Data
const getSettingsData = async (req, res)=>{
    try{
        // Get Current User From Middleware
        // const crrUser = req.user
        // if(crrUser?.role !== 'admin'){
        //     return responseHandler(res, 403, 'Access denied.')
        // }

        // Get Settings Data
        const settings = await Settings.findOne()

        return responseHandler(res, 200, 'Settings data fetched successfully.', settings)
    }catch(error){
        return responseHandler(res, 500, 'Internal server error.', null, error)
    }
}




module.exports = {
    updateSettings,
    getSettingsData
}