import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) * 100; // 100 per 1k views
  }

  if (type === "short") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) * 50; // 50 per 1k views
  }

  return 0;
};

function Revenue() {
  const { channelData } = useSelector((state) => state.user);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading channel data...
      </div>
    );
  }

  const videoRevenueData = (channelData.video || []).map((v) => ({
    title:
      v?.title?.length > 10
        ? v.title.slice(0, 10) + "..."
        : v?.title || "Untitled",
    revenue: calculateRevenue(Number(v?.views) || 0, "video"),
  }));

  const shortsRevenueData = (channelData.shorts || []).map((s) => ({
    title:
      s?.title?.length > 10
        ? s.title.slice(0, 10) + "..."
        : s?.title || "Untitled",
    revenue: calculateRevenue(Number(s?.views) || 0, "short"),
  }));

  const totalVideoRevenue = videoRevenueData.reduce(
    (sum, v) => sum + v.revenue,
    0
  );

  const totalShortsRevenue = shortsRevenueData.reduce(
    (sum, s) => sum + s.revenue,
    0
  );

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-[50px]">
      <h1 className="text-2xl font-bold">Revenue Analytics</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
          <p className="text-gray-300">Total Video Revenue</p>
          <h2 className="text-2xl font-bold">${totalVideoRevenue}</h2>
        </div>

        <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
          <p className="text-gray-300">Total Shorts Revenue</p>
          <h2 className="text-2xl font-bold">${totalShortsRevenue}</h2>
        </div>
      </div>

      {/* Video Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Video Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Shorts Revenue Chart */}
      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Shorts Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortsRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Revenue;
