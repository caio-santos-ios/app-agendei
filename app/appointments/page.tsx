"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { AppointmentCard } from "@/components/ui/AppointmentCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Loader2, Calendar, Star, CreditCard } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import toast from "react-hot-toast";

type Filter = "all" | "upcoming" | "completed" | "cancelled";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "upcoming", label: "Próximos" },
  { id: "completed", label: "Concluídos" },
  { id: "cancelled", label: "Cancelados" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getMyAppointments()
      .then(setAppointments)
      .catch(() => toast.error("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) => {
    if (filter === "upcoming") return a.status === "confirmed" || a.status === "pending";
    if (filter === "completed") return a.status === "completed";
    if (filter === "cancelled") return a.status === "cancelled";
    return true;
  });

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
      toast.success("Agendamento cancelado");
    } catch { toast.error("Erro ao cancelar"); }
  };

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-dark-50">Minha Agenda</h1>
        </div>
        <p className="text-sm text-dark-400 font-body ml-12">
          {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={clsx("flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium font-body transition-all",
              filter === f.id ? "bg-orange-500 text-white" : "bg-[#261914] text-dark-400 border border-orange-900/20 hover:border-orange-900/40")}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-dark-300 font-body font-medium">Nenhum agendamento</p>
            <p className="text-dark-500 text-sm font-body mt-1">
              {filter === "all" ? "Que tal agendar um serviço?" : "Nada nessa categoria"}
            </p>
            {filter === "all" && (
              <Link href="/search" className="btn-primary mt-4 inline-flex w-auto px-8">Buscar serviços</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt, i) => (
              <div key={apt.id} style={{ animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}>
                <AppointmentCard
                  appointment={apt}
                  viewAs="client"
                  onCancel={apt.status !== "completed" && apt.status !== "cancelled" ? handleCancel : undefined}
                />
                {/* Action buttons below card */}
                <div className="flex gap-2 mt-2">
                  {apt.status === "pending" && (
                    <Link href={`/payment?appointmentId=${apt.id}&amount=${apt.service?.price}&service=${encodeURIComponent(apt.service?.name || "")}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 font-body font-medium hover:bg-orange-500/20 transition-colors">
                      <CreditCard className="w-3.5 h-3.5" /> Pagar agora
                    </Link>
                  )}
                  {apt.status === "completed" && (
                    <Link href={`/reviews?appointmentId=${apt.id}&providerId=${apt.providerId}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-body font-medium hover:bg-amber-500/20 transition-colors">
                      <Star className="w-3.5 h-3.5" /> Avaliar serviço
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
