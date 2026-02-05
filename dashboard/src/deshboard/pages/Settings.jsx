import React, {useEffect, useState} from "react";
import {RiImageCircleAiFill} from "react-icons/ri";
import responseHandler from "../../utils/responseHandler.jsx";
import {useGetSettingsDataQuery, useUpdateSettingsMutation} from "../../redux/settings/settingsApi.js";
import Loader from "../../utils/Loader.jsx";

function Settings(){

    // States
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [logo, setLogo] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [logoAltTag, setLogoAltTag] = useState("");
    const [siteIcon, setSiteIcon] = useState("");
    const [siteIconUrl, setSiteIconUrl] = useState("");

    const [cardAdsOne, setCardAdsOne] = useState("");
    const [cardAdsOneUrl, setCardAdsOneUrl] = useState("");
    const [cardAdsOneLink, setCardAdsOneLink] = useState("");

    const [cardAdsTwo, setCardAdsTwo] = useState("");
    const [cardAdsTwoUrl, setCardAdsTwoUrl] = useState("");
    const [cardAdsTwoLink, setCardAdsTwoLink] = useState("");

    const [bannerAds, setBannerAds] = useState("");
    const [bannerAdsUrl, setBannerAdsUrl] = useState("");
    const [bannerAdsLink, setBannerAdsLink] = useState("");

    const [metaDescription, setMetaDescription] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState([]);

    const [facebookUrl, setFacebookUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [xUrl, setXUrl] = useState("");
    const [pinterestUrl, setPinterestUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");

    // Call Get Settings Data API
    const {data: settingsData, refetch: settingsDataRefetch} = useGetSettingsDataQuery()
    useEffect(()=>{
        if(settingsData?.data?._id){
            setName(settingsData?.data?.appName);
            setTitle(settingsData?.data?.title);
            setLogoUrl(settingsData?.data?.logo?.url)
            setLogoAltTag(settingsData?.data?.logo?.altTag)
            setSiteIconUrl(settingsData?.data?.siteIcon?.url)
            setCardAdsOneUrl(settingsData?.data?.cardAdOne?.url)
            setCardAdsOneLink(settingsData?.data?.cardAdOne?.link)
            setCardAdsTwoUrl(settingsData?.data?.cardAdTwo?.url)
            setCardAdsTwoLink(settingsData?.data?.cardAdTwo?.link)
            setBannerAdsUrl(settingsData?.data?.bannerAd?.url)
            setBannerAdsLink(settingsData?.data?.bannerAd?.link)
            setMetaDescription(settingsData?.data?.metaDescription)
            setKeywords(settingsData?.data?.keywords)
            setFacebookUrl(settingsData?.data?.socialLinks?.facebook)
            setInstagramUrl(settingsData?.data?.socialLinks?.instagram)
            setXUrl(settingsData?.data?.socialLinks?.x)
            setPinterestUrl(settingsData?.data?.socialLinks?.pinterest)
            setYoutubeUrl(settingsData?.data?.socialLinks?.youtube)
        }
    }, [settingsData]);

    // Logo Selector
    const logoSelector = (e)=>{
        setLogo(e.target.files[0]);
        const url = URL.createObjectURL(e.target.files[0]);
        setLogoUrl(url)
    }

    // Site Icon Selector
    const siteIconSelector = (e)=>{
        setSiteIcon(e.target.files[0]);
        const url = URL.createObjectURL(e.target.files[0]);
        setSiteIconUrl(url)
    }

    // Card Ads One Selector
    const cardAdsOneSelector = (e)=>{
        const url = URL.createObjectURL(e.target.files[0]);
        setCardAdsOneUrl(url)
        setCardAdsOne(e.target.files[0])
    }

    // Card Ads Two Selector
    const cardAdsTwoSelector = (e)=>{
        const url = URL.createObjectURL(e.target.files[0]);
        setCardAdsTwoUrl(url)
        setCardAdsTwo(e.target.files[0])
    }

    // Card Ads Two Selector
    const bannerAdsSelector = (e)=>{
        const url = URL.createObjectURL(e.target.files[0]);
        setBannerAdsUrl(url)
        setBannerAds(e.target.files[0])
    }

    // Handle Keyword Add
    const handleKeywordKeyDown = (e)=>{
        if(e.key === "Enter"){
            e.preventDefault();

            const value = keywordInput.trim().toLowerCase();

            if (!value) return;
            if (keywords.includes(value)) return;

            setKeywords([...keywords, value]);
            setKeywordInput("");
        }
    };

    // Handle Remove Keyword
    const removeKeyword = (keyword) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    // Call Update Settings API
    const [updateSettings, {isLoading: updateSettingsLoading}] = useUpdateSettingsMutation()

    // Handle Save Settings Data
    const handleSaveSettingsData = async ()=>{
        try{
            // Form Validation
            if(name?.trim() === "" && title?.trim() === "" && !logo && !siteIcon && logoAltTag?.trim() === "" && !cardAdsOne && !cardAdsOneLink && !cardAdsTwo && !cardAdsTwoLink && !bannerAds && !bannerAdsLink && metaDescription?.trim() === "" && keywords?.length === 0 && facebookUrl?.trim() === "" && instagramUrl?.trim() === "" && xUrl?.trim() === "" && pinterestUrl?.trim() === "" && youtubeUrl?.trim() === ""){
                return
            }
            if(logoAltTag?.trim() !== ""){
                if(!logo && !logoUrl){
                    return responseHandler(false, "Please upload a logo if Alt Tag is provided.")
                }
            }
            if(cardAdsOneLink.trim() !== ""){
                if(!cardAdsOne && !cardAdsOneUrl){
                    return responseHandler(false, "Please upload Card Ads 1 image if link is provided.");
                }
            }
            if(cardAdsTwoLink.trim() !== ""){
                if(!cardAdsTwo && !cardAdsTwoUrl){
                    return responseHandler(false, "Please upload Card Ads 2 image if link is provided.")
                }
            }
            if(bannerAdsLink.trim() !== ""){
                if(!bannerAds && !bannerAdsUrl){
                    return responseHandler(false, "Please upload Banner Ads image if link is provided.")
                }
            }

            // Get Form Data
            const formData = new FormData()

            formData.append("name", name)
            formData.append("title", title)
            if(logo || logoUrl){
                formData.append("logo", logo)
                formData.append("logoAltTag", logoAltTag)
            }
            if(siteIcon){
                formData.append("siteIcon", siteIcon)
            }

            if(cardAdsOne || cardAdsOneUrl){
                formData.append("cardAdsOne", cardAdsOne)
                formData.append("cardAdsOneLink", cardAdsOneLink)
            }
            if(cardAdsTwo || cardAdsTwoUrl){
                formData.append("cardAdsTwo", cardAdsTwo)
                formData.append("cardAdsTwoLink", cardAdsTwoLink)
            }
            if(bannerAds || bannerAdsUrl){
                formData.append("bannerAds", bannerAds)
                formData.append("bannerAdsLink", bannerAdsLink)
            }

            formData.append("metaDescription", metaDescription)
            if(keywords?.length > 0){
                formData.append("keywords", JSON.stringify(keywords))
            }

            formData.append("facebookUrl", facebookUrl)
            formData.append("instagramUrl", instagramUrl)
            formData.append("xUrl", xUrl)
            formData.append("pinterestUrl", pinterestUrl)
            formData.append("youtubeUrl", youtubeUrl)

            // Hit Update Settings API
            const response = await updateSettings(formData).unwrap()

            // Reset States
            setName("");
            setTitle("");

            setLogo("");
            setLogoUrl("");
            setLogoAltTag("");
            setSiteIcon("")
            setSiteIconUrl("")

            setCardAdsOne("");
            setCardAdsOneUrl("");
            setCardAdsOneLink("");

            setCardAdsTwo("");
            setCardAdsTwoUrl("");
            setCardAdsTwoLink("");

            setBannerAds("");
            setBannerAdsUrl("");
            setBannerAdsLink("");

            setMetaDescription("");
            setKeywordInput("");
            setKeywords([]);

            setFacebookUrl("");
            setInstagramUrl("");
            setXUrl("");
            setPinterestUrl("");
            setYoutubeUrl("");

            // Refetch Settings Data
            await settingsDataRefetch()

            return responseHandler(true, response?.message)
        }catch(error){
            console.log(error);
            return responseHandler(false, error?.data?.message);
        }
    }

    return(
        <div className="bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full border border-gray-200">
                {/* Section Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                </div>

                {/* Website Details */}
                <div className="p-6 flex flex-col gap-6 mt-4">
                    <h4 className="font-semibold uppercase text-indigo-600 border-b pb-2">Website</h4>

                    {/* Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Name:</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Title:</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[150px] font-medium text-gray-700">Logo (272 x 90):</label>
                        <label className="border border-gray-300 bg-gray-50 hover:border-indigo-500 w-[272px] h-[90px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow shadow-sm hover:shadow-md">
                            {logoUrl !== "" ? (
                                <img src={logoUrl} className="h-full w-full object-cover object-center"/>
                            ) : (
                                <RiImageCircleAiFill className="text-4xl text-gray-400"/>
                            )}
                            <input onChange={logoSelector} type="file" accept="image/*" className="hidden"/>
                        </label>
                    </div>

                    {/* Logo Alt Tag */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Alt Tag:</label>
                        <input value={logoAltTag} onChange={(e)=>setLogoAltTag(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/* Site Icon */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[150px] font-medium text-gray-700">Site Icon (90 x 90):</label>
                        <label className="border border-gray-300 bg-gray-50 hover:border-indigo-500 w-[90px] h-[90px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow shadow-sm hover:shadow-md">
                            {siteIconUrl !== "" ? (
                                <img src={siteIconUrl} className="h-full w-full object-cover object-center"/>
                            ) : (
                                <RiImageCircleAiFill className="text-4xl text-gray-400"/>
                            )}
                            <input onChange={siteIconSelector} type="file" accept="image/*" className="hidden"/>
                        </label>
                    </div>
                </div>

                {/* Ads Images */}
                <div className="p-6 flex flex-col gap-6 mt-6">
                    <h4 className="font-semibold uppercase text-indigo-600 border-b pb-2">Ads</h4>

                    {/* Card Ads 1 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Card Ads 1 (324 X 250):</label>
                        <label className="border border-gray-300 bg-gray-50 hover:border-indigo-500 w-[324px] h-[250px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow shadow-sm hover:shadow-md">
                            {cardAdsOneUrl !== "" ? <img src={cardAdsOneUrl} className="h-full w-full object-cover"/> : <RiImageCircleAiFill className="text-3xl text-gray-400"/>}
                            <input onChange={cardAdsOneSelector} type="file" accept="image/*" className="hidden"/>
                        </label>
                    </div>
                    {/* Card Ads 1 Link */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Link (Card Ads 1):</label>
                        <input value={cardAdsOneLink} onChange={(e)=>setCardAdsOneLink(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/* Card Ads 2 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Card Ads 2 (324 X 250):</label>
                        <label className="border border-gray-300 bg-gray-50 hover:border-indigo-500 w-[324px] h-[250px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow shadow-sm hover:shadow-md">
                            {cardAdsTwoUrl !== "" ? <img src={cardAdsTwoUrl} className="h-full w-full object-cover"/> : <RiImageCircleAiFill className="text-3xl text-gray-400"/>}
                            <input onChange={cardAdsTwoSelector} type="file" accept="image/*" className="hidden"/>
                        </label>
                    </div>
                    {/* Card Ads 2 Link */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Link (Card Ads 2):</label>
                        <input value={cardAdsTwoLink} onChange={(e)=>setCardAdsTwoLink(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/* Banner Ads */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Banner Ads (728 X 90):</label>
                        <label className="border border-gray-300 bg-gray-50 hover:border-indigo-500 w-[728px] h-[90px] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-shadow shadow-sm hover:shadow-md">
                            {bannerAdsUrl !== "" ? <img src={bannerAdsUrl} className="h-full w-full object-cover"/> : <RiImageCircleAiFill className="text-3xl text-gray-400"/>}
                            <input onChange={bannerAdsSelector} type="file" accept="image/*" className="hidden"/>
                        </label>
                    </div>
                    {/* Banner Ads Link */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[200px] font-medium text-gray-700">Link (Banner Ads):</label>
                        <input value={bannerAdsLink} onChange={(e)=>setBannerAdsLink(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>
                </div>

                {/* SEO */}
                <div className="p-6 flex flex-col gap-6 mt-6">
                    <h4 className="font-semibold uppercase text-indigo-600 border-b pb-2">SEO</h4>

                    {/*  Meta Description  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[150px] font-medium text-gray-700">Meta Description:</label>
                        <textarea value={metaDescription} onChange={(e)=>setMetaDescription(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] h-[160px] resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/*  Keywords  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[150px] font-medium text-gray-700">Keywords:</label>
                        <div className="w-full sm:w-[650px]">
                            <input value={keywordInput} onChange={(e)=>setKeywordInput(e.target.value)} onKeyDown={handleKeywordKeyDown} placeholder="Type keyword and press Enter" className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {keywords.map((keyword, index) => (
                                    <span key={index} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-sm">
                                        {keyword}
                                        <button type="button" onClick={() => removeKeyword(keyword)} className="font-bold hover:text-red-600">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links (unchanged logic) */}
                <div className="p-6 flex flex-col gap-6 mt-6">
                    <h4 className="font-semibold uppercase text-indigo-600 border-b pb-2">Social Links</h4>

                    {/*  Facebook  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Facebook:</label>
                        <input value={facebookUrl} onChange={(e)=>setFacebookUrl(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/*  Instagram  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Instagram:</label>
                        <input value={instagramUrl} onChange={(e)=>setInstagramUrl(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/*  X  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">X:</label>
                        <input value={xUrl} onChange={(e)=>setXUrl(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/*  Pinterest  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Pinterest:</label>
                        <input value={pinterestUrl} onChange={(e)=>setPinterestUrl(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>

                    {/*  Youtube  */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-[120px] font-medium text-gray-700">Youtube:</label>
                        <input value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.target.value)} className="border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg w-full sm:w-[650px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"/>
                    </div>
                </div>

                {/* Save Button */}
                <div className="p-6 flex justify-start">
                    <button disabled={updateSettingsLoading} onClick={handleSaveSettingsData} className={`${updateSettingsLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 w-[150px]`}>
                        {updateSettingsLoading ? <Loader size={20} color="#fff"/> : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings;