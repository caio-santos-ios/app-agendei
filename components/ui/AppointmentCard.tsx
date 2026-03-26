"use client";

import { Appointment } from "@/types";
import { Calendar, Clock, MapPin } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import clsx from "clsx";

interface AppointmentCardProps {
  appointment: Appointment;
  viewAs?: "client" | "provider";
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
}

const STATUS_CONFIG = {
  pending: { label: "Pendente", class: "badge-pending", dot: "bg-amber-400" },
  confirmed: { label: "Confirmado", class: "badge-confirmed", dot: "bg-emerald-400" },
  in_progress: { label: "Em andamento", class: "badge-confirmed", dot: "bg-blue-400" },
  completed: { label: "Concluído", class: "badge-completed", dot: "bg-blue-400" },
  cancelled: { label: "Cancelado", class: "badge-cancelled", dot: "bg-red-400" },
};

export function AppointmentCard({
  appointment,
  viewAs = "client",
  onCancel,
  onConfirm,
}: AppointmentCardProps) {
  const status = STATUS_CONFIG[appointment.status];
  const category = SERVICE_CATEGORIES.find((c) => c.id === appointment.service?.category);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
  };

  const personInfo = viewAs === "client" ? appointment.provider : appointment.client;

  return (
    <div className="card p-4">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              backgroundColor: `${category?.color}15`,
              border: `1px solid ${category?.color}25`,
            }}
          >
            {category?.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-dark-50 font-body">
              {appointment.service?.name}
            </h3>
            {personInfo && (
              <p className="text-xs text-dark-400 font-body mt-0.5">
                {viewAs === "client" ? "com " : "Cliente: "}
                {viewAs === "client"
                  ? (personInfo as any).name
                  : (personInfo as any).name}
              </p>
            )}
          </div>
        </div>
        <span className={status.class}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4 text-xs text-dark-400 font-body">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-dark-500" />
          {formatDate(appointment.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-dark-500" />
          {appointment.time}
        </span>
        <span className="font-medium text-orange-400/80 ml-auto">
          R$ {appointment.service?.price?.toFixed(2)}
        </span>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <p className="text-xs text-dark-500 font-body mt-3 pt-3 border-t border-orange-900/15 italic">
          "{appointment.notes}"
        </p>
      )}

      {/* Actions */}
      {(appointment.status === "pending" || appointment.status === "confirmed") && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-orange-900/15">
          {viewAs === "provider" && appointment.status === "pending" && onConfirm && (
            <button
              onClick={() => onConfirm(appointment.id)}
              className="flex-1 text-xs py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-body"
            >
              Confirmar
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex-1 text-xs py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-body"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
