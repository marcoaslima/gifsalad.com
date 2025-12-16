"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { GifGrid } from "@/components/GifGrid";
import { TagList } from "@/components/TagList";

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
  const [isAdult, setIsAdult] = useState(false);

  const fetchGifs = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      // Append includeAdult based on state
      const res = await fetch(`${apiUrl}/gifs?includeAdult=${isAdult}`);
      if (res.ok) {
        const data = await res.json();
        setGifs(data);
      }
    } catch (error) {
      console.error("Failed to fetch gifs", error);
    } finally {
      setLoading(false);
    }
  }, [isAdult]);

  // Load user preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("canViewAdult");
    if (savedPreference === "true") {
      setIsAdult(true);
    }
  }, []);

  // Fetch GIFs when isAdult changes (or on mount)
  useEffect(() => {
    fetchGifs();
  }, [fetchGifs]);

  const topTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    gifs.forEach(gif => {
      gif.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count desc
      .slice(0, 10) // Take top 10
      .map(([tag]) => tag);
  }, [gifs]);

  const handleTagSelect = (tag: string | null) => {
    if (tag === "+18") {
      const newIsAdult = !isAdult;
      setIsAdult(newIsAdult);
      localStorage.setItem("canViewAdult", String(newIsAdult));
      localStorage.setItem("isAdultConfigured", "true");
      return;
    }
    setSelectedTag(tag);
  };

  const displayTags = useMemo(() => {
    return [
      ...topTags,
      "+18"
    ];
  }, [topTags]);

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

      <AgeVerificationModal onVerify={(isVerified) => setIsAdult(isVerified)} />

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
          <TagList
            tags={displayTags}
            selectedTag={selectedTag}
            onSelectTag={handleTagSelect}
          />
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
