/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Droplet,
  Plus,
  Search,
  Check,
  X,
  Thermometer,
  Zap,
  Activity,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Measurement } from "../types";

interface MedicoesProps {
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  addAuditLog: (action: string, details: string) => void;
}

export default function Medicoes({ measurements, setMeasurements, addAuditLog }: MedicoesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for full Daily Telemetry Record
  const [areaId, setAreaId] = useState("a-1");
  const [lotId, setLotId] = useState("lote-1");
  const [temperature, setTemperature] = useState(24.5);
  const [airHumidity, setAirHumidity] = useState(65);
  const [soilHumidity, setSoilHumidity] = useState(55);
  const [pH, setPh] = useState(6.2);
  const [EC, setEc] = useState(1.4);
  const [co2, setCo2] = useState(400);
  const [waterConsumptionLiters, setWaterConsumptionLiters] = useState(300);
  const [responsible, setResponsible] = useState("Operador de Campo");
  const [observations, setObservations] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMeasurement: Measurement = {
      id: "m-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      areaId,
      lotId,
      temperature,
      airHumidity,
      soilHumidity,
      pH,
      EC,
      luminosity: 32000,
      co2,
      waterConsumptionLiters,
      irrigationTriggered: waterConsumptionLiters > 0,
      energyConsumptionKwh: 2.5,
      observations,
      photo: "",
      responsible
    };

    setMeasurements(prev => [newMeasurement, ...prev]);
    addAuditLog("Adicionou Medição", `Registrou telemetria completa para Área ${areaId}: ${temperature}°C, ${pH} pH, ${EC} EC`);
    setIsModalOpen(false);

    // Reset Form
    setObservations("");
  };

  // Get the absolute latest reading for stats
  const latest = measurements[0] || {
    temperature: 0,
    airHumidity: 0,
    soilHumidity: 0,
    pH: 0,
    EC: 0,
    co2: 0
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-emerald-900">Sensores e Medições Manuais</h2>
          <p className="text-stone-500 text-sm">Registre e monitore as condições do solo, do clima interno das estufas e da condutividade da água para garantir a máxima qualidade química.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer self-start"
        >
          <Plus size={16} /> Registrar Medição de Campo
        </button>
      </div>

      {/* Latest Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 text-stone-800">
        
        {/* Temp */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Temp. do Ar</span>
            <Thermometer size={16} className="text-amber-500" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.temperature} °C</span>
        </div>

        {/* Hum ar */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Umidade do Ar</span>
            <Droplet size={16} className="text-blue-500" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.airHumidity} %</span>
        </div>

        {/* Hum solo */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Umidade Solo</span>
            <Droplet size={16} className="text-emerald-600" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.soilHumidity} %</span>
        </div>

        {/* pH */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">pH do Solo</span>
            <Activity size={16} className="text-purple-500" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.pH} pH</span>
        </div>

        {/* EC */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">EC (Fertirrigação)</span>
            <Zap size={16} className="text-emerald-700" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.EC} mS/cm</span>
        </div>

        {/* CO2 */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-extrabold uppercase block tracking-wider">Concentração CO2</span>
            <Sparkles size={16} className="text-teal-600" />
          </div>
          <span className="text-lg font-black mt-2 text-stone-800">{latest.co2} ppm</span>
        </div>

      </div>

      {/* Charts & Interactive Real-Time SVG Sensor Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Sensor Curves */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-emerald-50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-emerald-900 text-sm font-display">Curva Climatológica de 24h</h3>
              <p className="text-xs text-stone-500">Histórico dinâmico de telemetria da Estufa Principal.</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] border border-emerald-150 font-bold">
              Telemetria Ativa
            </span>
          </div>

          {/* Simple Custom SVG Line Chart */}
          <div className="relative pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-44 overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f5f5f4" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f5f5f4" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f5f5f4" strokeWidth="1" />
              
              {/* Y-axis labels */}
              <text x="5" y="25" className="text-[9px] font-bold text-stone-400" fill="currentColor">35°C (Temp. Máx)</text>
              <text x="5" y="70" className="text-[9px] font-bold text-stone-400" fill="currentColor">25°C (Estável)</text>
              <text x="5" y="115" className="text-[9px] font-bold text-stone-400" fill="currentColor">15°C (Temp. Mín)</text>

              {/* Line 1: Temperature Curve (Yellow) */}
              <path 
                d="M 10 110 Q 90 90 150 50 T 280 40 T 400 100 T 490 115" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />

              {/* Line 2: Soil Moisture Curve (Blue) */}
              <path 
                d="M 10 50 Q 80 55 160 80 T 290 60 T 380 40 T 490 55" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* X-axis time marks */}
              <text x="10" y="145" className="text-[9px] font-bold text-stone-400" fill="currentColor">00:00</text>
              <text x="120" y="145" className="text-[9px] font-bold text-stone-400" fill="currentColor">06:00</text>
              <text x="240" y="145" className="text-[9px] font-bold text-stone-400" fill="currentColor">12:00 (Pico Sol)</text>
              <text x="360" y="145" className="text-[9px] font-bold text-stone-400" fill="currentColor">18:00</text>
              <text x="450" y="145" className="text-[9px] font-bold text-stone-400" fill="currentColor">23:00</text>
            </svg>

            {/* Legend indicators */}
            <div className="flex gap-4 items-center justify-center pt-2 text-[10px] font-bold text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500 inline-block rounded"></span>
                <span>Temperatura (°C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-600 border-dashed border inline-block rounded"></span>
                <span>Umidade do Substrato (%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Alerts or Guidance Box */}
        <div className="bg-emerald-950 rounded-2xl p-5 text-emerald-200 flex flex-col justify-between border border-emerald-900 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400" size={16} />
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-400 block">Dica de Manejo Técnico</span>
            </div>
            <h4 className="font-extrabold text-white text-sm font-display">Ponto de Murcha Permanente e EC</h4>
            <p className="text-xs text-emerald-300 leading-relaxed">
              Mantenha a condutividade elétrica (EC) de fertirrigação entre 1.4 e 1.8 mS/cm para cannabis/cânhamo regulado. Um pH ácido de 5.8 a 6.2 otimiza a absorção de nutrientes. Registre medições após cada irrigação matinal.
            </p>
          </div>
          
          <div className="pt-4 border-t border-emerald-900 text-[10px] text-emerald-400 flex justify-between items-center font-bold">
            <span>Último Alerta: Nenhum</span>
            <span>Estabilidade de pH: 98.4%</span>
          </div>
        </div>

      </div>

      {/* Historical logs table list */}
      <div className="bg-white rounded-2xl border border-emerald-50 shadow-sm p-5 space-y-4 text-stone-800">
        <h3 className="font-extrabold text-xs text-emerald-800 uppercase tracking-widest opacity-60">Histórico de Medições de Campo</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-50 text-stone-400 font-bold">
                <th className="pb-3 pr-4">Timestamp</th>
                <th className="pb-3 px-4">Localização / Lote</th>
                <th className="pb-3 px-3 text-center">Temp.</th>
                <th className="pb-3 px-3 text-center">Umidade Ar</th>
                <th className="pb-3 px-3 text-center">Umidade Solo</th>
                <th className="pb-3 px-3 text-center">pH</th>
                <th className="pb-3 px-3 text-center">EC</th>
                <th className="pb-3 px-3 text-center">CO2</th>
                <th className="pb-3 px-4 text-right">Consumo H2O</th>
                <th className="pb-3 px-4">Coletor</th>
                <th className="pb-3 pl-4">Anotação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50/50">
              {measurements.map(m => (
                <tr key={m.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-stone-500 whitespace-nowrap">{m.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-stone-900">{m.areaId} / {m.lotId}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-600">{m.temperature} °C</td>
                  <td className="py-3 px-3 text-center text-stone-600">{m.airHumidity} %</td>
                  <td className="py-3 px-3 text-center font-bold text-blue-600">{m.soilHumidity} %</td>
                  <td className="py-3 px-3 text-center font-bold text-purple-600">{m.pH}</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700">{m.EC} mS</td>
                  <td className="py-3 px-3 text-center text-stone-500">{m.co2} ppm</td>
                  <td className="py-3 px-4 text-right font-semibold text-stone-700">{m.waterConsumptionLiters} L</td>
                  <td className="py-3 px-4 text-stone-600 font-semibold">{m.responsible}</td>
                  <td className="py-3 pl-4 text-stone-400 italic max-w-xs truncate" title={m.observations}>{m.observations || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-stone-50 border-b border-stone-150 p-4 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-sm">Registrar Medição Completa de Campo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-full">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Estufa de Origem */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Código da Área</label>
                  <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs font-bold"
                  >
                    <option value="a-1">a-1 (Estufa Principal - Setor A)</option>
                    <option value="a-2">a-2 (Estufa de Mudas e Clones)</option>
                    <option value="a-3">a-3 (Área de Secagem)</option>
                  </select>
                </div>

                {/* Lote Associado */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Lote Relacionado</label>
                  <select
                    value={lotId}
                    onChange={(e) => setLotId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs font-bold"
                  >
                    <option value="lote-1">lote-1 (VVT-2026-001-EST1)</option>
                    <option value="lote-2">lote-2 (VVT-2026-002-VIVE)</option>
                  </select>
                </div>

                {/* Temperatura */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Temperatura do Ar (°C)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* Umidade do ar */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Umidade Relativa do Ar (%)</label>
                  <input 
                    type="number" 
                    required
                    value={airHumidity}
                    onChange={(e) => setAirHumidity(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* Umidade do solo */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Umidade do Substrato (%)</label>
                  <input 
                    type="number" 
                    required
                    value={soilHumidity}
                    onChange={(e) => setSoilHumidity(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* pH */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">pH do Solo</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={pH}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* EC */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Eletrocondutividade EC (mS)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={EC}
                    onChange={(e) => setEc(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>

                {/* CO2 */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Concentração CO2 (ppm)</label>
                  <input 
                    type="number" 
                    required
                    value={co2}
                    onChange={(e) => setCo2(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Água litros */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Volume de Fertirrigação Aplicado (Liters)</label>
                <input 
                  type="number" 
                  required
                  value={waterConsumptionLiters}
                  onChange={(e) => setWaterConsumptionLiters(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Operador */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Técnico Coletor / Responsável</label>
                <input 
                  type="text" 
                  required
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Anotações Climatológicas</label>
                <textarea 
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  placeholder="Ex: Medido antes do acionamento dos exaustores..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-500 rounded-lg p-2.5 text-sm"
                />
              </div>

              {/* Form Actions */}
              <div className="border-t border-stone-100 pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1">
                  Registrar Telemetria Walk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
