"use client";

import { useState, useEffect } from "react";
import { RevenueData } from "@/types";
import { revenueService } from "@/services/extendedServices";
import { BottomNav } from "@/components/layout/BottomNav";
import { TrendingUp, DollarSign, Calendar, Users, BarChart2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function DashboardPage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    revenueService.getRevenueData()
      .then(setData)
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  const maxRevenue = data ? Math.max(...data.byMonth.map(m => m.revenue)) : 1;

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/25 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs text-orange-400/70 font-body font-medium uppercase tracking-wider">Prestador</p>
          <h1 className="font-display text-2xl font-semibold text-dark-50 mt-0.5">Dashboard</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : data ? (
        <div className="px-5 space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Hoje", value: `R$${data.totalToday}`, icon: DollarSign, color: "text-orange-400", bg: "bg-orange-500/10" },
              { label: "Semana", value: `R$${data.totalWeek}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Mês", value: `R$${data.totalMonth}`, icon: BarChart2, color: "text-blue-400", bg: "bg-blue-500/10" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`card p-3.5 ${bg}`}>
                <Icon className={`w-4 h-4 ${color} mb-2`} />
                <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-dark-500 font-body mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Bar Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Receita Mensal</h2>
              <span className="text-xs text-dark-500 font-body">6 meses</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-36">
              {data.byMonth.map((m, i) => {
                const height = Math.max(8, (m.revenue / maxRevenue) * 100);
                const isLast = i === data.byMonth.length - 1;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <p className={clsx("text-[10px] font-mono", isLast ? "text-orange-400" : "text-dark-600")}>
                      R${m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(1)}k` : m.revenue}
                    </p>
                    <div className="w-full relative flex items-end" style={{ height: "96px" }}>
                      <div
                        className={clsx(
                          "w-full rounded-t-lg transition-all duration-700",
                          isLast
                            ? "bg-gradient-to-t from-orange-600 to-orange-400"
                            : "bg-orange-500/20"
                        )}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <p className={clsx("text-[10px] font-body", isLast ? "text-orange-400 font-medium" : "text-dark-600")}>
                      {m.month}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services breakdown */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Por Serviço</h2>
            <div className="space-y-3">
              {data.byService.map((svc, i) => {
                const maxR = data.byService[0].revenue;
                const pct = (svc.revenue / maxR) * 100;
                return (
                  <div key={svc.serviceId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-dark-200 font-body">{svc.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-dark-500 font-body">{svc.count}x</span>
                        <span className="text-sm font-medium text-orange-400 font-body">R${svc.revenue}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, transitionDelay: `${i * 100}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Clients */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-orange-400" />
              <h2 className="section-title">Top Clientes</h2>
            </div>
            <div className="space-y-3">
              {data.topClients.map(({ client, totalSpent, visits }, i) => (
                <div key={client.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm font-display font-bold text-orange-400 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-50 font-body truncate">{client.name}</p>
                    <p className="text-xs text-dark-500 font-body">{visits} visitas</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-400 font-body">R${totalSpent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <BottomNav />
    </div>
  );
}
