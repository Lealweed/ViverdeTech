/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Compass,
  Zap,
  Droplet,
  Tv,
  Thermometer,
  Layout,
  Hammer,
  Check,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Coins
} from "lucide-react";
import { Area, AreaType, AreaStatus } from "../types";

interface EstufasProps {
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Estufas({ areas, setAreas, addAuditLog }: EstufasProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(areas[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modular simulator state
  const [targetSize, setTargetSize] = useState<1000 | 2500 | 5000 | 10000>(1000);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<AreaType>(AreaType.Estufa);
  const [width, setWidth] = useState(20);
  const [length, setLength] = useState(50);
  const [locationInFarm, setLocationInFarm] = useState("");
  const [status, setStatus] = useState<AreaStatus>(AreaStatus.Planejada);
  const [structureSupplier, setStructureSupplier] = useState("");
  const [materialUsed, setMaterialUsed] = useState("");
  const [covering, setCovering] = useState("");
  const [irrigation, setIrrigation] = useState("");
  const [ventilation, setVentilation] = useState("");
  const [observations, setObservations] = useState("");

  const selectedArea = areas.find(a => a.id === selectedAreaId);

  // Expansion calculations
  const calculateModularRequirements = (size: number) => {
    // Ratios based on agricultural standards for greenhouse tunnels
    const arcosRatio = 2.5; // arco de aço a cada 2.5m
    const larguraPadrao = 10; // túneis de 10m de largura
    const lengthNeeded = size / larguraPadrao; // comprimento total acumulado
    
    const arcosCount = Math.ceil(lengthNeeded / arcosRatio) * 2; // de dois em dois arcos por vão
    const lonaM2 = size * 1.35; // margem de lona lateral
    const mangueiraM = size * 4; // 4 metros de tubo gotejo por m2
    const estCostUSD = size * 7.5; // aprox $7.5 por m2 estrutural completo
    const estYieldHempKg = Math.round(size * 0.25); // aprox 250g de flor seca/biomassa por m2
    const estYieldClonesUnits = size * 8; // aprox 8 clones/mudas por m2

    return {
      arcosCount,
      lonaM2: Math.round(lonaM2),
      mangueiraM: Math.round(mangueiraM),
      costUSD: estCostUSD,
      yieldHemp: estYieldHempKg,
      yieldClones: estYieldClonesUnits
    };
  };

  const reqs = calculateModularRequirements(targetSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, dê um nome para a área.");
      return;
    }

    const newArea: Area = {
      id: "a-" + Date.now(),
      name,
      type,
      sizeM2: width * length,
      width,
      length,
      locationInFarm,
      status,
      setupDate: new Date().toISOString().split("T")[0],
      structureSupplier,
      materialUsed,
      covering,
      irrigation,
      ventilation,
      sensorsInstalled: [],
      camerasInstalled: [],
      electricityType: "Trifásico 380V",
      observations,
      photos: []
    };

    setAreas(prev => [...prev, newArea]);
    setSelectedAreaId(newArea.id);
    addAuditLog("Adicionou Área", `Criou área física produtiva: ${name}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setLocationInFarm("");
    setStructureSupplier("");
    setMaterialUsed("");
    setCovering("");
    setIrrigation("");
    setVentilation("");
    setObservations("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Infraestrutura e Áreas de Cultivo</h2>
          <p className="text-stone-500 text-sm">Monitore as estufas ativas, viveiros de clones, reservatórios hidráulicos e planeje o cronograma de expansão modular.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Nova Área Física
        </button>
      </div>

      {/* Main Grid: Areas on left, Detailed Area Spec + Simulator on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Areas List Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Mapeamento Físico</h3>
          {areas.map(a => (
            <div 
              key={a.id}
              onClick={() => setSelectedAreaId(a.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedAreaId === a.id ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/20" : "bg-white border-emerald-50 hover:border-emerald-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                  {a.type}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  a.status === AreaStatus.EmUso ? "bg-emerald-100 text-emerald-700" :
                  a.status === AreaStatus.EmMontagem ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"
                }`}>
                  {a.status}
                </span>
              </div>

              <h4 className="font-bold text-stone-900 text-sm truncate">{a.name}</h4>
              <p className="text-xs text-stone-500 font-semibold">{a.sizeM2} m² ({a.width}m x {a.length}m)</p>
            </div>
          ))}
        </div>

        {/* Details Panel & Expansion Simulator */}
        <div className="lg:col-span-2 space-y-6 text-stone-800">
          
          {/* Selected Area Specification */}
          {selectedArea ? (
            <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-50/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-emerald-900 font-display">{selectedArea.name}</h3>
                  <p className="text-xs text-stone-500">{selectedArea.type} • Montagem em {selectedArea.setupDate}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-150 px-2.5 py-1 rounded">
                  {selectedArea.sizeM2} m² Úteis
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                {selectedArea.covering && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Cobertura / Filme Plástico</span>
                    <span className="text-stone-700 font-semibold">{selectedArea.covering}</span>
                  </div>
                )}
                {selectedArea.irrigation && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Sistema de Irrigação</span>
                    <span className="text-stone-700 font-semibold">{selectedArea.irrigation}</span>
                  </div>
                )}
                {selectedArea.ventilation && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Ventilação / Controle Térmico</span>
                    <span className="text-stone-700 font-semibold">{selectedArea.ventilation}</span>
                  </div>
                )}
                {selectedArea.materialUsed && (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Metalurgia / Tubagem</span>
                    <span className="text-stone-700 font-semibold">{selectedArea.materialUsed}</span>
                  </div>
                )}
                {selectedArea.locationInFarm && (
                  <div className="md:col-span-2">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Coordenadas de Disposição</span>
                    <span className="text-stone-700 font-medium">{selectedArea.locationInFarm}</span>
                  </div>
                )}
              </div>

              {selectedArea.observations && (
                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100/60 leading-relaxed pt-2">
                  <span className="font-bold text-stone-700 block mb-0.5">Observações Físicas:</span>
                  {selectedArea.observations}
                </div>
              )}

              {/* Photos Gallery */}
              {selectedArea.photos && selectedArea.photos.length > 0 && (
                <div className="h-44 rounded-xl overflow-hidden border border-stone-200">
                  <img referrerPolicy="no-referrer" src={selectedArea.photos[0]} alt="Estufa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-8 text-center text-stone-400 text-xs">
              Nenhuma área física selecionada.
            </div>
          )}

          {/* Interactive Modular Farm Expansion Simulator */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-emerald-800">
            <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-12">
              <Hammer size={120} />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-400" size={18} />
                <h3 className="font-extrabold text-sm tracking-wide uppercase text-emerald-300">Simulador de Expansão Modular da Fazenda</h3>
              </div>
              <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
                Nossa implantação é modular. Começamos com a estufa inicial de 1.000m² para viabilizar homologações SENAD e vendas piloto, reduzindo o aporte de risco, e escalamos geometricamente de forma lucrativa e segura.
              </p>

              {/* Size Milepost Selector Toggles */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[1000, 2500, 5000, 10000].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setTargetSize(sz as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      targetSize === sz 
                        ? "bg-emerald-600 border-white text-white font-extrabold shadow-sm scale-102"
                        : "bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/60 font-medium"
                    }`}
                  >
                    <span className="block text-xs md:text-sm">{sz === 10000 ? "1 Hectare" : `${sz.toLocaleString()} m²`}</span>
                    <span className="text-[9px] opacity-70 block font-normal">
                      {sz === 1000 ? "Fase Inicial" : sz === 2500 ? "Fase 2" : sz === 5000 ? "Fase Estável" : "Fase Comercial"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Requirement Outputs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-xs">
                
                {/* Tube frames count */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Arqueamento de Aço</span>
                  <span className="text-white font-extrabold text-sm">{reqs.arcosCount} pórticos</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Tubos galvanizados</span>
                </div>

                {/* Film roll dimensions */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Filme Plástico Agrícola</span>
                  <span className="text-white font-extrabold text-sm">{reqs.lonaM2.toLocaleString()} m²</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Lona UV 150 micras</span>
                </div>

                {/* Hose drip line length */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Mangueiras de Gotejamento</span>
                  <span className="text-white font-extrabold text-sm">{reqs.mangueiraM.toLocaleString()} metros</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Tubulação autocompensante</span>
                </div>

                {/* Estimated construct capital budget */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Orçamento Estrutural Est.</span>
                  <span className="text-white font-extrabold text-sm">${reqs.costUSD.toLocaleString()} USD</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Exclui terraplenagem</span>
                </div>

                {/* Crop output hemp */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Prod. Biomassa Cânhamo Seco</span>
                  <span className="text-white font-extrabold text-sm">~{reqs.yieldHemp.toLocaleString()} kg / ciclo</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Fins industriais/extrativos</span>
                </div>

                {/* Crop output clones */}
                <div className="bg-emerald-900/30 border border-emerald-800 p-3 rounded-lg">
                  <span className="text-emerald-300 block text-[9px] uppercase font-bold mb-1">Plano B: Viveiro de Clones</span>
                  <span className="text-white font-extrabold text-sm">~{reqs.yieldClones.toLocaleString()} mudas / ciclo</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Multiplicação e giro rápido</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Cadastrar Nova Área Físico-Produtiva</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome Identificador da Área *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Estufa Modular Capela - Setor B"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Tipo de Área */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Área</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AreaType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(AreaType).map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status Físico</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AreaStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(AreaStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Largura */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Largura Útil (metros)</label>
                  <input 
                    type="number" 
                    required
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Comprimento */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Comprimento Útil (metros)</label>
                  <input 
                    type="number" 
                    required
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Fornecedor Estrutural */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Fornecedor Estrutural</label>
                  <input 
                    type="text" 
                    value={structureSupplier}
                    onChange={(e) => setStructureSupplier(e.target.value)}
                    placeholder="Ex: Tubos del Este S.A."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Material usado */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Estrutura / Metalurgia Usada</label>
                  <input 
                    type="text" 
                    value={materialUsed}
                    onChange={(e) => setMaterialUsed(e.target.value)}
                    placeholder="Ex: Aço Galvanizado por Imersão Quente"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Cobertura */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Filme Plástico / Lona Cobertura</label>
                  <input 
                    type="text" 
                    value={covering}
                    onChange={(e) => setCovering(e.target.value)}
                    placeholder="Ex: Lona 150 micras difusora de luz"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Irrigação */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Sistema de Irrigação</label>
                  <input 
                    type="text" 
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value)}
                    placeholder="Ex: Gotejadores autocompensantes"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Ventilação */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Exaustores / Ventilação</label>
                  <input 
                    type="text" 
                    value={ventilation}
                    onChange={(e) => setVentilation(e.target.value)}
                    placeholder="Ex: Exaustores axiais elétricos 0.5HP"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Disposição de Localização na Fazenda</label>
                  <input 
                    type="text" 
                    value={locationInFarm}
                    onChange={(e) => setLocationInFarm(e.target.value)}
                    placeholder="Ex: Coordenadas norte ou anexo ao poço"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Notas Físicas da Área</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                    placeholder="Bitola de cabos elétricos, bombas instaladas, segurança de trancas perimetrais..."
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
                  <Check size={14} /> Cadastrar Área Física
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
