import React, { useState } from 'react'

function Description({ text }) {
    const [extended, setExtended] = useState(false);
    const showButton = text?.length > 100;
    return (
        <div className={`relative ${extended ? "h-48" : "h-12"} overflow-y-auto px-2 py-1`}>
            <p className={`text-sm text-gray-300 whitespace-pre-line ${extended ? "" : "line-clamp-1"}`}>{text}</p>
            {showButton && (
                <button onClick={()=>setExtended(!extended)} className='text-xs text-blue-400 mt-1 hover:underline'>
                    {extended? "Show less" : "Show more"}
                </button>
            )}
        </div>
    )
}

export default Description