import Image from "next/image";
import Link from "next/link";

function HorizontalNewsCard({news, categoryShow, authorShow}){
    return(
        <div className="w-full flex items-center gap-[15px]">
            {/*  Image  */}
            <div className="relative h-[75px] w-[100px] min-h-[75px] min-w-[100px] overflow-hidden">
                {(news && news._id) && <Image
                    src={news?.featuredImage || ""}
                    alt={news?.title || ""}
                    fill={true}
                    loading="eager"
                    className="object-cover object-center hover:scale-[1.1] transition duration-[1s]"
                />}
            </div>

            {/*  Content  */}
            <div className="flex flex-col gap-[5px]">
                {/*  Category  */}
                {categoryShow && <div className="flex items-center gap-3 flex-wrap">
                    {
                        news?.categories?.map((category, index)=>(
                            <Link href={`/category/${category?.slug}`} className={`${category?.name === "Breaking News" && "hidden"} uppercase text-gray-500 text-[12px] font-semibold hover:text-red-600 transition duration-200`} key={index}>{category?.name}</Link>
                        ))
                    }
                </div>}

                {/*  News Title  */}
                <Link href={`/news/${news?.slug}`} className="text-[15px] text-gray-800 font-medium hover:text-red-600 transition duration-200">{news?.title?.length > 50 ? news?.title?.slice(0, 50) + "..." : news?.title}</Link>

                {/*  Author & Date  */}
                <div className="flex items-center gap-4">
                    {authorShow && <span className="text-gray-700 text-[13px] font-medium">{news?.author?.name}</span>}
                    <span className="text-gray-400 text-[13px] font-medium">
                        {news?.createdAt && new Date(news?.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default HorizontalNewsCard;