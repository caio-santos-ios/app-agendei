"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Search, User, BarChart3, Settings, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import clsx from "clsx";

const clientNav = [
  { href: "/home", icon: Home, label: "Início" },
  { href: "/search", icon: Search, label: "Buscar" },
  { href: "/appointments", icon: Calendar, label: "Agenda" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Perfil" },
];

const providerNav = [
  { href: "/home", icon: Home, label: "Início" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/schedule", icon: Calendar, label: "Agenda" },
  { href: "/services", icon: Settings, label: "Serviços" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
];

export function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const navItems = user?.role === "provider" ? providerNav : clientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#1a1210]/92 backdrop-blur-xl border-t border-orange-900/15" />
      <div className="relative flex items-center justify-around px-2 pt-2.5 pb-6 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 min-w-[52px] py-1 px-2 rounded-xl transition-all duration-200",
                isActive ? "text-orange-400" : "text-dark-600 hover:text-dark-400"
              )}
            >
              <div className="relative">
                <Icon className={clsx("w-[22px] h-[22px] transition-all", isActive && "drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]")} />
              </div>
              <span className={clsx("text-[10px] font-body font-medium", isActive ? "text-orange-400" : "text-dark-700")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
