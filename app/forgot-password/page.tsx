"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, ArrowRight, Loader2, ChevronLeft, Mail, KeyRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";
import clsx from "clsx";

type Step = "email" | "code" | "newPassword" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Informe seu email"); return; }
    setLoading(true);
    try {
      // await authService.forgotPassword(email);
      // toast.success("Código enviado! Verifique seu email.");
      // setStep("code");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) { toast.error("Digite o código completo"); return; }
    setLoading(true);
    try {
      // await authService.verifyResetCode(email, fullCode);
      // setStep("newPassword");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Código inválido ou expirado");
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Senha deve ter ao menos 6 caracteres"); return; }
    if (password !== confirmPassword) { toast.error("As senhas não coincidem"); return; }
    setLoading(true);
    try {
      // await authService.resetPassword(email, code.join(""), password);
      // setStep("success");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  const STEPS_META = {
    email: { index: 1, title: "Esqueceu a senha?", subtitle: "Informe seu email para receber o código de recuperação" },
    code: { index: 2, title: "Verifique seu email", subtitle: `Enviamos um código de 6 dígitos para ${email}` },
    newPassword: { index: 3, title: "Nova senha", subtitle: "Crie uma senha segura para sua conta" },
    success: { index: 3, title: "", subtitle: "" },
  };

  const meta = STEPS_META[step];

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden noise">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-900/10 blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-sm" style={{ animation: "fadeUp 0.5s 0.1s ease both" }}>

          {step === "success" ? (
            <div className="card p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-dark-50">Senha redefinida!</h2>
              <p className="text-sm text-dark-400 font-body mt-2 leading-relaxed">
                Sua senha foi atualizada com sucesso. Agora você pode entrar na sua conta.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="btn-primary mt-7 flex items-center justify-center gap-2"
              >
                Ir para o login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="card p-7">
              <div className="flex items-center gap-3 mb-7">
                {step !== "email" && (
                  <button
                    onClick={() => setStep(step === "code" ? "email" : "code")}
                    className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 hover:bg-orange-500/20 transition-colors flex-shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="flex-1">
                  <h2 className="font-display text-xl text-dark-50 font-semibold">{meta.title}</h2>
                  <p className="text-xs text-dark-400 font-body mt-1 leading-relaxed">{meta.subtitle}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 self-start mt-1">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={clsx(
                        "h-1.5 rounded-full transition-all duration-300",
                        meta.index >= s ? "bg-orange-500 w-5" : "bg-dark-700 w-1.5"
                      )}
                    />
                  ))}
                </div>
              </div>

              {step === "email" && (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="label">Email cadastrado</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                      <input
                        type="email"
                        className="input-field pl-11"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar código <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}

              {step === "code" && (
                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div>
                    <label className="label">Código de 6 dígitos</label>
                    <div className="flex gap-2 justify-between">
                      {code.map((digit, i) => (
                        <input
                          key={i}
                          id={`code-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(i, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(i, e)}
                          className={clsx(
                            "w-11 h-13 text-center text-lg font-display font-bold rounded-xl border transition-all",
                            "bg-[#1a1210] focus:outline-none",
                            digit
                              ? "border-orange-500/50 text-orange-400"
                              : "border-orange-900/20 text-dark-50",
                            "focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
                          )}
                          style={{ height: "52px" }}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || code.join("").length < 6}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verificar código <ArrowRight className="w-4 h-4" /></>}
                  </button>

                  <p className="text-center text-xs text-dark-500 font-body">
                    Não recebeu?{" "}
                    <button
                      type="button"
                      onClick={() => { setCode(["","","","","",""]); handleSendEmail({ preventDefault: () => {} } as any); }}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Reenviar código
                    </button>
                  </p>
                </form>
              )}

              {step === "newPassword" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="label">Nova senha</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                      <input
                        type={showPass ? "text" : "password"}
                        className="input-field pl-11 pr-12"
                        placeholder="Mín. 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Confirmar nova senha</label>
                    <input
                      type={showPass ? "text" : "password"}
                      className="input-field"
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {password && (
                    <div className="flex gap-1.5">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={clsx(
                            "h-1 flex-1 rounded-full transition-colors",
                            password.length > i * 3
                              ? password.length >= 10 ? "bg-emerald-500" : "bg-orange-500"
                              : "bg-dark-800"
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {confirmPassword && (
                    <p className={clsx("text-xs font-body flex items-center gap-1.5", password === confirmPassword ? "text-emerald-400" : "text-red-400")}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", password === confirmPassword ? "bg-emerald-400" : "bg-red-400")} />
                      {password === confirmPassword ? "Senhas coincidem" : "Senhas não coincidem"}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Redefinir senha <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-dark-400 text-sm mt-6 font-body">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
