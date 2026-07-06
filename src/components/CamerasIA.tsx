import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Video, 
  Sparkles, 
  Play, 
  Square, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  UserCheck, 
  ShieldAlert,
  Zap,
  Activity,
  Maximize2,
  Settings,
  Wifi,
  WifiOff,
  Server
} from "lucide-react";

interface CameraStream {
  id: string;
  name: string;
  location: string;
  status: "Ativo" | "Alerta" | "Manutenção";
  imageUrl: string;
  resolution: string;
  fps: number;
  detections: string[];
  ipAddress?: string;
  port?: number;
  protocol?: "RTSP" | "HTTP MJPEG" | "HLS" | "RTMP";
  streamUrl?: string;
  username?: string;
  password?: string;
  latency?: number;
}

interface CameraAlert {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  severity: "info" | "warning" | "critical";
  message: string;
  resolved: boolean;
}

interface CamerasIAProps {
  addAuditLog: (action: string, details: string) => void;
}

export default function CamerasIA({ addAuditLog }: CamerasIAProps) {
  const [selectedCamId, setSelectedCamId] = useState<string>("cam-1");
  const [activeAiMode, setActiveAiMode] = useState<"health" | "security" | "epi" | "off">("health");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [simulatedTime, setSimulatedTime] = useState<string>("");

  // Default connection parameters for cameras
  const defaultCameras: CameraStream[] = [
    {
      id: "cam-1",
      name: "Câmera 01 - Berçário de Clones (Estufa A)",
      location: "Hernandarias - Estufa Principal",
      status: "Ativo",
      imageUrl: "https://images.unsplash.com/photo-1550147760-44c9966d6bc7?auto=format&fit=crop&w=1200&q=85",
      resolution: "1920x1080 (1080p)",
      fps: 30,
      detections: ["Propagação: 94% saudáveis", "Clones Feminilizados: OK", "EPI Verificado: Sim"],
      ipAddress: "192.168.100.51",
      port: 554,
      protocol: "RTSP",
      streamUrl: "rtsp://admin:coopagre2026@192.168.100.51:554/h264/ch1/main",
      username: "admin",
      password: "•••••••••••••",
      latency: 12
    },
    {
      id: "cam-2",
      name: "Câmera 02 - Floração CBD Kush (Estufa B)",
      location: "Hernandarias - Estufa de Flores",
      status: "Ativo",
      imageUrl: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=1200&q=85",
      resolution: "1920x1080 (1080p)",
      fps: 30,
      detections: ["Déficit de Umidade Leve (Setor 4)", "Previsão Teor CBD: ~11.2%", "Canopy Index: 78.4%"],
      ipAddress: "192.168.100.52",
      port: 554,
      protocol: "RTSP",
      streamUrl: "rtsp://admin:coopagre2026@192.168.100.52:554/h264/ch1/main",
      username: "admin",
      password: "•••••••••••••",
      latency: 15
    },
    {
      id: "cam-3",
      name: "Câmera 03 - Laboratório de Secagem & Extração",
      location: "Ypacaraí - Laboratório Central",
      status: "Ativo",
      imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=85",
      resolution: "1920x1080 (1080p)",
      fps: 24,
      detections: ["Acesso Controlado: Ativo", "Máscara / Luva: Conforme", "Temperatura de Secagem: 18°C"],
      ipAddress: "192.168.80.30",
      port: 554,
      protocol: "RTSP",
      streamUrl: "rtsp://admin:coopagre2026@192.168.80.30:554/h264/ch1/main",
      username: "admin",
      password: "•••••••••••••",
      latency: 48
    },
    {
      id: "cam-4",
      name: "Câmera 04 - Entrada & Perímetro de Segurança",
      location: "Hernandarias - Área Externa",
      status: "Alerta",
      imageUrl: "https://images.unsplash.com/photo-1508847154043-be12a3b6f1c1?auto=format&fit=crop&w=1200&q=85",
      resolution: "1920x1080 (1080p)",
      fps: 30,
      detections: ["Veículo Autorizado Detectado", "Guarita em Alerta", "Acesso biométrico liberado"],
      ipAddress: "192.168.100.99",
      port: 554,
      protocol: "RTSP",
      streamUrl: "rtsp://admin:coopagre2026@192.168.100.99:554/live/ch0",
      username: "admin",
      password: "•••••••••••••",
      latency: 8
    }
  ];

  const [cameras, setCameras] = useState<CameraStream[]>(() => {
    const saved = localStorage.getItem("coopagre_cameras_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cam, idx) => ({
            ...defaultCameras[idx],
            ...cam
          }));
        }
      } catch (e) {
        console.error("Failed to parse cameras config", e);
      }
    }
    return defaultCameras;
  });

  useEffect(() => {
    localStorage.setItem("coopagre_cameras_config", JSON.stringify(cameras));
  }, [cameras]);

  // Seed AI Alert Logs
  const [alerts, setAlerts] = useState<CameraAlert[]>([
    {
      id: "al-1",
      timestamp: "09:38:12",
      cameraId: "cam-2",
      cameraName: "Câmera 02 - Floração CBD Kush",
      severity: "warning",
      message: "Anomalia térmica detectada no setor 4 (umidade do ar caiu para 42%)",
      resolved: false
    },
    {
      id: "al-2",
      timestamp: "09:12:45",
      cameraId: "cam-4",
      cameraName: "Câmera 04 - Entrada & Perímetro",
      severity: "critical",
      message: "Operador de campo sem capacete de proteção na entrada da Estufa B",
      resolved: false
    },
    {
      id: "al-3",
      timestamp: "08:45:10",
      cameraId: "cam-1",
      cameraName: "Câmera 01 - Berçário de Clones",
      severity: "info",
      message: "Análise de Canopy concluída para o lote VVT-2026-002-VIVE (+3.4% crescimento nas 24h)",
      resolved: true
    }
  ]);

  // Keep a ticking timer for the real-time camera feeling
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSimulatedTime(now.toISOString().replace("T", " ").substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedCamera = cameras.find(c => c.id === selectedCamId) || cameras[0];

  // Camera IP / Network Editing State
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editIp, setEditIp] = useState("");
  const [editPort, setEditPort] = useState(554);
  const [editProtocol, setEditProtocol] = useState<"RTSP" | "HTTP MJPEG" | "HLS" | "RTMP">("RTSP");
  const [editUrl, setEditUrl] = useState("");
  const [editUser, setEditUser] = useState("");
  const [editPass, setEditPass] = useState("");
  const [editStatus, setEditStatus] = useState<"Ativo" | "Alerta" | "Manutenção">("Ativo");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Diagnostic Test Connection State
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);

  // Keep edit inputs synchronized with the currently selected camera
  useEffect(() => {
    if (selectedCamera) {
      setEditName(selectedCamera.name);
      setEditLocation(selectedCamera.location);
      setEditIp(selectedCamera.ipAddress || "192.168.100.51");
      setEditPort(selectedCamera.port || 554);
      setEditProtocol((selectedCamera.protocol as any) || "RTSP");
      setEditUrl(selectedCamera.streamUrl || "");
      setEditUser(selectedCamera.username || "admin");
      setEditPass(selectedCamera.password || "•••••••••••••");
      setEditStatus(selectedCamera.status);
      setTestLog([]);
    }
  }, [selectedCamId]);

  const handleSaveNetworkConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCameras(prev => prev.map(cam => {
      if (cam.id === selectedCamId) {
        return {
          ...cam,
          name: editName,
          location: editLocation,
          ipAddress: editIp,
          port: Number(editPort),
          protocol: editProtocol,
          streamUrl: editUrl,
          username: editUser,
          password: editPass,
          status: editStatus
        };
      }
      return cam;
    }));
    setSaveSuccess(true);
    addAuditLog("Configuração de Rede Câmera", `Câmera ${selectedCamId} configurada com o IP ${editIp}:${editPort}`);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setTestLog([`[DIAGNÓSTICO] Iniciando handshake e teste de latência de rede...`]);

    const steps = [
      () => `[PING] Enviando pacotes ICMP para o host ${editIp}...`,
      () => `  → ping -c 3 -t 64 ${editIp}`,
      () => `  → 64 bytes de ${editIp}: icmp_seq=1 ttl=64 tempo=${Math.floor(Math.random() * 15) + 5}ms`,
      () => `  → 64 bytes de ${editIp}: icmp_seq=2 ttl=64 tempo=${Math.floor(Math.random() * 15) + 5}ms`,
      () => `  → 64 bytes de ${editIp}: icmp_seq=3 ttl=64 tempo=${Math.floor(Math.random() * 15) + 5}ms`,
      () => `[PORT] Verificando status da porta ${editPort}/TCP (${editProtocol})...`,
      () => `[PORT] Porta aberta! Host respondeu com sucesso ao handshake TCP SYN.`,
      () => `[AUTH] Validando credenciais de streaming para o usuário: '${editUser}'...`,
      () => `[STREAM] Teste de cabeçalho RTSP DESCRIBE bem-sucedido. codec=H.265 profile=main.`,
      () => `[SUCESSO] Stream de vídeo consolidado com latência média de ${Math.floor(Math.random() * 10) + 10}ms.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTestLog(prev => [...prev, steps[currentStep]()]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsTestingConnection(false);
        addAuditLog("Diagnóstico de Rede", `Câmera ${selectedCamId} testada com sucesso no IP ${editIp}`);
      }
    }, 400);
  };

  // Perform AI analysis effect
  const handleTriggerAiScan = () => {
    setIsScanning(true);
    addAuditLog("Varredura IA Monitoramento", `Iniciada análise computacional em tempo real na ${selectedCamera.name}`);
    
    setTimeout(() => {
      setIsScanning(false);
      let res = {};
      if (selectedCamera.id === "cam-1") {
        res = {
          healthStatus: "Excelente (98.6%)",
          pestDetections: "Nenhuma praga ou fungo detectado",
          canopyIndex: "94.2% cobertura foliar",
          epivision: "100% em conformidade",
          cannabinoidsEst: "Estável para clone vegetativo"
        };
      } else if (selectedCamera.id === "cam-2") {
        res = {
          healthStatus: "Alerta de Umidade Leve (Estresse Moderado)",
          pestDetections: "Nenhum patógeno biológico detectado",
          canopyIndex: "78.4% cobertura de floração",
          epivision: "100% em conformidade",
          cannabinoidsEst: "CBD Potencial: 11.2% • THC: 0.14%"
        };
      } else {
        res = {
          healthStatus: "Conforme",
          pestDetections: "Ambiente asséptico livre de patógenos",
          canopyIndex: "N/A (Área laboratorial / Perímetro)",
          epivision: "EPIs e luvas de contenção ativos",
          cannabinoidsEst: "Não aplicável nesta câmera"
        };
      }
      setScanResult(res);
      addAuditLog("Varredura IA Concluída", `Resultado gerado para ${selectedCamera.name} com sucesso.`);
    }, 1800);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    addAuditLog("Alerta IA Resolvido", `Alerta de câmera ${id} marcado como corrigido.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900 flex items-center gap-2">
            <Sparkles size={24} className="text-emerald-600 animate-pulse" />
            Câmeras de Segurança & Monitoramento IA
          </h2>
          <p className="text-stone-500 text-sm">
            Visualização de feeds ao vivo das estufas de Cannabis no Paraguai com camada de IA computacional para análise fitossanitária, EPIs e presença em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
          <Activity size={14} className="text-emerald-600 animate-pulse" />
          Serviço de IA Ativo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Camera Feed & AI Overlay Control (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Main Feed Video Screen */}
          <div className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-xl relative aspect-video">
            
            {/* Live Camera Image */}
            <img 
              src={selectedCamera.imageUrl} 
              alt={selectedCamera.name}
              className="w-full h-full object-cover opacity-85 transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />

            {/* AI Computer Vision Bounding Boxes Overlay */}
            {activeAiMode !== "off" && !isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                {activeAiMode === "health" && selectedCamera.id === "cam-1" && (
                  <>
                    {/* Bounding box 1 */}
                    <div className="absolute top-[20%] left-[15%] w-[25%] h-[40%] border-2 border-emerald-500 animate-pulse rounded">
                      <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                        [AI] Clone Kush #01: Saudável 99.2%
                      </span>
                    </div>
                    {/* Bounding box 2 */}
                    <div className="absolute top-[35%] left-[55%] w-[30%] h-[35%] border-2 border-emerald-500 animate-pulse rounded">
                      <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                        [AI] Clone Kush #02: Saudável 98.4%
                      </span>
                    </div>
                  </>
                )}

                {activeAiMode === "health" && selectedCamera.id === "cam-2" && (
                  <>
                    <div className="absolute top-[10%] left-[20%] w-[45%] h-[60%] border-2 border-amber-500 rounded">
                      <span className="absolute -top-6 left-0 bg-amber-500 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                        [AI] Alerta Térmico: Déficit Hídrico Setor 4 (42% RH)
                      </span>
                    </div>
                    <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[35%] border-2 border-emerald-500 rounded">
                      <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                        [AI] Teor de CBD Estimado: 11.2% - Estável
                      </span>
                    </div>
                  </>
                )}

                {activeAiMode === "security" && (
                  <div className="absolute top-[20%] left-[40%] w-[20%] h-[55%] border-2 border-blue-500 rounded">
                    <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[9px] font-mono px-1 py-0.5 rounded shadow">
                      [AI] Humano Detectado: Operador Juan Gómez (Biometria OK)
                    </span>
                  </div>
                )}

                {activeAiMode === "epi" && selectedCamera.id === "cam-3" && (
                  <>
                    <div className="absolute top-[15%] left-[30%] w-[25%] h-[50%] border-2 border-emerald-500 rounded">
                      <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-[9px] font-mono px-1 py-0.5 rounded">
                        [AI] Luvas & Máscara: DETECTADO
                      </span>
                    </div>
                  </>
                )}

                {activeAiMode === "epi" && selectedCamera.id === "cam-4" && (
                  <div className="absolute top-[30%] left-[50%] w-[22%] h-[60%] border-2 border-red-500 animate-bounce rounded">
                    <span className="absolute -top-6 left-0 bg-red-500 text-white text-[9px] font-mono px-1 py-0.5 rounded">
                      [AI] ALERTA: Sem Capacete de Segurança!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Simulated Grid Scan Overlay Line */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none flex flex-col justify-between">
                <div className="w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10B981] animate-[bounce_2s_infinite]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-stone-900/90 border border-emerald-500 px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
                    <RefreshCw className="text-emerald-500 animate-spin" size={16} />
                    <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">IA Computacional Executando Varredura...</span>
                  </div>
                </div>
              </div>
            )}

            {/* OSD Header Overlay (Live indicators) */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none font-mono">
              <div className="bg-stone-950/70 border border-stone-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedCamera.status === "Ativo" ? "bg-emerald-500" : selectedCamera.status === "Alerta" ? "bg-red-500" : "bg-amber-500"} animate-pulse`}></span>
                <span className="text-white text-xs font-bold tracking-widest uppercase">LIVE • {selectedCamera.id.toUpperCase()}</span>
                <span className="text-emerald-400 text-[10px] font-bold border-l border-stone-700 pl-2">{selectedCamera.ipAddress || "192.168.1.1"}</span>
              </div>
              <div className="bg-stone-950/70 border border-stone-800 px-3 py-1.5 rounded-lg text-right">
                <div className="text-white text-[10px] font-bold">{simulatedTime || "2026-07-03 09:42:17"}</div>
                <div className="text-stone-400 text-[9px]">{selectedCamera.resolution} | {selectedCamera.fps} FPS | {selectedCamera.protocol || "RTSP"}</div>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="absolute bottom-4 left-4 bg-stone-950/80 border border-stone-800 px-3 py-1.5 rounded-lg pointer-events-none font-mono">
              <span className="text-emerald-400 text-xs font-semibold block">{selectedCamera.name}</span>
              <div className="flex items-center gap-2 text-stone-400 text-[9px]">
                <span>{selectedCamera.location}</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">{selectedCamera.ipAddress}:{selectedCamera.port || 554}</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-stone-950/80 border border-stone-800 px-2 py-1.5 rounded-lg flex gap-1.5 pointer-events-none">
              <span className="text-white text-[9px] font-mono px-1 bg-stone-800 rounded">H.265</span>
              <span className="text-white text-[9px] font-mono px-1 bg-stone-800 rounded">AES-256</span>
            </div>

          </div>

          {/* AI Filters and Controls Row */}
          <div className="bg-white p-4 rounded-xl border border-emerald-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-600 block uppercase">Camadas de Análise da Inteligência Artificial (Visão)</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveAiMode("health")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors border flex items-center gap-1.5 ${
                    activeAiMode === "health"
                      ? "bg-emerald-600 text-white border-emerald-700"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <Sparkles size={12} /> Fitossanitária (Fungos & CBD%)
                </button>
                <button
                  onClick={() => setActiveAiMode("security")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors border flex items-center gap-1.5 ${
                    activeAiMode === "security"
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <UserCheck size={12} /> Presença & Rastreabilidade
                </button>
                <button
                  onClick={() => setActiveAiMode("epi")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors border flex items-center gap-1.5 ${
                    activeAiMode === "epi"
                      ? "bg-amber-600 text-white border-amber-700"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <ShieldAlert size={12} /> Compliance de EPIs (Segurança)
                </button>
                <button
                  onClick={() => setActiveAiMode("off")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors border ${
                    activeAiMode === "off"
                      ? "bg-stone-800 text-white border-stone-900"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  Vídeo Puro (IA Off)
                </button>
              </div>
            </div>

            <button
              onClick={handleTriggerAiScan}
              disabled={isScanning}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-700/10 transition-colors"
            >
              <RefreshCw size={14} className={isScanning ? "animate-spin" : ""} />
              {isScanning ? "Analisando..." : "Acionar Varredura de IA"}
            </button>
          </div>

          {/* AI Scan Results Cards */}
          {scanResult && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-600" size={18} />
                  <h4 className="font-bold text-emerald-950 text-sm">Relatório Completo de Telemetria Visual (Varredura IA)</h4>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold uppercase px-2 py-0.5 rounded">CONFORME</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 uppercase tracking-wide font-bold block text-[9px] mb-1">Índice Fitossanitário</span>
                  <span className="text-stone-900 font-bold block">{scanResult.healthStatus}</span>
                  <p className="text-stone-500 text-[10px] mt-0.5">Determinado por densidade de clorofila visual (Canopy).</p>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 uppercase tracking-wide font-bold block text-[9px] mb-1">Análise de Patógenos (IA)</span>
                  <span className="text-stone-900 font-bold block">{scanResult.pestDetections}</span>
                  <p className="text-stone-500 text-[10px] mt-0.5">Varredura multiespectral de anomalias foliares ou manchas de mofo.</p>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 uppercase tracking-wide font-bold block text-[9px] mb-1">Cobertura Foliar (Canopy Index)</span>
                  <span className="text-stone-900 font-bold block">{scanResult.canopyIndex}</span>
                  <p className="text-stone-500 text-[10px] mt-0.5">Calculado por proporção de pixels verdes x solo em cultivo hidropônico.</p>
                </div>
                <div className="bg-[#F8FAF9] p-3 rounded-xl border border-emerald-50/50">
                  <span className="text-stone-400 uppercase tracking-wide font-bold block text-[9px] mb-1">Potencial de Canabinóides (Previsão)</span>
                  <span className="text-stone-950 font-bold block">{scanResult.cannabinoidsEst}</span>
                  <p className="text-stone-500 text-[10px] mt-0.5">Estimativa baseada no histórico de crescimento e índice NDVI.</p>
                </div>
              </div>
            </div>
          )}

          {/* Painel de Configuração de Rede & IP da Câmera Selecionada */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-stone-100 pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Settings className="text-emerald-700 animate-[spin_6s_linear_infinite]" size={18} />
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm font-display">Configurações de Rede & Endereço IP</h3>
                  <p className="text-[10px] text-stone-500">Configure o endereço IP e os parâmetros de conexão RTSP da câmera selecionada.</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono uppercase self-start sm:self-auto">
                {selectedCamera.id}
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Form Side - 7 cols */}
              <form onSubmit={handleSaveNetworkConfig} className="xl:col-span-7 space-y-3.5">
                {saveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-lg flex items-center gap-1.5 font-semibold">
                    <CheckCircle size={14} className="text-emerald-600" />
                    Parâmetros de rede salvos e persistidos com sucesso!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Nome de Exibição</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Localização Física</label>
                    <input 
                      type="text" 
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      required
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Endereço IP da Câmera (Real)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={editIp}
                        onChange={(e) => setEditIp(e.target.value)}
                        placeholder="Ex: 192.168.100.51"
                        required
                        pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                        className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg pl-8 pr-2 py-2 text-xs font-mono font-bold text-stone-800"
                      />
                      <Server size={14} className="absolute left-2.5 top-3 text-stone-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Porta de Entrada</label>
                    <input 
                      type="number" 
                      value={editPort}
                      onChange={(e) => setEditPort(Number(e.target.value))}
                      required
                      min="1"
                      max="65535"
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Protocolo</label>
                    <select
                      value={editProtocol}
                      onChange={(e) => setEditProtocol(e.target.value as any)}
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-bold"
                    >
                      <option value="RTSP">RTSP (Stream)</option>
                      <option value="HTTP MJPEG">HTTP MJPEG</option>
                      <option value="HLS">HLS (m3u8)</option>
                      <option value="RTMP">RTMP Live</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Caminho do Stream / Canal</label>
                    <input 
                      type="text" 
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="Ex: /live/ch0"
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-mono text-stone-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Usuário (Auth)</label>
                    <input 
                      type="text" 
                      value={editUser}
                      onChange={(e) => setEditUser(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Senha (Criptografada)</label>
                    <input 
                      type="password" 
                      value={editPass}
                      onChange={(e) => setEditPass(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">Status Operacional</label>
                  <div className="flex flex-wrap items-center gap-4">
                    {["Ativo", "Alerta", "Manutenção"].map((st) => (
                      <label key={st} className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="camStatus"
                          value={st}
                          checked={editStatus === st}
                          onChange={() => setEditStatus(st as any)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          st === "Ativo" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : st === "Alerta"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {st}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    Salvar & Aplicar Endereço de IP
                  </button>
                </div>
              </form>

              {/* Connection Diagnostics Console Side - 5 cols */}
              <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex-1 flex flex-col justify-between min-h-[280px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isTestingConnection ? "bg-amber-400" : "bg-emerald-400"} opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isTestingConnection ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">Terminal de Diagnóstico</span>
                      </div>
                      <span className="text-stone-500 font-mono text-[9px]">{editIp}:{editPort}</span>
                    </div>

                    {/* Console Screen */}
                    <div className="bg-black/40 border border-stone-900/60 rounded-lg p-2.5 h-[175px] overflow-y-auto font-mono text-[10px] text-emerald-400/90 space-y-1.5 scrollbar-thin">
                      {testLog.length === 0 ? (
                        <div className="text-stone-600 italic text-[11px] h-full flex items-center justify-center text-center">
                          Aguardando início do diagnóstico de rede... Clique no botão abaixo para testar o IP.
                        </div>
                      ) : (
                        testLog.map((line, idx) => (
                          <div 
                            key={idx} 
                            className={`${
                              line.startsWith("[SUCESSO]") 
                                ? "text-emerald-300 font-bold" 
                                : line.startsWith("[DIAGNÓSTICO]")
                                ? "text-blue-400 font-bold"
                                : line.startsWith("  •") || line.startsWith("  →")
                                ? "text-stone-400"
                                : "text-stone-300"
                            }`}
                          >
                            {line}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="w-full mt-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-stone-700 disabled:bg-stone-950 disabled:border-stone-900 text-white font-mono font-bold text-[11px] py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={12} className={isTestingConnection ? "animate-spin text-amber-400" : "text-emerald-500"} />
                    {isTestingConnection ? "Efetuando Ping..." : "Testar Conexão / Ping IP"}
                  </button>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                    <Wifi size={16} />
                  </div>
                  <div>
                    <span className="text-stone-800 text-xs font-bold block">Status da Conexão Local</span>
                    <span className="text-[10px] text-stone-500">Gateway atual em Hernandarias operando a 100 Mbps em sub-rede local segura.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Camera Select & Real-Time Alerts Ticker (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Camera Selection List */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-4">
            <h3 className="font-bold font-display text-emerald-950 text-sm">Dispositivos de Captura</h3>
            
            <div className="space-y-2">
              {cameras.map(cam => (
                <button
                  key={cam.id}
                  onClick={() => {
                    setSelectedCamId(cam.id);
                    setScanResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedCamId === cam.id
                      ? "bg-emerald-50/60 border-emerald-500 shadow-xs"
                      : "bg-white border-stone-100 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg ${selectedCamId === cam.id ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-500"}`}>
                      <Video size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-stone-800 font-bold block text-xs truncate">{cam.name}</span>
                      <span className="text-stone-400 text-[10px] block truncate">{cam.location}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    cam.status === "Ativo" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : cam.status === "Alerta"
                      ? "bg-red-100 text-red-800 animate-pulse"
                      : "bg-stone-100 text-stone-600"
                  }`}>
                    {cam.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live AI Safety Alerts Ticker */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-display text-emerald-950 text-sm">Alertas IA em Tempo Real</h3>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                {alerts.filter(a => !a.resolved).length} Ativos
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">Sem alertas gerados pela IA de campo.</div>
              ) : (
                alerts.map(al => (
                  <div 
                    key={al.id} 
                    className={`p-3 rounded-xl border space-y-2 transition-all ${
                      al.resolved 
                        ? "bg-stone-50/50 border-stone-100 opacity-60" 
                        : al.severity === "critical"
                        ? "bg-red-50/40 border-red-100"
                        : al.severity === "warning"
                        ? "bg-amber-50/40 border-amber-100"
                        : "bg-blue-50/40 border-blue-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {al.severity === "critical" ? (
                          <ShieldAlert className="text-red-600 animate-bounce" size={14} />
                        ) : al.severity === "warning" ? (
                          <AlertTriangle className="text-amber-600" size={14} />
                        ) : (
                          <Activity className="text-blue-600" size={14} />
                        )}
                        <span className="text-stone-800 font-bold text-[10px] uppercase font-mono">{al.cameraName}</span>
                      </div>
                      <span className="text-stone-400 text-[9px] font-mono">{al.timestamp}</span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {al.message}
                    </p>

                    {!al.resolved && (
                      <button
                        onClick={() => handleResolveAlert(al.id)}
                        className="text-emerald-700 hover:text-emerald-600 font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCircle size={12} /> Marcar como Corrigido
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
