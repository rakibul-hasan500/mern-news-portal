"use client"
import {Provider} from "react-redux";
import store from "@/redux/store";
import DataFetcher from "@/wrappers/DataFetcher";
import {Toaster} from "react-hot-toast";

function ReduxWrapper({children}){
    return(
        <Provider store={store}>
            <Toaster/>
            <DataFetcher/>
            {children}
        </Provider>
    )
}

export default ReduxWrapper;