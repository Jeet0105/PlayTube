function ShortCard({ shortUrl, title, channelName, avatar, views }) {
    return (
        <div className="w-[120px] cursor-pointer text-white flex flex-col gap-2">
            {/* Thumbnail */}
            <div className="rounded-xl overflow-hidden bg-black w-full h-[200px]">
                <video
                    src={shortUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>

            {/* Text content */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>

                <div className="flex items-center gap-2 mt-1">
                    <img
                        src={avatar}
                        alt={channelName}
                        className="w-5 h-5 rounded-full object-cover"
                    />
                    <p className="text-xs text-gray-400">{channelName}</p>
                </div>

                {views && (
                    <p className="text-xs text-gray-500 mt-1">{views} views</p>
                )}
            </div>
        </div>
    );
}

export default ShortCard;
