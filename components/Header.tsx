import React from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
            <div className={cn("glass pointer-events-auto rounded-2xl mx-auto max-w-7xl px-6 py-3 flex items-center justify-between shadow-lg shadow-purple-900/10")}>
                <div className="flex items-center gap-2">
                    <div className="bg-purple-600 p-2 rounded-lg shadow-inner shadow-white/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white hidden sm:block">WhoseTheGif</span>
                </div>

                <div className="flex items-center gap-4 flex-1 max-w-md mx-4 md:mx-8">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for GIFs..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">Trending</button>
                    <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">Upload</button>
                </div>
            </div>
        </header>
    );
}
