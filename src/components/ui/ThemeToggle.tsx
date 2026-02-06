"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md border shadow-lg transition-colors duration-300 focus:outline-none dark:bg-slate-800/80 dark:border-slate-700 bg-white/80 border-slate-200"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === "light" ? 1 : 0,
                        rotate: theme === "light" ? 0 : 90,
                        opacity: theme === "light" ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-yellow-500"
                >
                    <Sun size={20} className="fill-current" />
                </motion.div>
                <motion.div
                    initial={false}
                    animate={{
                        scale: theme === "dark" ? 1 : 0,
                        rotate: theme === "dark" ? 0 : -90,
                        opacity: theme === "dark" ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center text-slate-200"
                >
                    <Moon size={20} className="fill-current" />
                </motion.div>
            </div>
        </button>
    );
}
