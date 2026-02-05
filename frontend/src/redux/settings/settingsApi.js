import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseUrl} from "@/utils/baseUrl";

const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/settings`,
        credentials: "include",
    }),
    tagTypes: ["settings"],
    endpoints: (builder)=>({

        // Get Settings Data
        getSettingsData: builder.query({
            query: ()=>({
                url: "/",
                method: "GET",
            }),
            providesTags: ["settings"],
        })


    })
})

export const {
    useGetSettingsDataQuery,
} = settingsApi
export default settingsApi