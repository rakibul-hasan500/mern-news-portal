import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router";

function ProtectedLayout({roles}){

    const user = useSelector((state)=>state.App.userInfo);

    if(!user) return <Navigate to="/login"/>;

    if(roles && !roles.includes(user.role)){
        return <Navigate to="/page-not-found"/>;
    }

    return <Outlet />;
}

export default ProtectedLayout;