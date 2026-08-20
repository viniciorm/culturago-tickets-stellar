import { useState } from 'react';
import type { CulturalTicket, ParticipationRecord } from './types/ticket';
import { ticketRepository } from './services/ticketStore';
import { Navbar } from './components/Navbar';
import { EventView } from './components/EventView';
import { TicketView } from './components/TicketView';
import { CheckInScannerView } from './components/CheckInScannerView';
import { ParticipationView } from './components/ParticipationView';
import { DemoToolbar } from './components/DemoToolbar';

export function App() {
  const [currentTab, setCurrentTab] = useState<'event' | 'ticket' | 'checkin' | 'participation'>('event');
  const [tickets, setTickets] = useState<CulturalTicket[]>(() => ticketRepository.getAllTickets());
  const [currentTicket, setCurrentTicket] = useState<CulturalTicket | undefined>(() => {
    const all = ticketRepository.getAllTickets();
    return all[0];
  });
  const [participation, setParticipation] = useState<ParticipationRecord | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const event = ticketRepository.getEvent();

  const refreshState = () => {
    const all = ticketRepository.getAllTickets();
    setTickets(all);
    if (currentTicket) {
      const updated = ticketRepository.getTicketById(currentTicket.id);
      if (updated) setCurrentTicket(updated);
    }
  };

  const handleGetTicket = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      const newTicket = await ticketRepository.issueTicket(name, email);
      refreshState();
      setCurrentTicket(newTicket);
      setCurrentTab('ticket');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (qrPayload: string) => {
    const result = await ticketRepository.performCheckIn(qrPayload);
    refreshState();

    if (result.success && result.ticket) {
      const part = ticketRepository.getParticipation(result.ticket.id);
      if (part) {
        setParticipation(part);
      }
    }
    return result;
  };

  const handleGoToCheckIn = (ticket: CulturalTicket) => {
    setCurrentTicket(ticket);
    setCurrentTab('checkin');
  };

  const handleViewParticipation = (ticketId: string) => {
    const part = ticketRepository.getParticipation(ticketId);
    if (part) {
      setParticipation(part);
      setCurrentTab('participation');
    }
  };

  const handleResetDemo = () => {
    ticketRepository.resetDemo();
    const all = ticketRepository.getAllTickets();
    setTickets(all);
    setCurrentTicket(all[0]);
    setParticipation(undefined);
    setCurrentTab('event');
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-20">
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onResetDemo={handleResetDemo}
        ticketCount={tickets.length}
      />

      <main className="flex-1">
        {currentTab === 'event' && (
          <EventView
            event={event}
            onGetTicket={handleGetTicket}
            isLoading={isLoading}
          />
        )}

        {currentTab === 'ticket' && currentTicket && (
          <TicketView
            ticket={currentTicket}
            onGoToCheckIn={handleGoToCheckIn}
          />
        )}

        {currentTab === 'checkin' && (
          <CheckInScannerView
            currentTicket={currentTicket}
            allTickets={tickets}
            onCheckIn={handleCheckIn}
            onViewParticipation={handleViewParticipation}
          />
        )}

        {currentTab === 'participation' && (
          <ParticipationView
            participation={participation}
            onGoToEvent={() => setCurrentTab('event')}
          />
        )}
      </main>

      {/* 30-second Demo Accelerator Bar */}
      <DemoToolbar
        onStep1GetTicket={() => {
          handleGetTicket('Alex Valenzuela', 'alex.valenzuela@culturago.app');
        }}
        onStep2CheckIn={() => {
          setCurrentTab('checkin');
        }}
        onStep3DoubleCheckIn={() => {
          setCurrentTab('checkin');
        }}
        onStep4ViewPassport={() => {
          if (participation) setCurrentTab('participation');
        }}
        hasParticipation={!!participation}
      />
    </div>
  );
}

export default App;
