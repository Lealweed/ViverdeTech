/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  FileText,
  Plus,
  Upload,
  Search,
  Check,
  X,
  Trash2,
  Calendar,
  ArrowDownToLine,
  Sparkles
} from "lucide-react";
import { AppDocument } from "../types";

interface DocumentosProps {
  documents: AppDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<AppDocument[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Documentos({ documents, setDocuments, addAuditLog }: DocumentosProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  
  // Simulated File Upload triggers
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for manual registration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Jurídico S.A.");
  const [associatedModule, setAssociatedModule] = useState<"Contatos" | "Chácaras" | "Fornecedores" | "Compradores" | "Licenças" | "Lotes" | "Financeiro" | "Geral">("Geral");
  const [observation, setObservation] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateUpload(e.target.files[0]);
    }
  };

  // Process a simulated upload
  const handleSimulateUpload = (file: File) => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    // Guess category from name
    let guessedCategory = "Outro";
    let guessedModule: "Contatos" | "Chácaras" | "Fornecedores" | "Compradores" | "Licenças" | "Lotes" | "Financeiro" | "Geral" = "Geral";
    const nameLower = file.name.toLowerCase();

    if (nameLower.includes("constitucion") || nameLower.includes("ruc") || nameLower.includes("sa") || nameLower.includes("estatuto")) {
      guessedCategory = "Jurídico S.A.";
      guessedModule = "Geral";
    } else if (nameLower.includes("licencia") || nameLower.includes("senad") || nameLower.includes("dinavisa") || nameLower.includes("senave")) {
      guessedCategory = "Licenciamento";
      guessedModule = "Licenças";
    } else if (nameLower.includes("contrato") || nameLower.includes("compra") || nameLower.includes("offtake") || nameLower.includes("acuerdo")) {
      guessedCategory = "Comercial / Contratos";
      guessedModule = "Compradores";
    } else if (nameLower.includes("laudo") || nameLower.includes("analisis") || nameLower.includes("solo") || nameLower.includes("cbd") || nameLower.includes("thc")) {
      guessedCategory = "Laudo Técnico";
      guessedModule = "Lotes";
    }

    const newDoc: AppDocument = {
      id: "doc-" + Date.now(),
      name: file.name,
      type: guessedCategory,
      relatedModule: guessedModule,
      fileSize: `${sizeMB} MB`,
      date: new Date().toISOString().split("T")[0],
      observation: "Carregamento via painel interativo ViVerdetech drag-and-drop.",
      protocolNumber: `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fileUrl: "#",
      responsible: "Sócio Administrador (Simulado)"
    };

    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog("Upload Documento", `Documento simulado carregado: ${file.name} (${sizeMB} MB)`);
    alert(`Sucesso! Documento "${file.name}" carregado e associado à pasta de ${guessedCategory}.`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, dê um nome ao documento.");
      return;
    }

    const newDoc: AppDocument = {
      id: "doc-" + Date.now(),
      name: name.endsWith(".pdf") ? name : `${name}.pdf`,
      type: category,
      relatedModule: associatedModule,
      fileSize: "1.2 MB",
      date: new Date().toISOString().split("T")[0],
      observation,
      protocolNumber: `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fileUrl: "#",
      responsible: "Sócio Administrador"
    };

    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog("Registrou Documento", `Fichamento manual de documento: ${name}`);
    setIsModalOpen(false);

    // Reset
    setName("");
    setObservation("");
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm("Deseja realmente remover este documento do dossiê digital?")) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      addAuditLog("Excluiu Documento", "Apagou arquivo do dossiê digital.");
    }
  };

  // Filter & Search
  const filteredDocs = documents.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.relatedModule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.observation && d.observation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "todos" || d.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Dossiê e Documentoteca Digital</h2>
          <p className="text-stone-500 text-sm">Organize as escrituras da chácara, contratos de offtake, estatutos constitutivos da S.A. paraguaia e certidões regulatórias oficiais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Fichar Documento Manual
        </button>
      </div>

      {/* Main Grid: Left interactive Drag and Drop upload, Right list and filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive drag-and-drop box */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Upload de Arquivos Regulatórios</h3>
          
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-64 ${
              dragActive 
                ? "border-emerald-600 bg-emerald-50/50 scale-102" 
                : "border-emerald-100 bg-white hover:border-emerald-500 hover:bg-emerald-50/10"
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple={false}
              onChange={handleFileSelect}
              className="hidden" 
            />
            
            <div className="bg-[#F8FAF9] text-emerald-700 p-3 rounded-full mb-3 border border-emerald-100/60">
              <Upload size={24} />
            </div>
            
            <span className="font-bold text-stone-700 text-xs block">Arraste seus laudos e licenças aqui</span>
            <span className="text-stone-400 text-[10px] mt-1 block">Aceita arquivos em formato .pdf ou .jpg (Máx: 25MB)</span>
            
            <span className="mt-4 text-emerald-800 text-[10px] font-bold border border-emerald-200 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Ou selecione do computador
            </span>
          </div>

          <div className="bg-emerald-800 text-emerald-100 rounded-2xl p-4 text-xs space-y-2 leading-relaxed border border-emerald-950">
            <span className="font-extrabold text-white text-[10px] uppercase block tracking-wider">💡 Dica de Auditoria</span>
            <p>
              Ao arrastar arquivos com palavras-chave como <b>"RUC"</b>, <b>"SENAD"</b> ou <b>"Laudo"</b>, o sistema de upload do ViVerdetech categoriza o documento automaticamente na pasta adequada.
            </p>
          </div>
        </div>

        {/* Documents filter and list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:grow">
              <Search size={16} className="absolute left-3 top-3.5 text-stone-400" />
              <input 
                type="text" 
                placeholder="Buscar documento por nome ou anotação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-9 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-56 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
              >
                <option value="todos">Todas as Categorias</option>
                <option value="Jurídico S.A.">Jurídico S.A.</option>
                <option value="Licenciamento">Licenciamento</option>
                <option value="Comercial / Contratos">Comercial / Contratos</option>
                <option value="Laudo Técnico">Laudo Técnico</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
                Nenhum documento cadastrado ou filtrado nesta categoria.
              </div>
            ) : (
              filteredDocs.map(d => (
                <div key={d.id} className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm hover:border-emerald-200 transition-all flex items-start gap-4 text-stone-800">
                  {/* File Icon */}
                  <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg border border-emerald-100 shrink-0">
                    <FileText size={20} />
                  </div>

                  {/* Details */}
                  <div className="grow space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[9px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 uppercase">
                        {d.type}
                      </span>
                      {d.protocolNumber && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          Nº PROTOCOLO: {d.protocolNumber}
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-sm break-all">{d.name}</h4>
                    <p className="text-stone-500 text-[11px]">Mapeado em: <b>{d.relatedModule}</b> • Tamanho: {d.fileSize}</p>

                    {d.observation && (
                      <p className="text-stone-400 italic text-[11px] leading-relaxed">"{d.observation}"</p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-50 mt-2">
                      <span className="text-[10px] text-stone-500 font-semibold flex items-center gap-1">
                        <Calendar size={12} /> Carregado em: {d.date}
                      </span>

                      <div className="flex gap-2">
                        <a 
                          href={d.fileUrl}
                          className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-extrabold text-[10px] px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                        >
                          <ArrowDownToLine size={12} /> Baixar PDF
                        </a>

                        <button 
                          onClick={() => handleDeleteDoc(d.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-stone-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">Fichar Documento Manual</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleManualSubmit} className="p-6 space-y-4 text-stone-800">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome do Documento / Título *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Estatuto Constitutivo ViVerdetech S.A."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Categoria de Organização</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  <option value="Jurídico S.A.">Jurídico S.A.</option>
                  <option value="Licenciamento">Licenciamento</option>
                  <option value="Comercial / Contratos">Comercial / Contratos</option>
                  <option value="Laudo Técnico">Laudo Técnico</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Mapeamento físico */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Setor / Mapeamento Associado</label>
                <select
                  value={associatedModule}
                  onChange={(e) => setAssociatedModule(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm font-bold"
                >
                  <option value="Geral">Geral (Constituição/Empresa)</option>
                  <option value="Contatos">Contatos (CRM)</option>
                  <option value="Chácaras">Chácaras / Propriedade</option>
                  <option value="Fornecedores">Fornecedores</option>
                  <option value="Compradores">Compradores</option>
                  <option value="Licenças">Licenças & Compliance</option>
                  <option value="Lotes">Lotes & Rastreabilidade</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Observações / Anotações do Dossiê</label>
                <textarea 
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  rows={2}
                  placeholder="Ex: Cópia física autenticada na gaveta 2..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  <Check size={14} /> Registrar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
