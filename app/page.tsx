"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Loader2, Scissors } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authService.isAuthenticated()) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#1a1210]">
      <div className="flex flex-col items-center gap-4" style={{ animation: "fadeUp 0.5s ease forwards" }}>
        <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative">
          <Scissors className="w-9 h-9 text-orange-400" />
          <div className="absolute inset-0 rounded-3xl bg-orange-500/5 blur-xl" />
        </div>
        <h1 className="font-display text-5xl font-bold text-dark-50 tracking-tight">agendei</h1>
        <Loader2 className="w-5 h-5 text-orange-500/60 animate-spin mt-2" />
      </div>
    </div>
  );
}
