import React from "react";
import { SiYoutubeshorts } from "react-icons/si";
import PageShell from "../../component/PageShell";
import SurfaceCard from "../../component/SurfaceCard";

function Shorts() {
    return (
        <PageShell variant="app" padded={false} className="text-white">
            <div className="pt-16 px-4 md:px-8 lg:px-12 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                        <SiYoutubeshorts className="text-xl text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">Shorts</h1>
                </div>

                <SurfaceCard size="lg" heading="Discover Short Videos" subheading="Watch and create short-form content." divider={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="aspect-[9/16] bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition cursor-pointer group"
                            >
                                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                    <SiYoutubeshorts className="text-4xl text-gray-500 group-hover:text-orange-500 transition mb-2" />
                                    <p className="text-xs text-gray-400 text-center">Short Video {item}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm mb-4">No shorts available yet</p>
                        <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white px-6 py-2 rounded-full font-semibold transition">
                            Create Short
                        </button>
                    </div>
                </SurfaceCard>
            </div>
        </PageShell>
    );
}

export default Shorts;