import {
    FaBars,
    FaSearch,
    FaMicrophone,
    FaUserCircle,
    FaHome,
    FaHistory,
    FaList,
    FaThumbsUp,
} from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

import logo from "../../public/logo.png";
import { useState, useMemo, useCallback, memo, lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../component/Profile";
import PageShell from "../component/PageShell";
import { CATEGORIES } from "../utils/constants";

const AllVideosPage = lazy(() => import("../component/AllVideosPage"));
const AllShortsPage = lazy(() => import("../component/AllShortsPage"));


function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState("Home");
    const [activeCategory, setActiveCategory] = useState("All");
    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useSelector((state) => state.user);

    // Memoize categories to prevent re-creation on every render
    const categories = useMemo(() => CATEGORIES, []);

    // Memoize handlers to prevent unnecessary re-renders
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

    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="relative min-h-screen">

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
                                />
                                <button className="bg-[#272727] px-5 rounded-r-full border border-gray-700 hover:bg-[#3a3a3a] transition">
                                    <FaSearch />
                                </button>
                            </div>
                            <button className="bg-[#272727] p-3 rounded-full hover:bg-[#3a3a3a] transition">
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
                            <FaSearch className="text-xl md:hidden flex cursor-pointer" />
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
                            text="Subscriptions"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
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
                            onClick={() => !userData && navigate("/")}
                        />
                        <SidebarItem
                            icon={<FaList />}
                            text="Playlist"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => !userData && navigate("/")}
                        />
                        <SidebarItem
                            icon={<GoVideo />}
                            text="Saved Videos"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => !userData && navigate("/")}
                        />
                        <SidebarItem
                            icon={<FaThumbsUp />}
                            text="Liked Videos"
                            open={sidebarOpen}
                            selected={selectedItem}
                            setSelected={setSelectedItem}
                            onClick={() => !userData && navigate("/")}
                        />
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
                        onClick={() => setSelectedItem("Subscriptions")}
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

/* Sidebar Component */
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

/* Mobile Nav Component */
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
