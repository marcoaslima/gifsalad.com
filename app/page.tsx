import { Header } from "@/components/Header";
import { GifGrid } from "@/components/GifGrid";

// Mock Data with real Giphy WebP URLs
const MOCK_GIFS = [
  {
    id: "1",
    title: "Cyberpunk City",
    url: "https://media.giphy.com/media/LdLqDte8V5VTy/giphy.webp",
    width: 480,
    height: 270,
    featured: true,
  },
  {
    id: "2",
    title: "Retro Wave",
    url: "https://media.giphy.com/media/3o7TKsAdQnps51u5xu/giphy.webp",
    width: 480,
    height: 480,
  },
  {
    id: "3",
    title: "Neon Lights",
    url: "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.webp",
    width: 480,
    height: 270,
  },
  {
    id: "4",
    title: "Glitch Art",
    url: "https://media.giphy.com/media/xT9IgusfDcjjFCUOca/giphy.webp",
    width: 480,
    height: 480,
  },
  {
    id: "5",
    title: "Digital Rain",
    url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.webp",
    width: 480,
    height: 360,
  },
  {
    id: "6",
    title: "Abstract Flow",
    url: "https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.webp",
    width: 480,
    height: 480,
  },
  {
    id: "7",
    title: "Pixel Art",
    url: "https://media.giphy.com/media/sIIhZ104wx4Ha/giphy.webp",
    width: 480,
    height: 270,
  },
  {
    id: "8",
    title: "Vaporwave aesthetics",
    url: "https://media.giphy.com/media/3o6Ztg2MgUkcXyC8fb/giphy.webp",
    width: 480,
    height: 270,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative selection:bg-purple-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-neutral-950 pointer-events-none -z-20"></div>
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none -z-10"></div>

      <Header />

      <div className="pt-32 pb-12 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col mb-16 items-center text-center">
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

        <GifGrid gifs={MOCK_GIFS} />
      </div>
    </main>
  );
}
