/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  Plus,
  Search,
  Check,
  X,
  FileText,
  DollarSign,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  Briefcase,
  Layers,
  Sparkles
} from "lucide-react";
import { Buyer, BuyerType, BuyerStatus, CropType } from "../types";

interface CompradoresProps {
  buyers: Buyer[];
  setBuyers: React.Dispatch<React.SetStateAction<Buyer[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Compradores({ buyers, setBuyers, addAuditLog }: CompradoresProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<BuyerType>(BuyerType.Outro);
  const [country, setCountry] = useState("Paraguai");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [productOfInterest, setProductOfInterest] = useState<CropType>(CropType.MateriaPrimaExtracao);
  const [buyFromThirdParties, setBuyFromThirdParties] = useState(true);
  const [requiresLicense, setRequiresLicense] = useState(true);
  const [requiresLabReport, setRequiresLabReport] = useState(true);
  const [requiresMinVolume, setRequiresMinVolume] = useState(false);
  const [minVolumeDetails, setMinVolumeDetails] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "PYG" | "BRL">("USD");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [possibleContract, setPossibleContract] = useState(false);
  const [possibleLetterOfIntent, setPossibleLetterOfIntent] = useState(false);
  const [status, setStatus] = useState<BuyerStatus>(BuyerStatus.Identificado);
  const [nextAction, setNextAction] = useState("");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, preencha o nome da empresa compradora.");
      return;
    }

    const newBuyer: Buyer = {
      id: "b-" + Date.now(),
      name,
      type,
      country,
      city,
      contact,
      phone,
      email,
      whatsapp: phone,
      site,
      productOfInterest,
      buyFromThirdParties,
      requiresLicense,
      requiresLabReport,
      requiresMinVolume,
      minVolumeDetails,
      estimatedPrice,
      currency,
      paymentTerm,
      possibleContract,
      possibleLetterOfIntent,
      status,
      conversationDate: new Date().toISOString().split("T")[0],
      nextAction,
      observations,
      documents: []
    };

    setBuyers(prev => [newBuyer, ...prev]);
    addAuditLog("Adicionou Comprador", `Cadastrou mercado potencial: ${name}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setCity("");
    setContact("");
    setPhone("");
    setEmail("");
    setSite("");
    setEstimatedPrice(0);
    setObservations("");
    setNextAction("");
  };

  const handleDeleteBuyer = (id: string) => {
    if (window.confirm("Deseja realmente excluir este potencial comprador?")) {
      setBuyers(prev => prev.filter(b => b.id !== id));
      addAuditLog("Excluiu Comprador", `Removeu comprador da lista.`);
    }
  };

  const handleStatusChange = (buyerId: string, newStatus: BuyerStatus) => {
    setBuyers(prev => prev.map(b => b.id === buyerId ? { ...b, status: newStatus } : b));
    addAuditLog("Alterou Status Comprador", `Alterou status para ${newStatus}`);
  };

  // Filter & Search
  const filteredBuyers = buyers.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productOfInterest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.city && b.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.observations && b.observations.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === "todos" || b.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Compradores e Negociações (Marketplace)</h2>
          <p className="text-stone-500 text-sm">Controle canais de escoamento da colheita, processadores industriais de cânhamo, laboratórios farmacêuticos e contratos de compra futura (offtake).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Novo Comprador
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:grow">
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por empresa, produto de interesse, exigências..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todos os Status</option>
            {Object.values(BuyerStatus).map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Buyers Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBuyers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
            Nenhum comprador cadastrado ou filtrado.
          </div>
        ) : (
          filteredBuyers.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 flex flex-col justify-between hover:border-emerald-200 transition-all text-stone-800">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                      {b.type}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base">{b.name}</h3>
                    <p className="text-xs text-stone-500">{b.city ? `${b.city}, ${b.country}` : b.country}</p>
                  </div>

                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value as BuyerStatus)}
                    className="bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-1.5 text-xs font-semibold text-stone-700 shrink-0"
                  >
                    {Object.values(BuyerStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Interest Description */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                    <Briefcase size={12} className="text-emerald-700" />
                    <span className="font-semibold text-stone-700">Interesse Primário:</span>
                  </div>
                  <p className="font-bold text-stone-900">{b.productOfInterest}</p>
                </div>

                {/* Compliance / Requirements score */}
                <div className="space-y-2 border-t border-b border-stone-100 py-3 text-xs">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Exigências Regulatórias do Comprador</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                    <div className="flex items-center gap-1">
                      {b.requiresLicense ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                      <span>Exige Licença Ativa?</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {b.requiresLabReport ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                      <span>Exige Laudo de Lab?</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {b.buyFromThirdParties ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                      <span>Compra de Terceiros?</span>
                    </div>
                  </div>
                  
                  {b.requiresMinVolume && (
                    <div className="bg-amber-50 p-2 rounded text-[11px] text-amber-800 border border-amber-200/50 flex items-start gap-1">
                      <AlertCircle size={12} className="shrink-0 mt-0.5" />
                      <span><b>Volume Mínimo Exigido:</b> {b.minVolumeDetails || "A combinar"}</span>
                    </div>
                  )}
                </div>

                {/* Financial and payment details */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Preço de Compra Estimado</span>
                    <span className="text-stone-900 font-bold">
                      {b.estimatedPrice > 0 ? `${b.currency === "PYG" ? "PYG " : "$"}${b.estimatedPrice.toLocaleString()} / kg` : "A negociar"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Prazo de Pagamento</span>
                    <span className="text-stone-700 font-medium">{b.paymentTerm || "Imediato"}</span>
                  </div>
                </div>

                {/* Offtake potential indicators */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {b.possibleContract && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      Minuta Offtake em Análise
                    </span>
                  )}
                  {b.possibleLetterOfIntent && (
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      Possui Carta de Intenção
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
                <div className="flex gap-3 text-xs">
                  {b.phone && (
                    <a 
                      href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-stone-700 hover:text-emerald-600 font-semibold flex items-center gap-1"
                    >
                      <Phone size={12} /> WhatsApp
                    </a>
                  )}
                  {b.email && (
                    <a 
                      href={`mailto:${b.email}`} 
                      className="text-stone-700 hover:text-emerald-600 font-semibold flex items-center gap-1"
                    >
                      <Mail size={12} /> E-mail
                    </a>
                  )}
                </div>

                <button 
                  onClick={() => handleDeleteBuyer(b.id)}
                  className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Adicionar Potencial Comprador</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome da Empresa / Comprador *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: EuroCan Pharma S.A."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Tipo de Comprador */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Comprador</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as BuyerType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(BuyerType).map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Produto de Interesse */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Produto de Interesse</label>
                  <select
                    value={productOfInterest}
                    onChange={(e) => setProductOfInterest(e.target.value as CropType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(CropType).map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Luque"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Pessoa de Contato */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Pessoa de Contato</label>
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ex: Dra. Giselle"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">WhatsApp de Contato</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +5959..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Preço estimado */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Preço de Compra Estimado por kg</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Moeda */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Moeda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "USD" | "PYG" | "BRL")}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PYG">PYG (Guaraníes)</option>
                    <option value="BRL">BRL (R$)</option>
                  </select>
                </div>

                {/* Prazo pagamento */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Prazo de Pagamento</label>
                  <input 
                    type="text" 
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    placeholder="Ex: 30 dias após entrega"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status de Negociação</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BuyerStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(BuyerStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Exigências Toggles */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2.5 py-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={requiresLicense} onChange={(e) => setRequiresLicense(e.target.checked)} className="rounded text-emerald-600" />
                    Exige licença agrícola ativa?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={requiresLabReport} onChange={(e) => setRequiresLabReport(e.target.checked)} className="rounded text-emerald-600" />
                    Exige laudo laboratorial do lote?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={buyFromThirdParties} onChange={(e) => setBuyFromThirdParties(e.target.checked)} className="rounded text-emerald-600" />
                    Compra de produtores terceiros?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={requiresMinVolume} onChange={(e) => setRequiresMinVolume(e.target.checked)} className="rounded text-emerald-600" />
                    Exige volume mínimo obrigatório?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={possibleContract} onChange={(e) => setPossibleContract(e.target.checked)} className="rounded text-emerald-600" />
                    Possibilidade de contrato de compra (offtake)?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={possibleLetterOfIntent} onChange={(e) => setPossibleLetterOfIntent(e.target.checked)} className="rounded text-emerald-600" />
                    Fornece Carta de Intenção de Compra?
                  </label>
                </div>

                {/* Volume mínimo details */}
                {requiresMinVolume && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Detalhes do Volume Mínimo Necessário</label>
                    <input 
                      type="text" 
                      value={minVolumeDetails}
                      onChange={(e) => setMinVolumeDetails(e.target.value)}
                      placeholder="Ex: Mínimo 500 kg por remessa"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                )}

                {/* Próxima ação */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Próxima Ação Agendada</label>
                  <input 
                    type="text" 
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="Ex: Apresentar amostras laboratoriais e laudo do solo na próxima reunião"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Observações e Detalhes de Negociação</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                    placeholder="Anotações de conversas prévias, condições físicas exigidas de embalagem..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  <Check size={14} /> Cadastrar Mercado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
