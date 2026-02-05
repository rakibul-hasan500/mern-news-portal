"use client"
import {
    FacebookIcon,
    FacebookShareButton, PinterestIcon, PinterestShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {usePathname} from "next/navigation";

function SocialShare({mediaUrl}){

    // Get Page Url
    const pathName = usePathname()
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const pageUrl = baseUrl + pathName

    return(
        <div className="flex items-center gap-4 flex-wrap">
            {/*  Facebook Share  */}
            <FacebookShareButton url={pageUrl}>
                <div className="flex items-center gap-2 px-4 py-2 rounded shadow cursor-pointer transition text-[#0965FE] text-sm font-semibold">
                    <FacebookIcon size={22} round />
                    <span className="hidden sm:block">Facebook</span>
                </div>
            </FacebookShareButton>

            {/*  X Share  */}
            <TwitterShareButton url={pageUrl}>
                <div className="flex items-center gap-2 px-4 py-2 rounded shadow cursor-pointer transition text-[#00ACED] text-sm font-semibold">
                    <TwitterIcon size={22} round />
                    <span className="hidden sm:block">Twitter</span>
                </div>
            </TwitterShareButton>

            {/*  WhatsApp Share  */}
            <WhatsappShareButton url={pageUrl}>
                <div className="flex items-center gap-2 px-4 py-2 rounded shadow cursor-pointer transition text-[#25D366] text-sm font-semibold">
                    <WhatsappIcon size={22} round />
                    <span className="hidden sm:block">WhatsApp</span>
                </div>
            </WhatsappShareButton>

            {/*  X Share  */}
            <PinterestShareButton url={pageUrl} media={mediaUrl}>
                <div className="flex items-center gap-2 px-4 py-2 rounded shadow cursor-pointer transition text-[#E60023] text-sm font-semibold">
                    <PinterestIcon size={22} round />
                    <span className="hidden sm:block">Pinterest</span>
                </div>
            </PinterestShareButton>
        </div>
    )
}

export default SocialShare;