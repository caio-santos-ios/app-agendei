"use client";

import { useState, useEffect, useCallback } from "react";
import { Provider, ServiceCategory } from "@/types";
import { providerService } from "@/services/appointmentService";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await providerService.getProviders(category ?? undefined, query);
      setProviders(res.data);
    } catch {
      toast.error("Erro ao buscar profissionais");
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    const timer = setTimeout(fetchProviders, 400);
    return () => clearTimeout(timer);
  }, [fetchProviders]);

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1a1210]/95 backdrop-blur-xl border-b border-orange-900/10 px-5 pt-12 pb-4">
        <h1 className="font-display text-xl font-semibold text-dark-50 mb-3">Buscar Serviços</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              className="input-field pl-11 pr-10"
              placeholder="Ex: corte de cabelo, manicure..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx(
              "w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all",
              showFilters || category
                ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                : "bg-[#261914] border-orange-900/20 text-dark-400"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category filter */}
        {showFilters && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory(null)}
              className={clsx(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium border transition-all",
                !category
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-[#261914] border-orange-900/20 text-dark-400"
              )}
            >
              Todos
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id === category ? null : cat.id as ServiceCategory)}
                className={clsx(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body font-medium border transition-all",
                  category === cat.id
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-[#261914] border-orange-900/20 text-dark-400 hover:border-orange-900/40"
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-5 mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-dark-300 font-body font-medium">Nenhum resultado</p>
            <p className="text-dark-500 text-sm font-body mt-1">Tente outros termos ou categorias</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-dark-500 font-body mb-4">
              {providers.length} profissional{providers.length !== 1 ? "is" : ""} encontrado{providers.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {providers.map((provider, i) => (
                <div key={provider.id} style={{ animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}>
                  <ProviderCard provider={provider} variant="full" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
