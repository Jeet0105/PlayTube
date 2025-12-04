import React from "react";

const widthMap = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

function SurfaceCard({
  children,
  heading,
  subheading,
  size = "md",
  className = "",
  divider = true,
}) {
  return (
    <section
      className={`w-full ${widthMap[size] ?? widthMap.md} bg-[#111111]/90 border border-white/5 rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl p-6 sm:p-10 space-y-6 ${className}`}
    >
      {(heading || subheading) && (
        <div className="space-y-2">
          {heading && (
            <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
          )}
          {subheading && (
            <p className="text-sm text-gray-400 leading-relaxed">{subheading}</p>
          )}
        </div>
      )}

      {divider && (heading || subheading) && (
        <div className="h-px w-full bg-white/10" />
      )}

      {children}
    </section>
  );
}

export default SurfaceCard;

