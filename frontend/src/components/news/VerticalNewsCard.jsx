import Image from "next/image";
import Link from "next/link";
import {convert} from "html-to-text";

function VerticalNewsCard({news, descShow=true}){

    const desc = convert(news?.description);

    return(
        <div className="w-full overflow-hidden">
            {/*  Image  */}
            <div className="relative h-[240px] sm:h-[221px] w-full overflow-hidden">
                {(news && news._id) && <Image
                    src={news?.featuredImage || ""}
                    alt={news?.title || ""}
                    fill={true}
                    loading="eager"
                    className="object-cover object-center hover:scale-[1.1] transition duration-[1s]"
                />}
            </div>

            {/*  Category  */}
            <div className="flex items-center gap-3 flex-wrap mt-[15px] mb-[10px]">
                {
                    news?.categories?.map((category, index)=>(
                        <Link href={`/category/${category?.slug}`} className={`${category?.name === "Breaking News" && "hidden"} uppercase text-gray-500 text-[12px] font-semibold hover:text-red-600 transition duration-200`} key={index}>{category?.name}</Link>
                    ))
                }
            </div>

            {/*  News Title  */}
            <Link href={`/news/${news?.slug}`} className="text-[19px] text-gray-800 font-medium hover:text-red-600 transition duration-200">{news?.title}</Link>

            {/*  Author & Date  */}
            <div className="flex items-center gap-4 mt-[12px] mb-[10px]">
                <span className="text-gray-700 text-[13px] font-medium">{news?.author?.name}</span>
                <span className="text-gray-400 text-[13px] font-medium">
                    {news?.createdAt && new Date(news?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>

            {/*  Desc  */}
            {descShow&& <p className="text-[14px] text-gray-500 leading-6">{convert(news?.description).length > 112 ? desc?.slice(0, 112).trim() + "..." : desc}</p>}
        </div>
    )
}

export default VerticalNewsCard;