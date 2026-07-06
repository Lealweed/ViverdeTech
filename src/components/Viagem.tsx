/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Compass,
  Plus,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  X,
  Map,
  CheckSquare,
  Square,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { Visit, VisitStatus } from "../types";

interface ViagemProps {
  visits: Visit[];
  setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Viagem({ visits, setVisits, addAuditLog }: ViagemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<"Asuncion" | "CDE" | "Caaguazu" | "Ypacarai">("Asuncion");

  // Form states
  const [plannedDate, setPlannedDate] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Asunción");
  const [type, setType] = useState<any>("Órgão Público");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<VisitStatus>(VisitStatus.VisitaAgendada);
  const [result, setResult] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert("Por favor, preencha o nome do local e o endereço.");
      return;
    }

    const newVisit: Visit = {
      id: "v-" + Date.now(),
      name,
      type,
      address,
      city,
      gps: "-25.3000, -57.6300",
      contact,
      plannedDate: plannedDate || new Date().toISOString().split("T")[0],
      status,
      result,
      photos: [],
      documents: [],
      nextAction: "Acompanhar andamento protocolar."
    };

    setVisits(prev => [...prev, newVisit]);
    addAuditLog("Agendou Compromisso", `Adicionou visita a ${name} para ${result}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setAddress("");
    setContact("");
    setResult("");
  };

  const toggleVisitStatus = (id: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id === id) {
        const newStatus = v.status === VisitStatus.Visitado ? VisitStatus.VisitaAgendada : VisitStatus.Visitado;
        return { ...v, status: newStatus };
      }
      return v;
    }));
    addAuditLog("Status Compromisso", `Alterou status do compromisso ID ${id}`);
  };

  const hubDetails = {
    Asuncion: {
      title: "Asunción (Capital)",
      legal: "Centro jurídico e político paraguaio. Sede da DINAVISA, SENAD, MIC e dos principais cartórios (escribanías).",
      agri: "Ideal para reuniões de homologação, registro societário S.A. e networking de compliance.",
      logistics: "Localizada a 330km de Ciudad del Este. Conexão direta com aeroporto internacional Silvio Pettirossi."
    },
    CDE: {
      title: "Ciudad del Este / Hernandarias (Fronteira)",
      legal: "Polo industrial e tributário ativo. Hernandarias é referência regulamentada de cânhamo industrial.",
      agri: "Fácil acesso a fornecedores de tubos galvanizados, lona de estufa, fertilizantes e instaladores hidráulicos.",
      logistics: "Ligação direta com o Brasil via Ponte da Amizade. Chácaras de 1ha fáceis de arrendar na região."
    },
    Caaguazu: {
      title: "Caaguazú (Coração Agrícola)",
      legal: "Prefeituras locais facilitadoras para plantios protegidos orgânicos e cooperativas hortícolas.",
      agri: "Solos vermelhos profundos de altíssima qualidade. Abundância de água subterrânea sem necessidade de poços profundos.",
      logistics: "Cortada pela Ruta PY02. Posição geográfica centralizada e estratégica para escoamento logístico."
    },
    Ypacarai: {
      title: "Ypacaraí / Luque (Logística Central)",
      legal: "Zonas industriais organizadas que permitem a instalação de laboratórios de secagem e embalagem.",
      agri: "Microclima favorável e proximidade da capital Asunción (apenas 40km), permitindo logística rápida de extratos e flores sob refrigeração.",
      logistics: "Excelente acesso elétrico trifásico (ANDE) de alta estabilidade."
    }
  };

  return (
    <div className="space-y-6 text-stone-800">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Roteiro de Viagem e Reconhecimento (Paraguai)</h2>
          <p className="text-stone-500 text-sm">Organize as datas das vistorias presenciais de chácaras, reuniões jurídicas com escreventes de cartório e encontros com órgãos reguladores (SENAD/DINAVISA).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Agendar Compromisso
        </button>
      </div>

      {/* Map Guidance Hubs Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive map Pin Selection Panel */}
        <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60 flex items-center gap-1.5">
            <Map size={14} className="text-emerald-700" /> Guia Geográfico de Hubs Produtivos
          </h3>

          <p className="text-xs text-stone-500 leading-relaxed">
            Selecione uma região para entender suas vantagens técnicas, logísticas e regulatórias para a instalação modular do ViVerdetech:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            {Object.keys(hubDetails).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedHub(key as any)}
                className={`p-2.5 rounded-lg border font-bold text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedHub === key 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold"
                    : "bg-[#F8FAF9] border-emerald-100 hover:bg-emerald-50 text-stone-600"
                }`}
              >
                <MapPin size={12} className={selectedHub === key ? "text-emerald-700" : "text-stone-400"} />
                {key === "Asuncion" ? "Asunción" : key === "CDE" ? "Hernandarias" : key === "Caaguazu" ? "Caaguazú" : "Ypacaraí"}
              </button>
            ))}
          </div>

          <div className="bg-[#F8FAF9] p-3.5 rounded-xl border border-emerald-100/55 text-xs space-y-2 pt-4">
            <span className="font-extrabold text-emerald-800 text-[10px] uppercase block tracking-wider">
              {hubDetails[selectedHub].title}
            </span>
            <p className="text-stone-700 leading-relaxed">{hubDetails[selectedHub].legal}</p>
            <p className="text-stone-600 leading-relaxed"><b className="text-stone-700">Agrícola:</b> {hubDetails[selectedHub].agri}</p>
            <p className="text-stone-600 leading-relaxed"><b className="text-stone-700">Logística:</b> {hubDetails[selectedHub].logistics}</p>
          </div>
        </div>

        {/* Travel Timeline checklist (Righthand side / 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Cronograma de Atividades e Vistorias</h3>
          
          <div className="space-y-3">
            {visits.map(v => (
              <div 
                key={v.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                  v.status === VisitStatus.Visitado ? "bg-stone-50/50 border-stone-200" : "bg-white border-emerald-50 shadow-sm hover:border-emerald-200"
                }`}
              >
                {/* Checkbox */}
                <button 
                  onClick={() => toggleVisitStatus(v.id)}
                  className="mt-1 text-stone-300 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                >
                  {v.status === VisitStatus.Visitado ? <CheckSquare className="text-emerald-700" size={18} /> : <Square className="text-stone-300" size={18} />}
                </button>

                <div className="grow text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-bold bg-[#F8FAF9] text-stone-600 px-2 py-0.5 rounded border border-emerald-50">
                      {v.plannedDate} ({v.city})
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${v.status === VisitStatus.Visitado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {v.status}
                    </span>
                  </div>

                  <h4 className={`font-bold text-stone-900 text-sm ${v.status === VisitStatus.Visitado ? "line-through text-stone-400 font-normal" : "font-display text-emerald-900"}`}>
                    {v.name} ({v.type})
                  </h4>

                  <p className="text-stone-500 font-semibold flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-600" /> {v.address}
                  </p>

                  {v.contact && (
                    <p className="text-stone-600">Contato: <b>{v.contact}</b></p>
                  )}

                  {v.result && (
                    <p className="text-stone-600 italic bg-[#F8FAF9] p-2 rounded border border-emerald-100/50 mt-2"><b>Objetivo/Resultado:</b> "{v.result}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-sm">Agendar Compromisso de Viagem</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
              {/* Local */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Local / Entidade *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Escribanía Sonia González"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Endereço Completo *</label>
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Mariscal López, 2410"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Tipo de Compromisso */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Local</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  <option value="Órgão Público">Órgão Público (SENAD, DINAVISA etc.)</option>
                  <option value="Chácara">Chácara / Imóvel</option>
                  <option value="Advogado">Assessoria Jurídica</option>
                  <option value="Contador">Contabilidade</option>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Laboratório">Laboratório</option>
                </select>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Cidade Paraguaia</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  <option value="Asunción">Asunción (Capital)</option>
                  <option value="Hernandarias">Hernandarias (Alto Paraná)</option>
                  <option value="Ciudad del Este">Ciudad del Este</option>
                  <option value="Caaguazú">Caaguazú</option>
                  <option value="Ypacaraí">Ypacaraí</option>
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Data Planejada</label>
                <input 
                  type="date" 
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Contato no Local */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome de Contato / Responsável</label>
                <input 
                  type="text" 
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Ex: Dra. Sonia Franco"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Objetivo / Resultado */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Objetivo / Resultado Esperado</label>
                <textarea 
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  rows={2}
                  placeholder="Assinar protocolo ou registrar soil analytics..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
