/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  Building,
  Truck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Calendar,
  FileCheck,
  CheckCircle,
  Clock,
  Thermometer,
  Droplet,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Leaf
} from "lucide-react";
import {
  Contact,
  Property,
  Supplier,
  Buyer,
  License,
  Area,
  Lot,
  Measurement,
  Task,
  FinancialRecord,
  SystemAlert,
  Visit,
  UserRole,
  LotStatus,
  FinanceCategory,
  FinanceType
} from "../types";

interface DashboardProps {
  contacts: Contact[];
  properties: Property[];
  suppliers: Supplier[];
  buyers: Buyer[];
  licenses: License[];
  areas: Area[];
  lots: Lot[];
  measurements: Measurement[];
  tasks: Task[];
  finance: FinancialRecord[];
  setFinance: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  alerts: SystemAlert[];
  visits: Visit[];
  userRole: UserRole;
  setAlerts: React.Dispatch<React.SetStateAction<SystemAlert[]>>;
  setActiveTab: (tab: string) => void;
  setSelectedLotCode: (code: string) => void;
  addAuditLog: (action: string, details: string) => void;
}

export default function Dashboard({
  contacts,
  properties,
  suppliers,
  buyers,
  licenses,
  areas,
  lots,
  measurements,
  tasks,
  finance,
  setFinance,
  alerts,
  visits,
  userRole,
  setAlerts,
  setActiveTab,
  setSelectedLotCode,
  addAuditLog
}: DashboardProps) {
  // Quick Field Survey Form states
  const [quickDesc, setQuickDesc] = useState("");
  const [quickCat, setQuickCat] = useState<FinanceCategory>(FinanceCategory.Advogado);
  const [quickVal, setQuickVal] = useState<number | "">("");
  const [quickCurr, setQuickCurr] = useState<"USD" | "PYG">("USD");
  const [quickPay, setQuickPay] = useState("Dinheiro");
  const [quickObs, setQuickObs] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleAddSurveyExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDesc || !quickVal) return;

    const newRecord: FinancialRecord = {
      id: "f-survey-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: FinanceType.Despesa,
      category: quickCat,
      description: `[Levantamento Paraguai] ${quickDesc}`,
      value: Number(quickVal),
      currency: quickCurr,
      paymentMethod: quickPay,
      status: "Pago",
      observations: quickObs || "Lançamento em tempo real efetuado no levantamento de custos de campo no Paraguai."
    };

    setFinance(prev => [newRecord, ...prev]);
    addAuditLog("Levantamento de Custos Paraguai", `Registrado: ${newRecord.description} - ${newRecord.currency} ${newRecord.value}`);
    
    setQuickDesc("");
    setQuickVal("");
    setQuickObs("");
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Stats calculations
  const totalContacts = contacts.length;
  const activeSuppliers = suppliers.length;
  const activeBuyers = buyers.filter(b => b.status === "Interessado" || b.status === "Potencial Parceiro" || b.status === "Contrato em Negociação").length;
  
  const propertiesApproved = properties.filter(p => p.status === "Aprovada").length;
  const propertiesEvaluated = properties.length;

  const licensesPending = licenses.filter(l => l.status === "Protocolado" || l.status === "Em Análise").length;
  const licensesCompleted = licenses.filter(l => l.status === "Aprovado").length;
  const licensesTotal = licenses.length;

  const lotesAtivos = lots.filter(l => l.status !== "Vendido" && l.status !== "Descartado").length;
  const lotesColhidos = lots.filter(l => l.status === "Armazenado" || l.status === "Secagem" || l.status === "Vendido").length;

  const tarefasPendentes = tasks.filter(t => t.status === "Pendente" || t.status === "Em Andamento").length;
  const tarefasAtrasadas = tasks.filter(t => t.status === "Atrasada").length;

  // Finance calculations (USD based for uniform dashboard metrics, converting PYG on 1 USD = 7500 PYG)
  const usdToPyg = 7500;
  const totalInvestment = finance
    .filter(f => f.type === "Capital de Giro")
    .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / usdToPyg : curr.value), 0);

  const totalSpent = finance
    .filter(f => f.type === "Despesa Real")
    .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / usdToPyg : curr.value), 0);

  const totalRevenue = finance
    .filter(f => f.type === "Receita Real")
    .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / usdToPyg : curr.value), 0);

  const netBalance = totalInvestment - totalSpent + totalRevenue;

  // Handle Quick Alert Resolution
  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  // Visual Finance Chart percentages
  // Categories spent group
  const spentByCat: { [key: string]: number } = {};
  finance
    .filter(f => f.type === "Despesa Real")
    .forEach(f => {
      const val = f.currency === "PYG" ? f.value / usdToPyg : f.value;
      spentByCat[f.category] = (spentByCat[f.category] || 0) + val;
    });

  const categoriesData = Object.entries(spentByCat).map(([cat, val]) => ({
    category: cat,
    val: Math.round(val)
  })).sort((a, b) => b.val - a.val);

  const maxSpent = categoriesData.length > 0 ? categoriesData[0].val : 1;

  // Latest measurements quick status
  const latestM = measurements.length > 0 ? measurements[0] : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Leaf size={180} className="transform rotate-12 text-emerald-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3 border border-emerald-500/20">
              <Sparkles size={12} /> Operação Regulada • Paraguai
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-emerald-50">ViVerdetech</h1>
            <p className="mt-1 text-emerald-200 font-medium max-w-2xl text-sm md:text-base">
              “Cultivo, dados e rastreabilidade em uma única plataforma.” Gestão de compliance do campo ao comprador.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab("lotes")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
            >
              <Compass size={14} /> Rastrear Lotes
            </button>
            <button 
              onClick={() => setActiveTab("documentos")}
              className="bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck size={14} /> Auditoria Rápida
            </button>
          </div>
        </div>

        {/* Modular Expansion Indicator banner */}
        <div className="mt-6 pt-4 border-t border-emerald-700/40 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="font-bold">Implantação Modular:</span>
            <span className="bg-emerald-500/20 text-white px-2 py-0.5 rounded border border-emerald-500/30">Fase 1: 1.000m² (Estufa Ativa)</span>
            <span className="text-emerald-400">→</span>
            <span className="opacity-70">Fase 2: 2.500m²</span>
            <span className="text-emerald-400">→</span>
            <span className="opacity-70">Fase 3: 1 hectare (10.000m²)</span>
          </div>
          <div className="font-semibold text-emerald-300 bg-white/5 px-2 py-1 rounded">
            Perfil de Acesso: <span className="text-white underline">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      {activeAlertsCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
          <div className="flex gap-3">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-lg shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Controle de Segurança & Alertas Críticos ({activeAlertsCount})</h4>
              <p className="text-xs text-amber-700 mt-0.5 max-w-3xl">
                {alerts.find(a => !a.resolved)?.description || "Há pendências críticas de segurança ou documentação para vistorias SENAD."}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => resolveAlert(alerts.find(a => !a.resolved)?.id || "")}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Marcar como Resolvido
            </button>
            <button 
              onClick={() => setActiveTab("licencas")}
              className="bg-white hover:bg-[#F8FAF9] text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}

      {/* Key Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Contacts KPI */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">CRM / Contatos</span>
            <span className="text-2xl font-bold text-emerald-900 block">{totalContacts}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp size={12} /> {activeSuppliers} forn. • {activeBuyers} comp.
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg">
            <Users size={22} />
          </div>
        </div>

        {/* Properties Approved KPI */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Chácaras / Imóveis</span>
            <span className="text-2xl font-bold text-emerald-900 block">{propertiesApproved} / {propertiesEvaluated}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle size={12} /> 1 Aprovada (1.2ha)
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg">
            <Building size={22} />
          </div>
        </div>

        {/* Licenses and Compliance KPI */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Licenças e RUC</span>
            <span className="text-2xl font-bold text-emerald-900 block">{licensesCompleted} / {licensesTotal}</span>
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Clock size={12} /> {licensesPending} em andamento
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg">
            <FileCheck size={22} />
          </div>
        </div>

        {/* Budget KPI */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Saldo de Caixa</span>
            <span className="text-2xl font-bold text-emerald-900 block">
              ${netBalance.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-stone-500 font-medium block">
              Gasto: ${totalSpent.toLocaleString("en-US", { maximumFractionDigits: 0 })} / Giro: ${totalInvestment.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="bg-stone-50 text-stone-700 p-3 rounded-lg">
            <TrendingUp size={22} className={netBalance > 5000 ? "text-emerald-600" : "text-amber-600"} />
          </div>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Charts and Operations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Cultivations and Sensors */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="text-emerald-600" size={18} />
                <h3 className="font-bold text-emerald-900 text-sm">Lotes Ativos e Telemetria de Campo</h3>
              </div>
              <button 
                onClick={() => setActiveTab("lotes")}
                className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Gerenciar Lotes <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lots card */}
              {lots.map(l => (
                <div key={l.id} className="border border-emerald-50 rounded-xl p-4 bg-emerald-50/10 hover:border-emerald-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {l.code}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        l.status === LotStatus.Vegetativo ? "bg-blue-100 text-blue-700" :
                        l.status === LotStatus.Floracao ? "bg-purple-100 text-purple-700" :
                        l.status === LotStatus.Vendido ? "bg-emerald-100 text-emerald-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {l.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-emerald-900 text-sm mt-2">{l.crop}</h4>
                    <p className="text-xs text-stone-500">{l.variety}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-100/60 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Plantação:</span>
                        <span className="font-semibold text-stone-700">{l.plantingDate}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase">Prev. Colheita:</span>
                        <span className="font-semibold text-stone-700">{l.estimatedHarvestDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedLotCode(l.code);
                        setActiveTab("lotes");
                      }}
                      className="bg-white hover:bg-stone-50 border border-emerald-100 text-stone-700 text-[11px] font-bold py-1.5 px-3 rounded-lg grow transition-all cursor-pointer"
                    >
                      QR Code & Rastreabilidade
                    </button>
                    {l.status !== "Vendido" && (
                      <button 
                        onClick={() => setActiveTab("medicoes")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Thermometer size={12} /> Sensores
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Live Telemetry Sensor Bar */}
            {latestM && (
              <div className="mt-4 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-900">Sensores IoT Online (Último Registro)</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Thermometer size={14} className="text-red-500" /> {latestM.temperature}ºC
                  </span>
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Droplet size={14} className="text-blue-500" /> {latestM.airHumidity}% Ar
                  </span>
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Droplet size={14} className="text-amber-600" /> {latestM.soilHumidity}% Solo
                  </span>
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <b className="text-emerald-700">pH:</b> {latestM.pH}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <b className="text-emerald-700">EC:</b> {latestM.EC}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Real Field Survey Costs Management (Paraguay) */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="text-emerald-600" size={18} />
                  <h3 className="font-bold text-emerald-900 text-sm">Levantamento de Custos em Campo (Missão Paraguai)</h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Preencha e catalogue despesas e orçamentos reais levantados diretamente em campo no Paraguai.</p>
              </div>
              <button 
                onClick={() => setActiveTab("financeiro")}
                className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                Ver Fluxo Completo <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Left Column: Input Form */}
              <form onSubmit={handleAddSurveyExpense} className="space-y-3 bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">Lançar Nova Despesa de Campo</span>
                
                {formSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-2.5 rounded-lg flex items-center gap-1.5 font-semibold">
                    <CheckCircle size={14} className="text-emerald-600" />
                    Lançamento de campo gravado e consolidado no fluxo!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Descrição Curta</label>
                    <input 
                      type="text" 
                      value={quickDesc}
                      onChange={(e) => setQuickDesc(e.target.value)}
                      placeholder="Ex: Aluguel Galpão, Táxi, Cartório"
                      required
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Categoria de Custo</label>
                    <select
                      value={quickCat}
                      onChange={(e) => setQuickCat(e.target.value as FinanceCategory)}
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs"
                    >
                      {Object.values(FinanceCategory).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Valor de Campo</label>
                    <input 
                      type="number" 
                      value={quickVal}
                      onChange={(e) => setQuickVal(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0.00"
                      required
                      min="0.1"
                      step="any"
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Moeda</label>
                    <select
                      value={quickCurr}
                      onChange={(e) => setQuickCurr(e.target.value as "USD" | "PYG")}
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PYG">PYG (₲)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Forma de Pagto</label>
                    <select
                      value={quickPay}
                      onChange={(e) => setQuickPay(e.target.value)}
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs"
                    >
                      <option value="Dinheiro">Dinheiro vivo</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Swift / PIX">Remessa / Swift</option>
                      <option value="Transferência Local">Transferência Banco Continental</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Notas adicionais</label>
                    <input 
                      type="text" 
                      value={quickObs}
                      onChange={(e) => setQuickObs(e.target.value)}
                      placeholder="Observações do local..."
                      className="w-full bg-white border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Gravar Custo no Levantamento Real
                </button>
              </form>

              {/* Right Column: List of logged survey expenditures */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block">Registros Recentes de Levantamento de Campo</span>
                  
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {finance.filter(f => f.description.includes("[Levantamento") || f.id.startsWith("f-survey-")).length === 0 ? (
                      <div className="text-center py-8 text-stone-400 text-xs italic bg-stone-50/20 rounded-xl border border-stone-100/60">
                        Nenhum custo real de levantamento lançado ainda. Use o formulário ao lado!
                      </div>
                    ) : (
                      finance
                        .filter(f => f.description.includes("[Levantamento") || f.id.startsWith("f-survey-"))
                        .slice(0, 4)
                        .map((f, idx) => (
                          <div key={idx} className="bg-white border border-stone-100 p-2.5 rounded-lg flex items-center justify-between gap-2 shadow-2xs text-xs">
                            <div className="min-w-0">
                              <span className="font-semibold text-stone-800 block truncate">{f.description}</span>
                              <span className="text-stone-400 text-[9px] font-mono block">{f.date} | {f.category}</span>
                            </div>
                            <span className="text-stone-900 font-bold shrink-0">
                              {f.currency === "USD" ? `$ ${f.value.toLocaleString()}` : `₲ ${f.value.toLocaleString()}`}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Summary Info */}
                <div className="p-3 bg-emerald-50/55 rounded-xl border border-emerald-100/30 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold block text-[10px] uppercase">Gasto Levantamento (USD)</span>
                    <span className="text-lg font-black text-emerald-900">
                      ${Math.round(
                        finance
                          .filter(f => f.description.includes("[Levantamento") || f.id.startsWith("f-survey-"))
                          .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / usdToPyg : curr.value), 0)
                      ).toLocaleString()} USD
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold py-1 px-2 rounded">Bimoedário Ativo</span>
                </div>

              </div>

            </div>

            {/* Total balance info card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-stone-100">
              <div className="p-3 bg-stone-50 rounded-lg text-center">
                <span className="text-[10px] text-stone-400 font-semibold block uppercase">Capital de Giro</span>
                <span className="text-sm font-bold text-stone-800">${totalInvestment.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg text-center">
                <span className="text-[10px] text-stone-400 font-semibold block uppercase">Total Desembolsado</span>
                <span className="text-sm font-bold text-red-600">${totalSpent.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Saldo de Caixa</span>
                <span className="text-sm font-bold text-emerald-700">${netBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns - Tasks, Travel, and Quick Contacts */}
        <div className="space-y-6">
          
          {/* Operator Tasks / Checklist */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-600" size={18} />
                <h3 className="font-bold text-emerald-900 text-sm">Checklist Operacional</h3>
              </div>
              <button 
                onClick={() => setActiveTab("tarefas")}
                className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Gerenciar <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 4).map(t => (
                <div key={t.id} className="flex gap-3 items-start p-2 hover:bg-emerald-50/20 rounded-lg transition-colors border-b border-emerald-50/50 pb-3">
                  <div className={`p-1 rounded-md shrink-0 mt-0.5 ${
                    t.status === "Concluída" ? "bg-emerald-100 text-emerald-700" :
                    t.status === "Atrasada" ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-600"
                  }`}>
                    {t.status === "Concluída" ? <CheckCircle size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className={`text-xs font-bold ${t.status === "Concluída" ? "line-through text-stone-400" : "text-emerald-850"}`}>
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{t.description}</p>
                    <div className="flex gap-2 items-center text-[10px] text-stone-400 mt-1">
                      <span className="bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-medium">{t.responsible}</span>
                      <span>Vence: {t.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paraguay Trip Planner */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="text-emerald-600" size={18} />
                <h3 className="font-bold text-emerald-900 text-sm">Itinerário de Visitas PY</h3>
              </div>
              <button 
                onClick={() => setActiveTab("viagem")}
                className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Ver Viagem <ArrowRight size={12} />
              </button>
            </div>

            <div className="relative border-l border-emerald-100 pl-4 ml-2.5 space-y-4">
              {visits.slice(0, 3).map((v, index) => (
                <div key={v.id} className="relative">
                  {/* Timeline point */}
                  <span className={`absolute -left-6.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                    v.status === "Visita Agendada" ? "bg-blue-500" :
                    v.status === "Visitado" || v.status === "Aprovado" ? "bg-emerald-500" : "bg-stone-400"
                  }`}></span>
                  
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block w-fit mb-1">
                      {v.plannedDate} • {v.city}
                    </span>
                    <h4 className="text-xs font-bold text-stone-800">{v.name}</h4>
                    <p className="text-[11px] text-stone-500">{v.type} • {v.address}</p>
                    {v.nextAction && (
                      <p className="text-[10px] text-emerald-700 font-semibold italic mt-0.5">Próximo: {v.nextAction}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Guidelines / Compliance Rules */}
          <div className="bg-emerald-950 p-4 rounded-xl text-emerald-200 border border-emerald-800 relative">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" /> Diretrizes de Compliance
            </h4>
            <ul className="text-[11px] space-y-2 list-disc list-inside opacity-90">
              <li>Cada lote produtivo possui um <b>código único</b> auditável.</li>
              <li>A legislação paraguaia (MAG/SENAD) exige registro fotográfico diário.</li>
              <li>As vistorias de órgãos públicos necessitam de laudos de solo e água disponíveis.</li>
              <li>Todas as despesas requerem faturas oficiais paraguaias para apuração contábil S.A.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
