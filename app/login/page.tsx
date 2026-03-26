"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Eye, EyeOff, Scissors, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    try {
      await login({ email, password });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden noise">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-900/10 blur-[100px]" />
        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        {/* Logo */}
        <div
          className="flex flex-col items-center mb-12"
          style={{ animation: "fadeUp 0.6s ease forwards" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 relative">
            <Scissors className="w-7 h-7 text-orange-400" />
            <div className="absolute inset-0 rounded-2xl bg-orange-500/5 blur-md" />
          </div>
          <h1 className="font-display text-4xl font-bold text-dark-50 tracking-tight">
            agendei
          </h1>
          <p className="text-dark-400 text-sm mt-1.5 font-body">
            Serviços na palma da mão
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-sm"
          style={{ animation: "fadeUp 0.6s 0.15s ease both" }}
        >
          <div className="card p-7">
            <div className="mb-7">
              <h2 className="font-display text-2xl text-dark-50 font-semibold">
                Bem-vindo de volta
              </h2>
              <p className="text-dark-400 text-sm mt-1 font-body">
                Entre na sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-400/70 hover:text-orange-400 transition-colors font-body"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-900/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#261914] px-3 text-xs text-dark-500 font-body">
                  ou continue com
                </span>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail("joao@email.com"); setPassword("123456"); }}
                className="btn-secondary text-xs py-2.5"
              >
                Demo Cliente
              </button>
              <button
                onClick={() => { setEmail("carlos@email.com"); setPassword("123456"); }}
                className="btn-secondary text-xs py-2.5"
              >
                Demo Prestador
              </button>
            </div>
          </div>

          <p className="text-center text-dark-400 text-sm mt-6 font-body">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
