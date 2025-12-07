import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaVideo, FaPlay, FaPen, FaList } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import PageShell from "../component/PageShell";

function CreatePage() {
    const [selected, setSelected] = useState("");
    const navigate = useNavigate();
    const { channelData } = useSelector((state) => state.user);

    const options = [
        {
            id: "Video",
            icon: <FaVideo size={28} />,
            title: "Upload Video",
            description: "Upload a video to share with your audience",
            color: "from-orange-500 to-pink-500"
        },
        {
            id: "Short",
            icon: <FaPlay size={28} />,
            title: "Create Short",
            description: "Create a short-form vertical video",
            color: "from-purple-500 to-pink-500"
        },
        {
            id: "Post",
            icon: <FaPen size={28} />,
            title: "Create Community Post",
            description: "Share updates with your community",
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "PlayList",
            icon: <FaList size={28} />,
            title: "New Playlist",
            description: "Organize your videos into a playlist",
            color: "from-green-500 to-emerald-500"
        }
    ];

    const handleCreate = () => {
        if (!selected) return;

        // TODO: Navigate to appropriate creation page based on selected option
        switch (selected) {
            case "Video":
                // navigate("/upload-video");
                break;
            case "Short":
                // navigate("/create-short");
                break;
            case "Post":
                // navigate("/create-post");
                break;
            case "PlayList":
                // navigate("/create-playlist");
                break;
            default:
                break;
        }
    };

    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="min-h-screen bg-[#0f0f0f] px-4 md:px-6 py-8 mt-16 flex flex-col">
                <header className="mb-8 md:mb-12 border-b border-white/10 pb-4">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Create</h1>
                    <p className="text-gray-400 mt-2 text-sm md:text-base">
                        Choose what type of content you want to create for your audience
                    </p>
                </header>

                {!channelData && (
                    <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <p className="text-sm text-orange-400">
                            You need to create a channel first to upload content.{" "}
                            <button
                                onClick={() => navigate("/createchannel")}
                                className="underline font-medium hover:text-orange-300"
                            >
                                Create Channel
                            </button>
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 flex-1">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={`bg-[#1c1c1c] border rounded-xl p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                                selected === option.id
                                    ? "border-orange-500 ring-2 ring-orange-500/50 bg-[#1c1c1c] scale-105"
                                    : "border-white/10 hover:border-white/20 hover:bg-[#272727]"
                            } ${!channelData ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => channelData && setSelected(option.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if ((e.key === "Enter" || e.key === " ") && channelData) {
                                    setSelected(option.id);
                                }
                            }}
                        >
                            <div className={`bg-gradient-to-br ${option.color} p-4 rounded-full mb-4 shadow-lg`}>
                                {option.icon}
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold mb-2 text-center">
                                {option.title}
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm text-center">
                                {option.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center mt-12 md:mt-16 pb-8">
                    <IoIosCreate className="text-6xl md:text-7xl text-gray-600 mb-4" />
                    {!selected ? (
                        <>
                            <p className="mt-4 font-medium text-center text-lg">
                                Create content on any device
                            </p>
                            <p className="text-gray-400 text-sm md:text-base text-center mt-2">
                                Select an option above to get started
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="mt-4 font-medium text-center text-lg">
                                Ready to create?
                            </p>
                            <p className="text-gray-400 text-sm md:text-base text-center mt-2 max-w-md">
                                Click below to start {options.find((option) => option.id === selected)?.title.toLowerCase()}.
                            </p>
                            <button
                                onClick={handleCreate}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white mt-6 px-8 py-3 rounded-full font-semibold transition shadow-lg"
                            >
                                + Create {selected}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </PageShell>
    );
}

export default CreatePage;