import React from "react";
import { GifCard } from "./GifCard";

interface GifGridProps {
    gifs: Array<{
        id: string;
        title: string;
        url: string;
        width: number;
        height: number;
        featured?: boolean;
    }>;
}

export function GifGrid({ gifs }: GifGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {gifs.map((gif) => (
                <GifCard key={gif.id} {...gif} />
            ))}
        </div>
    );
}
