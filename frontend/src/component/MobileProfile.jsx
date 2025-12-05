import { useDispatch, useSelector } from "react-redux"
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
import { toast } from "react-toastify";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import PageShell from "./PageShell";

function MobileProfile() {
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/auth/signout`, { withCredentials: true });
            if (res.status === 200) {
                toast.success("Signed out successfully.");
                dispatch(setUserData(null));
            } else {
                toast.error("Failed to sign out. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to sign out. Please try again.");
            console.error("Error signing out:", error);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            const { displayName, email, photoURL } = res.user;

            const userData = {
                username: displayName,
                email: email,
                profilePictureUrl: photoURL,
            };
            const response = await axios.post(`${serverUrl}/api/v1/auth/googleauth`, userData, { withCredentials: true });
            if (response.status === 200) {
                toast.success("Signed in with Google successfully.");
                dispatch(setUserData(response.data.user));
            } else {
                toast.error("Google sign-in failed. Please try again.");
            }
        } catch (error) {
            toast.error("Google sign-in failed. Please try again.");
            console.error("Error during Google sign-in:", error);
        }
    }

    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="md:hidden min-h-screen flex flex-col pt-16">
                {userData && (
                    <div className="p-4 flex items-center gap-4 border-b border-white/10 bg-[#1c1c1c]/50">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center">
                            <img
                                src={userData?.profilePictureUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold text-lg truncate">@{userData?.username}</span>
                            <span className="text-gray-400 text-sm truncate">{userData?.email}</span>
                            <button
                                className="text-sm text-orange-400 hover:text-orange-300 transition mt-1 text-left"
                                onClick={()=>{userData?.channel ? navigate("/viewchannel") : navigate("/createchannel")}}
                            >
                                {userData?.channel ? "View Channel" : "Create Channel"}
                            </button>
                        </div>
                    </div>
                )}

                {/* auth buttons */}
                {!userData && (
                    <div className="flex flex-col gap-2 p-4 border-b border-white/10">
                        <button 
                            className="bg-[#1c1c1c] border border-white/10 hover:bg-white/5 text-white px-4 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition"
                            onClick={handleGoogleAuth}
                        >
                            <FcGoogle className="text-xl"/>
                            <span>Sign In With Google</span>
                        </button>

                        <button 
                            className="bg-[#1c1c1c] border border-white/10 hover:bg-white/5 text-white px-4 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition"
                            onClick={()=>navigate('/signup')}
                        >
                            <TiUserAddOutline className="text-xl"/>
                            <span>Create New Account</span>
                        </button>

                        <button 
                            className="bg-[#1c1c1c] border border-white/10 hover:bg-white/5 text-white px-4 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition"
                            onClick={()=>navigate('/signin')}
                        >
                            <MdOutlineSwitchAccount className="text-xl"/>
                            <span>Sign In With Other Account</span>
                        </button>
                    </div>
                )}

                {userData && (
                    <>
                        <div className="flex flex-col mt-4 gap-1 px-2">
                            <ProfileMenuItem icon={<FaHistory />} label="History" />
                            <ProfileMenuItem icon={<FaList />} label="Playlist" />
                            <ProfileMenuItem icon={<GoVideo />} label="Saved Videos" />
                            <ProfileMenuItem icon={<FaThumbsUp />} label="Liked Videos" />
                            {userData?.channel && (
                                <ProfileMenuItem icon={<SiYoutubestudio className="text-orange-400" />} label="PT Studio" />
                            )}
                        </div>
                        <div className="h-px w-full bg-white/10 my-2" />
                        <button 
                            className="bg-[#1c1c1c] border border-red-500/20 hover:bg-red-500/10 text-red-400 px-4 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition mx-2"
                            onClick={handleSignOut}
                        >
                            <FiLogOut className="text-xl"/>
                            <span>Sign Out</span>
                        </button>
                    </>
                )}
            </div>
        </PageShell>
    )
}

function ProfileMenuItem({ icon, label, onClick }) {
    return (
        <button
            className="flex items-center gap-3 p-4 hover:bg-white/5 active:bg-white/10 text-left w-full rounded-2xl transition"
            onClick={onClick}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </button>
    )
}

export default MobileProfile