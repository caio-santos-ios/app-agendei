"use client";

import { useState, useEffect } from "react";
import { SpendingRecord, SpendingSummary } from "@/types";
import { spendingService } from "@/services/extendedServices";
import { BottomNav } from "@/components/layout/BottomNav";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import { TrendingUp, Loader2, CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  pix: <Smartphone className="w-3.5 h-3.5" />,
  credit_card: <CreditCard className="w-3.5 h-3.5" />,
  debit_card: <CreditCard className="w-3.5 h-3.5" />,
  cash: <Banknote className="w-3.5 h-3.5" />,
};
const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix", credit_card: "Crédito", debit_card: "Débito", cash: "Dinheiro",
};

export default function SpendingPage() {
  const [records, setRecords] = useState<SpendingRecord[]>([]);
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([spendingService.getMySpending(), spendingService.getSpendingSummary()])
      .then(([r, s]) => { setRecords(r); setSummary(s); })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  const maxMonth = summary ? Math.max(...summary.byMonth.map(m => m.total)) : 1;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-dark-50">Histórico de Gastos</h1>
            <p className="text-xs text-dark-400 font-body">Controle seus investimentos em beleza</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="px-5 space-y-5">
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Este mês", value: summary.totalThisMonth },
                { label: "Este ano", value: summary.totalThisYear },
                { label: "Total", value: summary.totalAllTime },
              ].map(({ label, value }) => (
                <div key={label} className="card p-3.5 text-center bg-orange-500/5">
                  <p className="text-lg font-display font-bold text-orange-400">R${value}</p>
                  <p className="text-[11px] text-dark-500 font-body mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Spending chart */}
          {summary && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <h2 className="section-title">Gastos por mês</h2>
              </div>
              <div className="flex items-end gap-2 h-28">
                {summary.byMonth.map((m, i) => {
                  const h = Math.max(8, (m.total / maxMonth) * 100);
                  const isLast = i === summary.byMonth.length - 1;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <p className={clsx("text-[10px] font-mono", isLast ? "text-orange-400" : "text-dark-700")}>R${m.total}</p>
                      <div className="w-full flex items-end" style={{ height: "72px" }}>
                        <div className={clsx("w-full rounded-t-lg", isLast ? "bg-gradient-to-t from-orange-600 to-orange-400" : "bg-orange-500/20")}
                          style={{ height: `${h}%` }} />
                      </div>
                      <p className={clsx("text-[10px] font-body", isLast ? "text-orange-400 font-medium" : "text-dark-600")}>{m.month}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category breakdown */}
          {summary && (
            <div className="card p-5">
              <h2 className="section-title mb-4">Por categoria</h2>
              <div className="space-y-3">
                {summary.byCategory.map(({ category, total, count }) => {
                  const cat = SERVICE_CATEGORIES.find(c => c.id === category);
                  const pct = (total / summary.totalAllTime) * 100;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cat?.icon}</span>
                          <span className="text-sm text-dark-200 font-body">{cat?.label}</span>
                          <span className="text-xs text-dark-600 font-body">{count}x</span>
                        </div>
                        <span className="text-sm font-medium text-orange-400 font-body">R${total}</span>
                      </div>
                      <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat?.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Transaction list */}
          <div>
            <h2 className="section-title mb-3">Transações</h2>
            <div className="space-y-2">
              {records.map((r, i) => {
                const cat = SERVICE_CATEGORIES.find(c => c.id === r.service?.category);
                return (
                  <div key={r.id} className="card p-4 flex items-center gap-3" style={{ animation: `fadeUp 0.35s ${i * 0.05}s ease both` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${cat?.color}15`, border: `1px solid ${cat?.color}25` }}>
                      {cat?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-50 font-body truncate">{r.service?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-dark-500 font-body truncate">{r.provider?.name}</p>
                        <span className="text-dark-700">·</span>
                        <p className="text-xs text-dark-600 font-body">{formatDate(r.date)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-dark-50 font-body">- R${r.amount}</p>
                      <div className="flex items-center gap-1 justify-end mt-0.5 text-dark-600">
                        {PAYMENT_ICONS[r.paymentMethod]}
                        <span className="text-[10px] font-body">{PAYMENT_LABELS[r.paymentMethod]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
