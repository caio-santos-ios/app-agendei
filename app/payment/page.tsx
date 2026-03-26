"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentMethod, Payment } from "@/types";
import { paymentService } from "@/services/extendedServices";
import { Smartphone, CreditCard, Banknote, Copy, Check, Loader2, ChevronLeft, CheckCircle2, RefreshCw } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

type Step = "choose" | "pix" | "card" | "success";

const MOCK_PIX_CODE = "00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540555.005802BR5913Agendei6006Ilheus62070503***6304A1B2";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    }>
      <PaymentPageInner />
    </Suspense>
  );
}

function PaymentPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const appointmentId = params.get("appointmentId") || "apt1";
  const amount = Number(params.get("amount") || "55");
  const serviceName = params.get("service") || "Corte + Barba";

  const [step, setStep] = useState<Step>("choose");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [pixStatus, setPixStatus] = useState<"waiting" | "confirmed">("waiting");

  const handleChooseMethod = async (m: PaymentMethod) => {
    setMethod(m);
    setLoading(true);
    try {
      const p = await paymentService.createPayment({ appointmentId, method: m });
      setPayment(p);
      setStep(m === "pix" ? "pix" : "card");
    } catch { toast.error("Erro ao iniciar pagamento"); }
    finally { setLoading(false); }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(MOCK_PIX_CODE);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePix = () => {
    setPixStatus("confirmed");
    setTimeout(() => setStep("success"), 1200);
  };

  const handleCardPay = () => {
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      toast.error("Preencha todos os dados do cartão"); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 1500);
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (v: string) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

  return (
    <div className="min-h-dvh page-enter">
      {step !== "success" && (
        <button onClick={() => step === "choose" ? router.back() : setStep("choose")}
          className="fixed top-12 left-5 z-30 w-10 h-10 rounded-xl bg-[#1a1210]/80 backdrop-blur-sm border border-orange-900/20 flex items-center justify-center text-dark-300">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark-50">Pagamento confirmado!</h2>
            <p className="text-dark-400 text-sm font-body mt-2">R${amount.toFixed(2)} pago com sucesso via {method === "pix" ? "Pix" : "Cartão"}</p>
            <p className="text-xs text-dark-600 font-mono mt-2">{payment?.id}</p>
            <button onClick={() => router.push("/appointments")} className="btn-primary mt-8">Ver meus agendamentos</button>
          </div>
        </div>
      )}

      {/* Choose method */}
      {step === "choose" && (
        <div className="px-5 pt-20 pb-10">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-dark-50">Pagamento</h1>
            <p className="text-dark-400 text-sm font-body mt-1">{serviceName}</p>
          </div>
          <div className="card p-5 text-center mb-6 bg-orange-500/5 border-orange-500/15">
            <p className="text-xs text-dark-500 font-body mb-1">Total a pagar</p>
            <p className="font-display text-4xl font-bold text-orange-400">R${amount.toFixed(2)}</p>
          </div>
          <p className="label mb-3">Escolha como pagar</p>
          <div className="space-y-3">
            {([
              { method: "pix" as PaymentMethod, icon: <Smartphone className="w-5 h-5" />, label: "Pix", desc: "Aprovação instantânea", badge: "Recomendado" },
              { method: "credit_card" as PaymentMethod, icon: <CreditCard className="w-5 h-5" />, label: "Cartão de crédito", desc: "Parcelamento disponível" },
              { method: "debit_card" as PaymentMethod, icon: <CreditCard className="w-5 h-5" />, label: "Cartão de débito", desc: "Débito direto" },
              { method: "cash" as PaymentMethod, icon: <Banknote className="w-5 h-5" />, label: "Dinheiro", desc: "Pagar no local" },
            ]).map(({ method: m, icon, label, desc, badge }) => (
              <button key={m} onClick={() => handleChooseMethod(m)} disabled={loading}
                className="card-hover w-full p-4 flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 flex-shrink-0">{icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-dark-50 font-body">{label}</p>
                    {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-body">{badge}</span>}
                  </div>
                  <p className="text-xs text-dark-500 font-body mt-0.5">{desc}</p>
                </div>
                {loading && method === m ? <Loader2 className="w-4 h-4 text-orange-400 animate-spin" /> : <span className="text-dark-600 text-lg">›</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pix */}
      {step === "pix" && (
        <div className="px-5 pt-20 pb-10">
          <h1 className="font-display text-2xl font-bold text-dark-50 mb-1">Pagar com Pix</h1>
          <p className="text-dark-400 text-sm font-body mb-6">Escaneie o QR Code ou copie o código</p>
          <div className="card p-6 flex flex-col items-center mb-5">
            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="grid grid-cols-8 gap-0.5 w-full h-full p-2">
                {Array.from({ length: 64 }, (_, i) => (
                  <div key={i} className={clsx("rounded-sm", (i * 7 + i) % 3 === 0 ? "bg-dark-950" : "bg-transparent")} />
                ))}
              </div>
              {pixStatus === "confirmed" && (
                <div className="absolute inset-0 bg-emerald-500/90 flex items-center justify-center rounded-2xl">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-dark-500 font-body text-center">Válido por <span className="text-orange-400 font-medium">30 minutos</span></p>
          </div>
          <div className="card p-4 mb-4">
            <p className="text-xs text-dark-500 font-body mb-2">Código Pix Copia e Cola</p>
            <p className="text-xs text-dark-400 font-mono break-all leading-relaxed line-clamp-3">{MOCK_PIX_CODE}</p>
            <button onClick={handleCopyPix}
              className="mt-3 flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 font-body transition-colors">
              {copied ? <><Check className="w-3.5 h-3.5" />Copiado!</> : <><Copy className="w-3.5 h-3.5" />Copiar código</>}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-dark-500 font-body mb-6">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            {pixStatus === "waiting" ? "Aguardando pagamento..." : "Pagamento confirmado!"}
          </div>
          <button onClick={handleSimulatePix} className="btn-secondary text-xs py-3">
            🧪 Simular pagamento confirmado (mock)
          </button>
        </div>
      )}

      {/* Card */}
      {step === "card" && (
        <div className="px-5 pt-20 pb-10">
          <h1 className="font-display text-2xl font-bold text-dark-50 mb-1">Dados do cartão</h1>
          <p className="text-dark-400 text-sm font-body mb-6">R${amount.toFixed(2)} · {serviceName}</p>
          <div className="space-y-4 mb-6">
            <div>
              <label className="label">Número do cartão</label>
              <input className="input-field font-mono" placeholder="0000 0000 0000 0000"
                value={cardForm.number} onChange={e => setCardForm(f => ({ ...f, number: formatCard(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Nome no cartão</label>
              <input className="input-field uppercase" placeholder="NOME SOBRENOME"
                value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value.toUpperCase() }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Validade</label>
                <input className="input-field font-mono" placeholder="MM/AA"
                  value={cardForm.expiry} onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))} />
              </div>
              <div>
                <label className="label">CVV</label>
                <input className="input-field font-mono" placeholder="000" maxLength={4}
                  value={cardForm.cvv} onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
              </div>
            </div>
          </div>
          <button onClick={handleCardPay} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" />Pagar R${amount.toFixed(2)}</>}
          </button>
          <p className="text-center text-xs text-dark-600 font-body mt-4">🔒 Pagamento seguro e criptografado</p>
        </div>
      )}
    </div>
  );
}