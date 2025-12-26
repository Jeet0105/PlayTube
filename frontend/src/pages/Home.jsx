import {
    FaBars,
    FaSearch,
    FaMicrophone,
    FaUserCircle,
    FaHome,
    FaHistory,
    FaList,
    FaThumbsUp,
    FaTimes,
} from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

import logo from "../../public/logo.png";
import { useState, useMemo, useCallback, memo, lazy, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import PageShell from "../component/PageShell";
import { API_ENDPOINTS, CATEGORIES } from "../utils/constants";
import { toast } from "react-toastify";
import api from "../utils/axios";
import SearchResults from "../component/SearchResults";

const AllVideosPage = lazy(() => import("../component/AllVideosPage"));
const AllShortsPage = lazy(() => import("../component/AllShortsPage"));

function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState("Home");
    const [activeCategory, setActiveCategory] = useState("All");
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchPopUp, setSearchPopUp] = useState(false);
    const [listing, setListing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const { userData, subscribedChannels } = useSelector((state) => state.user);

    const categories = useMemo(() => CATEGORIES, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const toggleProfile = useCallback(() => {
        setProfileOpen(prev => !prev);
    }, []);

    const handleCategoryClick = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    const isHomePage = useMemo(() => location.pathname === "/", [location.pathname]);

    const recognitionRef = useRef();

    if (typeof window !== "undefined" && !recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognitionRef.current = recognition;
    }

    // --- UPDATED SPEECH HANDLER ---
    const handleSearch = async () => {
        if (!recognitionRef.current) {
            toast.error("Speech Recognition not supported in this browser.");
            return;
        }
        if (listing) {
            recognitionRef.current.stop();
            setListing(false);
            return;
        }

        setListing(true);
        setSearchQuery(""); // Clear input before listening
        recognitionRef.current.start();

        recognitionRef.current.onresult = async (e) => {
            const transcript = e.results[0][0].transcript.trim();
            setSearchQuery(transcript);
            setListing(false);
            recognitionRef.current.stop();
            
            // Pass transcript directly to bypass async state update lag
            await handleSrcData(transcript);
        };

        recognitionRef.current.onerror = (e) => {
            console.error("Speech recognition error:", e.error);
            setListing(false);
            if (e.error === "not-allowed" || e.error === "service-not-allowed") {
                toast.error("Permission to use microphone denied.");
            } else if (e.error === "no-speech") {
                toast.error("No speech detected.");
            } else {
                toast.error("Speech recognition error. Try again.");
            }
        };

        recognitionRef.current.onend = () => {
            setListing(false);
        };
    };

    function speak(message) {
        let utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    }

    // --- UPDATED DATA FETCH HANDLER ---
    const handleSrcData = async (manualInput) => {
        // Use manualInput (from speech) or searchQuery (from typing)
        const finalInput = typeof manualInput === 'string' ? manualInput : searchQuery;

        if (!finalInput) {
            toast.warn("Please enter a search term.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(API_ENDPOINTS.CONTENT.AI_SEARCH, {
                input: finalInput
            });
            setSearchData(res.data);
            setSearchPopUp(false);

            const { videos = [], shorts = [], channels = [], playlists = [] } = res.data;

            if (videos.length > 0 || shorts.length > 0 || channels.length > 0 || playlists.length > 0) {
                speak("Found matching results.");
            } else {
                speak("No results found.");
            }
        } catch (error) {
            toast.error("Failed to fetch search results.");
            console.error("Error fetching search data:", error);
        } finally {
            setLoading(false);
            setSearchQuery("");
        }
    };

    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="relative min-h-screen">

                {searchPopUp && (
                    <div className="fixed inset-0 bg-black/70 bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn p-4">
                        <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300">
                            <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition" onClick={() => setSearchPopUp(false)} aria-label="Close search popup">
                                <FaTimes size={22} />
                            </button>

                            <div className="flex flex-col items-center gap-3 w-full">
                                {listing ? (
                                    <h1 className="text-xl sm:text-2xl font-semibold text-orange-400 animate-pulse">
                                        Listening...
                                    </h1>
                                ) : (
                                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-300">
                                        Speak now or type your search
                                    </h1>    
                                )}

                                {searchQuery && (
                                    <span className="text-center text-lg sm:text-xl text-gray-300 px-4 py-2 rounded-lg bg-[#2a2a2a]/60 break-words w-full">
                                        {searchQuery}
                                    </span>
                                )}

                                <div className="flex items-center gap-2 w-full md:hidden mt-4">
                                    <input
                                        type="text" className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                                        placeholder="Search"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        value={searchQuery}
                                    />
                                    <button onClick={() => handleSrcData()} disabled={loading} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50">
                                        <FaSearch />
                                    </button>
                                </div>

                                <button onClick={handleSearch} className={`p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 ${listing ? 'bg-orange-600 animate-pulse ring-4 ring-orange-500/30' : 'bg-amber-500 hover:bg-orange-600 shadow-orange-500/40'}`}>
                                    <FaMicrophone size={48} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <header className="bg-[#0f0f0f]/95 backdrop-blur-xl h-16 px-4 border-b border-white/10 fixed top-0 left-0 right-0 z-50">
                    <div className="flex items-center justify-between h-full">

                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="text-xl bg-[#272727] p-2 rounded-full hidden md:flex hover:bg-[#3a3a3a] transition cursor-pointer"
                                aria-label="Toggle sidebar"
                            >
                                <FaBars />
                            </button>

                            <div className="flex items-center gap-[6px] cursor-pointer" onClick={() => navigate("/")}>
                                <img src={logo} alt="Logo" className="w-10" />
                                <span className="text-white font-bold text-xl tracking-tight">
                                    PlayTube
                                </span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-8">
                            <div className="flex flex-1">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="flex-1 bg-[#121212] px-4 py-2 rounded-l-full border border-gray-700 focus:border-gray-500 outline-none transition"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSrcData()}
                                />
                                <button onClick={() => handleSrcData()} disabled={loading} className="bg-[#272727] px-5 rounded-r-full border border-gray-700 hover:bg-[#3a3a3a] transition disabled:opacity-50">
                                    <FaSearch />
                                </button>
                            </div>
                            <button className="bg-[#272727] p-3 rounded-full hover:bg-[#3a3a3a] transition" onClick={() => setSearchPopUp(!searchPopUp)}>
                                <FaMicrophone />
                            </button>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4">
                            {userData?.channel && (
                                <button
                                    className="hidden md:flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3a3a3a] transition cursor-pointer"
                                    onClick={() => navigate("/create")}
                                >
                                    <span className="text-lg font-bold">+</span>
                                    <span className="font-medium">Create</span>
                                </button>
                            )}

                            <div onClick={userData ? toggleProfile : () => navigate("/")}>
                                {!userData ? (
                                    <FaUserCircle className="text-3xl hidden md:flex text-gray-300 hover:text-white transition cursor-pointer" />
                                ) : !userData?.profilePictureUrl ? (
                                    <FaUserCircle className="text-3xl hidden md:flex text-gray-300 hover:text-white transition cursor-pointer" />
                                ) : (
                                    <img src={userData?.profilePictureUrl} alt="User" className="w-8 h-8 rounded-full hidden md:flex cursor-pointer" />
                                )}
                            </div>
                            <FaSearch className="text-xl md:hidden flex cursor-pointer" onClick={() => setSearchPopUp(!searchPopUp)} />
                        </div>
                    </div>
                </header >

                {/* Sidebar */}
                < aside
                    className={`bg-[#0f0f0f]/95 backdrop-blur-xl border-r border-white/10 fixed top-16 bottom-0 left-0 z-40
                hidden md:flex flex-col overflow-y-auto transition-all duration-300
                ${sidebarOpen ? "w-60" : "w-20"}`
                    }
                >
                    <nav className="space-y-1 mt-4">
                        <SidebarItem
                            icon={<FaHome />}
                            text="Home"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => navigate("/")}
                        />

                        <SidebarItem
                            icon={<SiYoutubeshorts />}
                            text="Shorts"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => {
                                if (userData) {
                                    navigate("/shorts");
                                } else {
                                    navigate("/");
                                }
                            }}
                        />

                        <SidebarItem
                            icon={<MdOutlineSubscriptions />}
                            text="Subscription"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => userData && navigate("/subscription")}
                        />
                    </nav>

                    <div className="my-4 border-t border-white/10"></div>

                    {/* You section */}
                    <nav className="space-y-1">
                        {sidebarOpen && (
                            <p className="text-sm text-gray-400 px-3 mb-2">You</p>
                        )}

                        <SidebarItem
                            icon={<FaHistory />}
                            text="History"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => userData && navigate("/history")}
                        />
                        <SidebarItem
                            icon={<FaList />}
                            text="Playlist"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => userData && navigate("/savedplaylist")}
                        />
                        <SidebarItem
                            icon={<GoVideo />}
                            text="Saved Videos"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => userData && navigate("/savedcontent")}
                        />
                        <SidebarItem
                            icon={<FaThumbsUp />}
                            text="Liked Videos"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => userData && navigate("/likedcontent")}
                        />
                    </nav>

                    <div className="my-4 border-t border-white/10"></div>

                    {/* subscribed channels */}
                    <nav>
                        {sidebarOpen && (
                            <p className="text-sm text-gray-400 px-3 mb-2">Subscribed</p>
                        )}

                        <div className="space-y-1 mt-1">
                            {subscribedChannels?.map((ch) => (
                                <Link
                                    key={ch._id}
                                    to={`/channelpage/${ch._id}`}
                                    onClick={() => setSelectedItem(ch?._id)}
                                    className={`flex items-center ${sidebarOpen ? "gap-3 justify-start" : "justify-center"} w-full text-left cursor-pointer p-2 rounded-lg transition ${selectedItem === ch._id ? "bg-[#272727]" : "hover:bg-gray-800"}`}
                                >
                                    <img src={ch?.avatar} alt={ch.name} className="w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200" />
                                    {sidebarOpen && (
                                        <span className="text-sm text-white truncate">{ch?.name}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside >

                {/* Main Content */}
                < main className={`overflow-y-auto p-4 flex flex-col pb-16 transition-all duration-300
                ${sidebarOpen ? "md:ml-60" : "md:ml-20"}`}>

                    {/* Categories — only on Home */}
                    {isHomePage && (
                        <>
                            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2 mt-16">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 font-medium
                                ${activeCategory === category
                                                ? "bg-white text-black shadow-lg"
                                                : "bg-[#272727] hover:bg-[#3a3a3a] text-gray-300"}`}
                                        aria-label={`Filter by ${category}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3">
                                {searchData && <SearchResults searchResults={searchData} />}
                                <AllVideosPage />
                                <AllShortsPage />
                            </div>
                        </>
                    )}
                    {profileOpen && <Profile />}
                    <div className="mt-2">
                        <Outlet />
                    </div>
                </main >

                {/* Mobile Bottom Nav */}
                < nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 flex justify-around py-2 z-10" >

                    <MobileSizeNav
                        icon={<FaHome />}
                        text="Home"
                        active={selectedItem === "Home"}
                        onClick={() => {
                            setSelectedItem("Home");
                            navigate("/");
                        }}
                    />

                    <MobileSizeNav
                        icon={<SiYoutubeshorts />}
                        text="Shorts"
                        active={selectedItem === "Shorts"}
                        onClick={() => {
                            setSelectedItem("Shorts");
                            if (userData) {
                                navigate("/shorts");
                            } else {
                                navigate("/");
                            }
                        }}
                    />

                    <MobileSizeNav
                        icon={<IoIosAddCircle />}
                        text="Add"
                        active={selectedItem === "Add"}
                        onClick={() => { setSelectedItem("Add"); navigate("/create") }}
                    />

                    <MobileSizeNav
                        icon={<MdOutlineSubscriptions />}
                        text="Subs"
                        active={selectedItem === "Subscriptions"}
                        onClick={() => {
                            setSelectedItem("Subscriptions");
                            navigate("/subscription");
                        }}
                    />

                    <MobileSizeNav
                        icon={!userData ? <FaUserCircle /> : !userData?.profilePictureUrl ? <FaUserCircle /> : <img src={userData.profilePictureUrl} alt="User" className="w-6 h-6 rounded-full" />}
                        text="You"
                        active={selectedItem === "You"}
                        onClick={() => {
                            setSelectedItem("You");
                            if (userData) {
                                navigate("/mobilepro");
                            } else {
                                navigate("/");
                            }
                        }}
                    />
                </nav >
            </div >
        </PageShell>
    );
}

const SidebarItem = memo(({ icon, text, open, selected, setSelected, onClick }) => {
    const isActive = selected === text;
    const handleClick = () => {
        setSelected(text);
        if (onClick) onClick();
    };
    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-4 p-3 rounded-xl w-full transition-all duration-200
            ${open ? "justify-start" : "justify-center"} 
            ${isActive ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            aria-label={text}
        >
            <span className="text-lg">{icon}</span>
            {open && <span className="text-sm">{text}</span>}
        </button>
    );
});

SidebarItem.displayName = "SidebarItem";

const MobileSizeNav = memo(({ icon, text, onClick, active }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl 
            transition-all duration-200 
            ${active ? "text-white bg-white/10" : "text-gray-400"} hover:bg-white/5 active:scale-95`}
            aria-label={text}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-medium">{text}</span>
        </button>
    );
});

MobileSizeNav.displayName = "MobileSizeNav";

export default Home;