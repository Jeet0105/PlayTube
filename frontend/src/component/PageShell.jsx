import React from "react";

const backgroundMap = {
  default: "bg-gradient-to-b from-[#050505] via-[#080808] to-[#0f0f0f]",
  app: "bg-[#050505]",
};

function PageShell({
  children,
  variant = "default",
  padded = true,
  className = "",
  contentClassName = "",
}) {
  return (
    <div
      className={`min-h-screen text-white relative overflow-hidden ${
        backgroundMap[variant] || backgroundMap.default
      } ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,_rgba(255,122,0,0.12),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,_rgba(255,255,255,0.05),_transparent_45%)]" />
      </div>

      <div
        className={`relative z-10 ${
          padded ? "px-4 py-8 sm:px-8 lg:px-12" : ""
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

export default PageShell;

