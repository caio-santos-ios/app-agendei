"use client";

import { useState, useEffect } from "react";
import { Favorite } from "@/types";
import { favoritesService } from "@/services/extendedServices";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesService.getMyFavorites()
      .then(setFavorites)
      .catch(() => toast.error("Erro ao carregar favoritos"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (providerId: string) => {
    try {
      await favoritesService.removeFavorite(providerId);
      setFavorites(prev => prev.filter(f => f.providerId !== providerId));
      toast.success("Removido dos favoritos");
    } catch { toast.error("Erro ao remover"); }
  };

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-dark-50">Favoritos</h1>
            <p className="text-xs text-dark-400 font-body">{favorites.length} profissional(is) salvo(s)</p>
          </div>
        </div>
      </div>

      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💔</p>
            <p className="text-dark-300 font-body font-medium">Nenhum favorito ainda</p>
            <p className="text-dark-500 text-sm font-body mt-1 mb-5">Salve seus profissionais preferidos</p>
            <Link href="/search" className="btn-primary w-auto inline-flex items-center gap-2 px-8">
              Buscar profissionais
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav, i) => (
              <div key={fav.id} className="relative" style={{ animation: `fadeUp 0.35s ${i * 0.07}s ease both` }}>
                <ProviderCard provider={fav.provider} variant="compact" />
                <button
                  onClick={() => handleRemove(fav.providerId)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors z-10"
                >
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
