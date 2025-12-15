import { Link } from "react-router-dom";

function VideoCard({ thumbnail, duration, channelLogo, title, channelName, views, id }) {
    return (
        <Link to={`/playvideo/${id}`} className="w-[360px] cursor-pointer">
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="rounded-xl w-full h-[200px] border-2 border-gray-800 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 py-0.5 rounded">
                    {duration}
                </span>
            </div>

            <div className="flex mt-3">
                <img
                    src={channelLogo}
                    alt={channelName}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{channelName}</p>
                    <p className="text-xs text-gray-400">{views} views</p>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;
