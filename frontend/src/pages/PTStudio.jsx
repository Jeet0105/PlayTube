import { FaTachometerAlt, FaChartBar, FaVideo, FaPlusCircle } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, useState } from "react";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const Profile = lazy(() => import("../component/Profile"))


function PTStudio() {
    const { channelData } = useSelector(state => state.user);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("Dashboard");

    const navigate = useNavigate();

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">

            {/* header */}
            <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-gray-800 bg-[#0f0f0f] shadow-md">
                <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
                    <SiYoutubestudio className="text-orange-500 w-7 h-7" />
                    <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                        PT <span className="text-[#ffffff]">Studio</span>
                    </h1>
                </Link>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="bg-[#272727] px-3 sm:py-4 py-1 lg:rounded-lg rounded-full hover:bg-[#161414] active:scale-95 transition cursor-pointer text-sm hidden md:flex items-center justify-center gap-1">
                        + <span>Create</span>
                    </button>

                    <img
                        src={channelData?.avatar}
                        alt="Avatar"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-600 object-cover hover:scale-105 transition"
                        onClick={() => setOpen(!open)}
                    />
                </div>
            </header>

            <div className="flex flex-1 flex-col md:flex-row">

                {/* sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 bg-[#121212] border-r border-gray-800 flex-col p-4 shadow-lg">
                    <div className="flex flex-col items-center gap-2 mb-8 text-center">
                        <img
                            src={channelData?.avatar}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full border border-gray-600 object-cover shadow-md hover:scale-105 transition"
                            onClick={() => setOpen(!open)}
                        />
                        <h2 className="text-base lg:text-lg font-semibold">{channelData?.name}</h2>
                        <p className="text-xs text-gray-400">Your Channel</p>
                    </div>

                    <nav className="space-y-2">
                        <SidebarItem
                            icon={<FaTachometerAlt />}
                            text="Dashboard"
                            active={active}
                            setActive={setActive}
                            onClick={() => navigate("dashboard")}
                        />

                        <SidebarItem
                            icon={<FaChartBar />}
                            text="Analytics"
                            active={active}
                            setActive={setActive}
                            onClick={() => navigate("analytics")}
                        />

                        <SidebarItem
                            icon={<FaVideo />}
                            text="Content"
                            active={active}
                            setActive={setActive}
                            onClick={() => navigate("content")}
                        />

                        <SidebarItem
                            icon={<RiMoneyRupeeCircleFill />}
                            text="Revenue"
                            active={active}
                            setActive={setActive}
                            onClick={() => navigate("revenue")}
                        />
                    </nav>
                </aside>

                {/* main */}
                <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">
                    <div className="border border-gray-700 rounded-lg p-4 sm:p-6 text-center text-gray-400 bg-[#181818] shadow-inner min-h-[70vh]">
                        {open && <Profile />}
                        <div className="mt-4">
                            <Outlet />
                        </div>
                    </div>

                    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
                        <MobileSizeNav
                            icon={<FaTachometerAlt />}
                            text="Dashboard"
                            active={active==="Dashboard"}
                            onClick={()=> {
                                setActive("Dashboard");
                                navigate("/dashboard");
                            }}
                        />
                        <MobileSizeNav
                            icon={<FaChartBar />}
                            text="Analytics"
                            active={active==="Analytics"}
                            onClick={()=> {
                                setActive("Analytics");
                                navigate("/analytics");
                            }}
                        />
                        <MobileSizeNav 
                            icon={<FaPlusCircle />}
                            text="Create"
                            onClick={()=> navigate("/create")}
                        />
                        <MobileSizeNav
                            icon={<FaVideo />}
                            text="Content"
                            active={active==="Content"}
                            onClick={()=> {
                                setActive("Content");
                                navigate("/content");
                            }}
                        />
                        <MobileSizeNav
                            icon={<RiMoneyRupeeCircleFill />}
                            text="Revenue"
                            active={active==="Revenue"}
                            onClick={()=> {
                                setActive("Revenue");
                                navigate("/revenue");
                            }}
                        />
                    </nav>
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ icon, text, onClick, active, setActive }) {
    const isActive = active === text;
    return (
        <button
            onClick={() => {
                setActive(text);
                onClick();
            }}
            className={`flex items-center gap-2 lg:gap-3 w-full px-3 py-2 rounded-lg transition-all cursor-pointer ${isActive
                ? "bg-[#272727] text-white shadow-md"
                : "text-gray-300 hover:bg-[#272727] hover:text-white"
                }`}
        >
            <span className="text-base lg:text-lg">{icon}</span>
            <span className="text-sm lg:text-base font-medium">{text}</span>
        </button>
    );
};

function MobileSizeNav({ icon, text, onClick, active }) {
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
};

export default PTStudio