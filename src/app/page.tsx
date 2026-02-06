"use client";

import Dashboard from "@/components/Dashboard";
import { AppProvider } from "@/context/AppContext";

export default function Home() {
  return (
    <AppProvider>
      <main className="min-h-screen bg-transparent">
        <Dashboard />
      </main>
    </AppProvider>
  );
}
