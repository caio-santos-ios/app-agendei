"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Provider, Service } from "@/types";
import { providerService } from "@/services/appointmentService";
import { appointmentService } from "@/services/appointmentService";
import { favoritesService, chatService } from "@/services/extendedServices";
import { Star, MapPin, Clock, ChevronLeft, Loader2, CheckCircle2, X, Heart, MessageCircle } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import clsx from "clsx";
import toast from "react-hot-toast";

const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","14:00","14:30","15:00","15:30","16:00","17:00",
];

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [step, setStep] = useState<"info" | "booking">("info");
  const [booking, setBooking] = useState(false);
  const [notes, setNotes] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    providerService.getProviderById(id)
      .then((p) => { setProvider(p); return favoritesService.isFavorite(p.id); })
      .then(setIsFav)
      .catch(() => toast.error("Profissional não encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedDate && provider) {
      providerService.getAvailableSlots(provider.id, selectedDate).then(setAvailableSlots);
    }
  }, [selectedDate, provider]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1); return d;
  });

  const handleBooking = async () => {
    if (!provider || !selectedService || !selectedDate || !selectedTime) return;
    setBooking(true);
    try {
      const apt = await appointmentService.createAppointment({
        providerId: provider.id, serviceId: selectedService.id,
        date: selectedDate, time: selectedTime, notes,
      });
      toast.success("Agendamento realizado! 🎉");
      router.push(`/payment?appointmentId=${apt.id}&amount=${selectedService.price}&service=${encodeURIComponent(selectedService.name)}`);
    } catch { toast.error("Erro ao agendar. Tente novamente."); }
    finally { setBooking(false); }
  };

  const handleToggleFav = async () => {
    if (!provider) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await favoritesService.removeFavorite(provider.id);
        setIsFav(false);
        toast.success("Removido dos favoritos");
      } else {
        await favoritesService.addFavorite(provider.id);
        setIsFav(true);
        toast.success("Adicionado aos favoritos ❤️");
      }
    } catch { toast.error("Erro ao atualizar favoritos"); }
    finally { setFavLoading(false); }
  };

  const handleChat = async () => {
    if (!provider) return;
    try {
      const conv = await chatService.getOrCreateConversation(provider.id);
      router.push(`/chat?id=${conv.id}`);
    } catch { toast.error("Erro ao abrir chat"); }
  };

  const category = provider ? SERVICE_CATEGORIES.find((c) => c.id === provider.category) : null;

  if (loading) return (
    <div className="min-h-dvh flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
    </div>
  );

  if (!provider) return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-dark-300 font-body">Profissional não encontrado</p>
      <button onClick={() => router.back()} className="btn-secondary mt-4 w-auto px-8">Voltar</button>
    </div>
  );

  return (
    <div className="min-h-dvh pb-28 page-enter">
      {/* Back + action buttons */}
      <div className="fixed top-12 left-0 right-0 z-30 flex items-center justify-between px-5">
        <button onClick={() => step === "info" ? router.back() : setStep("info")}
          className="w-10 h-10 rounded-xl bg-[#1a1210]/80 backdrop-blur-sm border border-orange-900/20 flex items-center justify-center text-dark-300 hover:text-dark-100 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleChat}
            className="w-10 h-10 rounded-xl bg-[#1a1210]/80 backdrop-blur-sm border border-orange-900/20 flex items-center justify-center text-dark-300 hover:text-orange-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={handleToggleFav} disabled={favLoading}
            className={clsx("w-10 h-10 rounded-xl bg-[#1a1210]/80 backdrop-blur-sm border flex items-center justify-center transition-all",
              isFav ? "border-red-500/40 text-red-400" : "border-orange-900/20 text-dark-300 hover:text-red-400")}>
            {favLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={clsx("w-4 h-4", isFav && "fill-red-400")} />}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-br from-orange-900/30 to-[#1a1210] flex items-end px-5 pb-5">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle at 70% 30%, ${category?.color}40, transparent 70%)` }} />
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-7xl opacity-20">{category?.icon}</div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
            style={{ background: `${category?.color}20`, border: `1px solid ${category?.color}30` }}>
            {category?.icon}
          </div>
          <h1 className="font-display text-2xl font-bold text-dark-50">{provider.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-sm text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {provider.rating} <span className="text-dark-500">({provider.reviewCount})</span>
            </span>
            <span className="text-dark-500 text-sm">·</span>
            <span className="text-sm text-dark-400">{category?.label}</span>
            {provider.isAvailableNow && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-soft" />Disponível
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5">
        {/* Info */}
        <div className="card p-4">
          <p className="text-sm text-dark-300 font-body leading-relaxed">{provider.bio}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-dark-500 font-body">
            <MapPin className="w-3.5 h-3.5 text-dark-600" />{provider.address}
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="section-title mb-3">Serviços</h2>
          <div className="space-y-2">
            {provider.services.map((svc) => (
              <button key={svc.id}
                onClick={() => { setSelectedService(svc); setStep("booking"); }}
                className={clsx("w-full card p-4 flex items-center justify-between text-left transition-all duration-200",
                  selectedService?.id === svc.id ? "border-orange-500/40 bg-orange-500/8" : "hover:border-orange-900/40")}>
                <div>
                  <p className="text-sm font-medium text-dark-50 font-body">{svc.name}</p>
                  <p className="text-xs text-dark-500 font-body mt-0.5">{svc.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-dark-500 font-body">
                      <Clock className="w-3 h-3" /> {svc.duration}min
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-display font-bold text-orange-400">R${svc.price}</p>
                  <p className="text-[10px] text-dark-600 font-body">Agendar →</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Booking panel */}
        {step === "booking" && selectedService && (
          <div className="card p-5 space-y-5 border-orange-500/25">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Data e horário</h2>
              <button onClick={() => setStep("info")} className="text-dark-500 hover:text-dark-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-orange-500/8 rounded-xl p-3 border border-orange-500/15">
              <p className="text-xs text-orange-400/80 font-body">Serviço selecionado</p>
              <p className="text-sm font-medium text-dark-50 font-body mt-0.5">
                {selectedService.name} · R${selectedService.price} · {selectedService.duration}min
              </p>
            </div>

            {/* Date picker */}
            <div>
              <label className="label">Data</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((date) => {
                  const val = date.toISOString().split("T")[0];
                  return (
                    <button key={val} onClick={() => { setSelectedDate(val); setSelectedTime(""); }}
                      className={clsx("flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all w-16 text-center",
                        selectedDate === val ? "bg-orange-500 border-orange-500 text-white" : "bg-[#1a1210] border-orange-900/20 text-dark-400 hover:border-orange-900/40")}>
                      <span className="text-[10px] font-body uppercase">{date.toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                      <span className="text-lg font-display font-bold mt-0.5">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <label className="label">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const available = availableSlots.length === 0 || availableSlots.includes(slot);
                    return (
                      <button key={slot} disabled={!available} onClick={() => setSelectedTime(slot)}
                        className={clsx("py-2.5 rounded-xl text-xs font-body font-medium border transition-all",
                          !available && "opacity-30 cursor-not-allowed bg-[#1a1210] border-orange-900/10 text-dark-600",
                          available && selectedTime === slot && "bg-orange-500 border-orange-500 text-white",
                          available && selectedTime !== slot && "bg-[#1a1210] border-orange-900/20 text-dark-300 hover:border-orange-900/40")}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="label">Observações (opcional)</label>
              <textarea className="input-field resize-none h-20 pt-3" placeholder="Ex: prefiro mais curto nas laterais..."
                value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <button onClick={handleBooking} disabled={!selectedDate || !selectedTime || booking}
              className="btn-primary flex items-center justify-center gap-2">
              {booking ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><CheckCircle2 className="w-4 h-4" />Confirmar e pagar R${selectedService.price}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
