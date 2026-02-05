import {Link} from "react-router";
import NewsContent from "../components/NewsContent.jsx";
import {useSelector} from "react-redux";

function AllNews(){

    const userInfo = useSelector((state) => state.App.userInfo);

    return(
        <div className="flex-1 bg-white min-h-screen">
            {/*  Section Header  */}
            <div className="flex justify-between p-4">
                {/*  Title  */}
                <h2 className="text-xl font-medium">News</h2>

                {/*  Button  */}
                {(userInfo?.role !== "editor") && <Link to={"/dashboard/news/create"} className="px-5 py-2 font-semibold bg-indigo-500 rounded-lg text-white hover:bg-indigo-800 ">Create News</Link>}
            </div>

            {/*  All News  */}
            <NewsContent/>
        </div>
    )
}

export default AllNews;