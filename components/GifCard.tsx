"use client";
import React from "react";
import Image from "next/image";
import { Copy, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GifCardProps {
    id: string;
    title: string;
    url: string;
    width?: number;
    height?: number;
    featured?: boolean;
}

export function GifCard({ id, title, url, width = 400, height = 300, featured = false }: GifCardProps) {
    return (
        <motion.div
            className={cn(
                "group relative rounded-2xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer",
                featured ? "md:col-span-2 md:row-span-2" : ""
            )}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative w-full h-full min-h-[200px]">
                <Image
                    src={url}
                    alt={title}
                    width={width}
                    height={height}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium truncate drop-shadow-md">{title}</h3>
                    <div className="flex items-center gap-2 mt-3">
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-purple-600 hover:text-white transition-colors border border-white/10">
                            <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10">
                            <Copy className="w-4 h-4 text-white" />
                        </button>
                        <div className="flex-1" />
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors border border-white/10">
                            <Share2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
