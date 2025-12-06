import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaPhotoVideo, FaEdit, FaVideo, FaUsers } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import LoadingSkeleton from '../../components/LoadingSkeleton';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/axios';
import { API_ENDPOINTS } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { setChannelData } from '../../redux/userSlice';

function ViewChannel() {
    const { channelData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(!channelData);
    const [error, setError] = useState(null);

    // Fetch channel data if not available
    useEffect(() => {
        const fetchChannelData = async () => {
            if (channelData) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await api.get(API_ENDPOINTS.USER.GET_CHANNEL);
                if (res.data.success && res.data.channel) {
                    dispatch(setChannelData(res.data.channel));
                } else {
                    setError("Channel not found");
                }
            } catch (error) {
                setError("Failed to load channel data");
            } finally {
                setLoading(false);
            }
        };

        fetchChannelData();
    }, [channelData, dispatch]);

    // Show loading state
    if (loading) {
        return (
            <div className='flex flex-col gap-6 p-4'>
                <LoadingSkeleton variant="channel" className="w-full" />
            </div>
        );
    }

    // Show error state or no channel state
    if (error || !channelData) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh] p-4 text-center'>
                <FaPhotoVideo className='text-6xl text-gray-500 mb-4' />
                <h2 className='text-2xl font-bold mb-2'>No Channel Found</h2>
                <p className='text-gray-400 mb-6 max-w-md'>
                    {error || "You don't have a channel yet. Create one to start sharing your content!"}
                </p>
                <button
                    onClick={() => navigate('/createchannel')}
                    className='bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white px-6 py-3 rounded-full font-semibold transition'
                >
                    Create Channel
                </button>
            </div>
        );
    }

    const subscriberCount = channelData.subscriberCount || channelData.subscribers?.length || 0;

    return (
        <div className='flex flex-col gap-6 p-4 md:p-6'>
            {/* Banner */}
            <div className='w-full h-48 md:h-64 bg-gradient-to-r from-gray-800 to-gray-900 relative -mt-4 -mx-4 md:-mx-6 rounded-lg overflow-hidden'>
                {channelData?.banner ? (
                    <img 
                        src={channelData.banner} 
                        alt="Channel banner" 
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className='w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center'>
                        <FaPhotoVideo className='text-6xl text-gray-600' />
                    </div>
                )}
            </div>

            {/* Channel Info */}
            <div className='flex flex-col items-center -mt-20 md:-mt-24'>
                <div className='relative'>
                    {channelData?.avatar ? (
                        <img 
                            src={channelData.avatar} 
                            alt="Channel avatar" 
                            className='w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#0f0f0f] shadow-lg'
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                            }}
                        />
                    ) : (
                        <div className='w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center border-4 border-[#0f0f0f] shadow-lg'>
                            <span className='text-4xl md:text-5xl font-bold text-white'>
                                {channelData?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                        </div>
                    )}
                </div>

                <h1 className='text-2xl md:text-3xl font-bold mt-4 text-center'>
                    {channelData?.name || 'Unnamed Channel'}
                </h1>
                
                {channelData?.owner?.email && (
                    <p className='text-gray-400 text-sm mt-1'>{channelData.owner.email}</p>
                )}

                {channelData?.description && (
                    <p className='text-gray-300 text-sm md:text-base mt-3 max-w-2xl text-center px-4'>
                        {channelData.description}
                    </p>
                )}

                <div className='flex items-center gap-4 mt-3'>
                    {channelData?.category && (
                        <span className='text-xs md:text-sm px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30'>
                            {channelData.category}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className='flex items-center gap-6 mt-4'>
                    <div className='flex flex-col items-center'>
                        <span className='text-2xl font-bold'>{subscriberCount}</span>
                        <span className='text-xs text-gray-400'>Subscribers</span>
                    </div>
                    <div className='h-8 w-px bg-white/10' />
                    <div className='flex flex-col items-center'>
                        <span className='text-2xl font-bold'>{channelData?.video?.length || 0}</span>
                        <span className='text-xs text-gray-400'>Videos</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-3 mt-6 justify-center'>
                    <button 
                        onClick={() => navigate('/createchannel')}
                        className='bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-full font-medium transition flex items-center gap-2'
                    >
                        <FaEdit className='text-sm' />
                        Customize Channel
                    </button>
                    <button 
                        className='bg-[#272727] hover:bg-[#3a3a3a] text-white px-5 py-2 rounded-full font-medium transition flex items-center gap-2'
                    >
                        <FaVideo className='text-sm' />
                        Manage Videos
                    </button>
                </div>
            </div>

            {/* Empty State for Content */}
            <div className='flex flex-col items-center justify-center mt-12 md:mt-16 p-8 bg-[#1c1c1c]/50 rounded-2xl border border-white/5'>
                <FaPhotoVideo className='text-6xl md:text-7xl text-gray-600 mb-4' />
                <h3 className='text-xl md:text-2xl font-semibold mb-2'>Create content on any device</h3>
                <p className='text-gray-400 text-sm md:text-base text-center max-w-md mb-6'>
                    Upload and record at home or on the go. Everything you make public will appear here.
                </p>
                <button 
                    className='bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full font-semibold transition flex items-center gap-2'
                >
                    <span className='text-xl'>+</span>
                    Create
                </button>
            </div>
        </div>
    );
}

export default ViewChannel;
