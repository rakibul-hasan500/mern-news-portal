import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useGetAllNewsQuery} from "@/redux/news/newsApi";
import {handleSetNewsData} from "@/redux/news/newsSlice";
import {useGetAllCategoriesQuery} from "@/redux/category/categoryApi";
import {handleSetCategoryData} from "@/redux/category/categorySlice";
import {useGetSettingsDataQuery} from "@/redux/settings/settingsApi";
import {handleSetSettingsData} from "@/redux/settings/settingsSlice";
import {useGetCurrentUserQuery} from "@/redux/user/userApi";
import {handleSetUserData} from "@/redux/user/userSlice";

function DataFetcher(){

    const dispatch = useDispatch();


    /////////////////////////////
    // Call Get Settings Data API
    const {data: settingsData, isLoading: settingsDataLoading} = useGetSettingsDataQuery()
    useEffect(()=>{
        if(settingsData?.data?._id){
            dispatch(handleSetSettingsData(settingsData?.data))
        }
    }, [settingsData])


    //////////////////////////////
    // Call Current User Data
    const {data: userData} = useGetCurrentUserQuery()
    useEffect(()=>{
        if(userData?.data?.id){
            dispatch(handleSetUserData(userData?.data))
        }
    }, [userData])



    ///////////////////////////
    // Categories Filter States
    const [categoryLimits, setCategoryLimits] = useState(10);
    // Call Get All Categories API
    const {data: categoriesData, isLoading: categoriesDataLoading} = useGetAllCategoriesQuery({
        searchText: "",
        limits: categoryLimits,
        page: 1
    })
    // Set Data To Redux
    useEffect(()=>{
        setCategoryLimits(categoriesData?.data?.categoriesCount)
        dispatch(handleSetCategoryData(categoriesData))
    },[categoriesData])


    /////////////////////
    // News Filter States
    const [newsLimits, setNewsLimits] = useState(10);
    // Call Get All News API
    const {data: newsData, isLoading: newsDataLoading} = useGetAllNewsQuery({
        category: "",
        status: "",
        search: "",
        limits: newsLimits,
        page: 1
    })
    // Set Data To STates
    useEffect(()=>{
        setNewsLimits(newsData?.data?.allNewsCount)
        dispatch(handleSetNewsData(newsData));
    }, [newsData, dispatch]);

    return
}

export default DataFetcher;