import React, { useState } from 'react'

function Description({ text }) {
    const [extended, setExtended] = useState(false);
    const showButton = text?.length > 100;
    return (
        <div>
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