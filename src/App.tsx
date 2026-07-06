/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  Truck,
  TrendingUp,
  FileCheck,
  Layers,
  QrCode,
  Droplet,
  CheckSquare,
  DollarSign,
  FolderOpen,
  Compass,
  Download,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
  History,
  Award,
  Sparkles,
  Camera
} from "lucide-react";

import { UserRole } from "./types";
import {
  initialContacts,
  initialProperties,
  initialSuppliers,
  initialBuyers,
  initialLicenses,
  initialAreas,
  initialLots,
  initialMeasurements,
  initialTasks,
  initialFinance,
  initialDocuments,
  initialVisits,
  initialAlerts
} from "./data/seedData";

import Dashboard from "./components/Dashboard";
import CRM from "./components/CRM";
import Chacaras from "./components/Chacaras";
import Fornecedores from "./components/Fornecedores";
import Compradores from "./components/Compradores";
import Licencas from "./components/Licencas";
import Estufas from "./components/Estufas";
import Lotes from "./components/Lotes";
import Medicoes from "./components/Medicoes";
import Tarefas from "./components/Tarefas";
import Financeiro from "./components/Financeiro";
import Documentos from "./components/Documentos";
import Viagem from "./components/Viagem";
import Relatorios from "./components/Relatorios";
import CamerasIA from "./components/CamerasIA";

type TabId =
  | "dashboard"
  | "crm"
  | "chacaras"
  | "fornecedores"
  | "compradores"
  | "licencas"
  | "estufas"
  | "lotes"
  | "medicoes"
  | "tarefas"
  | "financeiro"
  | "documentos"
  | "viagem"
  | "relatorios"
  | "cameras";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.Administrador);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [selectedLotCode, setSelectedLotCode] = useState<string>("");

  // Core Application States loaded with high-fidelity Paraguayan seed data
  const [contacts, setContacts] = useState(initialContacts);
  const [properties, setProperties] = useState(initialProperties);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [buyers, setBuyers] = useState(initialBuyers);
  const [licenses, setLicenses] = useState(initialLicenses);
  const [areas, setAreas] = useState(initialAreas);
  const [lots, setLots] = useState(initialLots);
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [tasks, setTasks] = useState(initialTasks);
  const [finance, setFinance] = useState(initialFinance);
  const [documents, setDocuments] = useState(initialDocuments);
  const [visits, setVisits] = useState(initialVisits);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Helper helper to push actions into compliance audit trail
  const addAuditLog = (action: string, details: string) => {
    const newLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: currentUserRole,
      action,
      details,
      ipAddress: "192.168.12.42"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Tab definitions
  const tabs = [
    { id: "dashboard", label: "Painel Geral", icon: LayoutDashboard, category: "Geral" },
    { id: "crm", label: "Contatos (CRM)", icon: Users, category: "Comercial" },
    { id: "chacaras", label: "Chácaras / Imóveis", icon: Home, category: "Operação" },
    { id: "fornecedores", label: "Fornecedores", icon: Truck, category: "Comercial" },
    { id: "compradores", label: "Compradores", icon: TrendingUp, category: "Comercial" },
    { id: "licencas", label: "Licenças & Compliance", icon: FileCheck, category: "Legal" },
    { id: "estufas", label: "Áreas / Estufas", icon: Layers, category: "Operação" },
    { id: "lotes", label: "Rastreabilidade Lotes", icon: QrCode, category: "Operação" },
    { id: "cameras", label: "Câmeras & IA (Estufas)", icon: Camera, category: "Operação" },
    { id: "medicoes", label: "Sensores & Medições", icon: Droplet, category: "Operação" },
    { id: "tarefas", label: "Tarefas & Checklists", icon: CheckSquare, category: "Operação" },
    { id: "financeiro", label: "Fluxo Financeiro", icon: DollarSign, category: "Geral" },
    { id: "documentos", label: "Dossiê Documentos", icon: FolderOpen, category: "Legal" },
    { id: "viagem", label: "Roteiro Paraguai", icon: Compass, category: "Geral" },
    { id: "relatorios", label: "Relatórios & CSV", icon: Download, category: "Geral" }
  ];

  // Helper to filter nav items according to the active simulation role
  const isTabVisibleForRole = (tabId: string) => {
    if (currentUserRole === UserRole.ConsultorAdvogadoContador) {
      return ["dashboard", "licencas", "documentos", "relatorios"].includes(tabId);
    }
    if (currentUserRole === UserRole.OperadorCampo) {
      return ["dashboard", "estufas", "medicoes", "tarefas", "lotes", "documentos", "cameras"].includes(tabId);
    }
    if (currentUserRole === UserRole.CompradorParceiroExterno) {
      return ["dashboard", "lotes", "documentos"].includes(tabId);
    }
    return true; // Admin and Gestor see everything
  };

  // Render the selected component
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            contacts={contacts}
            properties={properties}
            suppliers={suppliers}
            buyers={buyers}
            licenses={licenses}
            areas={areas}
            lots={lots}
            measurements={measurements}
            tasks={tasks}
            finance={finance}
            setFinance={setFinance}
            alerts={alerts}
            visits={visits}
            userRole={currentUserRole}
            setAlerts={setAlerts}
            setActiveTab={(tab: string) => setActiveTab(tab as TabId)}
            setSelectedLotCode={setSelectedLotCode}
            addAuditLog={addAuditLog}
          />
        );
      case "crm":
        return <CRM contacts={contacts} setContacts={setContacts} addAuditLog={addAuditLog} />;
      case "chacaras":
        return <Chacaras properties={properties} setProperties={setProperties} addAuditLog={addAuditLog} />;
      case "fornecedores":
        return <Fornecedores suppliers={suppliers} setSuppliers={setSuppliers} addAuditLog={addAuditLog} />;
      case "compradores":
        return <Compradores buyers={buyers} setBuyers={setBuyers} addAuditLog={addAuditLog} />;
      case "licencas":
        return <Licencas licenses={licenses} setLicenses={setLicenses} addAuditLog={addAuditLog} />;
      case "estufas":
        return <Estufas areas={areas} setAreas={setAreas} addAuditLog={addAuditLog} />;
      case "lotes":
        return (
          <Lotes
            lots={lots}
            setLots={setLots}
            addAuditLog={addAuditLog}
            selectedLotCode={selectedLotCode}
            setSelectedLotCode={setSelectedLotCode}
            onBack={() => setActiveTab("dashboard")}
          />
        );
      case "medicoes":
        return <Medicoes measurements={measurements} setMeasurements={setMeasurements} addAuditLog={addAuditLog} />;
      case "tarefas":
        return <Tarefas tasks={tasks} setTasks={setTasks} addAuditLog={addAuditLog} />;
      case "financeiro":
        return <Financeiro finance={finance} setFinance={setFinance} addAuditLog={addAuditLog} />;
      case "documentos":
        return <Documentos documents={documents} setDocuments={setDocuments} addAuditLog={addAuditLog} />;
      case "viagem":
        return <Viagem visits={visits} setVisits={setVisits} addAuditLog={addAuditLog} />;
      case "relatorios":
        return (
          <Relatorios
            lots={lots}
            finance={finance}
            licenses={licenses}
            buyers={buyers}
            addAuditLog={addAuditLog}
          />
        );
      case "cameras":
        return <CamerasIA addAuditLog={addAuditLog} />;
      default:
        return <div>Componente em construção.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col md:flex-row font-sans overflow-x-hidden selection:bg-emerald-200">
      
      {/* Sidebar navigation */}
      <aside className={`bg-[#064E3B] text-emerald-100 w-64 shrink-0 transition-transform flex flex-col justify-between fixed md:relative inset-y-0 left-0 z-40 transform border-r border-emerald-900 shadow-xl ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">VV</div>
              <div>
                <h1 className="text-lg font-bold tracking-tight italic text-white">ViVerdetech</h1>
                <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider">Traceability & CRM</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-emerald-300 hover:text-white p-1 hover:bg-emerald-800 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation items grouped by category */}
          <nav className="p-4 grow space-y-5">
            {["Geral", "Comercial", "Operação", "Legal"].map(category => {
              const categoryTabs = tabs.filter(t => t.category === category && isTabVisibleForRole(t.id));
              if (categoryTabs.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest opacity-60 px-3 block mb-1">
                    {category}
                  </span>
                  
                  {categoryTabs.map(tab => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as TabId);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                          isActive 
                            ? "bg-emerald-800/50 text-white font-extrabold border border-white/10 shadow-sm" 
                            : "text-emerald-100 hover:text-white hover:bg-emerald-800/30"
                        }`}
                      >
                        <IconComponent size={15} className={isActive ? "text-emerald-300" : "text-emerald-300/60"} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer info brand */}
        <div className="p-4 border-t border-emerald-900 text-emerald-400 text-[10px] text-center bg-emerald-950/40 font-medium">
          <span>Do campo ao comprador, cada lote rastreado.</span>
        </div>
      </aside>

      {/* Main container right */}
      <div className="grow flex flex-col min-w-0">
        
        {/* Top Header navbar */}
        <header className="bg-white border-b border-emerald-100 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-stone-600 hover:text-stone-900 p-1.5 hover:bg-stone-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-stone-500 text-xs font-semibold bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
              <Sparkles size={14} className="text-emerald-700 animate-pulse" />
              <span>Slogan: <b className="text-stone-800">Do campo ao comprador, cada lote rastreado.</b></span>
            </div>
          </div>

          {/* User simulation role switcher drawer */}
          <div className="flex items-center gap-3 text-stone-800">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider hidden lg:inline">Simular Perfil:</span>
              <select
                value={currentUserRole}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setCurrentUserRole(role);
                  addAuditLog("Trocou de Perfil", `Navegando com o perfil de ${role}`);
                  
                  // Auto redirect based on visibility constraints
                  if (role === UserRole.OperadorCampo) setActiveTab("medicoes");
                  else if (role === UserRole.ConsultorAdvogadoContador) setActiveTab("licencas");
                  else if (role === UserRole.CompradorParceiroExterno) setActiveTab("lotes");
                  else setActiveTab("dashboard");
                }}
                className="bg-transparent border-none text-xs font-black text-stone-700 focus:outline-hidden cursor-pointer"
              >
                <option value={UserRole.Administrador}>Administrador (Full)</option>
                <option value={UserRole.OperadorCampo}>Operador de Campo</option>
                <option value={UserRole.GestorParceiro}>Gestor / Parceiro</option>
                <option value={UserRole.ConsultorAdvogadoContador}>Consultor / Contador</option>
                <option value={UserRole.CompradorParceiroExterno}>Comprador Externo</option>
              </select>
            </div>

            {/* Audit Logs Quick Trigger */}
            <button
              onClick={() => setIsAuditDrawerOpen(true)}
              className="p-2 border border-stone-200 hover:border-emerald-500 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50/20 transition-all"
              title="Histórico de Auditoria Imutável"
            >
              <History size={16} />
            </button>
          </div>

        </header>

        {/* Content view screen */}
        <main className="p-4 md:p-6 grow overflow-y-auto">
          {renderActiveContent()}
        </main>
      </div>

      {/* Audit Log expandable side drawer panel overlay */}
      {isAuditDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-stone-150 flex flex-col justify-between animate-in slide-in-from-right duration-200 text-stone-850">
          
          {/* Header */}
          <div className="bg-stone-50 p-4 border-b border-stone-150 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <History className="text-emerald-700" size={18} />
              <h3 className="font-extrabold text-stone-900 text-sm">Histórico de Auditoria Imutável</h3>
            </div>
            <button 
              onClick={() => setIsAuditDrawerOpen(false)}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Logs List */}
          <div className="p-4 overflow-y-auto grow space-y-3.5">
            <div className="bg-emerald-50 p-3 rounded-lg text-[11px] text-emerald-800 border border-emerald-150 leading-relaxed">
              <span><b>Padrão de Segurança:</b> Cada ação societária, atualização de lote ou medição física registrada alimenta este livro razão imutável. Essencial para auditorias SENAD e Ministério da Indústria (MIC).</span>
            </div>

            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="text-xs border-b border-stone-100 pb-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold">
                    <span>{log.timestamp}</span>
                    <span className="bg-stone-100 px-1.5 py-0.2 rounded">{log.user}</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-xs">{log.action}</h4>
                  <p className="text-stone-600 leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer close */}
          <div className="p-3 bg-stone-50 border-t border-stone-150 flex justify-end shrink-0">
            <button 
              onClick={() => setIsAuditDrawerOpen(false)}
              className="bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold px-4 py-2 rounded-lg"
            >
              Fechar Histórico
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
