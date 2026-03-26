"use client";

import { useState, useEffect } from "react";
import { Notification } from "@/types";
import { notificationService } from "@/services/extendedServices";
import { BottomNav } from "@/components/layout/BottomNav";
import { Bell, BellOff, Calendar, MessageCircle, Star, DollarSign, X, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  appointment_confirmed: { icon: <Calendar className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  appointment_cancelled: { icon: <X className="w-4 h-4" />, color: "text-red-400", bg: "bg-red-500/10" },
  appointment_reminder: { icon: <Calendar className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/10" },
  new_message: { icon: <MessageCircle className="w-4 h-4" />, color: "text-orange-400", bg: "bg-orange-500/10" },
  new_review: { icon: <Star className="w-4 h-4" />, color: "text-amber-400", bg: "bg-amber-500/10" },
  payment_received: { icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    notificationService.getNotifications()
      .then(setNotifications)
      .catch(() => toast.error("Erro ao carregar notificações"))
      .finally(() => setLoading(false));

    // Check push permission
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Todas marcadas como lidas");
  };

  const handleTogglePush = async () => {
    if (!("Notification" in window)) { toast.error("Seu navegador não suporta notificações push"); return; }
    setPushLoading(true);
    try {
      if (pushEnabled) {
        setPushEnabled(false);
        toast.success("Notificações desativadas");
      } else {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPushEnabled(true);
          toast.success("Notificações ativadas! 🔔");
          // In production: subscribe to push and call notificationService.subscribePush(subscription)
        } else {
          toast.error("Permissão negada para notificações");
        }
      }
    } finally { setPushLoading(false); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
    return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 sticky top-0 z-30 bg-[#1a1210]/95 backdrop-blur-xl border-b border-orange-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
                <Bell className="w-4 h-4 text-orange-400" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <h1 className="font-display text-xl font-semibold text-dark-50">Notificações</h1>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-orange-400 font-body hover:text-orange-300 transition-colors">
              Marcar todas
            </button>
          )}
        </div>

        {/* Push toggle */}
        <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <div className="flex items-center gap-2">
            {pushEnabled ? <Bell className="w-4 h-4 text-orange-400" /> : <BellOff className="w-4 h-4 text-dark-500" />}
            <div>
              <p className="text-xs font-medium text-dark-200 font-body">Notificações push</p>
              <p className="text-[10px] text-dark-500 font-body">{pushEnabled ? "Ativadas" : "Desativadas"}</p>
            </div>
          </div>
          <button
            onClick={handleTogglePush}
            disabled={pushLoading}
            className={clsx(
              "w-11 h-6 rounded-full transition-all duration-300 relative",
              pushEnabled ? "bg-orange-500" : "bg-dark-700"
            )}
          >
            <div className={clsx("w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300", pushEnabled ? "left-6" : "left-1")} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-5 mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔕</p>
            <p className="text-dark-300 font-body font-medium">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.appointment_confirmed;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={clsx(
                    "card p-4 flex items-start gap-3 transition-all cursor-pointer",
                    !n.read && "border-orange-500/20 bg-orange-500/3"
                  )}
                  style={{ animation: `fadeUp 0.35s ${i * 0.06}s ease both` }}
                >
                  <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                    <span className={config.color}>{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={clsx("text-sm font-body", n.read ? "text-dark-300 font-normal" : "text-dark-50 font-medium")}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-dark-600 font-body flex-shrink-0">{formatTime(n.createdAt)}</span>
                    </div>
                    <p className="text-xs text-dark-500 font-body mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 flex-shrink-0" />}
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
