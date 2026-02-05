import {Navigate, Outlet} from "react-router";
import {useSelector} from "react-redux";

function RoleBaseRedirect(){

    const userInfo = useSelector((state)=>state.App.userInfo)

    if(userInfo && userInfo.role === "admin"){
        return <Navigate to={"/dashboard/admin"}/>
    }else if(userInfo && userInfo.role === "editor"){
        return <Navigate to={"/dashboard/editor"}/>
    }else{
        return <Navigate to={"/dashboard/writer"}/>
    }
}

export default RoleBaseRedirect;