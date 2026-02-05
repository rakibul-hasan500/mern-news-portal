import Link from "next/link";

function SectionTitle({title, slug=""}){
    return(
        <div className="flex items-center gap-4 mb-[18px]">
            <span className="min-w-max w-max uppercase text-[17px] font-semibold">{title}</span>
            <div className="w-full h-[3px] bg-gray-400"></div>
            {slug !== "" && <Link href={`/category/${slug}`} className="h-[30px] w-[47px] min-w-[47px] flex items-center justify-center text-xs rounded-full shadow bg-gray-100 hover:bg-red-600 hover:text-white transition duration-200">All</Link>}
        </div>
    )
}

export default SectionTitle;