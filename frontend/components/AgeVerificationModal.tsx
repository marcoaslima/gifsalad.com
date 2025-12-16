import React, { useState, useEffect } from "react";

interface AgeVerificationModalProps {
    onVerify: (isAdult: boolean) => void;
}

export function AgeVerificationModal({ onVerify }: AgeVerificationModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        const savedPreference = localStorage.getItem("isAdultConfigured");
        if (!savedPreference) {
            setIsOpen(true);
        }
    }, []);

    const handleChoice = (isAdult: boolean) => {
        setIsOpen(false);
        localStorage.setItem("isAdultConfigured", "true");
        localStorage.setItem("canViewAdult", String(isAdult));
        onVerify(isAdult);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
            <div className="relative bg-neutral-900 border border-purple-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Age Verification</h2>
                <p className="text-gray-300 mb-8">
                    This website may contain content that is restricted to adults (18+).
                    Do you wish to see age-restricted content?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleChoice(true)}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20"
                    >
                        Yes, I am 18+ - Show everything
                    </button>
                    <button
                        onClick={() => handleChoice(false)}
                        className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl transition-all border border-white/10"
                    >
                        No, hide restricted content
                    </button>
                </div>
            </div>
        </div>
    );
}
