"use client";

import { useState, useEffect } from "react";
import { Service, ServiceCategory } from "@/types";
import { providerServicesService } from "@/services/extendedServices";
import { BottomNav } from "@/components/layout/BottomNav";
import { SERVICE_CATEGORIES } from "@/lib/mockData";
import { Plus, Pencil, Trash2, Clock, DollarSign, X, Loader2, Check } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const EMPTY_FORM = { name: "", description: "", price: "", duration: "", category: "barber" as ServiceCategory };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    providerServicesService.getMyServices()
      .then(setServices)
      .catch(() => toast.error("Erro ao carregar serviços"))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (svc: Service) => {
    setForm({ name: svc.name, description: svc.description, price: String(svc.price), duration: String(svc.duration), category: svc.category });
    setEditingId(svc.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) { toast.error("Preencha todos os campos"); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price: Number(form.price), duration: Number(form.duration), category: form.category };
      if (editingId) {
        const updated = await providerServicesService.updateService(editingId, payload);
        setServices(prev => prev.map(s => s.id === editingId ? updated : s));
        toast.success("Serviço atualizado!");
      } else {
        const created = await providerServicesService.createService(payload);
        setServices(prev => [...prev, created]);
        toast.success("Serviço criado!");
      }
      setShowModal(false);
    } catch { toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await providerServicesService.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Serviço removido");
    } catch { toast.error("Erro ao remover"); }
    finally { setDeletingId(null); }
  };

  const cat = (id: ServiceCategory) => SERVICE_CATEGORIES.find(c => c.id === id);

  return (
    <div className="min-h-dvh pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-orange-400/70 font-body uppercase tracking-wider">Prestador</p>
          <h1 className="font-display text-2xl font-semibold text-dark-50 mt-0.5">Meus Serviços</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-400 rounded-xl text-white text-sm font-medium font-body transition-colors">
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      <div className="px-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">✂️</p>
            <p className="text-dark-300 font-body font-medium">Nenhum serviço cadastrado</p>
            <button onClick={openCreate} className="btn-primary mt-4 w-auto px-8">Adicionar serviço</button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((svc, i) => {
              const category = cat(svc.category);
              return (
                <div key={svc.id} className="card p-4" style={{ animation: `fadeUp 0.35s ${i * 0.06}s ease both` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${category?.color}15`, border: `1px solid ${category?.color}25` }}>
                      {category?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-dark-50 font-body">{svc.name}</h3>
                          <p className="text-xs text-dark-500 font-body mt-0.5 line-clamp-1">{svc.description}</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => openEdit(svc)} className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 hover:bg-orange-500/20 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(svc.id)} disabled={deletingId === svc.id}
                            className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                            {deletingId === svc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-orange-400 font-body font-medium">
                          <DollarSign className="w-3 h-3" /> R${svc.price}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-dark-500 font-body">
                          <Clock className="w-3 h-3" /> {svc.duration}min
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-body"
                          style={{ background: `${category?.color}15`, color: category?.color }}>
                          {category?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-[#1e1410] border border-orange-900/20 rounded-t-3xl p-6"
            style={{ animation: "fadeUp 0.3s ease forwards" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-dark-50">
                {editingId ? "Editar Serviço" : "Novo Serviço"}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Categoria</label>
                <div className="grid grid-cols-4 gap-2">
                  {SERVICE_CATEGORIES.slice(0, 4).map(c => (
                    <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id as ServiceCategory }))}
                      className={clsx("flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all",
                        form.category === c.id ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-orange-900/20 bg-[#1a1210] text-dark-500")}>
                      <span className="text-lg">{c.icon}</span>
                      <span className="font-body text-[10px]">{c.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {SERVICE_CATEGORIES.slice(4).map(c => (
                    <button key={c.id} type="button" onClick={() => setForm(f => ({ ...f, category: c.id as ServiceCategory }))}
                      className={clsx("flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all",
                        form.category === c.id ? "border-orange-500/60 bg-orange-500/10 text-orange-400" : "border-orange-900/20 bg-[#1a1210] text-dark-500")}>
                      <span className="text-lg">{c.icon}</span>
                      <span className="font-body text-[10px]">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Nome do serviço</label>
                <input className="input-field" placeholder="Ex: Corte + Barba" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Descrição</label>
                <input className="input-field" placeholder="Breve descrição..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Preço (R$)</label>
                  <input type="number" className="input-field" placeholder="0,00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Duração (min)</label>
                  <input type="number" className="input-field" placeholder="30" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" />{editingId ? "Salvar alterações" : "Criar serviço"}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
