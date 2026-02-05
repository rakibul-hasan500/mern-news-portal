import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import base_url from "../../config/config.js";

const dashboardApi = createApi({
    reducerPath: "dashboard",
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/dashboard`,
        credentials: "include",
    }),
    tagTypes: ["dashboard"],
    endpoints: (builder)=>({

        // Get Stats
        getStats: builder.query({
            query: ()=>({
                url: "/stats",
                method: "GET",
            })
        })


    })
})

export const {
    useGetStatsQuery
} = dashboardApi;
export default dashboardApi
