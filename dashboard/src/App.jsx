import {BrowserRouter, Route, Routes} from 'react-router'
import './App.css'
import Login from './deshboard/pages/Login';
import MainLayout from './deshboard/layout/MainLayout';
import AdminIndex from './deshboard/pages/AdminIndex';
import ProtectDashboard from "./middleware/ProtectDashboard.jsx";
import PageNotFound from "./deshboard/pages/PageNotFound.jsx";
import PublicRoute from "./middleware/PublicRoute.jsx";
import RoleBaseRedirect from "./middleware/RoleBaseRedirect.jsx";
import AllNews from "./deshboard/pages/AllNews.jsx";
import AddUser from "./deshboard/pages/AddUser.jsx";
import Users from "./deshboard/pages/Users.jsx";
import Profile from "./deshboard/pages/Profile.jsx";
import Settings from "./deshboard/pages/Settings.jsx";
import CreateNews from "./deshboard/pages/CreateNews.jsx";
import NewsLayout from "./deshboard/layout/NewsLayout.jsx";
import WriterIndex from "./deshboard/pages/WriterIndex.jsx";
import {useGetUserQuery} from "./redux/auth/authApi.js";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {handleGetUserData} from "./redux/app/appSlice.js";
import VerifyUser from "./deshboard/pages/VerifyUser.jsx";
import Category from "./deshboard/pages/Category.jsx";
import AddCategory from "./deshboard/pages/AddCategory.jsx";
import Comment from "./deshboard/pages/Comment.jsx";
import EditorIndex from "./deshboard/pages/EditorIndex.jsx";
import ProtectedLayout from "./middleware/ProtectedLayout.jsx";
import EditNews from "./deshboard/pages/EditNews.jsx";
import SingleNews from "./deshboard/pages/SingleNews.jsx";
import {useGetSettingsDataQuery} from "./redux/settings/settingsApi.js";
import useFabIcon from "./deshboard/components/useFabIcon.jsx";

function App(){

    useFabIcon()

    const dispatch = useDispatch();

    // Call Get User Data API
    const {data: userData} = useGetUserQuery()

    // Set User Data To Redux
    useEffect(() => {
        if(userData?.data?.id){
            dispatch(handleGetUserData(userData?.data || null))
        }else{
            dispatch(handleGetUserData(null))
        }
    }, [userData, dispatch]);

    // Call Get Settings Data API
    const {data: settingsData} = useGetSettingsDataQuery()

    // Set Site Title
    useEffect(()=>{
        if(settingsData && settingsData?.data?._id){
            document.title = `${settingsData?.data?.appName} - ${settingsData?.data?.title}`
        }else{
            document.title = "Admin Panel"
        }
    }, [settingsData]);

  return (
    <BrowserRouter>
      <Routes>

          {/*  Auth Routes  */}
          <Route element={<PublicRoute/>}>
              <Route path='/login' element={<Login/>}/>
              <Route path='/verify' element={<VerifyUser/>}/>
          </Route>

          {/*  Protected Routes  */}
          <Route element={<ProtectDashboard/>}>
              <Route element={<MainLayout/>}>

                  {/*  Root Redirect  */}
                  <Route path="/" element={<RoleBaseRedirect/>}/>

                  {/*  Profile Route  */}
                  <Route path="dashboard/profile" element={<Profile/>}/>




                  {/* ============= ADMIN ============= */}
                  <Route element={<ProtectedLayout roles={["admin"]}/>}>
                      <Route path="dashboard/admin" element={<AdminIndex/>}/>
                      <Route path="dashboard/category/add" element={<AddCategory/>}/>
                      <Route path="dashboard/categories" element={<Category/>}/>
                      <Route path="dashboard/user/add" element={<AddUser/>}/>
                      <Route path="dashboard/users" element={<Users/>}/>
                      <Route path="dashboard/settings" element={<Settings/>}/>
                  </Route>




                  {/* ============= EDITOR ============ */}
                  <Route element={<ProtectedLayout roles={["editor"]}/>}>
                      <Route path="dashboard/editor" element={<EditorIndex/>}/>
                  </Route>




                  {/* ============ WRITER ============= */}
                  <Route element={<ProtectedLayout roles={["writer"]}/>}>
                      <Route path="dashboard/writer" element={<WriterIndex/>}/>
                  </Route>





                  {/* ==== WRITER | EDITOR | ADMIN ==== */}
                  <Route element={<ProtectedLayout roles={["writer", "admin", "editor"]}/>}>
                      {/*  News Routes  */}
                      <Route path="dashboard/news" element={<NewsLayout/>}>
                          <Route index element={<AllNews/>}/>
                          <Route element={<ProtectedLayout roles={["writer", "admin"]}/>}>
                              <Route path="create" element={<CreateNews/>}/>
                          </Route>
                          <Route path="edit/:slug" element={<EditNews/>}/>
                          <Route path=":slug" element={<SingleNews/>}/>
                      </Route>
                  </Route>



                  {/* ======= WRITER | ADMIN ========= */}
                  <Route element={<ProtectedLayout roles={["writer", "admin"]}/>}>
                      <Route path="dashboard/comments" element={<Comment/>}/>
                  </Route>







                  {/*  Page Not Found Route  */}
                  <Route path="*" element={<PageNotFound/>}/>

              </Route>
          </Route>









          {/*  Global Page Not Found Route  */}
          <Route path="page-not-found" element={<PageNotFound/>}/>
          <Route path="*" element={<PageNotFound/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
