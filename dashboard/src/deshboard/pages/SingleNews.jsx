import {useParams, Link} from "react-router";
import {useGetNewsDetailsQuery} from "../../redux/news/newsApi.js";
import {FaEdit, FaArrowLeft} from "react-icons/fa";

function SingleNews() {

    // Get slug from URL
    const { slug } = useParams();

    // Fetch news details
    const { data, isLoading, isError } = useGetNewsDetailsQuery({ slug });

    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading news details...
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load news details.
            </div>
        );
    }

    const news = data.data;

    return (
        <div className="flex-1 bg-white min-h-screen">
            <div className="p-6 max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-4">
                    <Link
                        to="/dashboard/news"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                    >
                        <FaArrowLeft />
                        Back to News
                    </Link>
                </div>

                {/*  Image  */}
                <div className="mb-6 rounded overflow-hidden">
                    <img
                        src={news.featuredImage}
                        alt={news.title}
                        className="w-full h-[400px] object-cover"
                    />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {news.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span>
                    By <b>{news.author?.name || "Unknown"}</b>
                </span>
                    <span>
                    {new Date(news.createdAt).toLocaleDateString()}
                </span>
                    {news.category && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {news.category.name}
                    </span>
                    )}
                </div>

                {/* Thumbnail */}
                {news.thumbnail && (
                    <div className="mb-6">
                        <img
                            src={news.thumbnail}
                            alt={news.title}
                            className="w-full max-h-[400px] object-cover rounded"
                        />
                    </div>
                )}

                {/* Description (HTML content) */}
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: news.description }}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                    <Link
                        to={`/dashboard/news/edit/${news.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                    >
                        <FaEdit />
                        Edit News
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SingleNews;
