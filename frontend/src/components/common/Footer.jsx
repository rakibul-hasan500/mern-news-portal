"use client"
import Link from "next/link";
import {FaFacebookF, FaInstagram, FaPinterest, FaYoutube} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import {useSelector} from "react-redux";

function Footer(){

    // Get Settings Data From Redux
    const settingsData = useSelector((state)=>state.Settings.settingsData);

    // Menu Items
    const menuItems = [
        {name: "Home", link: "/"},
        {name: "Blog", link: "/blog"},
        // {name: "About", link: "/about"},
        // {name: "Contact", link: "/contact"},
    ]

    return(
        <footer className="bg-black text-gray-300">
            {/* Top simple brand line */}
            <div className="px-4 lg:px-12 py-10 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
                {/*  Logo  */}
                <h2 className="text-white text-xl font-semibold tracking-wide">{settingsData?.appName || "Company Name"}</h2>

                {/*  Slogan  */}
                <p className="text-gray-400 text-sm text-center md:text-right max-w-md">{settingsData?.title}</p>
            </div>

            {/* Bottom bar */}
            <div className="px-4 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                {/*  Copyright Text  */}
                <p className="text-gray-400">© {new Date().getFullYear()} {settingsData?.appName || "Company Name"}. All rights reserved.</p>

                {/*  Nav Links  */}
                <div className="flex items-center gap-4">
                    {
                        menuItems.map((menu, index)=>(
                            <Link key={index} href={menu.link} className="hover:text-white transition">{menu.name}</Link>
                        ))
                    }
                </div>

                {/*  Social Icons  */}
                <div className="flex items-center gap-4 text-lg">
                    <a className="hover:text-white transition" href={settingsData?.socialLinks?.facebook || "#"} target={"_blank"}><FaFacebookF/></a>
                    <a className="hover:text-white transition" href={settingsData?.socialLinks?.instagram || "#"} target={"_blank"}><FaInstagram/></a>
                    <a className="hover:text-white transition" href={settingsData?.socialLinks?.x || "#"} target={"_blank"}><FaXTwitter/></a>
                    <a className="hover:text-white transition" href={settingsData?.socialLinks?.pinterest || "#"} target={"_blank"}><FaPinterest/></a>
                    <a className="hover:text-white transition" href={settingsData?.socialLinks?.youtube || "#"} target={"_blank"}><FaYoutube/></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;