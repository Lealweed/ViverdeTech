/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building,
  Check,
  X,
  MapPin,
  Compass,
  Home,
  Droplet,
  Zap,
  Shield,
  Truck,
  Plus,
  Trash2,
  DollarSign,
  Info,
  CheckSquare,
  Square,
  Sparkles,
  Layers
} from "lucide-react";
import { Property, PropertyStatus, PropertyChecklist } from "../types";

interface ChacarasProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Chacaras({ properties, setProperties, addAuditLog }: ChacarasProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new property
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("Alto Paraná");
  const [address, setAddress] = useState("");
  const [gps, setGps] = useState("");
  const [distanceCity, setDistanceCity] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [usableArea, setUsableArea] = useState("");
  const [reserve100x100, setReserve100x100] = useState(true);
  const [hasHouse, setHasHouse] = useState(true);
  const [houseState, setHouseState] = useState("Bom estado");
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [kitchen, setKitchen] = useState(true);
  const [internet, setInternet] = useState(true);
  const [electricity, setElectricity] = useState("Trifásico (380V)");
  const [water, setWater] = useState("Poço Artesiano");
  const [well, setWell] = useState(true);
  const [stream, setStream] = useState(false);
  const [reservoir, setReservoir] = useState(true);
  const [truckAccess, setTruckAccess] = useState(true);
  const [roadType, setRoadType] = useState<"Asfalto" | "Terra" | "Empedrado">("Terra");
  const [security, setSecurity] = useState("Cerca simples");
  const [rentValue, setRentValue] = useState(600);
  const [depositValue, setDepositValue] = useState(1200);
  const [minContract, setMinContract] = useState("24 meses");
  const [ownerInfo, setOwnerInfo] = useState("");
  const [observations, setObservations] = useState("");
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.Encontrada);

  // Checklist states
  const [checklist, setChecklist] = useState<PropertyChecklist>({
    aguaSuficiente: true,
    energiaSuficiente: true,
    internetFunciona: true,
    casaHabitavel: true,
    estradaCaminhao: true,
    areaUmHectare: true,
    permiteCerca: true,
    permiteCameras: true,
    permiteAtividadeAgricola: true,
    contratoClaro: true,
    documentosVistos: true,
    riscoVizinhanca: false,
    riscoSeguranca: false,
    cabeNoOrcamento: true
  });

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const calculateChecklistScore = (cl: PropertyChecklist) => {
    // True values are positive, except risks where false is positive
    const positiveItems = [
      cl.aguaSuficiente,
      cl.energiaSuficiente,
      cl.internetFunciona,
      cl.casaHabitavel,
      cl.estradaCaminhao,
      cl.areaUmHectare,
      cl.permiteCerca,
      cl.permiteCameras,
      cl.permiteAtividadeAgricola,
      cl.contratoClaro,
      cl.documentosVistos,
      !cl.riscoVizinhanca,
      !cl.riscoSeguranca,
      cl.cabeNoOrcamento
    ];
    const score = positiveItems.filter(Boolean).length;
    return { score, total: positiveItems.length };
  };

  const toggleChecklistItem = (propertyId: string, key: keyof PropertyChecklist) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updatedChecklist = { ...p.checklist, [key]: !p.checklist[key] };
        return { ...p, checklist: updatedChecklist };
      }
      return p;
    }));
    addAuditLog("Atualizou Checklist", `Alterou item ${key} da avaliação da propriedade.`);
  };

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
    addAuditLog("Alterou Status Imóvel", `Status alterado para ${newStatus}`);
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm("Deseja realmente remover esta chácara da lista de avaliação?")) {
      setProperties(prev => prev.filter(p => p.id !== id));
      addAuditLog("Excluiu Propriedade", `Removeu chácara da lista.`);
      setSelectedPropertyId(properties[0]?.id || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, dê um nome para identificar a propriedade.");
      return;
    }

    const newProperty: Property = {
      id: "p-" + Date.now(),
      name,
      city,
      department,
      address,
      gps,
      distanceCity,
      totalArea,
      usableArea,
      reserve100x100,
      hasHouse,
      houseState,
      rooms,
      bathrooms,
      kitchen,
      internet,
      electricity,
      water,
      well,
      stream,
      reservoir,
      truckAccess,
      roadType,
      security,
      fence: true,
      gate: true,
      neighborsClose: false,
      rentValue,
      currency: "USD",
      depositValue,
      minContract,
      ownerInfo,
      photos: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
      ],
      videos: [],
      documents: [],
      observations,
      status,
      checklist
    };

    setProperties(prev => [...prev, newProperty]);
    setSelectedPropertyId(newProperty.id);
    addAuditLog("Adicionou Propriedade", `Cadastrou para avaliação: ${name}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setCity("");
    setAddress("");
    setGps("");
    setDistanceCity("");
    setTotalArea("");
    setUsableArea("");
    setObservations("");
    setOwnerInfo("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Avaliação de Chácaras e Imóveis</h2>
          <p className="text-stone-500 text-sm">Pesquise, avalie a infraestrutura hidráulica/elétrica e filtre propriedades ideais para o cultivo regulado modular de 1 hectare.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Cadastrar Nova Área
        </button>
      </div>

      {/* Main Grid: Left sidebar of properties, Right details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Properties Sidebar List */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Propriedades Cadastradas</h3>
          
          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
              Nenhuma propriedade cadastrada.
            </div>
          ) : (
            properties.map(p => {
              const { score, total } = calculateChecklistScore(p.checklist);
              const isSelected = p.id === selectedPropertyId;
              const approvalRate = Math.round((score / total) * 100);

              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`p-4 rounded-2xl shadow-sm border transition-all cursor-pointer ${
                    isSelected ? "bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/20" : "bg-white border-emerald-50 hover:border-emerald-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.status === PropertyStatus.Aprovada ? "bg-emerald-100 text-emerald-700" :
                      p.status === PropertyStatus.Descartada ? "bg-red-100 text-red-600" :
                      p.status === PropertyStatus.EmNegociacao ? "bg-purple-100 text-purple-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {p.status}
                    </span>
                    <span className={`text-[11px] font-bold ${approvalRate >= 70 ? "text-emerald-700" : "text-amber-700"}`}>
                      {approvalRate}% Aprovada
                    </span>
                  </div>

                  <h4 className="font-bold text-emerald-900 text-sm truncate">{p.name}</h4>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-emerald-500" /> {p.city}, {p.department}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-50/60 text-xs text-stone-500">
                    <span>Área: {p.totalArea}</span>
                    <span className="font-semibold text-emerald-850">${p.rentValue}/mês</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Property Detailed Evaluation Panel */}
        <div className="lg:col-span-2">
          {selectedProperty ? (
            <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-6">
              
              {/* Card Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-50/60">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900 font-display">{selectedProperty.name}</h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin size={14} className="text-emerald-600" /> {selectedProperty.address}
                  </p>
                </div>
                
                <div className="flex gap-2 self-start shrink-0">
                  <select
                    value={selectedProperty.status}
                    onChange={(e) => handleStatusChange(selectedProperty.id, e.target.value as PropertyStatus)}
                    className="bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2 text-xs font-bold text-emerald-850"
                  >
                    {Object.values(PropertyStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleDeleteProperty(selectedProperty.id)}
                    className="p-2 border border-emerald-100 text-stone-400 hover:text-red-600 rounded-lg hover:bg-emerald-50/40 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* General Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase mb-1">Área Total</span>
                  <span className="text-emerald-900 font-extrabold text-sm">{selectedProperty.totalArea}</span>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase mb-1">Área Útil Cultivo</span>
                  <span className="text-emerald-900 font-extrabold text-sm">{selectedProperty.usableArea}</span>
                </div>
                <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50">
                  <span className="text-emerald-800 block text-[10px] font-bold uppercase mb-1">Valor Aluguel</span>
                  <span className="text-emerald-700 font-extrabold text-sm">${selectedProperty.rentValue} / mês</span>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase mb-1">Contrato Mínimo</span>
                  <span className="text-emerald-900 font-extrabold text-sm">{selectedProperty.minContract}</span>
                </div>
              </div>

              {/* Infrastructure Technical Checklist Detail */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-emerald-850 uppercase tracking-widest flex items-center gap-1.5 opacity-80">
                  <Zap size={14} className="text-emerald-600" /> Infraestrutura Agrícola Instalada
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="border border-emerald-50 rounded-xl p-3 space-y-2 bg-white">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                      <Droplet size={14} className="text-blue-500" /> Abastecimento de Água
                    </span>
                    <p className="text-stone-600">{selectedProperty.water}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${selectedProperty.well ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>Poço</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${selectedProperty.reservoir ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>Caixa/Res.</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${selectedProperty.stream ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-400"}`}>Rio</span>
                    </div>
                  </div>

                  <div className="border border-emerald-50 rounded-xl p-3 space-y-2 bg-white">
                    <span className="font-bold text-stone-800 block flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-500" /> Energia Elétrica
                    </span>
                    <p className="text-stone-600 leading-relaxed">{selectedProperty.electricity}</p>
                  </div>

                  <div className="border border-stone-100 rounded-lg p-3 space-y-2">
                    <span className="font-bold text-stone-800 block flex items-center gap-1.5">
                      <Home size={14} className="text-stone-600" /> Moradia no Local (Casa)
                    </span>
                    <p className="text-stone-600">{selectedProperty.hasHouse ? `${selectedProperty.houseState} (${selectedProperty.rooms} dorm, ${selectedProperty.bathrooms} banh)` : "Não possui residência."}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="border border-stone-100 rounded-lg p-3">
                    <span className="font-bold text-stone-800 block flex items-center gap-1.5">
                      <Truck size={14} className="text-stone-500" /> Acesso Logístico
                    </span>
                    <p className="text-stone-600 mt-1">Estrada de tipo <b>{selectedProperty.roadType}</b>. {selectedProperty.truckAccess ? "Permite tráfego regular de caminhões de materiais." : "Acesso limitado para veículos pesados."}</p>
                  </div>
                  <div className="border border-stone-100 rounded-lg p-3">
                    <span className="font-bold text-stone-800 block flex items-center gap-1.5">
                      <Shield size={14} className="text-emerald-700" /> Segurança Perimetral
                    </span>
                    <p className="text-stone-600 mt-1">Fechamento atual: <b>{selectedProperty.security}</b>. Proprietário {selectedProperty.checklist.permiteCerca ? "autoriza" : "não autoriza"} reformas de segurança SENAD.</p>
                  </div>
                  <div className="border border-stone-100 rounded-lg p-3">
                    <span className="font-bold text-stone-800 block flex items-center gap-1.5">
                      <Layers size={14} className="text-emerald-600" /> Modularidade 100x100m
                    </span>
                    <p className="text-stone-600 mt-1">{selectedProperty.reserve100x100 ? "✓ Área plana livre de 100m x 100m disponível para plantio de 1 hectare regulado." : "⚠️ Dimensões físicas irregulares para expansão uniforme de 1ha."}</p>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {selectedProperty.photos && selectedProperty.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-stone-400 uppercase tracking-wider">Imagens da Propriedade</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProperty.photos.map((ph, idx) => (
                      <div key={idx} className="h-28 rounded-lg overflow-hidden border border-stone-200">
                        <img referrerPolicy="no-referrer" src={ph} alt="Chácara" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Scorecard Audit Checklist */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">Checklist de Auditoria Regulada e Viabilidade</h4>
                    <p className="text-xs text-stone-500">Clique nas caixas para atualizar os requisitos técnicos reais constatados na visita de campo.</p>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                    Pontuação: {calculateChecklistScore(selectedProperty.checklist).score} / {calculateChecklistScore(selectedProperty.checklist).total} Requisitos
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-xs">
                  {/* Water */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "aguaSuficiente")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.aguaSuficiente ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Água abundante para irrigação o ano todo?</span>
                  </div>

                  {/* Energy */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "energiaSuficiente")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.energiaSuficiente ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Energia adequada (Trifásico ou Transformador)?</span>
                  </div>

                  {/* Internet */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "internetFunciona")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.internetFunciona ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Conectividade/Sinal celular funciona?</span>
                  </div>

                  {/* Habitable */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "casaHabitavel")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.casaHabitavel ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Casa de apoio em condições habitáveis imediatas?</span>
                  </div>

                  {/* Road */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "estradaCaminhao")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.estradaCaminhao ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Estrada transitável para caminhões?</span>
                  </div>

                  {/* 1ha size */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "areaUmHectare")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.areaUmHectare ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Permite expansão modular de 1 hectare completo?</span>
                  </div>

                  {/* Fence reform */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "permiteCerca")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.permiteCerca ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Dono autoriza instalação de cerca SENAD?</span>
                  </div>

                  {/* Camera allowed */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "permiteCameras")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.permiteCameras ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Dono permite instalação de câmeras de vigilância?</span>
                  </div>

                  {/* Agriculture activity */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "permiteAtividadeAgricola")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.permiteAtividadeAgricola ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Prefeitura local autoriza cultivo regulado?</span>
                  </div>

                  {/* clear contract */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "contratoClaro")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.contratoClaro ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Minuta de contrato de locação clara e segura?</span>
                  </div>

                  {/* legal docs checked */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "documentosVistos")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.documentosVistos ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Título e documentação do imóvel regularizados?</span>
                  </div>

                  {/* Budget compatible */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "cabeNoOrcamento")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.cabeNoOrcamento ? <CheckSquare className="text-emerald-700 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">Preço e garantia cabem no orçamento inicial?</span>
                  </div>

                  {/* Risco vizinhos (Note: false is positive/green, true is alert/red) */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "riscoVizinhanca")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.riscoVizinhanca ? <CheckSquare className="text-red-600 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">⚠️ Risco iminente de reclamação de vizinhos?</span>
                  </div>

                  {/* Risco seguranca */}
                  <div 
                    onClick={() => toggleChecklistItem(selectedProperty.id, "riscoSeguranca")}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-stone-150 cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    {selectedProperty.checklist.riscoSeguranca ? <CheckSquare className="text-red-600 shrink-0" size={16} /> : <Square className="text-stone-400 shrink-0" size={16} />}
                    <span className="text-stone-700">⚠️ Risco elevado de invasão ou falta de policiamento?</span>
                  </div>
                </div>
              </div>

              {/* Owner Info & Observations */}
              <div className="space-y-2 text-xs border-t border-stone-100 pt-4">
                <h4 className="font-bold text-stone-800">Contato do Proprietário / Imobiliária</h4>
                <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">{selectedProperty.ownerInfo || "Nenhuma informação cadastrada."}</p>
                
                {selectedProperty.observations && (
                  <>
                    <h4 className="font-bold text-stone-800 pt-2">Observações Adicionais</h4>
                    <p className="text-stone-600 leading-relaxed">{selectedProperty.observations}</p>
                  </>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8 text-center text-stone-400 text-sm">
              Nenhuma chácara selecionada para avaliação técnica.
            </div>
          )}
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Cadastrar Nova Chácara / Imóvel para Avaliação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome Identificador da Propriedade *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Chácara San Francisco (Hernandarias)"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Cidade</label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Hernandarias"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Departamento / Região</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Alto Paraná">Alto Paraná</option>
                    <option value="Central">Central (próximo Asunción)</option>
                    <option value="Caaguazú">Caaguazú</option>
                    <option value="Itapúa">Itapúa</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Endereço Completo</label>
                  <input 
                    type="text" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Ruta PY02 Km 12, a 2.000m do asfalto"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* GPS */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Coordenadas GPS</label>
                  <input 
                    type="text" 
                    value={gps}
                    onChange={(e) => setGps(e.target.value)}
                    placeholder="-25.412845, -54.631522"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Distância */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Distância da Cidade Mais Próxima</label>
                  <input 
                    type="text" 
                    value={distanceCity}
                    onChange={(e) => setDistanceCity(e.target.value)}
                    placeholder="Ex: 8 km do centro"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Área Total */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Área Total</label>
                  <input 
                    type="text" 
                    required
                    value={totalArea}
                    onChange={(e) => setTotalArea(e.target.value)}
                    placeholder="Ex: 12.000 m² (1.2ha)"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Área Útil */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Área Útil para Cultivo</label>
                  <input 
                    type="text" 
                    required
                    value={usableArea}
                    onChange={(e) => setUsableArea(e.target.value)}
                    placeholder="Ex: 1.0 hectare útil plano"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Rent Value */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Aluguel Estimado (USD) *</label>
                  <input 
                    type="number" 
                    required
                    value={rentValue}
                    onChange={(e) => setRentValue(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Deposit Value */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Caução de Garantia (USD)</label>
                  <input 
                    type="number" 
                    value={depositValue}
                    onChange={(e) => setDepositValue(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Eletricity */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Energia Elétrica Disponível</label>
                  <select
                    value={electricity}
                    onChange={(e) => setElectricity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Trifásico (380V)">Trifásico (380V) - Recomendado</option>
                    <option value="Monofásico (220V)">Monofásico (220V)</option>
                    <option value="Sem Energia">Sem Energia (Necessita de Transformador)</option>
                  </select>
                </div>

                {/* Water supply */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Fonte de Água</label>
                  <select
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Poço Artesiano">Poço Artesiano</option>
                    <option value="Água Encanada / Sanepar">Água Encanada</option>
                    <option value="Córrego / Coche">Rio / Córrego Próximo</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status de Avaliação</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(PropertyStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Owner info */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Dono / Corretor (Contato)</label>
                  <input 
                    type="text" 
                    value={ownerInfo}
                    onChange={(e) => setOwnerInfo(e.target.value)}
                    placeholder="Ex: Mateo González - +59598..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Observations */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Notas Adicionais de Campo</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                    placeholder="Insira observações relevantes anotadas durante a visita presencial..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1">
                  <Check size={14} /> Cadastrar para Auditoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
