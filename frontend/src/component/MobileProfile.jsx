import { useSelector } from "react-redux"
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import {
    FaHistory,
    FaList,
    FaThumbsUp,
} from "react-icons/fa";
import { GoVideo } from "react-icons/go";

function MobileProfile() {
    const { userData } = useSelector((state) => state.user);
    return (
        <div className="md:hidden bg-[#0f0f0f] text-white min-h-screen flex flex-col pt-16 p-2.5">
            {userData && (
                <div className="p-4 flex items-center gap-4 border-b border-gray-800">
                    <img
                        src={userData?.profilePictureUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">@{userData?.username}</span>
                        <span className="text-gray-400 text-sm">{userData?.email}</span>
                        <p className="text-sm text-blue-400 cursor-pointer hover:underline">{userData?.channel ? "View Channel" : "Create Channel"}</p>
                    </div>
                </div>
            )}

            {/* auth buttons */}
            <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
                <button 
                    className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                    <FcGoogle className="text-xl"/>SignIn With Google Account
                </button>

                <button 
                    className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                    <TiUserAddOutline className="text-xl"/>Create New Account
                </button>

                <button 
                    className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                    <MdOutlineSwitchAccount className="text-xl"/>SignIn With Other account
                </button>

                <button 
                    className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
                >
                    <FiLogOut className="text-xl"/>Sign Out
                </button>
            </div>

            <div
                className="flex flex-col mt-10 gap-2"
            >
                <ProfileMenuItem icon={<FaHistory />} label="History" />
                <ProfileMenuItem icon={<FaList />} label="Playlist" />
                <ProfileMenuItem icon={<GoVideo />} label="Saved Videos" />
                <ProfileMenuItem icon={<FaThumbsUp />} label="Liked Videos" />
                <ProfileMenuItem icon={<SiYoutubestudio className="text-orange-400" />} label="PT Studio" />
            </div>
        </div>
    )
}

function ProfileMenuItem({ icon, label, onClick }) {
    return (
        <button
            className="flex items-center gap-3 p-4 active:bg-[#272727] text-left w-full rounded-2xl"
            onClick={onClick}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </button>
    )
}

export default MobileProfile