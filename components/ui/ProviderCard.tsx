"use client";

import Link from "next/link";
import { Provider } from "@/types";
import { Star, MapPin, Clock } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import clsx from "clsx";

interface ProviderCardProps {
  provider: Provider;
  variant?: "full" | "compact";
}

export function ProviderCard({ provider, variant = "full" }: ProviderCardProps) {
  const category = SERVICE_CATEGORIES.find((c) => c.id === provider.category);

  if (variant === "compact") {
    return (
      <Link href={`/providers/${provider.id}`} className="card-hover p-4 flex items-center gap-4 block">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${category?.color}15`, border: `1px solid ${category?.color}30` }}
          >
            {category?.icon}
          </div>
          {provider.isAvailableNow && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#261914] animate-pulse-soft" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-dark-50 font-body truncate">{provider.name}</h3>
          <p className="text-xs text-dark-400 font-body mt-0.5">{category?.label}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              {provider.rating}
            </span>
            {provider.distance && (
              <span className="flex items-center gap-1 text-xs text-dark-500">
                <MapPin className="w-3 h-3" />
                {provider.distance}km
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-dark-500 font-body">A partir de</p>
          <p className="text-sm font-semibold text-orange-400 font-body">
            R$ {Math.min(...provider.services.map((s) => s.price))}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/providers/${provider.id}`} className="card-hover block p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${category?.color}15`, border: `1px solid ${category?.color}25` }}
          >
            {category?.icon}
          </div>
          <div>
            <h3 className="font-medium text-dark-50 font-body text-sm leading-tight">{provider.name}</h3>
            <p className="text-xs text-dark-500 mt-0.5 font-body">{category?.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-amber-400">{provider.rating}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-dark-400 font-body line-clamp-2 leading-relaxed mb-3">
        {provider.bio}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-dark-500 font-body mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {provider.distance ? `${provider.distance}km` : "Sem distância"}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {provider.isAvailableNow ? (
            <span className="text-emerald-400">Disponível agora</span>
          ) : (
            <span>Indisponível</span>
          )}
        </span>
      </div>

      {/* Services preview */}
      <div className="flex gap-2 flex-wrap">
        {provider.services.slice(0, 2).map((service) => (
          <span
            key={service.id}
            className="text-[11px] font-body px-2.5 py-1 rounded-lg bg-orange-500/8 text-orange-400/80 border border-orange-500/10"
          >
            {service.name} · R${service.price}
          </span>
        ))}
        {provider.services.length > 2 && (
          <span className="text-[11px] font-body px-2.5 py-1 rounded-lg bg-dark-800/50 text-dark-500">
            +{provider.services.length - 2} mais
          </span>
        )}
      </div>
    </Link>
  );
}
