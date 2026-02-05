import {Navigate, Outlet} from "react-router";
import {useSelector} from "react-redux";

function ProtectDashboard(){

    const userInfo = useSelector((state)=>state.App.userInfo)

    if(userInfo && userInfo.name){
        return <Outlet/>
    }else{
        return <Navigate to={"/login"}/>
    }

}

export default ProtectDashboard;