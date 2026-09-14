"use client";

import { useState } from "react";
import { Save, Store, Truck, CreditCard, Bell, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simuler une sauvegarde
    setTimeout(() => {
      toast.success("Paramètres enregistrés avec succès.");
      setSaving(false);
    }, 600);
  };

  const tabs = [
    { id: "general", label: "Général", icon: Store },
    { id: "livraison", label: "Livraison", icon: Truck },
    { id: "paiement", label: "Paiements", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "securite", label: "Sécurité", icon: Lock },
  ];

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Paramètres de la boutique</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Gérez la configuration générale, la livraison et vos préférences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation des onglets (Sidebar sur Desktop) */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", active ? "text-slate-900" : "text-slate-400")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {activeTab === "general" && (
              <div className="p-6 flex flex-col gap-6 animate-in fade-in">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Informations générales</h2>
                  <p className="text-sm text-slate-500">Ces informations seront visibles par vos clients.</p>
                </div>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Nom de la boutique</label>
                    <input type="text" defaultValue="La Boutique" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Description courte</label>
                    <textarea defaultValue="Boutique de vêtements, lingerie et accessoires." rows={3} className={cn(inputClass, "resize-none")} />
                  </div>
                  <div>
                    <label className={labelClass}>Email de contact</label>
                    <input type="email" defaultValue="contact@laboutique.sn" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone</label>
                    <input type="text" defaultValue="+221 77 123 45 67" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Adresse physique</label>
                    <input type="text" defaultValue="Dakar, Sénégal" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "livraison" && (
              <div className="p-6 flex flex-col gap-6 animate-in fade-in">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Zones et tarifs de livraison</h2>
                  <p className="text-sm text-slate-500">Configurez les frais de livraison pour Dakar et la banlieue.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-900">Dakar intra-muros</span>
                      <input type="number" defaultValue={2000} className="w-24 rounded border border-slate-200 px-2 py-1 text-sm text-right" />
                    </div>
                    <p className="text-xs text-slate-500">Livraison standard dans les quartiers de Dakar.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-900">Banlieue (Pikine, Guédiawaye, Rufisque...)</span>
                      <input type="number" defaultValue={3000} className="w-24 rounded border border-slate-200 px-2 py-1 text-sm text-right" />
                    </div>
                    <p className="text-xs text-slate-500">Frais majorés pour la banlieue.</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-900">Régions</span>
                      <input type="number" defaultValue={5000} className="w-24 rounded border border-slate-200 px-2 py-1 text-sm text-right" />
                    </div>
                    <p className="text-xs text-slate-500">Expédition via transporteur (ex: Sept places).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglets non implémentés complètement pour la V1 mockée */}
            {["paiement", "notifications", "securite"].includes(activeTab) && (
              <div className="p-6 flex flex-col items-center justify-center text-center py-20 animate-in fade-in">
                <div className="rounded-full bg-slate-100 p-3 mb-4">
                  <Store className="h-6 w-6 text-slate-400" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-1">Bientôt disponible</h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  Cette section de paramètres sera activée dans la prochaine version (V2) lors de la connexion au backend réel.
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 bg-slate-50 p-6 flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60 transition-colors"
              >
                <Save className="h-4 w-4" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
