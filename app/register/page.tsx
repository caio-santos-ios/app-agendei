"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Eye, EyeOff, Scissors, ArrowRight, Loader2, User, Briefcase, ChevronLeft } from "lucide-react";
import { UserRole } from "@/types";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>("client");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Preencha todos os campos");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) {
      toast.error("Preencha a senha");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Senha deve ter ao menos 6 caracteres");
      return;
    }
    try {
      await register({ ...form, role });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao criar conta");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden noise">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-900/8 blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 relative z-10">
        {/* Header */}
        {/* <div className="flex flex-col items-center mb-10" style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6 text-orange-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-dark-50">agendei</h1>
        </div> */}

        <div className="w-full max-w-sm" style={{ animation: "fadeUp 0.5s 0.1s ease both" }}>
          <div className="card p-7">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-7">
              {step > 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 hover:bg-orange-500/20 transition-colors mr-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <p className="text-xs text-dark-500 font-body mb-1">
                  Passo {step} de 2
                </p>
                <h2 className="font-display text-xl text-dark-50 font-semibold">
                  {step === 1 ? "Criar sua conta" : "Definir senha"}
                </h2>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className={clsx("w-8 h-1.5 rounded-full transition-colors", step >= 1 ? "bg-orange-500" : "bg-dark-700")} />
                <div className={clsx("w-8 h-1.5 rounded-full transition-colors", step >= 2 ? "bg-orange-500" : "bg-dark-700")} />
              </div>
            </div>

            {/* Step 1: Role + Info */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-4">
                {/* Role selector */}
                <div>
                  <label className="label">Tipo de conta</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={clsx(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                        role === "client"
                          ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                          : "border-orange-900/20 bg-[#1a1210] text-dark-400 hover:border-orange-900/40"
                      )}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-xs font-medium font-body">Cliente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("provider")}
                      className={clsx(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                        role === "provider"
                          ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                          : "border-orange-900/20 bg-[#1a1210] text-dark-400 hover:border-orange-900/40"
                      )}
                    >
                      <Briefcase className="w-5 h-5" />
                      <span className="text-xs font-medium font-body">Prestador</span>
                    </button>
                  </div>
                  <p className="text-xs text-dark-500 mt-2 font-body">
                    {role === "client"
                      ? "Agende serviços com os melhores profissionais"
                      : "Gerencie sua agenda e atenda mais clientes"}
                  </p>
                </div>

                <div>
                  <label className="label">Nome completo</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="(00) 99999-0000"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="card p-3 flex items-center gap-3 bg-orange-500/5 border-orange-500/15">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-sm">
                    {role === "client" ? "👤" : "💼"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-dark-50 font-body">{form.name}</p>
                    <p className="text-xs text-dark-400 font-body">{form.email}</p>
                  </div>
                </div>

                <div>
                  <label className="label">Criar senha</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="input-field pr-12"
                      placeholder="Mín. 6 caracteres"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Confirmar senha</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field"
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                </div>

                {/* Password strength indicator */}
                {form.password && (
                  <div className="flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "h-1 flex-1 rounded-full transition-colors",
                          form.password.length > i * 3
                            ? form.password.length >= 10 ? "bg-emerald-500" : "bg-orange-500"
                            : "bg-dark-800"
                        )}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Criar conta <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-dark-400 text-sm mt-6 font-body">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
