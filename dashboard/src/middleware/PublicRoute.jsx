import {Navigate, Outlet} from "react-router";
import {useSelector} from "react-redux";

function PublicRoute(){

    const userInfo = useSelector((state)=>state.App.userInfo)

    if(!userInfo || !userInfo.name){
        return <Outlet/>
    }

    return <Navigate to={"/"}/>

}

export default PublicRoute;