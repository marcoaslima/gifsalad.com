"use client";
import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GifGrid } from "@/components/GifGrid";
import { TagList } from "@/components/TagList";

// ... imports
import { useEffect } from "react";

interface Gif {
  _id: string; // Mongoose ID
  title: string;
  url: string;
  width: number;
  height: number;
  featured?: boolean;
  tags: string[];
}

import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { UploadModal } from "@/components/UploadModal";

export default function Home() {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchGifs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/gifs`);
      if (res.ok) {
        const data = await res.json();
        setGifs(data);
      }
    } catch (error) {
      console.error("Failed to fetch gifs", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch GIFs from Backend
  useEffect(() => {
    fetchGifs();
  }, []);

  const allTags = useMemo(() => Array.from(new Set(gifs.flatMap(g => g.tags))).sort(), [gifs]);

  const filteredGifs = useMemo(() => {
    if (!selectedTag) return gifs;
    return gifs.filter(gif => gif.tags.includes(selectedTag));
  }, [selectedTag, gifs]);

  return (
    <main className="min-h-screen bg-black relative selection:bg-purple-500/30">
      { /* ... background elements ... */}
      <div className="fixed inset-0 bg-neutral-950 pointer-events-none -z-20"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none -z-10"></div>

      <AgeVerificationModal onVerify={(isAdult) => {
        if (!isAdult) {
          // Optional: Handle rejection (e.g., redirect or show simplified view)
          console.log("User is not an adult");
        }
      }} />

      <Header onUploadClick={() => setIsUploadOpen(true)} />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={fetchGifs}
      />

      <div className="pt-32 pb-12 max-w-7xl mx-auto px-6 relative z-10">
        { /* ... Hero Section ... */}
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
          <TagList tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading Vibes...</div>
        ) : (
          <GifGrid gifs={filteredGifs.map(g => ({ ...g, id: g._id }))} />
        )}
      </div>
    </main>
  );
}
