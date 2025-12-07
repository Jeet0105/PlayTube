import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const ProtectRoute = ({ children, requireChannel = false }) => {
  const { userData, channelData } = useSelector((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a small delay to allow Redux state to update
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [userData, channelData]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  // Check if user is authenticated
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  // Check if channel is required and exists
  if (requireChannel && !channelData) {
    return <Navigate to="/createchannel" replace />;
  }

  return children;
};

export default ProtectRoute;

