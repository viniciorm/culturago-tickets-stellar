import React, { useState } from 'react';
import type { CulturalTicket, CheckInResult } from '../types/ticket';
import {
  Scan,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';

interface CheckInScannerViewProps {
  currentTicket?: CulturalTicket;
  allTickets: CulturalTicket[];
  onCheckIn: (qrPayload: string) => Promise<CheckInResult>;
  onViewParticipation: (ticketId: string) => void;
}

export const CheckInScannerView: React.FC<CheckInScannerViewProps> = ({
  currentTicket,
  allTickets,
  onCheckIn,
  onViewParticipation,
}) => {
  const [inputPayload, setInputPayload] = useState(currentTicket?.qrString || '');
  const [selectedTicketId, setSelectedTicketId] = useState(currentTicket?.id || allTickets[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);

  const handleRunScan = async (payloadToScan: string) => {
    setIsProcessing(true);
    setResult(null);
    try {
      const res = await onCheckIn(payloadToScan);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickScan = () => {
    const target = allTickets.find((t) => t.id === selectedTicketId) || currentTicket;
    if (target) {
      handleRunScan(target.qrString);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Scanner Card */}
      <div className="rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Punto de Acceso & Check-in
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              Validación criptográfica contra emisor confiable y registro Stellar Testnet
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Lector de Puerta Listo
          </div>
        </div>

        {/* Scanner HUD Area */}
        <div className="relative rounded-2xl bg-black/60 border border-gray-800 p-8 flex flex-col items-center justify-center text-center overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

          <div className="relative w-48 h-48 border-2 border-dashed border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center p-4 bg-gray-900/40">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400"></div>

            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <span className="text-xs text-gray-300 font-medium">Validando en Stellar...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Scan className="w-10 h-10 text-indigo-400/80 animate-pulse" />
                <span className="text-[11px] text-gray-400">Listo para escanear QR</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Latencia de validación en puerta: <span className="text-emerald-400 font-mono font-bold">&lt; 200 ms</span>
          </p>
        </div>

        {/* Quick Demo Controls */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-gray-800/40 border border-gray-700/50">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Seleccionar Ticket para Probar Validación
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedTicketId}
                onChange={(e) => {
                  setSelectedTicketId(e.target.value);
                  const t = allTickets.find((item) => item.id === e.target.value);
                  if (t) setInputPayload(t.qrString);
                }}
                className="flex-1 px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              >
                {allTickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.attendeeName} ({t.status})
                  </option>
                ))}
              </select>

              <button
                onClick={handleQuickScan}
                disabled={isProcessing || allTickets.length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                <span>Escanear Ticket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Result Banner */}
        {result && (
          <div
            className={`p-6 rounded-2xl border mb-6 transition-all ${
              result.statusCode === 'CHECK_IN_SUCCESSFUL'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                : result.statusCode === 'TICKET_ALREADY_USED'
                ? 'bg-purple-950/40 border-purple-500/50 text-purple-100'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-4">
              {result.statusCode === 'CHECK_IN_SUCCESSFUL' ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                </div>
              ) : result.statusCode === 'TICKET_ALREADY_USED' ? (
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-7 h-7 text-purple-400" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <XCircle className="w-7 h-7 text-rose-400" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      result.statusCode === 'CHECK_IN_SUCCESSFUL'
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : result.statusCode === 'TICKET_ALREADY_USED'
                        ? 'bg-purple-500/30 text-purple-300'
                        : 'bg-rose-500/30 text-rose-300'
                    }`}
                  >
                    {result.statusCode.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm font-semibold">{result.message}</p>

                {/* Proof and Action for Success */}
                {result.statusCode === 'CHECK_IN_SUCCESSFUL' && result.ticket && (
                  <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {result.stellarStatus === 'CONFIRMED' && result.stellarTxHash && result.stellarExplorerUrl ? (
                      <a
                        href={result.stellarExplorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 font-mono underline underline-offset-4"
                      >
                        <span>Stellar Tx: {result.stellarTxHash.slice(0, 16)}...</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Acceso validado en puerta (Stellar Testnet pendiente/no disponible)</span>
                      </div>
                    )}

                    <button
                      onClick={() => onViewParticipation(result.ticket!.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <span>Ver Pasaporte Cultural</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Explanation for Already Used */}
                {result.statusCode === 'TICKET_ALREADY_USED' && (
                  <div className="pt-2 text-xs text-purple-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      Doble gasto prevenido: el identificador único del ticket ya está en estado USED.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Payload Input */}
        <div className="pt-4 border-t border-gray-800">
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer font-medium hover:text-gray-300">
              Validar Payload QR de forma manual (JSON)
            </summary>
            <div className="mt-3 space-y-2">
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                placeholder="Pega aquí el JSON del código QR..."
                rows={3}
                className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleRunScan(inputPayload)}
                disabled={isProcessing || !inputPayload.trim()}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
              >
                Validar Payload Manual
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
