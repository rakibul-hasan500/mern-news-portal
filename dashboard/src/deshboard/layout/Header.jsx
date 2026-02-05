import profileImage from "../../assets/images/profile.png"
import {IoSearch} from "react-icons/io5";
import {useSelector} from "react-redux";

function Header() {

    const userInfo = useSelector((state)=>state.App.userInfo)

  return (
    <div className="fixed w-[calc(100vw-300px)] z-50 border-l border-gray-300">
        <div className="w-full rounded h-[70px] flex items center justify-between p-4 bg-[#f1f1fb]">
            {/*  Search Input  */}
            <div className="relative">
                <input type="text" placeholder="Search" className="px-3 py-2 rounded-md outline-none border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-10 w-[400px] bg-white"/>
                <IoSearch className="text-xl absolute top-1/2 -translate-y-1/2 right-2"/>
            </div>

            {/*  Image & User Data  */}
            <div className="pr-4">
                <div className="flex gap-x-2">
                    {/*  Image  */}
                    <div>
                        <img src={userInfo?.image || profileImage} alt="person-profile-image" className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover object-center"/>
                    </div>

                    {/*  User Data  */}
                    <div className="flex flex-col justify-center items-start">
                        <span className="font-bold">{userInfo?.name}</span>
                        <span className="font-semibold text-xs uppercase text-indigo-600">{userInfo?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header