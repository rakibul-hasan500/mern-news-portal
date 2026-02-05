import React from 'react'
import {Link} from "react-router";
import {IoMdEye} from "react-icons/io";
import {useGetStatsQuery} from "../../redux/dashboard/dashboardApi.js";

function AdminIndex() {

    // Call Get Stats API
    const {data: statsData} = useGetStatsQuery()

  return (
    <div className="mt-4">
        {/*  Stats Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/*  Total News  */}
            <div className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2">
                <span className={`text-red-500 text-4xl font-bold`}>{statsData?.data?.stats?.totalNews && String(statsData?.data?.stats?.totalNews).padStart(2, "0")}</span>
                <span className="uppercase font-bold text-gray-600">Total News</span>
            </div>

            {/*  Pending News  */}
            <div className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2">
                <span className={`text-purple-500 text-4xl font-bold`}>{statsData?.data?.stats?.pendingNews && String(statsData?.data?.stats?.pendingNews).padStart(2, "0")}</span>
                <span className="uppercase font-bold text-gray-600">Pending News</span>
            </div>

            {/*  Rejected News  */}
            <div className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2">
                <span className={`text-cyan-500 text-4xl font-bold`}>{statsData?.data?.stats?.rejectedNews && String(statsData?.data?.stats?.rejectedNews).padStart(2, "0")}</span>
                <span className="uppercase font-bold text-gray-600">Rejected News</span>
            </div>

            {/*  Published News  */}
            <div className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2">
                <span className={`text-indigo-500 text-4xl font-bold`}>{statsData?.data?.stats?.publishedNews && String(statsData?.data?.stats?.publishedNews).padStart(2, "0")}</span>
                <span className="uppercase font-bold text-gray-600">Published News</span>
            </div>

            {/*  Users  */}
            <div className="p-8 bg-white rounded-lg shadow-md flex flex-col items-center gap-2">
                <span className={`text-green-500 text-4xl font-bold`}>{statsData?.data?.stats?.totalUsers && String(statsData?.data?.stats?.totalUsers).padStart(2, "0")}</span>
                <span className="uppercase font-bold text-gray-600">Total Users</span>
            </div>
        </div>

        {/*  Recent News  */}
        <div className="bg-white p-6 mb-8 rounded-lg shadow-md mt-8">
            {/*  Titele & See All Button  */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <h2 className="text-xl font-bold text-gray-600">Recent News</h2>
                <Link to={"/dashboard/news"} className="text-indigo-500 hover:text-indigo-700 font-semibold transition duration-200">See All</Link>
            </div>

            {/*  Recent News Items  */}
            <div className="overflow-x-auto">
                <div>
                    {/*  News Items Header  */}
                    <div className="grid grid-cols-12 gap-2 w-full bg-gray-200 p-4 rounded-t-lg">
                        {/*  Serial Number  */}
                        <div className="col-span-1 uppercase font-medium">
                            NO
                        </div>

                        {/*  Title  */}
                        <div className="col-span-4 uppercase font-medium">
                            Title
                        </div>

                        {/*  Image  */}
                        <div className="col-span-1 uppercase font-medium">
                            IMAGE
                        </div>

                        {/*  Category  */}
                        <div className="col-span-2 uppercase font-medium">
                            Category
                        </div>

                        {/*  Date  */}
                        <div className="col-span-2 uppercase font-medium">
                            Date
                        </div>

                        {/*  Status  */}
                        <div className="col-span-1 uppercase font-medium">
                            Status
                        </div>

                        {/*  Actions  */}
                        <div className="col-span-1 uppercase font-medium text-center">
                            Action
                        </div>
                    </div>

                    {/*  News Items  */}
                    <div>
                        {
                            statsData?.data?.newsItems.map((news, index)=>(
                                <div key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-white"} grid grid-cols-12 gap-4 w-full min-w-[1490px] p-4 rounded-t-lg items-center border-b border-gray-200`}>
                                    {/*  Serial Number  */}
                                    <div className="col-span-1 text-gray-600 font-medium">
                                        {index + 1}
                                    </div>

                                    {/*  Title  */}
                                    <div className="col-span-4 text-gray-600">
                                        {news?.title}
                                    </div>

                                    {/*  Image  */}
                                    <div className="col-span-1 text-gray-600">
                                        <img src={news?.featuredImage} alt={news?.title} className="w-18 h-12 rounded object-cover object-center"/>
                                    </div>

                                    {/*  Category  */}
                                    <div className="col-span-2 text-gray-600 flex gap-3 flex-wrap">
                                        {news?.categories?.map((category, index)=>(
                                            <span key={index} className="px-2 py-1 shadow bg-gray-100 text-sm font-semibold">{category?.name}</span>
                                        ))}
                                    </div>

                                    {/*  Date  */}
                                    <div className="col-span-2 text-gray-600">
                                        {new Date(news?.createdAt).toLocaleDateString("en-us", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>

                                    {/*  Status  */}
                                    <div className={`${news.status === "published" ? "bg-green-100 text-green-700 px-4 py-1 rounded-full w-max" : news.status === "pending" ? "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full w-max" : "bg-red-100 text-red-700 px-4 py-1 rounded-full w-max" } col-span-1 text-gray-600 text-sm capitalize`}>
                                        {news.status}
                                    </div>

                                    {/*  Actions  */}
                                    <div className="col-span-1 text-gray-600 flex items-center justify-center gap-4">
                                        {/*  Preview  */}
                                        <Link to={`/dashboard/news/${news?.slug}`} className="h-9 w-9 bg-indigo-500 hover:bg-indigo-700 rounded-md flex items-center justify-center text-xl text-white cursor-pointer">
                                            <IoMdEye />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminIndex