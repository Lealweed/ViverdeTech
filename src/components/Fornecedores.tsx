/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Truck,
  Plus,
  Search,
  Check,
  X,
  Star,
  DollarSign,
  Phone,
  Globe,
  Trash2,
  Paperclip,
  CheckSquare,
  Square,
  ShieldAlert
} from "lucide-react";
import { Supplier, SupplierCategory } from "../types";

interface FornecedoresProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Fornecedores({ suppliers, setSuppliers, addAuditLog }: FornecedoresProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SupplierCategory>(SupplierCategory.Outro);
  const [country, setCountry] = useState("Paraguai");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [productService, setProductService] = useState("");
  const [priceInformed, setPriceInformed] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "PYG" | "BRL">("USD");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentForm, setPaymentForm] = useState("");
  const [deliversRural, setDeliversRural] = useState(true);
  const [cutToMeasure, setCutToMeasure] = useState(false);
  const [installs, setInstalls] = useState(false);
  const [formalBudget, setFormalBudget] = useState(true);
  const [invoiceIssued, setInvoiceIssued] = useState(true);
  const [indicatesAssembler, setIndicatesAssembler] = useState(false);
  const [reliability, setReliability] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, preencha o nome do fornecedor.");
      return;
    }

    const newSupplier: Supplier = {
      id: "s-" + Date.now(),
      name,
      category,
      country,
      city,
      contact,
      phone,
      whatsapp,
      email,
      site,
      productService,
      priceInformed,
      currency,
      deliveryTime,
      paymentForm,
      deliversRural,
      cutToMeasure,
      installs,
      formalBudget,
      invoiceIssued,
      indicatesAssembler,
      reliability,
      status: "Ativo",
      budgetFiles: [],
      photos: [],
      observations
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    addAuditLog("Adicionou Fornecedor", `Cadastrou fornecedor de ${category}: ${name}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setCity("");
    setContact("");
    setPhone("");
    setWhatsapp("");
    setProductService("");
    setPriceInformed(0);
    setObservations("");
  };

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm("Deseja realmente remover este fornecedor?")) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      addAuditLog("Excluiu Fornecedor", `Removeu fornecedor da lista.`);
    }
  };

  // Filter & Search
  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.productService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.observations && s.observations.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "todos" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Fornecedores Agrícolas e Estruturas</h2>
          <p className="text-stone-500 text-sm">Filtre e controle prestadores de serviços de estufas, lona, irrigação, bombas, segurança perimetral e automação IoT.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Cadastrar Fornecedor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:grow">
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar fornecedores, produtos, orçamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todas as Categorias</option>
            {Object.values(SupplierCategory).map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suppliers Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
            Nenhum fornecedor encontrado para os filtros aplicados.
          </div>
        ) : (
          filteredSuppliers.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 flex flex-col justify-between hover:border-emerald-200 transition-all">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 inline-block mb-1">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base">{s.name}</h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1">
                      <Truck size={12} /> {s.city ? `${s.city}, ${s.country}` : s.country}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-200 shrink-0">
                    <Star size={12} className="fill-amber-500" />
                    <span className="text-xs font-bold">{s.reliability}.0</span>
                  </div>
                </div>

                {/* Product/Service Description */}
                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100/70">
                  <span className="font-bold text-stone-700 block mb-1">Material / Serviço prestado:</span>
                  <p className="leading-relaxed">{s.productService}</p>
                </div>

                {/* Quick details checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-[11px] text-stone-600">
                  <div className="flex items-center gap-1.5">
                    {s.cutToMeasure ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                    <span>Corta sob medida?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.installs ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                    <span>Faz montagem/instalação?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.deliversRural ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                    <span>Entrega área rural?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.formalBudget ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                    <span>Emite orçamento formal?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.invoiceIssued ? <Check className="text-emerald-600" size={14} /> : <X className="text-stone-400" size={14} />}
                    <span>Emite fatura/nota fiscal?</span>
                  </div>
                </div>

                {/* Pricing / delivery */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-stone-100">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Último Orçamento</span>
                    <span className="text-stone-900 font-bold">
                      {s.priceInformed > 0 ? `${s.currency === "PYG" ? "PYG " : "$"}${s.priceInformed.toLocaleString()}` : "Não orçado"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Prazo de Entrega</span>
                    <span className="text-stone-700 font-medium">{s.deliveryTime || "A combinar"}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
                <div className="flex gap-2 text-xs text-stone-500">
                  {s.phone && (
                    <a 
                      href={`https://wa.me/${s.phone.replace(/\D/g, "")}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-stone-700 hover:text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone size={12} /> WhatsApp
                    </a>
                  )}
                  {s.site && (
                    <a 
                      href={`https://${s.site}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-stone-700 hover:text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Globe size={12} /> Website
                    </a>
                  )}
                </div>

                <button 
                  onClick={() => handleDeleteSupplier(s.id)}
                  className="text-stone-400 hover:text-red-600 p-1 rounded-md hover:bg-stone-50 transition-colors"
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
              <h3 className="font-bold text-stone-800 text-base">Adicionar Novo Fornecedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome Comercial / Fornecedor *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Tubos del Este S.A."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Categoria de Fornecimento</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupplierCategory)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(SupplierCategory).map((c, idx) => (
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
                    placeholder="Ex: Ciudad del Este"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* País */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">País</label>
                  <input 
                    type="text" 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Paraguai"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Contato Responsável */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Pessoa de Contato</label>
                  <input 
                    type="text" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Ex: Carlos Villalba"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">WhatsApp de Contato</label>
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: +595981..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Preço informado */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Último Valor Orçado</label>
                  <input 
                    type="number" 
                    value={priceInformed}
                    onChange={(e) => setPriceInformed(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Moeda */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Moeda do Orçamento</label>
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

                {/* Prazo */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Prazo de Entrega Estimado</label>
                  <input 
                    type="text" 
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="Ex: 5 dias úteis"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Confiabilidade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Confiabilidade Técnica (1 a 5 Estrelas)</label>
                  <select
                    value={reliability}
                    onChange={(e) => setReliability(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value={5}>5 Estrelas - Excelente</option>
                    <option value={4}>4 Estrelas - Muito Bom</option>
                    <option value={3}>3 Estrelas - Regular</option>
                    <option value={2}>2 Estrelas - Pouco Confiável</option>
                    <option value={1}>1 Estrela - Problemas de Entrega</option>
                  </select>
                </div>

                {/* Checklist options */}
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2.5 py-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={cutToMeasure} onChange={(e) => setCutToMeasure(e.target.checked)} className="rounded text-emerald-600" />
                    Corta materiais sob medida?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={installs} onChange={(e) => setInstalls(e.target.checked)} className="rounded text-emerald-600" />
                    Realiza montagem/instalação?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={deliversRural} onChange={(e) => setDeliversRural(e.target.checked)} className="rounded text-emerald-600" />
                    Entrega em zona rural?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={formalBudget} onChange={(e) => setFormalBudget(e.target.checked)} className="rounded text-emerald-600" />
                    Fornece orçamento formal PDF?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input type="checkbox" checked={invoiceIssued} onChange={(e) => setInvoiceIssued(e.target.checked)} className="rounded text-emerald-600" />
                    Emite Fatura legal paraguaia?
                  </label>
                </div>

                {/* Materiais Prestados */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Descrição Detalhada do Material / Orçamento</label>
                  <textarea 
                    value={productService}
                    onChange={(e) => setProductService(e.target.value)}
                    rows={2}
                    placeholder="Especifique dimensões, bitola do aço, marca dos sensores ou exaustores orçados..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Notas Gerais</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                    placeholder="Histórico de ligações, desconto comercial oferecido..."
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
                  <Check size={14} /> Cadastrar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
