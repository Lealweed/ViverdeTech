/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ContactType {
  Contador = "Contador",
  Advogado = "Advogado",
  Regulador = "Regulador",
  Fornecedor = "Fornecedor",
  Comprador = "Comprador",
  Imobiliaria = "Imobiliária",
  Proprietario = "Proprietário de Chácara",
  Laboratorio = "Laboratório",
  Agronomo = "Agrônomo",
  TecnicoAgricola = "Técnico Agrícola",
  Metalurgica = "Metalúrgica",
  Irrigacao = "Empresa de Irrigação",
  LocadoraFerramentas = "Locadora de Ferramentas",
  Seguranca = "Empresa de Segurança",
  Transporte = "Transporte",
  Parceiro = "Parceiro",
  Investidor = "Investidor",
  OrgaoPublico = "Órgão Público",
  Outro = "Outro"
}

export enum ContactStatus {
  Novo = "Novo",
  Contatado = "Contatado",
  AguardandoResposta = "Aguardando Resposta",
  EmNegociacao = "Em Negociação",
  Aprovado = "Aprovado",
  Descartado = "Descartado",
  Importante = "Importante",
  PendenteVisita = "Pendente Visita"
}

export enum PriorityLevel {
  Baixa = "Baixa",
  Media = "Média",
  Alta = "Alta",
  Critica = "Crítica"
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  type: ContactType;
  country: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  site: string;
  responsible: string;
  language: string;
  source: string;
  status: ContactStatus;
  priority: PriorityLevel;
  firstContactDate: string;
  lastContactDate: string;
  nextAction: string;
  observations: string;
  tags: string[];
  files: string[];
}

export enum PropertyStatus {
  Encontrada = "Encontrada",
  ContatoFeito = "Contato Feito",
  VisitaAgendada = "Visita Agendada",
  Visitada = "Visitada",
  Aprovada = "Aprovada",
  Descartada = "Descartada",
  EmNegociacao = "Em Negociação",
  ContratoAnalise = "Contrato em Análise"
}

export interface PropertyChecklist {
  aguaSuficiente: boolean;
  energiaSuficiente: boolean;
  internetFunciona: boolean;
  casaHabitavel: boolean;
  estradaCaminhao: boolean;
  areaUmHectare: boolean;
  permiteCerca: boolean;
  permiteCameras: boolean;
  permiteAtividadeAgricola: boolean;
  contratoClaro: boolean;
  documentosVistos: boolean;
  riscoVizinhanca: boolean;
  riscoSeguranca: boolean;
  cabeNoOrcamento: boolean;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  department: string;
  address: string;
  gps: string;
  distanceCity: string;
  totalArea: string; // e.g. "1.5 hectares"
  usableArea: string; // e.g. "1.0 hectare"
  reserve100x100: boolean; // can preserve 100x100m (1ha)
  hasHouse: boolean;
  houseState: string; // e.g. "Bom estado", "Regular", "Reforma"
  rooms: number;
  bathrooms: number;
  kitchen: boolean;
  internet: boolean;
  electricity: string; // e.g. "Monofásico", "Trifásico"
  water: string; // e.g. "Poço Artesiano", "Água encanada"
  well: boolean;
  stream: boolean;
  reservoir: boolean;
  truckAccess: boolean;
  roadType: "Asfalto" | "Terra" | "Empedrado";
  security: string; // e.g. "Muro", "Cerca simples", "Grade"
  fence: boolean;
  gate: boolean;
  neighborsClose: boolean;
  rentValue: number;
  currency: "USD" | "PYG" | "BRL";
  depositValue: number;
  minContract: string; // e.g. "12 meses"
  ownerInfo: string;
  photos: string[];
  videos: string[];
  documents: string[];
  observations: string;
  status: PropertyStatus;
  checklist: PropertyChecklist;
}

export enum SupplierCategory {
  TubosGalvanizados = "Tubos Galvanizados / Metalurgia",
  PerfisMetalicos = "Perfis Metálicos",
  AcoChapas = "Aço e Chapas",
  PlasticoAgricola = "Lona/Plástico Agrícola",
  TelaAntiInseto = "Tela Anti-Inseto",
  SombriteAluminet = "Sombrite / Aluminet",
  IrrigacaoBomba = "Irrigação e Bombas",
  FiltrosMangueiras = "Filtros e Mangueiras",
  Gotejo = "Gotejadores",
  SensoresAutomacao = "Sensores e Automação",
  CamerasMonitoramento = "Câmeras e Monitoramento",
  InternetRural = "Internet Rural",
  EnergiaSolar = "Energia Solar",
  FerramentasEquipamentos = "Ferramentas e Máquinas",
  LocacaoEquipamentos = "Locação de Equipamentos",
  LaboratorioAnalises = "Laboratório de Análises",
  TransporteLogistica = "Transporte e Logística",
  EPIs = "Equipamentos de Proteção (EPIs)",
  SementesMudas = "Sementes e Mudas",
  ConstrucaoMontagem = "Construção e Montagem",
  SegurancaPatrulha = "Segurança Patrimonial",
  Outro = "Outro"
}

export interface Supplier {
  id: string;
  name: string;
  category: SupplierCategory;
  country: string;
  city: string;
  contact: string;
  phone: string;
  whatsapp: string;
  email: string;
  site: string;
  productService: string;
  priceInformed: number;
  currency: "USD" | "PYG" | "BRL";
  deliveryTime: string;
  paymentForm: string;
  deliversRural: boolean;
  cutToMeasure: boolean;
  installs: boolean;
  formalBudget: boolean;
  invoiceIssued: boolean;
  indicatesAssembler: boolean;
  reliability: 1 | 2 | 3 | 4 | 5; // stars
  status: "Ativo" | "Em Negociação" | "Inativo";
  budgetFiles: string[];
  photos: string[];
  observations: string;
}

export enum BuyerType {
  Processador = "Processador Industrial",
  MarcaCosmetico = "Marca de Cosméticos",
  LaboratorioFarmaceutico = "Laboratório Farmacêutico",
  DistribuidorMedicinal = "Distribuidor Medicinal",
  Exportador = "Exportadora",
  DistribuidorCanhamo = "Distribuidor de Cânhamo",
  DispensarioClub = "Dispensários e Clubes",
  Cooperativa = "Cooperativa",
  Outro = "Outro"
}

export enum BuyerStatus {
  Identificado = "Identificado",
  ContatoFeito = "Contato Feito",
  AguardandoResposta = "Aguardando Resposta",
  Interessado = "Interessado",
  NaoCompraTerceiros = "Não Compra de Terceiros",
  ExigeLicenca = "Exige Licença Ativa",
  PotencialParceiro = "Potencial Parceiro",
  Descartado = "Descartado",
  ContratoNegociacao = "Contrato em Negociação"
}

export enum CropType {
  BiomassaSeca = "Biomassa Seca (Cânhamo)",
  FlorInNatura = "Flor In Natura",
  FolhaSeca = "Folha Seca",
  SementeCanhamo = "Semente de Cânhamo",
  FibraCanhamo = "Fibra de Cânhamo",
  MateriaPrimaExtracao = "Matéria-prima para Extração",
  Cosmeticos = "Matéria-prima para Cosméticos",
  InfusoesChas = "Matéria-prima para Infusões",
  MedicinalTHCCBD = "Produto Medicinal (THC/CBD)",
  ClonesFeminilizados = "Clones Feminilizados",
  FloresCBD = "Flores CBD Alto Teor",
  ResinasExtratos = "Resinas e Extratos (Crude)",
  Outro = "Outro"
}

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  country: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  whatsapp: string;
  site: string;
  productOfInterest: CropType;
  buyFromThirdParties: boolean;
  requiresLicense: boolean;
  requiresLabReport: boolean;
  requiresMinVolume: boolean;
  minVolumeDetails: string;
  estimatedPrice: number;
  currency: "USD" | "PYG" | "BRL";
  paymentTerm: string;
  possibleContract: boolean;
  possibleLetterOfIntent: boolean;
  status: BuyerStatus;
  conversationDate: string;
  nextAction: string;
  observations: string;
  documents: string[];
}

export enum OrganResponsable {
  AberturaEmpresa = "Registro Público / Abogacía",
  SET_RUC = "SET (RUC - Ministério de Hacienda)",
  COINCA_MAG = "COINCA / MAG (Ministério de Agricultura)",
  SENAD = "SENAD (Secretaría Nacional Antidrogas)",
  SENAVE = "SENAVE (Sanidade Vegetal e Sementes)",
  MIC = "MIC (Ministério de Indústria e Comércio)",
  DINAVISA = "DINAVISA (Vigilância Sanitária)",
  Municipalidad = "Municipalidad / Prefeitura Local",
  ContratoImovel = "Contrato de Imóvel / Escribanía",
  Laboratorio = "Laboratório de Controle de Qualidade",
  Outro = "Outro"
}

export enum LicenseStatus {
  NaoIniciado = "Não Iniciado",
  Pesquisando = "Pesquisando",
  DocumentosPendentes = "Documentos Pendentes",
  EmPreparacao = "Em Preparação",
  Protocolado = "Protocolado",
  EmAnalise = "Em Análise",
  Aprovado = "Aprovado",
  Recusado = "Recusado",
  Vencido = "Vencido",
  Renovar = "Renovar"
}

export interface License {
  id: string;
  name: string;
  organ: OrganResponsable;
  type: "Licença Prévia" | "Registro" | "Autorização de Plantio" | "Contrato" | "Alvará" | "Outro";
  status: LicenseStatus;
  internalResponsible: string;
  externalResponsible: string;
  deadline: string;
  estimatedCost: number;
  realCost: number;
  currency: "USD" | "PYG" | "BRL";
  requiredDocs: string[];
  files: string[];
  protocolDate: string;
  expirationDate: string;
  renewalRequired: boolean;
  observations: string;
  risk: "Baixo" | "Médio" | "Alto";
  nextStep: string;
}

export enum AreaType {
  Estufa = "Estufa (Greenhouse)",
  AreaAberta = "Área Aberta",
  AreaSecagem = "Área de Secagem",
  AreaArmazenamento = "Área de Armazenamento",
  Viveiro = "Viveiro / Clone-Room",
  CasaApoio = "Casa de Apoio (Habitação)",
  SalaTecnica = "Sala Técnica / Bombas",
  Reservatorio = "Reservatório de Água",
  AreaFutura = "Área Futura de Expansão"
}

export enum AreaStatus {
  Planejada = "Planejada",
  EmMontagem = "Em Montagem",
  Pronta = "Pronta",
  EmUso = "Em Uso",
  Manutencao = "Manutenção",
  Desativada = "Desativada"
}

export interface Area {
  id: string;
  name: string;
  type: AreaType;
  sizeM2: number;
  width: number;
  length: number;
  locationInFarm: string;
  status: AreaStatus;
  setupDate: string;
  structureSupplier: string;
  materialUsed: string;
  covering: string;
  irrigation: string;
  ventilation: string;
  sensorsInstalled: string[];
  camerasInstalled: string[];
  electricityType: string;
  observations: string;
  photos: string[];
}

export enum ProjectType {
  MedicinalRegulado = "Medicinal Regulado",
  IndustrialCanhamo = "Industrial / Cânhamo",
  CanabinoidesAltoControle = "Canabinóides de Alto Controle",
  TestePDI = "Teste P&D",
  Outro = "Outro"
}

export enum LotStatus {
  Planejado = "Planejado",
  Plantado = "Plantado",
  Vegetativo = "Vegetativo",
  Floracao = "Floração",
  Colheita = "Colheita",
  Secagem = "Secagem",
  Armazenado = "Armazenado",
  Vendido = "Vendido",
  Descartado = "Descartado",
  BloqueadoCompliance = "Bloqueado por Compliance"
}

export interface Lot {
  id: string;
  code: string; // e.g. VVT-2026-001-ESTA
  crop: CropType;
  variety: string;
  projectType: ProjectType;
  areaId: string;
  plantingDate: string;
  estimatedHarvestDate: string;
  realHarvestDate: string;
  responsible: string;
  seedSource: string;
  supplier: string;
  quantityPlanted: number;
  areaUsedM2: number;
  status: LotStatus;
  weightHarvestedKg: number;
  weightDryKg: number;
  lossPercentage: number;
  humidityPercentage: number;
  labReportFile: string;
  destination: string;
  buyerId: string;
  estimatedPricePerKg: number;
  realPricePerKg: number;
  currency: "USD" | "PYG" | "BRL";
  observations: string;
  photos: string[];
  documents: string[];
}

export interface Measurement {
  id: string;
  timestamp: string;
  areaId: string;
  lotId: string;
  temperature: number; // ºC
  airHumidity: number; // %
  soilHumidity: number; // %
  pH: number;
  EC: number; // mS/cm
  luminosity: number; // lux
  co2: number; // ppm
  waterConsumptionLiters: number;
  irrigationTriggered: boolean;
  energyConsumptionKwh: number;
  observations: string;
  photo: string;
  responsible: string;
}

export enum TaskType {
  Irrigar = "Irrigar",
  MedirPH_EC = "Medir pH e EC",
  VerificarPragas = "Verificar Pragas",
  RegistrarFoto = "Registrar Foto de Acompanhamento",
  LimparArea = "Limpar Área / Higienização",
  RevisarCameras = "Revisar Câmeras",
  RevisarCerca = "Revisar Cerca de Segurança",
  RevisarBomba = "Revisar Bomba / Filtro",
  VerificarSecagem = "Verificar Secagem",
  PesarMaterial = "Pesar Material",
  ColetarAmostra = "Coletar Amostra de Laboratório",
  EnviarLaboratorio = "Enviar para Laboratório",
  AtualizarLote = "Atualizar Status do Lote",
  ContatarFornecedor = "Contatar Fornecedor",
  ContatarComprador = "Contatar Comprador",
  RenovarDocumento = "Renovar Documento/Licença"
}

export enum TaskStatus {
  Pendente = "Pendente",
  EmAndamento = "Em Andamento",
  Concluida = "Concluída",
  Atrasada = "Atrasada",
  Cancelada = "Cancelada"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  responsible: string;
  areaId: string;
  lotId: string;
  priority: PriorityLevel;
  deadline: string;
  status: TaskStatus;
  recurrence: "Única" | "Diária" | "Semanal" | "Mensal";
  photoRequired: boolean;
  observations: string;
  completionDate: string;
  photoUrl: string;
}

export enum FinanceType {
  Orcamento = "Orçamento Previsto",
  Despesa = "Despesa Real",
  Receita = "Receita Real",
  Investimento = "Capital de Giro"
}

export enum FinanceCategory {
  Caucao = "Caução Imobiliária",
  Aluguel = "Aluguel da Chácara",
  CompraMaterial = "Compra de Materiais",
  LocacaoFerramenta = "Locação de Ferramentas",
  MaoDeObra = "Mão de Obra / Serviços",
  Transporte = "Transporte e Logística",
  Licenca = "Taxas e Licenças",
  Contador = "Contabilidade / Gestão",
  Advogado = "Assessoria Jurídica / Registro S.A.",
  Laboratorio = "Análises de Laboratório",
  Energia = "Energia Elétrica",
  Agua = "Abastecimento de Água",
  Internet = "Conectividade",
  Manutencao = "Manutenção e Reparos",
  Seguranca = "Infraestrutura de Segurança",
  VendaLote = "Venda de Produção",
  AporteCapital = "Injeção de Capital de Giro",
  Outro = "Outro"
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: FinanceType;
  category: FinanceCategory;
  description: string;
  supplierId?: string;
  propertyId?: string;
  areaId?: string;
  lotId?: string;
  value: number;
  currency: "USD" | "PYG" | "BRL";
  paymentMethod: string;
  status: "Pendente" | "Pago" | "Recebido" | "Cancelado";
  receiptFile?: string;
  observations: string;
}

export interface AppDocument {
  id: string;
  name: string;
  type: string; // e.g. "Estatuto", "Laudo", "Fatura", "Contrato"
  relatedModule: "Contatos" | "Chácaras" | "Fornecedores" | "Compradores" | "Licenças" | "Lotes" | "Financeiro" | "Geral";
  relatedId?: string; // id of the specific record
  date: string;
  expirationDate?: string;
  responsible: string;
  observation: string;
  fileUrl: string;
  fileSize: string; // e.g. "1.2 MB"
  protocolNumber?: string;
}

export enum VisitStatus {
  Visitar = "Visitar",
  VisitaAgendada = "Visita Agendada",
  Visitado = "Visitado",
  Aprovado = "Aprovado",
  Descartado = "Descartado",
  Retornar = "Retornar"
}

export interface Visit {
  id: string;
  name: string; // Place or entity name, e.g. "DINAVISA", "Chácara Hernandarias"
  type: "Chácara" | "Imobiliária" | "Fornecedor" | "Comprador" | "Advogado" | "Contador" | "Laboratório" | "Órgão Público" | "Produtor" | "Outro";
  address: string;
  city: string;
  gps: string;
  contact: string;
  plannedDate: string;
  status: VisitStatus;
  result: string;
  photos: string[];
  documents: string[];
  nextAction: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  type: "danger" | "warning" | "success" | "info";
  date: string;
  severity: PriorityLevel;
  resolved: boolean;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export enum UserRole {
  Administrador = "Administrador",
  OperadorCampo = "Operador de Campo",
  GestorParceiro = "Gestor / Parceiro",
  ConsultorAdvogadoContador = "Consultor / Advogado / Contador",
  CompradorParceiroExterno = "Comprador / Parceiro Externo"
}
