import React, { useState } from 'react';
import type { CulturalEvent } from '../types/ticket';
import { Calendar, MapPin, Clock, Award, Shield, ArrowRight, User, Mail, Sparkles } from 'lucide-react';

interface EventViewProps {
  event: CulturalEvent;
  onGetTicket: (name: string, email: string) => Promise<void>;
  isLoading: boolean;
}

export const EventView: React.FC<EventViewProps> = ({ event, onGetTicket, isLoading }) => {
  const [name, setName] = useState('Alex Valenzuela');
  const [email, setEmail] = useState('alex.valenzuela@culturago.app');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onGetTicket(name, email);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900/90 to-indigo-950/70 border border-gray-800 shadow-2xl p-6 sm:p-10 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Category & Badge preview */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {event.category}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-medium border border-indigo-500/30">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Recompensa: +{event.badgePoints} Puntos Pasaporte</span>
          </div>
        </div>

        {/* Event Title */}
        <div className="relative z-10 mb-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
            {event.title}
          </h1>
          <p className="text-lg text-indigo-300 font-medium">{event.subtitle}</p>
        </div>

        {/* Event Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <Calendar className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Fecha</p>
              <p className="text-sm font-semibold text-white">{event.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <Clock className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Horario</p>
              <p className="text-sm font-semibold text-white">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-800/50 border border-gray-700/50 sm:col-span-2 lg:col-span-1">
            <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Lugar</p>
              <p className="text-sm font-semibold text-white">{event.venue}</p>
              <p className="text-xs text-gray-400">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 relative z-10">
          {event.description}
        </p>

        {/* Ticket Request Form */}
        <div className="relative z-10 pt-6 border-t border-gray-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>Obtén tu entrada digital</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {event.price}
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Nombre completo del asistente
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Alex Valenzuela"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Emisión firmada criptográficamente con Stellar Ed25519</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Emitiendo ticket...</span>
                ) : (
                  <>
                    <span>Get Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
