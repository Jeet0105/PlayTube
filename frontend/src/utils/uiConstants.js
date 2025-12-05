// Shared UI Constants for consistent styling across the app

export const colors = {
    primary: {
        gradient: "bg-gradient-to-r from-orange-500 to-pink-500",
        hover: "hover:opacity-90",
    },
    success: {
        gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
        hover: "hover:opacity-90",
    },
    background: {
        dark: "bg-[#0f0f0f]",
        card: "bg-[#111111]/90",
        cardHover: "bg-[#1c1c1c]",
    },
    border: {
        default: "border-white/10",
        hover: "border-white/20",
        focus: "border-orange-500",
    },
    text: {
        primary: "text-white",
        secondary: "text-gray-400",
        tertiary: "text-gray-300",
        accent: "text-orange-400",
    },
};

export const inputClasses = "w-full bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none transition";

export const buttonClasses = {
    primary: "w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
    success: "w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
    secondary: "bg-[#272727] hover:bg-[#3a3a3a] px-4 py-2 rounded-full transition",
    ghost: "hover:bg-white/5 px-4 py-2 rounded-lg transition",
};

export const cardClasses = {
    surface: "bg-[#111111]/90 border border-white/5 rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl",
    inner: "bg-[#1c1c1c]/50 border border-white/10 rounded-2xl",
};

export const spacing = {
    section: "space-y-6",
    input: "space-y-4",
    button: "gap-2",
};

