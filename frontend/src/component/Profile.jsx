import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiLogOut } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { MdOutlineSwitchAccount } from 'react-icons/md'
import { TiUserAddOutline } from 'react-icons/ti'
import { SiYoutubestudio } from 'react-icons/si'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../utils/axios'
import { API_ENDPOINTS } from '../utils/constants'
import { setUserData } from '../redux/userSlice'
import { auth, provider } from '../../utils/firebase.js'
import { signInWithPopup } from 'firebase/auth'

function Profile() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        // Prevent multiple simultaneous calls
        if (isSigningOut) return;
        
        setIsSigningOut(true);
        try {
            const res = await api.get(API_ENDPOINTS.AUTH.SIGNOUT);
            if (res.data.success) {
                toast.success(res.data.message || "Signed out successfully.");
                dispatch(setUserData(null));
                navigate("/signin");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSigningOut(false);
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
            const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, userData);
            if (response.data.success && response.data.user) {
                toast.success(response.data.message || "Signed in with Google successfully.");
                dispatch(setUserData(response.data.user));
            }
        } catch (error) {
            // Error is handled by axios interceptor
            console.error("Error during Google sign-in:", error);
        }
    }

    return (
        <div>
            <div className='absolute right-5 top-10 mt-2 w-80 bg-[#111111]/95 backdrop-blur-xl border border-white/5 text-white rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.65)] z-50 hidden md:flex flex-col overflow-hidden'>
                {userData && (
                    <div className='flex items-center gap-3 p-4 border-b border-white/10 bg-[#1c1c1c]/50'>
                        <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center">
                            <img 
                                src={userData?.profilePictureUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className='font-semibold truncate'>{userData?.username}</h4>
                            <p className='text-sm text-gray-400 truncate'>{userData?.email}</p>
                            <button
                                className='text-sm text-orange-400 hover:text-orange-300 transition mt-1'
                                onClick={()=>{userData?.channel ? navigate("/viewchannel") : navigate("/createchannel")}}
                            >
                                {userData?.channel ? 'View Channel' : 'Create Channel'}
                            </button>
                        </div>
                    </div>
                )}
                <div className='flex flex-col py-2'>
                    {!userData && (
                        <>
                            <button 
                                className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer text-left' 
                                onClick={handleGoogleAuth}
                            >
                                <FcGoogle className='text-xl'/>
                                <span>Sign in with Google</span>
                            </button>
                            <button 
                                className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer text-left' 
                                onClick={() => navigate("/signup")}
                            >
                                <TiUserAddOutline className='text-xl' />
                                <span>Create New Account</span>
                            </button>
                            <button 
                                className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer text-left' 
                                onClick={() => navigate("/signin")}
                            >
                                <MdOutlineSwitchAccount className='text-xl' />
                                <span>Sign in with Other Account</span>
                            </button>
                        </>
                    )}
                    {userData && (
                        <>
                            {userData?.channel && (
                                <button
                                    className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer text-left'
                                    onClick={()=> navigate("/ptstudio/dashboard")}
                                >
                                    <SiYoutubestudio className='text-xl text-orange-500' />
                                    <span>PT Studio</span>
                                </button>
                            )}
                            <div className="h-px w-full bg-white/10 my-1" />
                            <button 
                                className='flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer text-left text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                            >
                                <FiLogOut className='text-xl' />
                                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile