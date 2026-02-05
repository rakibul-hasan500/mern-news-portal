import Image from "next/image";
import Link from "next/link";
import {convert} from "html-to-text";
import {LuUser} from "react-icons/lu";
import {FiClock} from "react-icons/fi";

function ResponsiveNewsCard({news}){

    const desc = convert(news?.description);

    return(
        <div className="w-full flex flex-col lg:flex-row items-center gap-[15px]">
            {/*  Image  */}
            <div className="relative h-[250px] w-full lg:h-[146px] lg:w-[208px] lg:min-w-[208px] overflow-hidden">
                {(news && news._id) && <Image
                    src={news?.featuredImage || ""}
                    alt={news?.title || ""}
                    fill={true}
                    loading="eager"
                    className="object-cover object-center hover:scale-[1.1] transition duration-[1s]"
                />}
            </div>

            {/*  Content  */}
            <div className="flex flex-col gap-[6px] overflow-hidden">
                {/*  Category  */}
                <div className="flex items-center gap-3 flex-wrap">
                    {
                        news?.categories?.map((category, index)=>(
                            <Link href={`/category/${category?.slug}`} className={`${category?.name === "Breaking News" && "hidden"} uppercase text-gray-500 text-[12px] font-semibold hover:text-red-600 transition duration-200`} key={index}>{category?.name}</Link>
                        ))
                    }
                </div>

                {/*  News Title  */}
                <Link href={`/news/${news?.slug}`} className="text-[21px] text-gray-800 font-medium hover:text-red-600 transition duration-200">{news?.title?.length > 40 ? news?.title?.slice(0, 40) + "..." : news?.title}</Link>

                {/*  Category, Author & Date  */}
                <div className="flex items-center gap-4">
                    {/*  Author  */}
                    <span className="text-gray-500 text-[14px] font-medium flex items-center gap-1"><LuUser />{news?.author?.name}</span>
                    {/*  Date  */}
                    <span className="text-gray-400 text-[13px] font-medium flex items-center gap-1">
                        <FiClock />
                        {news?.createdAt && new Date(news?.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {/*  Description  */}
                <p className="text-gray-600 font-light text-sm">{desc?.trim()?.length > 129 ? desc?.slice(0, 129) + "..." : desc?.trim()}</p>
            </div>
        </div>
    )
}

export default ResponsiveNewsCard;