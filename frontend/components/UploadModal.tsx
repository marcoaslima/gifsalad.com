import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isAdult, setIsAdult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("tags", tags);
        formData.append("width", "480"); // Default width (backend should probably handle metadata extraction)
        formData.append("height", "480"); // Default height
        formData.append("isAdult", String(isAdult));
        formData.append("file", file);
        formData.append("originalId", file.name);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const res = await fetch(`${apiUrl}/gifs`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to upload gif");
            }

            onUploadSuccess();
            onClose();
            // Reset form
            setTitle("");
            setTags("");
            setFile(null);
            setIsAdult(false);
        } catch (err) {
            console.error(err);
            setError("Failed to upload. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Upload GIF</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Shiny object"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="shiny, object, 3d"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">File</label>
                        <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 transition-colors hover:border-purple-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer group">
                            <input
                                type="file"
                                accept="image/gif,image/webp"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                            {file ? (
                                <div className="text-center">
                                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isAdult}
                            onChange={(e) => setIsAdult(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-white/5 border-white/10"
                            id="adult-checkbox"
                        />
                        <label htmlFor="adult-checkbox" className="text-sm font-medium text-gray-300 select-none">
                            Contains 18+ content
                        </label>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Uploading..." : "Upload GIF"}
                    </button>
                </form>
            </div>
        </div>
    );
}
