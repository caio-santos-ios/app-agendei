"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChevronLeft, ChevronRight, Clock, User, Loader2 } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import clsx from "clsx";
import toast from "react-hot-toast";

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

function getWeekDates(baseDate: Date) {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - day + 1);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);

  useEffect(() => {
    appointmentService.getProviderAppointments()
      .then(setAppointments)
      .catch(() => toast.error("Erro ao carregar agenda"))
      .finally(() => setLoading(false));
  }, []);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  // Get appointments for selected day
  const dayAppointments = appointments.filter(a => a.date === selectedDateStr);

  // Map appointment to time slot
  const aptByTime: Record<string, Appointment> = {};
  dayAppointments.forEach(a => { aptByTime[a.time] = a; });

  const formatMonthYear = (d: Date) =>
    d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const isToday = (d: Date) => {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isSelected = (d: Date) => d.toDateString() === selectedDate.toDateString();

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 sticky top-0 z-30 bg-[#1a1210]/95 backdrop-blur-xl border-b border-orange-900/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-semibold text-dark-50">Minha Agenda</h1>
          <div className="flex items-center gap-1">
            <button onClick={() => setWeekOffset(w => w - 1)} className="btn-ghost p-2">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-dark-400 font-body min-w-[100px] text-center capitalize">
              {formatMonthYear(weekDates[0])}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="btn-ghost p-2">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week strip */}
        <div className="flex gap-1.5">
          {weekDates.map((date, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                "flex-1 flex flex-col items-center py-2.5 rounded-xl border transition-all duration-200",
                isSelected(date)
                  ? "bg-orange-500 border-orange-500"
                  : isToday(date)
                    ? "border-orange-500/40 bg-orange-500/10"
                    : "border-orange-900/20 bg-[#261914] hover:border-orange-900/40"
              )}
            >
              <span className={clsx("text-[10px] font-body uppercase", isSelected(date) ? "text-white/80" : "text-dark-500")}>
                {DAYS_PT[date.getDay()]}
              </span>
              <span className={clsx("text-base font-display font-bold mt-0.5", isSelected(date) ? "text-white" : isToday(date) ? "text-orange-400" : "text-dark-300")}>
                {date.getDate()}
              </span>
              {/* Dot indicator */}
              {appointments.some(a => a.date === date.toISOString().split("T")[0]) && (
                <div className={clsx("w-1.5 h-1.5 rounded-full mt-1", isSelected(date) ? "bg-white/60" : "bg-orange-500")} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="px-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-dark-300 font-body capitalize">
            {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <span className="text-xs text-dark-600 font-body">{dayAppointments.length} agendamento(s)</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {HOURS.map((hour) => {
              const apt = aptByTime[hour];
              const cat = apt ? SERVICE_CATEGORIES.find(c => c.id === apt.service?.category) : null;

              return (
                <div key={hour} className="flex gap-3 items-stretch min-h-[56px]">
                  {/* Time label */}
                  <div className="w-14 flex-shrink-0 flex items-start pt-3">
                    <span className="text-xs text-dark-600 font-mono">{hour}</span>
                  </div>

                  {/* Slot */}
                  <div className="flex-1">
                    {apt ? (
                      <div
                        className="rounded-xl p-3 border transition-all"
                        style={{
                          background: `${cat?.color}12`,
                          borderColor: `${cat?.color}30`,
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-dark-50 font-body">{apt.service?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1 text-xs text-dark-400 font-body">
                                <User className="w-3 h-3" />
                                {apt.client?.name ?? "Cliente"}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-dark-500 font-body">
                                <Clock className="w-3 h-3" />
                                {apt.service?.duration}min
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-orange-400 font-body">R${apt.service?.price}</p>
                            <span className={clsx(
                              "text-[10px] px-2 py-0.5 rounded-full font-body",
                              apt.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                            )}>
                              {apt.status === "confirmed" ? "Confirmado" : "Pendente"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-10 rounded-xl border border-dashed border-orange-900/15 flex items-center justify-center">
                        <span className="text-xs text-dark-700 font-body">Disponível</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
