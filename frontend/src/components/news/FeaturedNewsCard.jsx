import Image from "next/image";
import Link from "next/link";

function FeaturedNewsCard({height, titleFontSize, news}){
    return(
        <Link href={`/news/${news?.slug}`} style={{height: height}} className="group w-full relative border border-gray-50 overflow-hidden">
            {/*  Image  */}
            {(news && news._id) && <Image
                src={news?.featuredImage || ""}
                alt={news?.title || ""}
                fill={true}
                loading="eager"
                className="object-cover object-center group-hover:scale-[1.1] transition duration-[1s]"
            />}

            {/*  Data  */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 flex flex-col gap-2">
                {/*  Category  */}
                <div className="flex items-center gap-2 flex-wrap">
                    {
                        news?.categories?.map((category, index)=>(
                            <span className={`${category?.name === "Breaking News" && "hidden"} uppercase text-white text-[11px] font-semibold bg-red-500 px-2 py-1 rounded-full`} key={index}>{category?.name}</span>
                        ))
                    }
                </div>
                {/*  Title  */}
                <h2 style={{fontSize: titleFontSize}} className="text-white font-bold">{news?.title}</h2>
                {/*  Author & Date  */}
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-sm text-gray-200 font-medium">{news?.author?.name}</span>
                    <span className="text-sm text-gray-200 font-medium">
                        {news?.createdAt && new Date(news?.createdAt).toLocaleDateString("en-us", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default FeaturedNewsCard;