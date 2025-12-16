"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchGifs = useCallback(async (pageNum: number, shouldAppend: boolean) => {
    if (loading) return; // Prevent duplicate requests
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/gifs?includeAdult=${isAdult}&page=${pageNum}&limit=30`);

      if (res.ok) {
        const data = await res.json();
        if (data.length < 30) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setGifs(prev => shouldAppend ? [...prev, ...data] : data);
      }
    } catch (error) {
      console.error("Failed to fetch gifs", error);
    } finally {
      setLoading(false);
    }
  }, [isAdult]); // loading removed from dependency to avoid staleness issues inside, handled by ref check or just logic

  // Handle isAdult change -> Reset
  useEffect(() => {
    // We only want to trigger this when isAdult changes specifically, 
    // but we also need to load initial state.
    // Let's rely on page reset.
    setPage(1);
    setHasMore(true);
    // We need to fetch page 1 immediately here, or let the page dependency handle it.
    // If we use page dependency, we need to be careful about the initial render.
    fetchGifs(1, false);
  }, [isAdult, fetchGifs]);

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        hasMore &&
        !loadingRef.current
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  // Fetch when page changes (but skip page 1 as it's handled by isAdult/mount effect)
  // Actually, keeping it simple: manage fetch calls explicitly or use one effect.
  // Exception: infinite scroll increments page.
  useEffect(() => {
    if (page > 1) {
      fetchGifs(page, true);
    }
  }, [page, fetchGifs]);

  // Load user preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("canViewAdult");
    if (savedPreference === "true") {
      setIsAdult(true);
    }
    // No explicit fetch here, the isAdult effect handles the first fetch (1, false) 
    // because setIsAdult triggers it? 
    // Wait, if savedPreference is true, setIsAdult(true) runs.
    // If it's false (default), setIsAdult doesn't change.
    // We need to ensure initial fetch happens.
    // The isAdult effect runs on mount regardless of change? Yes.
  }, []);

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


  const reload = () => {
    setPage(1);
    fetchGifs(1, false);
  };

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
        onUploadSuccess={reload}
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
            specialTags={isAdult ? ["+18"] : []}
          />
        </div>

        <GifGrid gifs={filteredGifs.map(g => ({ ...g, id: g._id }))} />

        {loading && (
          <div className="text-center py-12 pb-20 text-gray-500 animate-pulse">Loading more vibes...</div>
        )}
        {!hasMore && gifs.length > 0 && (
          <div className="text-center py-12 text-gray-600 text-sm">No more GIFs to load</div>
        )}
      </div>
    </main>
  );
}
