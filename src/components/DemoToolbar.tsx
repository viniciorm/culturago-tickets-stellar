import React from 'react';
import { PlayCircle, ShieldAlert } from 'lucide-react';

interface DemoToolbarProps {
  onStep1GetTicket: () => void;
  onStep2CheckIn: () => void;
  onStep3DoubleCheckIn: () => void;
  onStep4ViewPassport: () => void;
  hasParticipation: boolean;
}

export const DemoToolbar: React.FC<DemoToolbarProps> = ({
  onStep1GetTicket,
  onStep2CheckIn,
  onStep3DoubleCheckIn,
  onStep4ViewPassport,
  hasParticipation,
}) => {
  return (
    <aside aria-label="Demo Bar" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-gray-900/95 backdrop-blur-md border border-gray-700/80 rounded-2xl shadow-2xl p-2.5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-gray-300">
          <PlayCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Flujo Rápido 30s:</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 w-full sm:w-auto text-[11px]">
          <button
            onClick={onStep1GetTicket}
            className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors text-center border border-gray-700"
          >
            1. Emitir
          </button>
          <button
            onClick={onStep2CheckIn}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium transition-colors text-center"
          >
            2. Escanear
          </button>
          <button
            onClick={onStep3DoubleCheckIn}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-purple-200" />
            <span>3. Reúso</span>
          </button>
          <button
            onClick={onStep4ViewPassport}
            disabled={!hasParticipation}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors text-center ${
              hasParticipation
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed'
            }`}
          >
            4. Pasaporte
          </button>
        </div>
      </div>
    </aside>
  );
};
