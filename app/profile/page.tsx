"use client";

import { useAuth } from "@/lib/authContext";
import { BottomNav } from "@/components/layout/BottomNav";
import {
  User, Mail, Phone, LogOut, ChevronRight,
  Bell, Shield, CreditCard, HelpCircle, Star
} from "lucide-react";

const menuSections = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Editar perfil", href: "/profile/edit" },
      { icon: Bell, label: "Notificações", href: "/profile/notifications" },
      { icon: Shield, label: "Privacidade e segurança", href: "/profile/security" },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      { icon: CreditCard, label: "Métodos de pagamento", href: "/profile/payment" },
      { icon: Star, label: "Avaliações", href: "/profile/reviews" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Central de ajuda", href: "/help" },
    ],
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <h1 className="font-display text-2xl font-semibold text-dark-50 mb-6">Meu Perfil</h1>

        {/* Avatar card */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-2xl font-display font-bold text-orange-400 flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg font-semibold text-dark-50 truncate">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-body">
                {user?.role === "client" ? "👤 Cliente" : "💼 Prestador"}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-dark-600 flex-shrink-0" />
        </div>

        {/* Contact info */}
        <div className="card mt-3 divide-y divide-orange-900/15">
          <div className="p-4 flex items-center gap-3">
            <Mail className="w-4 h-4 text-dark-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-dark-500 font-body">Email</p>
              <p className="text-sm text-dark-200 font-body mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Phone className="w-4 h-4 text-dark-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-dark-500 font-body">Telefone</p>
              <p className="text-sm text-dark-200 font-body mt-0.5">{user?.phone || "Não informado"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-5 space-y-5">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="label mb-2">{section.title}</p>
            <div className="card divide-y divide-orange-900/10">
              {section.items.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 p-4 hover:bg-orange-500/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-500/8 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-colors">
                    <Icon className="w-4 h-4 text-orange-400/70" />
                  </div>
                  <span className="flex-1 text-sm text-dark-200 font-body">{label}</span>
                  <ChevronRight className="w-4 h-4 text-dark-600" />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full card p-4 flex items-center gap-3 hover:bg-red-500/5 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <span className="flex-1 text-sm text-red-400 font-body text-left">Sair da conta</span>
        </button>

        <p className="text-center text-xs text-dark-700 font-mono pb-4">
          agendei v0.1.0 · Made with ♥ in Ilhéus-BA
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
