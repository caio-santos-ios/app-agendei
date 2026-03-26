"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { Provider, ServiceCategory } from "@/types";
import { providerService } from "@/services/appointmentService";
import { appointmentService } from "@/services/appointmentService";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { AppointmentCard } from "@/components/ui/AppointmentCard";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import { Bell, Search, MapPin, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

export default function HomePage() {
  const { user } = useAuth();

  // Redirect provider to provider home
  if (user?.role === "provider") {
    return <ProviderHome />;
  }
  return <ClientHome />;
}

// ─── Client Home ─────────────────────────────────────────────────────────────
function ClientHome() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [nextApt, setNextApt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [providersRes, apts] = await Promise.all([
          providerService.getProviders(selectedCategory ?? undefined),
          appointmentService.getMyAppointments(),
        ]);
        setProviders(providersRes.data);
        const upcoming = apts.filter(
          (a) => a.status === "confirmed" || a.status === "pending"
        );
        setNextApt(upcoming[0] ?? null);
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  const filteredProviders = providers.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/30 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-dark-400 font-body">{greeting} 👋</p>
            <h1 className="font-display text-2xl font-semibold text-dark-50 mt-0.5">
              {firstName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="w-10 h-10 rounded-xl bg-orange-500/8 border border-orange-500/15 flex items-center justify-center relative">
              <Bell className="w-4.5 h-4.5 text-dark-300 w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-orange-500/8 border border-orange-500/15 flex items-center justify-center text-sm font-medium text-orange-400 font-body">
              {user?.name?.[0] ?? "U"}
            </div>
          </div>
        </div>

        {/* Location bar */}
        <div className="flex items-center gap-1.5 mt-4 relative z-10">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs text-dark-400 font-body">Ilhéus, BA · </span>
          <span className="text-xs text-orange-400/80 font-body">alterar localização</span>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            className="input-field pl-11"
            placeholder="Buscar profissional ou serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Next appointment banner */}
        {nextApt && (
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(194,65,12,0.1) 100%)",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <p className="text-xs text-orange-400/80 font-body mb-1">Próximo agendamento</p>
            <p className="font-display text-lg font-semibold text-dark-50">
              {nextApt.service?.name}
            </p>
            <p className="text-sm text-dark-300 font-body mt-1">
              {nextApt.provider?.name} · {nextApt.date} às {nextApt.time}
            </p>
            <Link
              href="/appointments"
              className="inline-flex items-center gap-1 mt-3 text-xs text-orange-400 font-medium font-body hover:text-orange-300 transition-colors"
            >
              Ver detalhes <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">Categorias</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={clsx(
                "flex flex-col items-center gap-2 p-3 rounded-xl border flex-shrink-0 transition-all duration-200 w-[72px]",
                !selectedCategory
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-orange-900/20 bg-[#261914] hover:border-orange-900/40"
              )}
            >
              <span className="text-xl">🔍</span>
              <span className="text-[10px] font-body text-dark-400 leading-tight text-center">Todos</span>
            </Link>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
                className={clsx(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border flex-shrink-0 transition-all duration-200 w-[72px]",
                  selectedCategory === cat.id
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-orange-900/20 bg-[#261914] hover:border-orange-900/40"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[10px] font-body text-dark-400 leading-tight text-center">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Providers list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">
              {selectedCategory
                ? SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)?.label
                : "Profissionais perto de você"}
            </h2>
            <Link href="/search" className="text-xs text-orange-400 font-body hover:text-orange-300 transition-colors">
              Ver todos
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-dark-400 font-body text-sm">Nenhum profissional encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProviders.map((provider, i) => (
                <div
                  key={provider.id}
                  style={{ animation: `fadeUp 0.4s ${i * 0.08}s ease both` }}
                >
                  <ProviderCard provider={provider} variant="compact" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Provider Home ────────────────────────────────────────────────────────────
function ProviderHome() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(" ")[0] ?? "Profissional";

  useEffect(() => {
    appointmentService.getProviderAppointments()
      .then(setAppointments)
      .catch(() => toast.error("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayApts = appointments.filter((a) => a.date === today || true); // mock shows all

  const stats = {
    today: appointments.filter((a) => a.status === "confirmed" || a.status === "pending").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentService.confirmAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a))
      );
      toast.success("Agendamento confirmado!");
    } catch {
      toast.error("Erro ao confirmar");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
      toast.success("Agendamento cancelado");
    } catch {
      toast.error("Erro ao cancelar");
    }
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/25 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-orange-400/70 font-body font-medium uppercase tracking-wider">
              Painel do Prestador
            </p>
            <h1 className="font-display text-2xl font-semibold text-dark-50 mt-0.5">
              Olá, {firstName} 👋
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-xs text-dark-500 hover:text-dark-300 font-body transition-colors px-3 py-2 rounded-lg hover:bg-orange-900/20"
          >
            Sair
          </Link>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Hoje", value: stats.today, color: "text-orange-400", bg: "bg-orange-500/10" },
            { label: "Pendentes", value: stats.pending, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Concluídos", value: stats.completed, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`card p-3 text-center ${stat.bg}`}>
              <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-dark-500 font-body mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/schedule" className="card-hover p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl flex-shrink-0">📅</div>
            <div>
              <p className="text-sm font-medium text-dark-50 font-body">Minha Agenda</p>
              <p className="text-xs text-dark-500 font-body">Ver horários</p>
            </div>
          </Link>
          <Link href="/services" className="card-hover p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl flex-shrink-0">✂️</div>
            <div>
              <p className="text-sm font-medium text-dark-50 font-body">Serviços</p>
              <p className="text-xs text-dark-500 font-body">Gerenciar</p>
            </div>
          </Link>
        </div>

        {/* Incoming appointments */}
        <div>
          <h2 className="section-title mb-3">Agendamentos</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-dark-400 font-body text-sm">Nenhum agendamento ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt, i) => (
                <div key={apt.id} style={{ animation: `fadeUp 0.4s ${i * 0.08}s ease both` }}>
                  <AppointmentCard
                    appointment={apt}
                    viewAs="provider"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
