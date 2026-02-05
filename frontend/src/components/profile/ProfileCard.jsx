import Link from "next/link";
import Image from "next/image";
import {MdOutlineDashboardCustomize} from "react-icons/md";
import {TbUserEdit} from "react-icons/tb";
import {FaPowerOff} from "react-icons/fa";

function ProfileCard({currentUserData, setLogoutWarningOpen}){

    // Role & Image
    const role = currentUserData?.role;
    const avatar = currentUserData?.image;

    return (
        <div className="absolute right-4 top-full w-[270px] h-max rounded-2xl overflow-hidden bg-white/95 backdrop-blur-lg border-2 border-gray-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] invisible group-hover:visible transition-all duration-300 z-[99999]">
            {/* subtle top line */}
            <div className="h-[2px] w-full bg-gray-200"></div>

            {/* Header */}
            <div className="px-4 pt-5 pb-5 text-center">
                {/* Avatar */}
                <div className="relative mx-auto w-16 h-16 rounded-full border-3 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={currentUserData?.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-xl font-bold text-gray-700">{currentUserData?.name?.charAt(0)}</span>
                    )}
                </div>

                {/*  Name  */}
                <h3 className="mt-3 text-sm font-semibold text-gray-900 truncate">{currentUserData?.name}</h3>

                {/*  Email  */}
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{currentUserData?.email}</p>

                {/*  Role  */}
                {role && <span className="inline-block px-3 py-[3px] rounded-full text-[10px] font-semibold uppercase tracking-wide bg-gray-200 text-gray-700 mt-2">{role}</span>}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300 mx-4"></div>

            {/* Actions */}
            <div className="px-3 py-4 flex flex-col gap-2">
                {/*  Dashboard  */}
                {(role === "admin" || role === "writer" || role === "editor") && (
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                        <MdOutlineDashboardCustomize /> Dashboard
                    </Link>
                )}

                {/*  Edit Profile  */}
                <Link href="/edit-profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                    <TbUserEdit /> Edit Profile
                </Link>

                {/*  Logout  */}
                <button onClick={()=>setLogoutWarningOpen((open)=>!open)} className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition uppercase text-center justify-center mt-1">
                    <FaPowerOff /> Logout
                </button>
            </div>
        </div>
    );
}

export default ProfileCard;
