"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Calendar } from "lucide-react";

// Données mockées pour les statistiques avancées
const monthlySales = [
  { mois: "Jan", CA: 15000000, commandes: 420 },
  { mois: "Fév", CA: 18000000, commandes: 485 },
  { mois: "Mar", CA: 16500000, commandes: 450 },
  { mois: "Avr", CA: 22000000, commandes: 590 },
  { mois: "Mai", CA: 25000000, commandes: 650 },
  { mois: "Juin", CA: 21000000, commandes: 540 },
  { mois: "Jui", CA: 19000000, commandes: 510 },
  { mois: "Aoû", CA: 17500000, commandes: 480 },
  { mois: "Sep", CA: 26000000, commandes: 710 }, // Mois en cours
];

const categoryDistribution = [
  { name: "Vêtements", value: 45 },
  { name: "Lingerie", value: 25 },
  { name: "Linge de maison", value: 15 },
  { name: "Encens & parfums", value: 10 },
  { name: "Accessoires", value: 5 },
];

const COLORS = ["#0f172a", "#334155", "#475569", "#64748b", "#94a3b8"];

const topProducts = [
  { name: "Robe wax manches longues", ventes: 124, ca: 3100000 },
  { name: "Parure drap lin lavé sable", ventes: 89, ca: 2225000 },
  { name: "Ensemble dentelle bordeaux", ventes: 112, ca: 2016000 },
  { name: "Coffret encens santal", ventes: 156, ca: 1170000 },
  { name: "Sac cabas raphia", ventes: 64, ca: 960000 },
];

function formatFCFA(value: number) {
  return value.toLocaleString("fr-FR") + " F";
}

export default function StatistiquesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Statistiques détaillées</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Analysez les performances de votre boutique sur l&apos;année.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          Année 2026
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CA Évolution annuelle */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-semibold text-slate-700">Évolution du Chiffre d'Affaires</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="mois" 
                  tick={{ fontSize: 12, fill: "#64748b" }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: "#64748b" }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(v: any) => [formatFCFA(v), "Chiffre d'affaires"]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="CA" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorCA)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commandes par mois */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-6 text-sm font-semibold text-slate-700">Volume de commandes</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="commandes" fill="#334155" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Répartition du CA par catégorie</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v: any) => [`${v}%`, "Part du CA"]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 text-xs ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Produits */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-700">Top 5 des produits les plus vendus</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Produit</th>
                <th className="px-5 py-3 font-semibold">Unités vendues</th>
                <th className="px-5 py-3 font-semibold">CA généré</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {topProducts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-5 py-3 text-slate-600">{p.ventes}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{formatFCFA(p.ca)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
