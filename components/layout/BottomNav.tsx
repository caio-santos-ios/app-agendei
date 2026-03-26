"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Search, User, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import clsx from "clsx";

const clientNav = [
  { href: "/home", icon: Home, label: "Início" },
  { href: "/search", icon: Search, label: "Buscar" },
  { href: "/appointments", icon: Calendar, label: "Agenda" },
  { href: "/profile", icon: User, label: "Perfil" },
];

const providerNav = [
  { href: "/home", icon: Home, label: "Início" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/schedule", icon: Calendar, label: "Agenda" },
  { href: "/settings", icon: Settings, label: "Config" },
];

export function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const navItems = user?.role === "provider" ? providerNav : clientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-[#1a1210]/90 backdrop-blur-xl border-t border-orange-900/15" />

      <div className="relative flex items-center justify-around px-4 pt-3 pb-2 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 min-w-[56px] py-1.5 px-3 rounded-xl transition-all duration-200",
                isActive
                  ? "text-orange-400"
                  : "text-dark-500 hover:text-dark-300"
              )}
            >
              <div className="relative">
                <Icon className={clsx("w-5 h-5 transition-all", isActive && "drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]")} />
                {isActive && (
                  <div className="absolute inset-0 bg-orange-400/20 blur-md rounded-full" />
                )}
              </div>
              <span className={clsx(
                "text-[10px] font-body font-medium transition-all",
                isActive ? "text-orange-400" : "text-dark-600"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
