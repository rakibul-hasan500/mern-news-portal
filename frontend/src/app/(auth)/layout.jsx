import ReduxWrapper from "@/wrappers/ReduxWrapper";
import {baseUrl} from "@/utils/baseUrl";
import {IoHomeSharp} from "react-icons/io5";
import "../globals.css"
import "../../css/font.css"
import Link from "next/link";

// Call Get Settings Data API For Meta Data
async function getSiteSettings(){
    try{
        const res = await fetch(`${baseUrl}/api/settings`, {cache: "no-cache"})
        if(!res.ok) return null;
        return res.json()
    }catch(error){
        return console.error(error)
    }
}

// Apply Meta Data
export async function generateMetadata(){
    // Get Meta Data
    const data = await getSiteSettings();

    return{
        title: `${data?.data?.appName} - ${data?.data?.title}`,
        description: data?.data?.description,
        keywords: data?.data?.keywords,
        icons: {
            icon: [
                {url: data?.data?.siteIcon?.url},
                {url: data?.data?.siteIcon?.url, rel: "shortcut icon"},
            ],
            apple: [
                {url: data?.data?.siteIcon?.url},
            ],
        }
    }
}

export default function authLayout({children}){
    return(
        <ReduxWrapper>
            <html lang="en">
                <body className="bg-gray-50 relative">
                    {/*  Header  */}
                    <header>
                        <Link href={"/"} className="bg-white rounded absolute top-4 left-4 shadow h-12 w-12 flex items-center justify-center text-xl">
                            <IoHomeSharp />
                        </Link>
                    </header>
                    {children}
                </body>
            </html>
        </ReduxWrapper>
    )
}