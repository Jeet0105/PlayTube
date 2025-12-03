import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiLogOut } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { MdOutlineSwitchAccount } from 'react-icons/md'
import { TiUserAddOutline } from 'react-icons/ti'
import { SiYoutubestudio } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'

function Profile() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSignOut = async () => {
        console.log("aatest");
        
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
    return (
        <div>
            <div className='absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:flex flex-col'>
                {userData && (
                    <div className='flex items-center gap-3 p-4 border-b border-gray-700'>
                        <img src={userData?.profilePictureUrl} alt="Profile" className="w-12 h-12 rounded-full flex items-center justify-center object-cover border-2" />
                        <div>
                            <h4 className='font-semibold'>{userData?.username}</h4>
                            <p className='text-sm text-gray-400'>{userData?.email}</p>
                            <p className='text-sm text-blue-400 cursor-pointer hover:underline'>
                                {userData?.channel ? 'View Channel' : 'Create Channel'}
                            </p>
                        </div>
                    </div>
                )}
                <div className='flex flex-col py-2'>
                    <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition cursor-pointer'><FcGoogle className='text-xl' /> Sign in with Google</button>
                    <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition cursor-pointer' onClick={() => navigate("/signup")}><TiUserAddOutline className='text-xl' /> Create New Account</button>
                    <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition cursor-pointer' onClick={() => navigate("/signin")}><MdOutlineSwitchAccount className='text-xl' /> Sign in with Other Account</button>
                    {userData?.channel && <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition cursor-pointer'><SiYoutubestudio className='text-xl text-orange-500' /> PT Studio</button>}
                    {userData && <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded-lg transition cursor-pointer'  onClick={handleSignOut}><FiLogOut className='text-xl' /> Sign Out</button>}
                </div>
            </div>
        </div>
    )
}

export default Profile