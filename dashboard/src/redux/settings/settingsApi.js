import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import base_url from "../../config/config.js";

const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${base_url}/api/settings`,
        credentials: "include",
    }),
    tagTypes: ["settings"],
    endpoints: (builder)=>({

        // Update Settings
        updateSettings: builder.mutation({
            query: (settingsData)=>({
                url: `/update`,
                method: "POST",
                body: settingsData
            }),
            invalidatesTags: ["settings"]
        }),

        // Get Settings Data
        getSettingsData: builder.query({
            query: ()=>({
                url: `/`,
                method: "GET"
            }),
            providesTags: ["settings"],
        })


    })
})

export const {
    useUpdateSettingsMutation,
    useGetSettingsDataQuery
} = settingsApi;
export default settingsApi
