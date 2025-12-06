import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ size = 40, color = "#ff6b35", className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ClipLoader size={size} color={color} loading={true} />
    </div>
  );
};

export default LoadingSpinner;

