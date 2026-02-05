import {Navigate, Outlet} from "react-router"
import Header from "./Header"
import Sidebar from "./Sidebar"
import DeleteWarning from "../components/DeleteWarning.jsx";
import {useSelector} from "react-redux";

function MainLayout(){

    const deleteWarning = useSelector((state)=>state.App.deleteWarning)

  return (
    <div className="overflow-x-hidden min-h-screen bg-slate-400 flex">
        {/*  Warning  */}
        {deleteWarning && <DeleteWarning/>}

        {/*  Sidebar  */}
        <Sidebar/>

        {/*  Header & Pages  */}
        <div className="ml-[300px] flex-1">
            {/*  Header  */}
            <Header/>

            {/*  Pages  */}
            <div className="p-4">
                <div className="pt-[70px]">
                    <Outlet/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MainLayout