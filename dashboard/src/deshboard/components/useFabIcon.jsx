import {useGetSettingsDataQuery} from "../../redux/settings/settingsApi.js";
import {useEffect} from "react";

function useFabIcon(){

    // Call Get Settings Data API
    const {data: settingsData} = useGetSettingsDataQuery()

    useEffect(()=>{
        if(!settingsData || !settingsData?.data?._id) return

        if(settingsData && settingsData?.data?._id){
            let link = document.querySelector("link[rel='icon']")

            if(!link){
                link = document.createElement("link")
                link.rel = "icon"
                link.type = "image/png"
                document.head.appendChild(link)
            }

            link.href = settingsData?.data?.siteIcon + "?v=" + new Date().getTime();
        }
    }, [settingsData]);

}

export default useFabIcon;