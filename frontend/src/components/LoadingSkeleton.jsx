const LoadingSkeleton = ({ variant = "default", className = "" }) => {
  const baseClasses = "animate-pulse bg-[#272727] rounded";

  if (variant === "card") {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="w-full aspect-video bg-[#272727] rounded-lg mb-3"></div>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#272727]"></div>
          <div className="flex-1">
            <div className="h-4 bg-[#272727] rounded mb-2"></div>
            <div className="h-3 bg-[#272727] rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "channel") {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="w-full h-48 bg-[#272727] rounded-lg mb-4"></div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#272727]"></div>
          <div className="flex-1">
            <div className="h-6 bg-[#272727] rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-[#272727] rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="h-4 bg-[#272727] rounded"></div>
    </div>
  );
};

export default LoadingSkeleton;

