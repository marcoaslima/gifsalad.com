"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TagListProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export function TagList({ tags, selectedTag, onSelectTag }: TagListProps) {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 -mx-6 px-6 scrollbar-hide">
            <div className="flex items-center gap-3 w-max">
                <motion.button
                    onClick={() => onSelectTag(null)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md whitespace-nowrap",
                        selectedTag === null
                            ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    )}
                >
                    All
                </motion.button>
                {tags.map((tag) => (
                    <motion.button
                        key={tag}
                        onClick={() => onSelectTag(tag)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md whitespace-nowrap",
                            selectedTag === tag
                                ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                        )}
                    >
                        {tag}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
