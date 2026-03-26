"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { reviewService } from "@/services/extendedServices";
import { mockProviders } from "@/lib/mockData";
import { Star, Send, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const QUICK_COMMENTS = [
  "Atendimento excelente! 🌟",
  "Muito cuidadoso e atencioso",
  "Ambiente limpo e confortável",
  "Ficou exatamente como eu queria",
  "Super pontual e profissional",
  "Vou voltar com certeza! 👏",
];

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    }>
      <ReviewPageInner />
    </Suspense>
  );
}

function ReviewPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const appointmentId = params.get("appointmentId") || "apt3";
  const providerId = params.get("providerId") || "prov3";

  const provider = mockProviders.find(p => p.id === providerId) || mockProviders[2];
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const ratingLabels = ["", "Ruim 😕", "Regular 😐", "Bom 😊", "Ótimo 😄", "Excelente 🤩"];

  const handleSubmit = async () => {
    if (!rating) { toast.error("Dê uma avaliação para continuar"); return; }
    setLoading(true);
    try {
      await reviewService.createReview({ appointmentId, providerId, rating, comment });
      setDone(true);
    } catch { toast.error("Erro ao enviar avaliação"); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 page-enter">
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-dark-50">Avaliação enviada!</h2>
          <p className="text-dark-400 text-sm font-body mt-2 leading-relaxed">
            Obrigado pelo seu feedback. Ele ajuda outros clientes a encontrar os melhores profissionais.
          </p>
          <div className="flex gap-1 mt-4">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={clsx("w-7 h-7", s <= rating ? "fill-amber-400 text-amber-400" : "text-dark-700")} />
            ))}
          </div>
          <button onClick={() => router.push("/home")} className="btn-primary mt-8">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh page-enter">
      <button onClick={() => router.back()} className="fixed top-12 left-5 z-30 w-10 h-10 rounded-xl bg-[#1a1210]/80 backdrop-blur-sm border border-orange-900/20 flex items-center justify-center text-dark-300">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="px-5 pt-20 pb-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-4xl mb-4">
            ✂️
          </div>
          <h1 className="font-display text-2xl font-bold text-dark-50">{provider.name}</h1>
          <p className="text-dark-400 text-sm font-body mt-1">Como foi seu atendimento?</p>
        </div>

        {/* Star rating */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-3 mb-2">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="transition-transform active:scale-90"
                style={{ transform: (hovered || rating) >= s ? "scale(1.15)" : "scale(1)" }}
              >
                <Star className={clsx("w-10 h-10 transition-colors duration-150",
                  (hovered || rating) >= s ? "fill-amber-400 text-amber-400" : "text-dark-700")} />
              </button>
            ))}
          </div>
          <p className="text-sm font-medium font-body text-dark-300 h-5 transition-all">
            {ratingLabels[hovered || rating]}
          </p>
        </div>

        {/* Quick comments */}
        <div className="mb-5">
          <p className="label mb-3">Sugestões rápidas</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMENTS.map(q => (
              <button key={q} onClick={() => setComment(prev => prev ? `${prev} ${q}` : q)}
                className="text-xs px-3 py-2 rounded-xl border border-orange-900/20 bg-[#261914] text-dark-300 hover:border-orange-500/30 hover:text-orange-400 transition-all font-body">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="label">Comentário (opcional)</label>
          <textarea className="input-field resize-none h-28 pt-3"
            placeholder="Conte sua experiência em detalhes..."
            value={comment} onChange={e => setComment(e.target.value)} maxLength={500} />
          <p className="text-xs text-dark-700 font-body text-right mt-1">{comment.length}/500</p>
        </div>

        <button onClick={handleSubmit} disabled={loading || !rating} className="btn-primary flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" />Enviar avaliação</>}
        </button>
      </div>
    </div>
  );
}