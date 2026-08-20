import React, { useState } from 'react';
import type { CulturalTicket } from '../types/ticket';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle,
  AlertTriangle,
  QrCode,
  KeyRound,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TicketViewProps {
  ticket: CulturalTicket;
  onGoToCheckIn: (ticket: CulturalTicket) => void;
}

export const TicketView: React.FC<TicketViewProps> = ({ ticket, onGoToCheckIn }) => {
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(ticket.qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUsed = ticket.status === 'USED';

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Digital Ticket Container */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-center relative border-b border-indigo-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-300">
              CulturaGO Tickets
            </span>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isUsed
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isUsed ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                  <span>USED</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VALID</span>
                </>
              )}
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">{ticket.eventTitle}</h2>
          <p className="text-xs text-indigo-200 mt-1">Ticket Digital con Ownership Criptográfico</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Attendee Info Card */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-800/60 border border-gray-700/50 text-left">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Asistente
              </p>
              <p className="text-sm font-bold text-white mt-0.5 truncate">{ticket.attendeeName}</p>
              <p className="text-xs text-gray-400 truncate">{ticket.attendeeEmail}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Ticket ID
              </p>
              <p className="text-sm font-mono font-bold text-amber-400 mt-0.5">{ticket.id}</p>
              <p className="text-xs text-gray-400">
                Emitido {new Date(ticket.issuedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 text-center relative">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG
                value={ticket.qrString}
                size={200}
                level="M"
                includeMargin={false}
                className={isUsed ? 'opacity-40 grayscale' : ''}
              />
            </div>

            {isUsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/75 rounded-2xl backdrop-blur-xs">
                <div className="bg-purple-900/90 border border-purple-500/50 text-white px-4 py-2 rounded-xl text-center shadow-lg">
                  <p className="text-xs font-bold text-purple-200">TICKET UTILIZADO</p>
                  <p className="text-[10px] text-purple-300">
                    {ticket.usedAt ? new Date(ticket.usedAt).toLocaleTimeString() : 'Validado'}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>QR Dinámico con Payload Firmado Ed25519</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onGoToCheckIn(ticket)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
            >
              <span>Ir a Check-in en Puerta (Escanear)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyPayload}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium flex items-center justify-center gap-2 border border-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payload Copiado al Portapapeles</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Payload QR para Validación Manual</span>
                </>
              )}
            </button>
          </div>

          {/* Cryptographic Inspector Toggle */}
          <div className="pt-2 border-t border-gray-800 text-left">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-indigo-300 transition-colors py-1"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verificar Firma Criptográfica (Ed25519)</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-400">
                {showTechnicalDetails ? 'Ocultar' : 'Ver Detalles'}
              </span>
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-3 rounded-xl bg-gray-950 border border-gray-800 text-[11px] font-mono text-gray-400 space-y-2 break-all">
                <div>
                  <span className="text-gray-500">Authority Public Key:</span>
                  <p className="text-indigo-300">{ticket.signedPayload.authorityPublicKey}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ed25519 Signature:</span>
                  <p className="text-amber-300">{ticket.signedPayload.signature}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nonce:</span>
                  <p className="text-emerald-300">{ticket.signedPayload.nonce}</p>
                </div>
                <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-900 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span>Sin claves privadas ni datos sensibles en el QR.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
