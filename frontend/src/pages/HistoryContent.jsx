import { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import { useSelector } from "react-redux";

import ShortCard from "../component/ShortCard";
import VideoCard from "../component/VideoCard";

const getVideoDuration = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
      const totalSeconds = Math.floor(video.duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };
    video.onerror = () => resolve("0:00");
  });
};

function HistoryContent() {
  const { videoHistory, shortHistory } = useSelector((state) => state.user);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (!videoHistory?.length) return;

    const fetchDurations = async () => {
      const newDurations = {};
      for (const video of videoHistory) {
        const videoId = video.contentId?._id || video._id;
        if (!duration[videoId]) {
          newDurations[videoId] = await getVideoDuration(video.videoUrl);
        }
      }
      setDuration((prev) => ({ ...prev, ...newDurations }));
    };

    fetchDurations();
  }, [videoHistory]);

  return (
    <div className="px-4 sm:px-6 py-6 min-h-screen mt-14 lg:mt-6">

      {/* History Shorts */}
      {shortHistory?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-6 h-6 text-red-600" />
            History Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {shortHistory.map((short) => {
              const content = short.contentId;
              return (
                <div key={content?._id || short._id} className="shrink-0 w-40 sm:w-[180px]">
                  <ShortCard
                    id={content?._id}
                    shortUrl={content?.shortUrl}
                    avatar={content?.channel?.avatar}
                    channelName={content?.channel?.name}
                    title={content?.title}
                    views={content?.views}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* History Videos */}
      {videoHistory?.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
            <GoVideo className="w-6 h-6 text-red-600" />
            History Videos
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {videoHistory.map((video) => {
              const content = video.contentId;
              const videoId = content?._id || video._id;
              return (
                <div key={videoId} className="shrink-0 w-60 sm:w-[260px]">
                  <VideoCard
                    id={videoId}
                    thumbnail={content?.thumbnail}
                    duration={duration[videoId] || "0:00"}
                    channelLogo={content?.channel?.avatar}
                    title={content?.title}
                    channelName={content?.channel?.name}
                    views={content?.views}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!shortHistory?.length && !videoHistory?.length && (
        <div className="flex items-center justify-center h-[60vh] text-gray-500 text-lg">
          No history content yet
        </div>
      )}
    </div>
  );
}

export default HistoryContent;
