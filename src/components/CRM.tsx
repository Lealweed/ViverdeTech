/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Tag,
  User,
  Phone,
  FileText,
  X,
  Filter,
  Check
} from "lucide-react";
import { Contact, ContactType, ContactStatus, PriorityLevel } from "../types";

interface CRMProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function CRM({ contacts, setContacts, addAuditLog }: CRMProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<ContactType>(ContactType.Outro);
  const [country, setCountry] = useState("Paraguai");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [responsible, setResponsible] = useState("Admin (Você)");
  const [language, setLanguage] = useState("Espanhol / Português");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<ContactStatus>(ContactStatus.Novo);
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.Media);
  const [observations, setObservations] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Detailed contact view drawer/modal
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const resetForm = () => {
    setName("");
    setCompany("");
    setType(ContactType.Outro);
    setCountry("Paraguai");
    setCity("");
    setAddress("");
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setSite("");
    setResponsible("Admin (Você)");
    setLanguage("Espanhol / Português");
    setSource("");
    setStatus(ContactStatus.Novo);
    setPriority(PriorityLevel.Media);
    setObservations("");
    setNextAction("");
    setTagInput("");
    setTags([]);
    setEditingContact(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Contact) => {
    setEditingContact(c);
    setName(c.name);
    setCompany(c.company);
    setType(c.type);
    setCountry(c.country);
    setCity(c.city);
    setAddress(c.address);
    setPhone(c.phone);
    setWhatsapp(c.whatsapp);
    setEmail(c.email);
    setSite(c.site);
    setResponsible(c.responsible);
    setLanguage(c.language);
    setSource(c.source);
    setStatus(c.status);
    setPriority(c.priority);
    setObservations(c.observations);
    setNextAction(c.nextAction);
    setTags(c.tags || []);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm("Deseja realmente remover este contato do CRM?")) {
      const contactToDelete = contacts.find(c => c.id === id);
      setContacts(prev => prev.filter(c => c.id !== id));
      addAuditLog("Excluiu Contato", `Removeu o contato ${contactToDelete?.name} (${contactToDelete?.company})`);
      if (viewingContact?.id === id) setViewingContact(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, preencha o nome do contato.");
      return;
    }

    if (editingContact) {
      // Edit
      setContacts(prev => prev.map(c => {
        if (c.id === editingContact.id) {
          return {
            ...c,
            name,
            company,
            type,
            country,
            city,
            address,
            phone,
            whatsapp,
            email,
            site,
            responsible,
            language,
            source,
            status,
            priority,
            observations,
            nextAction,
            tags,
            lastContactDate: new Date().toISOString().split("T")[0]
          };
        }
        return c;
      }));
      addAuditLog("Editou Contato", `Atualizou os dados de ${name} (${company})`);
    } else {
      // Add
      const newContact: Contact = {
        id: "c-" + Date.now(),
        name,
        company,
        type,
        country,
        city,
        address,
        phone,
        whatsapp,
        email,
        site,
        responsible,
        language,
        source,
        status,
        priority,
        firstContactDate: new Date().toISOString().split("T")[0],
        lastContactDate: new Date().toISOString().split("T")[0],
        observations,
        nextAction,
        tags,
        files: []
      };
      setContacts(prev => [newContact, ...prev]);
      addAuditLog("Cadastrou Contato", `Adicionou o contato ${name} como ${type}`);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Filter & Search
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.observations && c.observations.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "todos" || c.type === selectedType;
    const matchesStatus = selectedStatus === "todos" || c.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">CRM de Contatos e Reguladores</h2>
          <p className="text-stone-500 text-sm">Gerencie o relacionamento com contadores, advogados, órgãos públicos, vizinhos e parceiros regulados.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Cadastrar Contato
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:grow">
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, empresa, cidade, notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todos os Tipos</option>
            {Object.values(ContactType).map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todos os Status</option>
            {Object.values(ContactStatus).map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: List on left (or full), Details panel on right if selected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contacts Table List */}
        <div className={`bg-white rounded-2xl border border-emerald-50 shadow-sm overflow-hidden ${viewingContact ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-emerald-50/80 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">Nome / Empresa</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Cidade / País</th>
                  <th className="p-4">Prioridade</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400 text-sm">
                      Nenhum contato encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(c => (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-stone-50/50 transition-colors cursor-pointer text-stone-800 ${viewingContact?.id === c.id ? "bg-emerald-50/30 font-medium" : ""}`}
                      onClick={() => setViewingContact(c)}
                    >
                      <td className="p-4 pl-6">
                        <div className="font-bold text-stone-900">{c.name}</div>
                        <div className="text-stone-500 text-xs">{c.company || "Pessoa Física"}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {c.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-stone-600">
                        {c.city ? `${c.city}, ${c.country}` : c.country}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          c.priority === PriorityLevel.Critica ? "bg-red-100 text-red-700" :
                          c.priority === PriorityLevel.Alta ? "bg-amber-100 text-amber-700" :
                          c.priority === PriorityLevel.Media ? "bg-blue-100 text-blue-700" :
                          "bg-stone-100 text-stone-600"
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          c.status === ContactStatus.Aprovado ? "bg-emerald-100 text-emerald-700" :
                          c.status === ContactStatus.Novo ? "bg-blue-100 text-blue-700" :
                          c.status === ContactStatus.EmNegociacao ? "bg-purple-100 text-purple-700" :
                          c.status === ContactStatus.Descartado ? "bg-stone-100 text-stone-400" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(c)}
                            title="Editar Contato"
                            className="text-stone-400 hover:text-emerald-700 p-1 rounded-md hover:bg-stone-100 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteContact(c.id)}
                            title="Excluir Contato"
                            className="text-stone-400 hover:text-red-600 p-1 rounded-md hover:bg-stone-100 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Contact View Panel */}
        {viewingContact && (
          <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-6 relative self-start">
            <button 
              onClick={() => setViewingContact(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-100 inline-block mb-2">
                {viewingContact.type}
              </span>
              <h3 className="text-lg font-bold text-emerald-900 font-display">{viewingContact.name}</h3>
              <p className="text-stone-500 text-xs font-semibold">{viewingContact.company || "Pessoa Física"}</p>
            </div>

            <div className="flex gap-2">
              {viewingContact.whatsapp && (
                <a 
                  href={`https://wa.me/${viewingContact.whatsapp.replace(/\D/g, "")}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm grow justify-center transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
              {viewingContact.email && (
                <a 
                  href={`mailto:${viewingContact.email}`}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 grow justify-center transition-colors"
                >
                  <Mail size={14} /> E-mail
                </a>
              )}
            </div>

            <div className="space-y-3.5 text-xs border-t border-stone-100 pt-4">
              {viewingContact.city && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-stone-400 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block text-[10px] font-semibold uppercase">Localização</span>
                    <span className="text-stone-700 font-medium">{viewingContact.address ? `${viewingContact.address}, ${viewingContact.city} - ${viewingContact.country}` : `${viewingContact.city}, ${viewingContact.country}`}</span>
                  </div>
                </div>
              )}

              {viewingContact.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="text-stone-400 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block text-[10px] font-semibold uppercase">Telefone</span>
                    <span className="text-stone-700 font-medium">{viewingContact.phone}</span>
                  </div>
                </div>
              )}

              {viewingContact.nextAction && (
                <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200/50">
                  <Calendar size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-amber-800 block text-[10px] font-bold uppercase">Próxima Ação</span>
                    <span className="text-amber-900 font-medium">{viewingContact.nextAction}</span>
                  </div>
                </div>
              )}

              {viewingContact.observations && (
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-stone-400 block text-[10px] font-semibold uppercase">Observações / Anotações</span>
                    <span className="text-stone-700 whitespace-pre-line leading-relaxed font-medium">{viewingContact.observations}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[10px] font-semibold uppercase">Primeiro Contato</span>
                  <span className="text-stone-700 font-medium">{viewingContact.firstContactDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-semibold uppercase">Último Contato</span>
                  <span className="text-stone-700 font-medium">{viewingContact.lastContactDate}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] font-semibold uppercase mb-1.5">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {viewingContact.tags && viewingContact.tags.length > 0 ? (
                    viewingContact.tags.map((t, idx) => (
                      <span key={idx} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-medium border border-stone-200">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 text-[10px]">Nenhuma tag</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-2">
              <button 
                onClick={() => handleOpenEditModal(viewingContact)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2 px-3 rounded-lg grow transition-all flex items-center justify-center gap-1"
              >
                <Edit2 size={12} /> Editar Dados
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Creation/Edition Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-base">
                {editingContact ? "Editar Contato do CRM" : "Cadastrar Novo Contato"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome Completo *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Dr. Alejandro Peralta"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Empresa */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Empresa / Escritório</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Peralta Abogados"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Tipo de Contato */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Contato</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ContactType)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(ContactType).map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Idioma */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Idiomas de Comunicação</label>
                  <input 
                    type="text" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="Ex: Espanhol / Português"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Telefone Principal</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +595 21 600 123"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">WhatsApp (Número Completo com DDI) *</label>
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: +595981123456"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: peralta@peraltayasociados.com"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Website</label>
                  <input 
                    type="text" 
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="Ex: www.peralta.com.py"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Asunción"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
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
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Endereço */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Endereço Completo</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Mariscal López 3450, Edificio Plaza, Piso 4"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Origem do Contato */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Origem / Como conheceu</label>
                  <input 
                    type="text" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Ex: Indicação, Pesquisa Web..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Responsável Interno */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Responsável Interno</label>
                  <input 
                    type="text" 
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Ex: Admin (Você)"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Prioridade */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Prioridade Regulatória / Atendimento</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(PriorityLevel).map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Status de Negociação</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContactStatus)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  >
                    {Object.values(ContactStatus).map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Próxima Ação */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Próxima Ação Agendada</label>
                  <input 
                    type="text" 
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="Ex: Assinatura da constituição da S.A. dia 10 de julho"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Observações e Detalhes Importantes</label>
                  <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                    placeholder="Adicione notas adicionais, contratos acordados ou prazos específicos..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {/* Tags Management */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tags de Agrupamento</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Ex: Legal, Maquila, CDE..."
                      className="grow bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg p-2.5 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddTag}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 text-xs font-semibold rounded-lg border border-stone-250 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-150 px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 font-semibold">
                        {t}
                        <button type="button" onClick={() => handleRemoveTag(idx)} className="hover:bg-emerald-100 rounded-full p-0.5">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check size={14} /> {editingContact ? "Salvar Alterações" : "Cadastrar Contato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
