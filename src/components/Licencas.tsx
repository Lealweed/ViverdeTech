/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileCheck,
  Plus,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  Coins,
  Shield,
  FileText,
  User,
  Calendar,
  XCircle,
  ArrowRight,
  Info,
  Check
} from "lucide-react";
import { License, OrganResponsable, LicenseStatus } from "../types";

interface LicencasProps {
  licenses: License[];
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Licencas({ licenses, setLicenses, addAuditLog }: LicencasProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [organ, setOrgan] = useState<OrganResponsable>(OrganResponsable.Outro);
  const [type, setType] = useState<"Licença Prévia" | "Registro" | "Autorização de Plantio" | "Contrato" | "Alvará" | "Outro">("Licença Prévia");
  const [status, setStatus] = useState<LicenseStatus>(LicenseStatus.NaoIniciado);
  const [internalResponsible, setInternalResponsible] = useState("Admin (Você)");
  const [externalResponsible, setExternalResponsible] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [realCost, setRealCost] = useState(0);
  const [currency, setCurrency] = useState<"USD" | "PYG" | "BRL">("USD");
  const [requiredDocsInput, setRequiredDocsInput] = useState("");
  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [observations, setObservations] = useState("");
  const [risk, setRisk] = useState<"Baixo" | "Médio" | "Alto">("Baixo");
  const [nextStep, setNextStep] = useState("");

  const handleAddDoc = () => {
    if (requiredDocsInput.trim() && !requiredDocs.includes(requiredDocsInput.trim())) {
      setRequiredDocs([...requiredDocs, requiredDocsInput.trim()]);
      setRequiredDocsInput("");
    }
  };

  const handleRemoveDoc = (index: number) => {
    setRequiredDocs(requiredDocs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, preencha o nome do processo regulatório.");
      return;
    }

    const newLicense: License = {
      id: "l-" + Date.now(),
      name,
      organ,
      type,
      status,
      internalResponsible,
      externalResponsible,
      deadline,
      estimatedCost,
      realCost,
      currency,
      requiredDocs,
      files: [],
      protocolDate: status === LicenseStatus.Protocolado ? new Date().toISOString().split("T")[0] : "",
      expirationDate: "",
      renewalRequired: type === "Alvará" || type === "Autorização de Plantio",
      observations,
      risk,
      nextStep
    };

    setLicenses(prev => [...prev, newLicense]);
    addAuditLog("Adicionou Processo", `Abriu acompanhamento de licença: ${name}`);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setExternalResponsible("");
    setDeadline("");
    setEstimatedCost(0);
    setRealCost(0);
    setRequiredDocs([]);
    setObservations("");
    setNextStep("");
  };

  const handleStatusChange = (id: string, newStatus: LicenseStatus) => {
    setLicenses(prev => prev.map(l => {
      if (l.id === id) {
        return { 
          ...l, 
          status: newStatus,
          protocolDate: newStatus === LicenseStatus.Protocolado ? new Date().toISOString().split("T")[0] : l.protocolDate
        };
      }
      return l;
    }));
    addAuditLog("Status Licença", `Atualizou status da licença ID ${id} para ${newStatus}`);
  };

  const totalEstimatedCostUSD = licenses.reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.estimatedCost / 7500 : curr.estimatedCost), 0);
  const totalRealCostUSD = licenses.reduce((acc, curr) => acc + (curr.currency === "PYG" ? curr.realCost / 7500 : curr.realCost), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Compliance Regulatório e Licenciamento</h2>
          <p className="text-stone-500 text-sm">Monitore os prazos, as taxas oficiais e as exigências legais para operar com segurança e 100% de compliance legal no Paraguai.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Acompanhar Processo
        </button>
      </div>

      {/* Compliance Financial Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-800">
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Custo Estimado Legal</span>
            <span className="text-xl font-black text-emerald-900">${totalEstimatedCostUSD.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD</span>
          </div>
          <div className="bg-emerald-50/55 p-2.5 rounded-xl text-emerald-700 border border-emerald-100/30">
            <Coins size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Custo Regulatório Real</span>
            <span className="text-xl font-black text-emerald-900">${totalRealCostUSD.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD</span>
          </div>
          <div className="bg-emerald-50/55 p-2.5 rounded-xl text-emerald-700 border border-emerald-100/30">
            <Coins size={20} className="text-emerald-700" />
          </div>
        </div>

        <div className="bg-emerald-950 p-4 rounded-2xl text-emerald-200 border border-emerald-900 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5 pr-2">
            <span className="text-[10px] text-emerald-300 font-extrabold uppercase block tracking-wider">Estratégia de Risco Regulatório</span>
            <span className="text-xs font-semibold block leading-relaxed text-white">Plano B Cânhamo Industrial ativo para rápido fluxo de caixa enquanto cannabis medicinal tramita.</span>
          </div>
          <div className="bg-emerald-900/50 p-2.5 rounded-xl text-emerald-350 border border-emerald-800/30 shrink-0">
            <Shield size={20} />
          </div>
        </div>
      </div>

      {/* Licenses Timeline Flowcard List */}
      <div className="space-y-4">
        {licenses.map(l => (
          <div key={l.id} className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 grid grid-cols-1 lg:grid-cols-4 gap-6 hover:border-emerald-200 transition-all text-stone-800">
            
            {/* Column 1: Organ & Status */}
            <div className="space-y-3 lg:border-r lg:border-stone-100 lg:pr-6">
              <div>
                <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                  {l.organ}
                </span>
                <h3 className="font-bold text-stone-900 text-sm mt-1.5 leading-snug">{l.name}</h3>
                <p className="text-xs text-stone-400 font-medium mt-0.5">{l.type}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Status Atual</span>
                <select
                  value={l.status}
                  onChange={(e) => handleStatusChange(l.id, e.target.value as LicenseStatus)}
                  className={`p-1 text-xs font-semibold rounded-lg border focus:ring-1 focus:ring-emerald-500 bg-stone-50 ${
                    l.status === LicenseStatus.Aprovado ? "border-emerald-200 text-emerald-700 bg-emerald-50/20" :
                    l.status === LicenseStatus.Recusado || l.status === LicenseStatus.Vencido ? "border-red-200 text-red-700" :
                    l.status === LicenseStatus.Protocolado || l.status === LicenseStatus.EmAnalise ? "border-blue-200 text-blue-700" :
                    "border-stone-200 text-stone-600"
                  }`}
                >
                  {Object.values(LicenseStatus).map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Column 2: Details & Responsibilities */}
            <div className="space-y-3 lg:col-span-2 lg:border-r lg:border-stone-100 lg:pr-6 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Resp. Interno</span>
                  <span className="font-semibold text-stone-700 flex items-center gap-1 mt-0.5">
                    <User size={12} /> {l.internalResponsible}
                  </span>
                </div>
                {l.externalResponsible && (
                  <div>
                    <span className="text-stone-400 text-[10px] font-bold uppercase block">Resp. Externo (Apoio)</span>
                    <span className="font-semibold text-stone-700 flex items-center gap-1 mt-0.5">
                      <User size={12} /> {l.externalResponsible}
                    </span>
                  </div>
                )}
              </div>

              {l.nextStep && (
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-start gap-1.5">
                  <ArrowRight size={14} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-800 font-bold block text-[9px] uppercase tracking-wide">Próximo Passo Legal</span>
                    <span className="text-amber-900 leading-relaxed font-medium">{l.nextStep}</span>
                  </div>
                </div>
              )}

              {l.observations && (
                <p className="text-stone-600 leading-relaxed">{l.observations}</p>
              )}
            </div>

            {/* Column 3: Dates, Costs, Action Toggles */}
            <div className="space-y-4 text-xs flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Prazo Alvo</span>
                  <span className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                    <Calendar size={12} /> {l.deadline || "A definir"}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Risco Processo</span>
                  <span className={`font-bold mt-0.5 inline-block px-1.5 py-0.2 rounded text-[10px] ${
                    l.risk === "Alto" ? "bg-red-100 text-red-700" :
                    l.risk === "Médio" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {l.risk}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] font-bold uppercase block">Custo Est. / Real</span>
                  <span className="font-semibold text-stone-700 mt-0.5 block">
                    ${l.estimatedCost} / <b className="text-emerald-700">${l.realCost}</b> {l.currency}
                  </span>
                </div>
                {l.protocolDate && (
                  <div className="text-right">
                    <span className="text-stone-400 text-[10px] font-bold uppercase block">Protocolado Em</span>
                    <span className="font-semibold text-stone-700 mt-0.5 block">{l.protocolDate}</span>
                  </div>
                )}
              </div>

              {/* Requirement Documents list link */}
              {l.requiredDocs && l.requiredDocs.length > 0 && (
                <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                  <span className="text-[9px] uppercase font-bold text-stone-500 block mb-1">Dossiê Exigido ({l.requiredDocs.length})</span>
                  <ul className="list-disc list-inside text-[10px] text-stone-600 space-y-1">
                    {l.requiredDocs.slice(0, 2).map((doc, idx) => (
                      <li key={idx} className="truncate" title={doc}>{doc}</li>
                    ))}
                    {l.requiredDocs.length > 2 && <li className="text-stone-400 italic">+{l.requiredDocs.length - 2} mais</li>}
                  </ul>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Iniciar Processo Regulatório</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow text-stone-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome Processo */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome / Título do Processo Legal *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Registro do Estabelecimento na DINAVISA"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Orgão Responsável */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Órgão Público / Órgão Competente</label>
                  <select
                    value={organ}
                    onChange={(e) => setOrgan(e.target.value as OrganResponsable)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(OrganResponsable).map((o, idx) => (
                      <option key={idx} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Documento</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Licença Prévia">Licença Prévia</option>
                    <option value="Registro">Registro</option>
                    <option value="Autorização de Plantio">Autorização de Plantio</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Alvará">Alvará / Licença Local</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Prazo */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Data Prazo de Conclusão Alvo</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status de Andamento</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LicenseStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(LicenseStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Cost Est */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Taxa Oficial Estimada (USD)</label>
                  <input 
                    type="number" 
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Cost Real */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Custo Real Pago (USD)</label>
                  <input 
                    type="number" 
                    value={realCost}
                    onChange={(e) => setRealCost(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Responsável Externo */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Assessoria Externa (Advogado/Gestor)</label>
                  <input 
                    type="text" 
                    value={externalResponsible}
                    onChange={(e) => setExternalResponsible(e.target.value)}
                    placeholder="Ex: Dr. Alejandro Peralta"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Risco */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nível de Risco de Deferimento</label>
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    <option value="Baixo">Baixo - Trâmite administrativo comum</option>
                    <option value="Médio">Médio - Exige vistorias prévias comuns</option>
                    <option value="Alto">Alto - Processo burocrático complexo</option>
                  </select>
                </div>

                {/* Próximo Passo */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Próxima Ação Imediata Requerida</label>
                  <input 
                    type="text" 
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    placeholder="Ex: Enviar comprovante de capital da S.A. para a escribanía"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Dossiê required items */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Dossiê / Documentos Necessários</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={requiredDocsInput}
                      onChange={(e) => setRequiredDocsInput(e.target.value)}
                      placeholder="Ex: Registro cadastral da chácara, Cópia do RUC..."
                      className="grow bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDoc();
                        }
                      }}
                    />
                    <button type="button" onClick={handleAddDoc} className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 text-xs font-semibold rounded-lg border border-stone-250">
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredDocs.map((doc, idx) => (
                      <span key={idx} className="bg-stone-100 border border-stone-250 text-stone-700 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold">
                        {doc}
                        <button type="button" onClick={() => handleRemoveDoc(idx)} className="hover:bg-stone-200 rounded-full p-0.5">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Anotações e Histórico</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                    placeholder="Adicione observações de acompanhamento, telefone do analista..."
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
                  <Check size={14} /> Iniciar Trâmite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
