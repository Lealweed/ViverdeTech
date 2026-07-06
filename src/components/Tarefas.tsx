/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Check,
  X,
  Camera,
  User,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Briefcase,
  Layers,
  Trash2,
  Sparkles
} from "lucide-react";
import { Task, TaskType, TaskStatus, PriorityLevel } from "../types";

interface TarefasProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Tarefas({ tasks, setTasks, addAuditLog }: TarefasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTaskToUploadPhoto, setActiveTaskToUploadPhoto] = useState<Task | null>(null);
  
  // Field Operator upload simulator
  const [fieldObservations, setFieldObservations] = useState("");

  // Form states for new task
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>(TaskType.Irrigar);
  const [responsible, setResponsible] = useState("Operador de Campo");
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.Media);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Por favor, preencha o título da tarefa.");
      return;
    }

    const newTask: Task = {
      id: "t-" + Date.now(),
      title,
      description,
      type,
      responsible,
      areaId: "a-1",
      lotId: "lote-1",
      priority,
      deadline: deadline || new Date().toISOString().split("T")[0],
      status: TaskStatus.Pendente,
      recurrence: "Diária",
      photoRequired: true,
      observations: "",
      completionDate: "",
      photoUrl: ""
    };

    setTasks(prev => [...prev, newTask]);
    addAuditLog("Adicionou Tarefa", `Tarefa programada: ${title} atribuída a ${responsible}`);
    setIsModalOpen(false);

    // Reset Form
    setTitle("");
    setDescription("");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isDone = t.status === TaskStatus.Concluida;
        const newStatus = isDone ? TaskStatus.Pendente : TaskStatus.Concluida;
        return {
          ...t,
          status: newStatus,
          completionDate: isDone ? "" : new Date().toISOString().split("T")[0]
        };
      }
      return t;
    }));
    addAuditLog("Status Tarefa", `Marcou status da tarefa como alterado.`);
  };

  const handleSimulateOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskToUploadPhoto) return;

    // Elegant mock agricultural photos depending on the task's type
    const typePhotos: Record<TaskType, string> = {
      [TaskType.Irrigar]: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      [TaskType.MedirPH_EC]: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
      [TaskType.VerificarPragas]: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      [TaskType.RegistrarFoto]: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      [TaskType.LimparArea]: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      [TaskType.RevisarCameras]: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      [TaskType.RevisarCerca]: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      [TaskType.RevisarBomba]: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      [TaskType.VerificarSecagem]: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      [TaskType.PesarMaterial]: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      [TaskType.ColetarAmostra]: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
      [TaskType.EnviarLaboratorio]: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80",
      [TaskType.AtualizarLote]: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      [TaskType.ContatarFornecedor]: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
      [TaskType.ContatarComprador]: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      [TaskType.RenovarDocumento]: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    };

    const mockPhoto = typePhotos[activeTaskToUploadPhoto.type] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80";

    setTasks(prev => prev.map(t => {
      if (t.id === activeTaskToUploadPhoto.id) {
        return {
          ...t,
          status: TaskStatus.Concluida,
          completionDate: new Date().toISOString().split("T")[0],
          photoUrl: mockPhoto,
          observations: fieldObservations || "Checklist operacional executado perfeitamente sob os termos de conformidade."
        };
      }
      return t;
    }));

    addAuditLog("Relatório Operador", `Capturou e anexou evidência fotográfica da conclusão de: ${activeTaskToUploadPhoto.title}`);
    setActiveTaskToUploadPhoto(null);
    setFieldObservations("");
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm("Deseja realmente remover esta tarefa?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
      addAuditLog("Excluiu Tarefa", "Removeu atividade programada.");
    }
  };

  // Filter & Search
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypeFilter === "todos" || t.type === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Checklist e Tarefas Operacionais de Campo</h2>
          <p className="text-stone-500 text-sm">Organize as rotinas diárias de irrigação, patrulhamento de segurança anti-narcóticos da SENAD, adubação orgânica e colheita modular.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Programar Tarefa
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:grow">
          <Search size={18} className="absolute left-3 top-3 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por tarefa, responsável, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2.5 text-xs text-stone-700 placeholder-stone-400 outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full bg-[#F8FAF9] border border-emerald-100 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-stone-700 font-bold outline-none transition-all"
          >
            <option value="todos">Todas as Atividades</option>
            {Object.values(TaskType).map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-stone-800">
        
        {/* Task cards list (Lefthand side / 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Rotina e Atividades Operacionais</h3>

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-emerald-50 text-stone-400 text-xs shadow-sm">
              Nenhuma tarefa de rotina programada.
            </div>
          ) : (
            filteredTasks.map(t => (
              <div 
                key={t.id} 
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  t.status === TaskStatus.Concluida ? "bg-stone-50/50 border-stone-200" : "bg-white border-emerald-50 shadow-sm hover:border-emerald-200"
                }`}
              >
                {/* Checkbox */}
                <button 
                  onClick={() => toggleTaskStatus(t.id)}
                  className="mt-1 text-stone-300 hover:text-emerald-700 transition-colors shrink-0"
                >
                  <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center ${
                    t.status === TaskStatus.Concluida ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300 bg-white"
                  }`}>
                    {t.status === TaskStatus.Concluida && <Check size={14} className="stroke-[3px]" />}
                  </div>
                </button>

                {/* Content */}
                <div className="grow space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 uppercase">
                      {t.type}
                    </span>

                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      t.priority === PriorityLevel.Alta ? "bg-red-100 text-red-700" :
                      t.priority === PriorityLevel.Media ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      Prioridade {t.priority}
                    </span>
                  </div>

                  <h4 className={`font-bold text-stone-900 text-sm ${t.status === TaskStatus.Concluida ? "line-through text-stone-400" : ""}`}>
                    {t.title}
                  </h4>

                  {t.description && (
                    <p className={`text-xs ${t.status === TaskStatus.Concluida ? "text-stone-400" : "text-stone-500"} leading-relaxed`}>
                      {t.description}
                    </p>
                  )}

                  {/* Metadata row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 pt-1.5">
                    <span className="flex items-center gap-1 font-semibold text-stone-600">
                      <User size={12} /> {t.responsible}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Prazo: {t.deadline}
                    </span>
                    {t.completionDate && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        Concluído em {t.completionDate}
                      </span>
                    )}
                  </div>

                  {/* Operational Notes and Photo evidence */}
                  {t.status === TaskStatus.Concluida && (t.observations || t.photoUrl) && (
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs mt-3 space-y-2">
                      {t.observations && (
                        <p className="text-stone-600 italic"><b>Relatório do Operador:</b> "{t.observations}"</p>
                      )}
                      {t.photoUrl && (
                        <div className="w-28 h-20 rounded border overflow-hidden">
                          <img referrerPolicy="no-referrer" src={t.photoUrl} alt="Evidência" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upload photo trigger (For simulation) */}
                  {t.status !== TaskStatus.Concluida && (
                    <button
                      type="button"
                      onClick={() => setActiveTaskToUploadPhoto(t)}
                      className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/50 hover:bg-emerald-100 rounded-md px-2 py-1 flex items-center gap-1 mt-1 transition-all"
                    >
                      <Camera size={12} /> Simular Upload Foto de Campo
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => handleDeleteTask(t.id)}
                  className="text-stone-300 hover:text-red-500 p-1 rounded hover:bg-stone-50 transition-colors self-start"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right side operational instructions and guidelines */}
        <div className="space-y-6">
          <h3 className="font-bold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Diretrizes Governamentais</h3>

          <div className="bg-gradient-to-br from-emerald-950 to-stone-900 rounded-2xl p-5 text-emerald-200 space-y-4 border border-emerald-800 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-amber-400 shrink-0" size={16} />
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-400">Compliance Auditável</span>
            </div>
            <h4 className="font-black text-white text-xs uppercase">Registro Fotográfico Diário</h4>
            <p className="text-xs text-emerald-300 leading-relaxed">
              O regulamento paraguaio exige que as atividades de manejo, adubação química/orgânica e rondas de vigilância sejam logadas com data, hora e fotos georreferenciadas para eventual auditoria fiscal da SENAD ou do Ministério da Agricultura (MAG).
            </p>
            <div className="bg-emerald-900/40 p-2.5 rounded text-[10px] text-emerald-400 border border-emerald-900">
              Mantenha o histórico limpo e as evidências fotográficas em dia para evitar sanções regulatórias.
            </div>
          </div>
        </div>

      </div>

      {/* Field Operator Evidence Upload Simulator Modal */}
      {activeTaskToUploadPhoto && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-stone-800">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-emerald-700" />
                <h3 className="font-bold text-stone-800 text-sm">Simulador de Evidência Fotográfica</h3>
              </div>
              <button onClick={() => setActiveTaskToUploadPhoto(null)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSimulateOperatorSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Atividade Associada</span>
                <p className="text-sm font-bold text-stone-900">{activeTaskToUploadPhoto.title}</p>
              </div>

              {/* simulated capture visual */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-center space-y-2">
                <div className="mx-auto w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                  <Camera size={20} className="text-emerald-700" />
                </div>
                <span className="text-xs font-bold text-stone-700 block">✓ Câmera do Smartphone Simulada</span>
                <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-relaxed">
                  Ao clicar em Concluir, o ViVerdetech capturará uma foto agrícola correspondente no banco de dados para anexar à ordem de serviço.
                </p>
              </div>

              {/* observations */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Anotações do Operador na Lavoura</label>
                <textarea
                  required
                  rows={3}
                  value={fieldObservations}
                  onChange={(e) => setFieldObservations(e.target.value)}
                  placeholder="Ex: Pulverização executada nos corredores 4 e 5. Lona esticada perfeitamente. Dreno desobstruído..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveTaskToUploadPhoto(null)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5">
                  <Check size={14} /> Concluir Atividade e Capturar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-sm">Programar Nova Tarefa de Campo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Título da Atividade *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Checklist de vazamento por gotejo"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Tipo de Atividade */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Tipo de Trabalho</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TaskType)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  {Object.values(TaskType).map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Operador / Responsável</label>
                <input 
                  type="text" 
                  required
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nível de Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                >
                  {Object.values(PriorityLevel).map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Data Limite */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Data Limite de Conclusão</label>
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Instruções Operacionais</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Instruções claras de desinfecção, vestimenta..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  Programar Trabalho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
