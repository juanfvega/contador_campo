"use client";

import { Coffee, Heart } from "lucide-react";
import { Button } from "./ui/Button";

export function Footer() {
    return (
        <footer className="w-full py-4 mt-20 flex flex-col items-center justify-center text-center gap-2 relative z-0 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <p className="text-[10px] text-[var(--muted-foreground)]">
                ¿Te gusta mi trabajo?, colabora con el proyecto
            </p>

            <a
                href="https://link.mercadopago.com.ar/juanfv"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 active:scale-95"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-full text-xs text-blue-500/80 hover:bg-blue-500/10 h-8 px-3"
                >
                    <Heart className="w-3 h-3 fill-current" />
                    Colaborar
                </Button>
            </a>

            <p className="text-[10px] text-[var(--muted-foreground)]/40">
                © {new Date().getFullYear()} CONTADOR DE CAMPO v1.0
            </p>
        </footer>
    );
}
