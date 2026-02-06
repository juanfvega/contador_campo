"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2 p-1 rounded-full border shadow-lg transition-colors duration-300 focus:outline-none ${theme === "dark"
                    ? "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                    : "bg-white/80 border-slate-200 hover:border-slate-300"
                }`}
            aria-label="Toggle Theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <div className="relative flex items-center">
                {/* Sliding Pill Background */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={`absolute h-8 w-8 rounded-full shadow-sm ${theme === "dark" ? "bg-slate-700 right-0" : "bg-white left-0"
                        }`}
                    style={{
                        left: theme === "light" ? "0" : "auto",
                        right: theme === "dark" ? "0" : "auto"
                    }}
                />

                {/* Icons Container */}
                <div className="relative z-10 flex items-center justify-between w-20 px-1">
                    <div className={`p-1.5 rounded-full transition-colors ${theme === "light" ? "text-yellow-500" : "text-slate-400"}`}>
                        <Sun size={18} fill={theme === "light" ? "currentColor" : "none"} />
                    </div>
                    <div className={`p-1.5 rounded-full transition-colors ${theme === "dark" ? "text-blue-200" : "text-slate-400"}`}>
                        <Moon size={18} fill={theme === "dark" ? "currentColor" : "none"} />
                    </div>
                </div>
            </div>
        </button>
    );
}
