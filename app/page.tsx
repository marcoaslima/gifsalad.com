"use client";
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GifGrid } from "@/components/GifGrid";
import { TagList } from "@/components/TagList";

// Mock Data with real Giphy WebP URLs and Tags
const MOCK_GIFS = [
  {
    id: "1",
    title: "Cyberpunk City",
    url: "https://media.giphy.com/media/LdLqDte8V5VTy/giphy.webp",
    width: 480,
    height: 270,
    featured: true,
    tags: ["Cyberpunk", "Sci-Fi", "City", "Neon"],
  },
  {
    id: "2",
    title: "Retro Wave",
    url: "https://media.giphy.com/media/3o7TKsAdQnps51u5xu/giphy.webp",
    width: 480,
    height: 480,
    tags: ["Retro", "Synthwave", "80s", "Loop"],
  },
  {
    id: "3",
    title: "Neon Lights",
    url: "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.webp",
    width: 480,
    height: 270,
    tags: ["Abstract", "Neon", "Lights"],
  },
  {
    id: "4",
    title: "Glitch Art",
    url: "https://media.giphy.com/media/xT9IgusfDcjjFCUOca/giphy.webp",
    width: 480,
    height: 480,
    tags: ["Glitch", "Art", "Trippy"],
  },
  {
    id: "5",
    title: "Digital Rain",
    url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.webp",
    width: 480,
    height: 360,
    tags: ["Matrix", "Code", "Cyberpunk", "Rain"],
  },
  {
    id: "6",
    title: "Abstract Flow",
    url: "https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.webp",
    width: 480,
    height: 480,
    tags: ["Abstract", "Liquid", "Flow", "3D"],
  },
  {
    id: "7",
    title: "Pixel Art",
    url: "https://media.giphy.com/media/sIIhZ104wx4Ha/giphy.webp",
    width: 480,
    height: 270,
    tags: ["Pixel Art", "Retro", "Game", "Scenery"],
  },
  {
    id: "8",
    title: "Vaporwave aesthetics",
    url: "https://media.giphy.com/media/3o6Ztg2MgUkcXyC8fb/giphy.webp",
    width: 480,
    height: 270,
    tags: ["Vaporwave", "Aesthetic", "Pink", "Retro"],
  },
];

// Extract unique tags
const ALL_TAGS = Array.from(new Set(MOCK_GIFS.flatMap(gif => gif.tags))).sort();

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredGifs = useMemo(() => {
    if (!selectedTag) return MOCK_GIFS;
    return MOCK_GIFS.filter(gif => gif.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <main className="min-h-screen bg-black relative selection:bg-purple-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-neutral-950 pointer-events-none -z-20"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none -z-10"></div>

      <Header />

      <div className="pt-32 pb-12 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-12 items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Live Trending
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 mb-6 tracking-tight">
            Discover the <span className="text-purple-400">Vibes</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            A curated collection of the finest WebP GIFs. <br className="hidden md:block" />High quality, smooth playback, and pure aesthetic.
          </p>
        </div>

        <div className="mb-8 sticky top-24 z-40 bg-black/50 backdrop-blur-xl p-2 rounded-2xl border border-white/5 -mx-2 px-4 shadow-xl">
          <TagList tags={ALL_TAGS} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
        </div>

        <GifGrid gifs={filteredGifs} />
      </div>
    </main>
  );
}
