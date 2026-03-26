"use client";

import { useAuth } from "@/lib/authContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChevronRight, Bell, Clock, MapPin, CreditCard, LogOut, User, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { logout } = useAuth();

  const sections = [
    {
      title: "Perfil",
      items: [
        { icon: User, label: "Dados do estabelecimento", href: "/profile/edit" },
        { icon: MapPin, label: "Endereço e localização", href: "/profile/address" },
        { icon: Clock, label: "Horários de atendimento", href: "/profile/hours" },
      ],
    },
    {
      title: "Financeiro",
      items: [
        { icon: CreditCard, label: "Dados bancários e pagamentos", href: "/profile/bank" },
      ],
    },
    {
      title: "Sistema",
      items: [
        { icon: Bell, label: "Notificações", href: "/notifications" },
        { icon: Shield, label: "Privacidade e segurança", href: "/profile/security" },
      ],
    },
  ];

  return (
    <div className="min-h-dvh pb-24 page-enter">
      <div className="px-5 pt-14 pb-6">
        <h1 className="font-display text-2xl font-semibold text-dark-50">Configurações</h1>
      </div>

      <div className="px-5 space-y-5">
        {sections.map(section => (
          <div key={section.title}>
            <p className="label mb-2">{section.title}</p>
            <div className="card divide-y divide-orange-900/10">
              {section.items.map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-3 p-4 hover:bg-orange-500/5 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/8 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/15 transition-colors">
                    <Icon className="w-4 h-4 text-orange-400/70" />
                  </div>
                  <span className="flex-1 text-sm text-dark-200 font-body">{label}</span>
                  <ChevronRight className="w-4 h-4 text-dark-600" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <button onClick={logout}
          className="w-full card p-4 flex items-center gap-3 hover:bg-red-500/5 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <span className="flex-1 text-sm text-red-400 font-body text-left">Sair da conta</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
