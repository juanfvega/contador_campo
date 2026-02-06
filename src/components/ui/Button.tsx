"use client";

import { motion, MotionProps } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Combine generic HTML button props with Motion props, but be careful with overlaps
// Easiest is to use React.ComponentProps<typeof motion.button> which already handles this overlap
type MotionButtonProps = React.ComponentProps<typeof motion.button>;

interface ButtonProps extends MotionButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-opacity-90 shadow-lg shadow-[var(--primary)]/20",
        secondary: "bg-[var(--card)] text-[var(--foreground)] border border-[var(--card-border)] hover:bg-[var(--muted)]",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
        ghost: "bg-transparent hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            // @ts-ignore - Resolving complex intersection type issues with framer-motion and react types
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
}
