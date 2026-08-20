import React from 'react';
import type { ParticipationRecord } from '../types/ticket';
import {
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  BookOpen,
} from 'lucide-react';

interface ParticipationViewProps {
  participation?: ParticipationRecord;
  onGoToEvent: () => void;
}

export const ParticipationView: React.FC<ParticipationViewProps> = ({
  participation,
  onGoToEvent,
}) => {
  if (!participation) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 space-y-4">
          <Award className="w-12 h-12 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">No hay participación verificada aún</h2>
          <p className="text-sm text-gray-400">
            Realiza el check-in de un ticket para ver la credencial anclada en Stellar Testnet.
          </p>
          <button
            onClick={onGoToEvent}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Ir a Evento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Verification Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-emerald-500/30 shadow-2xl p-6 sm:p-10 mb-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Status */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                PARTICIPATION VERIFIED
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Asistencia Cultural Certificada
              </h1>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            On-Chain Verificada
          </span>
        </div>

        {/* Passport Stamp & Badge Showcase */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stamp Card */}
          <div className="md:col-span-1 p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400/70 flex flex-col items-center justify-center p-2 mb-3 bg-amber-950/40">
              <Sparkles className="w-6 h-6 text-amber-400 mb-0.5" />
              <span className="text-[9px] font-black text-amber-300 uppercase tracking-tighter">
                CULTURAGO
              </span>
              <span className="text-[8px] font-mono text-amber-200">SELLO 2026</span>
            </div>
            <p className="text-xs font-bold text-white">{participation.badgeName}</p>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              +{participation.badgePoints} Pts Pasaporte
            </p>
          </div>

          {/* Attendance Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center gap-3">
              <Ticket className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase text-gray-400">Evento</p>
                <p className="text-xs font-bold text-white truncate">{participation.eventTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center gap-3">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase text-gray-400">Participante</p>
                  <p className="text-xs font-bold text-white truncate">
                    {participation.attendeeName}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase text-gray-400">Verificado a las</p>
                  <p className="text-xs font-bold text-white truncate">
                    {new Date(participation.verifiedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stellar Testnet Proof Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-black/70 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-xs font-bold text-indigo-200">
                Prueba Inmutable en Stellar Testnet
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
              Horizon Testnet RPC
            </span>
          </div>

          <div>
            <p className="text-[11px] text-gray-400 font-mono mb-1">Stellar Transaction Hash:</p>
            <p className="text-xs font-mono text-emerald-300 break-all bg-gray-950 p-2.5 rounded-xl border border-gray-800">
              {participation.stellarTxHash}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-400">
              Prueba pública de asistencia criptográficamente anclada en el Ledger.
            </p>

            <a
              href={participation.stellarExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <span>Ver en Stellar Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Cultural Passport Connection Note */}
        <div className="relative z-10 mt-6 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-300">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Integración con el Pasaporte Cultural de CulturaGO</span>
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            Esta asistencia confirmada en Stellar es una credencial portable que se acumula en el
            perfil cultural del usuario, desbloqueando accesos exclusivos a museos, preventas y
            recompensas comunitarias sin depender de intermediarios centralizados.
          </p>
        </div>
      </div>
    </div>
  );
};
