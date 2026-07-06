/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  Check,
  X,
  DollarSign,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Trash2
} from "lucide-react";
import { FinancialRecord, FinanceType, FinanceCategory } from "../types";

interface FinanceiroProps {
  finance: FinancialRecord[];
  setFinance: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Financeiro({ finance, setFinance, addAuditLog }: FinanceiroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("todos");
  
  // Real-time currency toggle
  const [viewCurrency, setViewCurrency] = useState<"USD" | "PYG">("USD");
  const exchangeRate = 7500; // 1 USD = 7500 PYG (realistic Paraguay rate)

  // Form states
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FinanceType>(FinanceType.Despesa);
  const [category, setCategory] = useState<FinanceCategory>(FinanceCategory.CompraMaterial);
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "PYG" | "BRL">("USD");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"Pendente" | "Pago" | "Recebido" | "Cancelado">("Pago");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value <= 0) {
      alert("Por favor, preencha um valor financeiro válido.");
      return;
    }

    const newRecord: FinancialRecord = {
      id: "f-" + Date.now(),
      description,
      type,
      category,
      value,
      currency,
      date: date || new Date().toISOString().split("T")[0],
      status,
      paymentMethod,
      observations
    };

    setFinance(prev => [newRecord, ...prev]);
    addAuditLog("Registrou Transação", `Lançou ${type}: ${description} no valor de ${value} ${currency}`);
    setIsModalOpen(false);

    // Reset Form
    setDescription("");
    setValue(0);
    setObservations("");
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm("Deseja realmente remover este lançamento financeiro?")) {
      setFinance(prev => prev.filter(f => f.id !== id));
      addAuditLog("Removeu Transação", "Excluiu registro do caixa.");
    }
  };

  // Convert values based on view currency setting
  const formatValue = (val: number, recCurrency: "USD" | "PYG" | "BRL") => {
    let usdAmount = val;
    if (recCurrency === "PYG") usdAmount = val / exchangeRate;
    else if (recCurrency === "BRL") usdAmount = val / 5.5; // approx

    if (viewCurrency === "PYG") {
      const pyAmount = Math.round(usdAmount * exchangeRate);
      return `₲ ${pyAmount.toLocaleString("es-PY")}`;
    } else {
      return `$ ${usdAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
  };

  // Totals calculations
  const totalInflowUSD = finance
    .filter(f => (f.type === FinanceType.Receita || f.type === FinanceType.Investimento) && (f.status === "Pago" || f.status === "Recebido"))
    .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / exchangeRate : curr.value), 0);

  const totalOutflowUSD = finance
    .filter(f => f.type === FinanceType.Despesa && f.status === "Pago")
    .reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.value / exchangeRate : curr.value), 0);

  const netBalanceUSD = totalInflowUSD - totalOutflowUSD;

  // Filter & Search
  const filteredFinance = finance.filter(f => {
    const matchesSearch = 
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.observations && f.observations.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypeFilter === "todos" || f.type === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Fluxo de Caixa e Gestão Operacional</h2>
          <p className="text-stone-500 text-sm">Monitore o orçamento de infraestrutura, os custos de abertura judicial em Asunción e o fluxo de pagamentos de forma bimoedária (USD/Guaraníes).</p>
        </div>
        
        <div className="flex items-center gap-2 self-start">
          {/* Exchange rate quick toggle */}
          <button 
            type="button"
            onClick={() => setViewCurrency(prev => prev === "USD" ? "PYG" : "USD")}
            className="bg-white hover:bg-stone-50 border border-emerald-100 text-stone-750 px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw size={13} className="text-emerald-600 animate-spin-slow" />
            Exibir em: <b className="text-emerald-700 uppercase">{viewCurrency}</b>
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            <Plus size={16} /> Lançar Movimentação
          </button>
        </div>
      </div>

      {/* Cash Flow KPIs Card Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-800">
        
        {/* Total Inflow */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Giro / Receitas</span>
            <span className="text-xl font-black text-emerald-900">
              {viewCurrency === "PYG" 
                ? `₲ ${Math.round(totalInflowUSD * exchangeRate).toLocaleString("es-PY")}` 
                : `$ ${totalInflowUSD.toLocaleString("en-US", { minimumFractionDigits: 0 })} USD`
              }
            </span>
          </div>
          <div className="bg-emerald-50/55 p-3 rounded-xl text-emerald-700 border border-emerald-100/30">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Despesas Realizadas</span>
            <span className="text-xl font-black text-emerald-950">
              {viewCurrency === "PYG" 
                ? `₲ ${Math.round(totalOutflowUSD * exchangeRate).toLocaleString("es-PY")}` 
                : `$ ${totalOutflowUSD.toLocaleString("en-US", { minimumFractionDigits: 0 })} USD`
              }
            </span>
          </div>
          <div className="bg-red-50/55 p-3 rounded-xl text-red-600 border border-red-100/30">
            <ArrowDownLeft size={20} />
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Saldo Líquido Operacional</span>
            <span className={`text-xl font-black ${netBalanceUSD >= 0 ? "text-emerald-700" : "text-red-750"}`}>
              {viewCurrency === "PYG" 
                ? `₲ ${Math.round(netBalanceUSD * exchangeRate).toLocaleString("es-PY")}` 
                : `$ ${netBalanceUSD.toLocaleString("en-US", { minimumFractionDigits: 0 })} USD`
              }
            </span>
          </div>
          <div className={`p-3 rounded-xl ${netBalanceUSD >= 0 ? "bg-emerald-50/55 text-emerald-700 border border-emerald-100/30" : "bg-red-50/55 text-red-600 border border-red-100/30"}`}>
            <Coins size={20} />
          </div>
        </div>

      </div>

      {/* Double Currency Warning Info Board */}
      <div className="bg-emerald-50/20 border border-emerald-100/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-stone-650">
        <div className="flex items-center gap-2.5">
          <Sparkles className="text-amber-500 shrink-0" size={16} />
          <p>
            Parâmetro cambial simulado: <b>1 USD = 7.500 PYG (Guaraníes)</b>. Notas fiscais de cartório (escribanías) e taxas municipais em Hernandarias são lançadas em PYG e convertidas para balanço em USD.
          </p>
        </div>
      </div>

      {/* Filters and search list */}
      <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-4 text-stone-800">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Histórico de Transações</h3>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto grow max-w-xl">
            <div className="relative grow">
              <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
              <input 
                type="text" 
                placeholder="Filtrar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-stone-800 outline-none"
              />
            </div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-1.5 text-xs text-stone-700 font-bold shrink-0 outline-none"
            >
              <option value="todos">Todos os Lançamentos</option>
              <option value="Receita Real">Receitas</option>
              <option value="Despesa Real">Despesas</option>
            </select>
          </div>
        </div>

        {/* Financial Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-150 text-stone-400 font-bold">
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 px-4">Lançamento / Descrição</th>
                <th className="pb-3 px-4">Categoria</th>
                <th className="pb-3 px-4">Modo</th>
                <th className="pb-3 px-4 text-right">Valor Original</th>
                <th className="pb-3 px-4 text-right">Exibição Convertida</th>
                <th className="pb-3 px-4 text-center">Status</th>
                <th className="pb-3 pl-4">Opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredFinance.map(f => (
                <tr key={f.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-stone-500 whitespace-nowrap">{f.date}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{f.description}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 uppercase">
                      {f.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">{f.paymentMethod || "-"}</td>
                  <td className="py-3 px-4 text-right text-stone-500 font-mono whitespace-nowrap">
                    {f.currency === "PYG" ? "₲ " : "$"}{f.value.toLocaleString(f.currency === "PYG" ? "es-PY" : "en-US")} {f.currency}
                  </td>
                  <td className={`py-3 px-4 text-right font-black whitespace-nowrap ${f.type === FinanceType.Receita ? "text-emerald-700" : "text-stone-900"}`}>
                    {f.type === FinanceType.Despesa ? "-" : ""}{formatValue(f.value, f.currency)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.status === "Pago" || f.status === "Recebido" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-700"}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 pl-4">
                    <button 
                      onClick={() => handleDeleteRecord(f.id)}
                      className="text-stone-300 hover:text-red-500 p-1 rounded hover:bg-stone-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Lançar Movimentação de Caixa</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Descrição do Lançamento *</label>
                <input 
                  type="text" 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Registro da S.A. na Escribanía"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tipo */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Lançamento</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FinanceType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value={FinanceType.Despesa}>Despesa Real</option>
                    <option value={FinanceType.Receita}>Receita Real</option>
                    <option value={FinanceType.Investimento}>Capital de Giro</option>
                    <option value={FinanceType.Orcamento}>Orçamento Previsto</option>
                  </select>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FinanceCategory)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(FinanceCategory).map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Valor Financeiro *</label>
                  <input 
                    type="number" 
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Moeda */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Moeda Original</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PYG">PYG (Guaraníes)</option>
                    <option value="BRL">BRL (R$)</option>
                  </select>
                </div>

                {/* Data */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Data Competência</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Meio de Pagamento</label>
                  <input 
                    type="text" 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="Ex: Transferência Bancária"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status do Lançamento</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  <option value="Pago">Pago (Despesa Liquidada)</option>
                  <option value="Recebido">Recebido (Compensado em Conta)</option>
                  <option value="Pendente">Pendente / Em Aberto</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Observações do Comprovante</label>
                <textarea 
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  placeholder="Número de fatura paraguaia, observações de desconto..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  <Check size={14} /> Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
