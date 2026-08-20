import React from 'react';
import { Ticket, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentTab: 'event' | 'ticket' | 'checkin' | 'participation';
  onSelectTab: (tab: 'event' | 'ticket' | 'checkin' | 'participation') => void;
  onResetDemo: () => void;
  ticketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onResetDemo,
  ticketCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c0f17]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">CulturaGO</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                  Tickets
                </span>
              </div>
              <p className="text-xs text-gray-400">Tickets culturales con participación verificable</p>
            </div>
          </div>

          {/* Badges */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Stellar Testnet
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Raven MCP Context
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Web2 Frictionless
            </div>
          </div>

          {/* Navigation Steps & Reset */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <nav className="flex items-center bg-gray-900/80 p-1 rounded-xl border border-gray-800 text-xs">
              <button
                onClick={() => onSelectTab('event')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentTab === 'event'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                1. Evento
              </button>
              <button
                onClick={() => onSelectTab('ticket')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  currentTab === 'ticket'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                2. Ticket
                {ticketCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
              <button
                onClick={() => onSelectTab('checkin')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentTab === 'checkin'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                3. Check-in
              </button>
              <button
                onClick={() => onSelectTab('participation')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentTab === 'participation'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                4. Pasaporte
              </button>
            </nav>

            <button
              onClick={onResetDemo}
              title="Reiniciar flujo de demo"
              className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 transition-colors border border-gray-700 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
