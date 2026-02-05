"use client";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default function EditProfilePage(){
    return (
        <main className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-16 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm">
                <Link href="/" className="text-gray-500 hover:text-red-600 transition">Home</Link>
                <IoIosArrowForward className="text-gray-400" />
                <span className="text-gray-600 font-medium">Edit Profile</span>
            </div>

            {/* Title */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Edit Your Profile</h1>
                <p className="text-gray-500 mt-1">Update your personal information and password</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-10">
                <EditProfileForm />
            </div>
        </main>
    );
}
