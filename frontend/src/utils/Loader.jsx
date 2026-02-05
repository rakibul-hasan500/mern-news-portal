import {ClipLoader} from "react-spinners";

function Loader({color="#fff", size=20}){
    return <ClipLoader
        color={color}
        size={size}
    />
}

export default Loader;