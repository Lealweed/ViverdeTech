/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  QrCode,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  X,
  Search,
  Eye,
  Trash2,
  TrendingUp,
  Droplet,
  Thermometer,
  ShieldCheck,
  User,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Check,
  ArrowLeft
} from "lucide-react";
import { Lot, CropType, LotStatus, ProjectType } from "../types";

interface LotesProps {
  lots: Lot[];
  setLots: React.Dispatch<React.SetStateAction<Lot[]>>;
  addAuditLog: (action: string, details: string) => void;
  selectedLotCode?: string;
  setSelectedLotCode?: (code: string) => void;
  onBack?: () => void;
}

export default function Lotes({ 
  lots, 
  setLots, 
  addAuditLog, 
  selectedLotCode = "", 
  setSelectedLotCode, 
  onBack 
}: LotesProps) {
  const [searchTerm, setSearchTerm] = useState(selectedLotCode);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePortalLot, setActivePortalLot] = useState<Lot | null>(null);

  useEffect(() => {
    if (selectedLotCode) {
      setSearchTerm(selectedLotCode);
    }
  }, [selectedLotCode]);

  // Form states
  const [crop, setCrop] = useState<CropType>(CropType.BiomassaSeca);
  const [variety, setVariety] = useState("");
  const [areaId, setAreaId] = useState("a-1");
  const [quantityPlanted, setQuantityPlanted] = useState(1000);
  const [weightDryKg, setWeightDryKg] = useState(120);
  const [plantingDate, setPlantingDate] = useState("");
  const [status, setStatus] = useState<LotStatus>(LotStatus.Vegetativo);
  const [labReportFile, setLabReportFile] = useState("");
  const [observations, setObservations] = useState("");

  const areaMap: Record<string, string> = {
    "a-1": "Estufa Principal - Setor A",
    "a-2": "Estufa de Mudas e Clones",
    "a-3": "Área de Secagem e Processamento"
  };

  const getAreaName = (id: string) => {
    return areaMap[id] || "Estufa Principal";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variety.trim()) {
      alert("Por favor, preencha a variedade.");
      return;
    }

    // Generate unique lot code
    const year = new Date().getFullYear();
    const typeAbbr = crop === CropType.BiomassaSeca ? "HEMP" : "VEG";
    const nextIndex = String(lots.length + 1).padStart(3, "0");
    const code = `VV-${year}-${typeAbbr}-${nextIndex}`;

    const newLot: Lot = {
      id: "lot-" + Date.now(),
      code,
      crop,
      variety,
      projectType: crop === CropType.BiomassaSeca ? ProjectType.IndustrialCanhamo : ProjectType.CanabinoidesAltoControle,
      areaId,
      plantingDate: plantingDate || new Date().toISOString().split("T")[0],
      estimatedHarvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      realHarvestDate: "",
      responsible: "Ing. Hugo Mendoza (Agrônomo)",
      seedSource: "SENAVE Certificada",
      supplier: "COINCA Distribuidora",
      quantityPlanted,
      areaUsedM2: 500,
      status,
      weightHarvestedKg: 0,
      weightDryKg,
      lossPercentage: 2,
      humidityPercentage: 12.4,
      labReportFile: labReportFile || `LN-${year}-042`,
      destination: "Mercado Local / Exportação",
      buyerId: "b-2",
      estimatedPricePerKg: 1.2,
      realPricePerKg: 0,
      currency: "USD",
      observations,
      photos: ["https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80"],
      documents: []
    };

    setLots(prev => [newLot, ...prev]);
    addAuditLog("Gerou Lote", `Lote rastreável criado com código único: ${code}`);
    setIsModalOpen(false);

    // Reset Form
    setVariety("");
    setLabReportFile("");
    setObservations("");
  };

  const handleDeleteLot = (id: string) => {
    if (window.confirm("Deseja realmente remover este lote? Isto apagará todo o histórico de rastreabilidade associado.")) {
      setLots(prev => prev.filter(l => l.id !== id));
      addAuditLog("Excluiu Lote", `Apagou lote do sistema.`);
    }
  };

  const handleStatusChange = (id: string, newStatus: LotStatus) => {
    setLots(prev => prev.map(l => {
      if (l.id === id) {
        return { 
          ...l, 
          status: newStatus,
          realHarvestDate: newStatus === LotStatus.Colheita ? new Date().toISOString().split("T")[0] : l.realHarvestDate,
          weightHarvestedKg: newStatus === LotStatus.Colheita ? l.weightDryKg : l.weightHarvestedKg
        };
      }
      return l;
    }));
    addAuditLog("Status Lote", `Status do lote ${id} alterado para ${newStatus}`);
  };

  // Filter & Search
  const filteredLots = lots.filter(l => {
    const matchesSearch = 
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAreaName(l.areaId).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCropFilter === "todos" || l.crop === selectedCropFilter;

    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6">
      {/* Back to Dashboard Button */}
      {onBack && (
        <button
          type="button"
          onClick={() => {
            if (setSelectedLotCode) setSelectedLotCode("");
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg w-fit transition-all cursor-pointer border border-emerald-100"
        >
          <ArrowLeft size={14} /> Voltar ao Painel Geral
        </button>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Rastreabilidade e Lotes Agrícolas</h2>
          <p className="text-stone-500 text-sm">Gere códigos únicos com padrões governamentais, monitore os laudos laboratoriais livres de THC e simule o portal de fiscalização externa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Criar Novo Lote Rastreável
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:grow">
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por lote (ex: VV-2026), variedade, estufa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
          />
        </div>

        {/* Crop Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todos os Cultivos</option>
            {Object.values(CropType).map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lots Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-stone-800">
        {filteredLots.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
            Nenhum lote produtivo registrado.
          </div>
        ) : (
          filteredLots.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-4 hover:border-emerald-200 transition-all flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-emerald-800 font-extrabold text-sm block">
                      {l.code}
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-base mt-1">{l.variety}</h3>
                    <p className="text-xs text-stone-500 font-medium">Local: {getAreaName(l.areaId)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <select
                      value={l.status}
                      onChange={(e) => handleStatusChange(l.id, e.target.value as LotStatus)}
                      className="bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-1.5 text-xs font-semibold text-stone-700"
                    >
                      {Object.values(LotStatus).map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>

                    <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200 font-bold uppercase">
                      {l.crop}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase font-bold">Início do Plantio</span>
                    <span className="font-semibold text-stone-700 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {l.plantingDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase font-bold">Colheita / Fim</span>
                    <span className="font-semibold text-stone-700 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {l.realHarvestDate || "Cultivando"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase font-bold">Quantidade Estimada</span>
                    <span className="font-extrabold text-stone-900 mt-0.5 block">
                      {l.status === LotStatus.Colheita || l.status === LotStatus.Secagem || l.status === LotStatus.Armazenado || l.status === LotStatus.Vendido 
                        ? `${l.weightHarvestedKg || l.weightDryKg} kg colhidos` 
                        : `~${l.weightDryKg} kg esperado`}
                    </span>
                  </div>
                </div>

                {/* Lab report results details */}
                <div className="bg-stone-50/70 border border-stone-150 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-extrabold text-stone-500 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-700" /> Laudo de Laboratório DINAVISA
                    </span>
                    <span className="text-[10px] font-bold text-stone-700">{l.labReportFile || "Pendente"}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-stone-400 block text-[9px]">CBD (Canabidiol)</span>
                      <span className="font-extrabold text-stone-800">11.2%</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px]">THC (Psicoativo)</span>
                      <span className="font-extrabold text-emerald-700">0.15% (Legal)</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-stone-400 block text-[9px]">Amostragem</span>
                      <span className="font-semibold text-stone-600 truncate block">DINAVISA Central Lab</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Simulator trigger and deletion */}
              <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setActivePortalLot(l)}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <QrCode size={14} /> Simular Visão do Comprador
                </button>

                <button 
                  onClick={() => handleDeleteLot(l.id)}
                  className="text-stone-400 hover:text-red-600 p-1 rounded-md hover:bg-stone-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Public Traceability Certificate / Scanning Portal Simulator Overlay */}
      {activePortalLot && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-stone-100 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-emerald-950/20 max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-200">
            
            {/* Header: Simulation warning banner */}
            <div className="bg-emerald-900 text-emerald-100 p-3 text-center text-xs font-bold flex items-center justify-between gap-1.5 shrink-0 border-b border-emerald-950">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400 shrink-0" />
                <span>Simulador de QR Code - Visão Pública do Fiscal / Comprador</span>
              </div>
              <button 
                onClick={() => setActivePortalLot(null)}
                className="bg-emerald-950 hover:bg-emerald-850 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-emerald-800"
              >
                <X size={12} />
                <span>Fechar</span>
              </button>
            </div>

            {/* Public Certificate Sheet */}
            <div className="p-5 overflow-y-auto space-y-5 text-stone-800 bg-white">
              
              {/* Certificate Head */}
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                  <ShieldCheck size={24} className="text-emerald-700" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-base uppercase tracking-wide">ViVerdetech Paraguay</h3>
                <p className="text-[10px] text-stone-500 font-bold tracking-wider uppercase">Certificado de Rastreabilidade Governamental</p>
                <p className="text-[10px] text-emerald-700 font-extrabold font-mono tracking-wide mt-1">LOTE VALIDADO: {activePortalLot.code}</p>
              </div>

              {/* Status block stamps */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs text-emerald-800 space-y-1">
                <span className="font-black text-emerald-900 uppercase text-xs block tracking-wide">✓ LOTE REGULARIZADO SENAD</span>
                <p className="text-[10px] leading-relaxed text-emerald-700 font-medium">Este lote cumpre rigorosamente com o artigo 33 da Lei paraguaia de substâncias psicoativas. O percentual de THC está abaixo de 0.5%.</p>
              </div>

              {/* General details table */}
              <div className="border border-stone-150 rounded-xl divide-y divide-stone-150 text-xs">
                <div className="p-3 flex justify-between items-center bg-stone-50/50">
                  <span className="text-stone-500 font-bold">Variedade de Cultivo:</span>
                  <span className="font-black text-stone-900">{activePortalLot.variety}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Área de Origem:</span>
                  <span className="font-semibold text-stone-800 flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-700" /> {getAreaName(activePortalLot.areaId)}
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Data de Plantio:</span>
                  <span className="font-semibold text-stone-800">{activePortalLot.plantingDate}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Status Fisiológico:</span>
                  <span className="font-bold text-emerald-700 uppercase bg-emerald-100/50 px-2.5 py-0.5 rounded-full text-[10px]">
                    {activePortalLot.status}
                  </span>
                </div>
              </div>

              {/* Chemical specs */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  <FileText size={14} className="text-emerald-700" /> Parâmetros Químicos do Laudo Oficial
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="border border-stone-150 p-2.5 rounded-lg bg-stone-50/50">
                    <span className="text-stone-400 block text-[9px] uppercase font-bold">Teor Canabidiol (CBD)</span>
                    <span className="text-stone-900 font-extrabold text-base">11.2%</span>
                  </div>
                  <div className="border border-stone-150 p-2.5 rounded-lg bg-emerald-50/20 border-emerald-200">
                    <span className="text-emerald-700 block text-[9px] uppercase font-bold">Teor Psicoativo (THC)</span>
                    <span className="text-emerald-800 font-extrabold text-base">0.15%</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-2 rounded-lg border border-stone-150 text-[10px] text-stone-500 flex justify-between items-center">
                  <span>Analisado por: <b>DINAVISA Central Lab</b></span>
                  <span>Laudo: <b>{activePortalLot.labReportFile || "Pendente"}</b></span>
                </div>
              </div>

              {/* Simulated IoT environmental metrics log */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Droplet size={14} className="text-blue-500" /> Histórico Ambiental Automatizado (Sensores IoT)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-stone-600">
                  <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-150">
                    <Thermometer size={16} className="text-amber-500" />
                    <div>
                      <span className="block text-[10px] text-stone-400">Temp. Média Cultivo</span>
                      <span className="font-bold text-stone-800">26.4 °C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-150">
                    <Droplet size={16} className="text-blue-500" />
                    <div>
                      <span className="block text-[10px] text-stone-400">Umidade Média Solo</span>
                      <span className="font-bold text-stone-800">64.1%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicit bottom back / close button inside certificate */}
              <div className="pt-5 border-t border-stone-100 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActivePortalLot(null)}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Check size={14} /> Fechar Certificado e Voltar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-stone-800">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-stone-800 text-sm">Criar Lote com Rastreabilidade</h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form - with scrollable inner container */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
                {/* Variedade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Variedade / Nome do Cultivo *</label>
                  <input 
                    type="text" 
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="Ex: Sativa Industrial Yguazú 2"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* Cultura */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Cultura / Destinação</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value as CropType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  >
                    {Object.values(CropType).map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Área / Estufa */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Área de Plantio</label>
                  <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs font-bold"
                  >
                    <option value="a-1">a-1 (Estufa Principal - Setor A)</option>
                    <option value="a-2">a-2 (Estufa de Mudas e Clones)</option>
                    <option value="a-3">a-3 (Área de Secagem)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantidade Plantada */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Quantidade Mudas/Plantas</label>
                    <input 
                      type="number" 
                      required
                      value={quantityPlanted}
                      onChange={(e) => setQuantityPlanted(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                    />
                  </div>

                  {/* Rendimento Esperado */}
                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Peso Seco Estimado (kg)</label>
                    <input 
                      type="number" 
                      required
                      value={weightDryKg}
                      onChange={(e) => setWeightDryKg(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                    />
                  </div>
                </div>

                {/* Data Plantio */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Data de Germinação / Plantio</label>
                  <input 
                    type="date" 
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* Status do Lote */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Fase Fisiológica Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LotStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  >
                    {Object.values(LotStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Laudo Referência */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nro Laudo / Boletim DINAVISA</label>
                  <input 
                    type="text" 
                    value={labReportFile}
                    onChange={(e) => setLabReportFile(e.target.value)}
                    placeholder="Ex: LN-2026-042"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Observações do Lote</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                    placeholder="Observações de germinação, clima..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Form Actions - Pinned at the bottom */}
              <div className="border-t border-stone-100 p-4 bg-stone-50 flex justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar / Voltar
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Gerar Lote Rastreável
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
