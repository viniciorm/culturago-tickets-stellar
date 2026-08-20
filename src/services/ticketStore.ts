import type {
  CulturalEvent,
  CulturalTicket,
  CheckInResult,
  ParticipationRecord,
  SignedQRPayload,
} from '../types/ticket';
import {
  signTicketPayload,
  verifyTicketSignature,
  anchorAttendanceToStellar,
  getTrustedAuthorityPublicKey,
} from './stellar';

export const DEFAULT_EVENT: CulturalEvent = {
  id: 'sbn-2026-culturago',
  title: 'Stellar Builder Night — Santiago',
  subtitle: 'Edición Especial CulturaGO: Ticketing & Identidad Cultural',
  date: '20 de Agosto, 2026',
  time: '18:30 - 22:00 CLT',
  location: 'Santiago, Chile',
  venue: 'Hub de Innovación & Cultura Tech',
  price: 'Gratis (Patrocinado)',
  category: 'Cultura & Tecnología',
  description:
    'Encuentro de builders, creadores y desarrolladores para construir módulos de ticketing y pasaporte cultural sobre Stellar.',
  organizer: 'CulturaGO & Stellar Community',
  badgeName: 'Pionero Builder Night 2026',
  badgePoints: 150,
  availableTickets: 80,
};

export interface ITicketRepository {
  getEvent(): CulturalEvent;
  issueTicket(attendeeName: string, attendeeEmail: string): Promise<CulturalTicket>;
  getTicketById(ticketId: string): CulturalTicket | undefined;
  getAllTickets(): CulturalTicket[];
  performCheckIn(qrPayloadString: string): Promise<CheckInResult>;
  getParticipation(ticketId: string): ParticipationRecord | undefined;
  resetDemo(): void;
}

/**
 * InMemoryTicketRepository
 *
 * ARCHITECTURE & SECURITY NOTICE:
 * This in-memory repository manages ticket state for this MVP demonstration.
 * In a production multi-reader environment, single-use state must be enforced by
 * a distributed transaction backend (e.g. PostgreSQL with row-level locks) or directly
 * via a Soroban Smart Contract on Stellar to prevent race conditions across gates.
 *
 * (Client/in-memory storage is an MVP demo abstraction, NOT a production anti-fraud system).
 */
class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Map<string, CulturalTicket> = new Map();
  private participations: Map<string, ParticipationRecord> = new Map();
  private event: CulturalEvent = DEFAULT_EVENT;

  constructor() {
    this.seedDefaultTicket();
  }

  private seedDefaultTicket() {
    const issuedAt = Date.now() - 3600000;
    const ticketId = 'CG-SBN-8841';
    const signedPayload = signTicketPayload({
      ticketId,
      eventId: this.event.id,
      attendeeName: 'Alex Valenzuela',
      issuedAt,
    });

    const ticket: CulturalTicket = {
      id: ticketId,
      eventId: this.event.id,
      eventTitle: this.event.title,
      attendeeName: 'Alex Valenzuela',
      attendeeEmail: 'alex.valenzuela@culturago.app',
      status: 'VALID',
      issuedAt,
      signedPayload,
      qrString: JSON.stringify(signedPayload),
    };

    this.tickets.set(ticket.id, ticket);
  }

  getEvent(): CulturalEvent {
    return this.event;
  }

  async issueTicket(attendeeName: string, attendeeEmail: string): Promise<CulturalTicket> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `CG-SBN-${randomSuffix}`;
    const issuedAt = Date.now();

    const signedPayload = signTicketPayload({
      ticketId,
      eventId: this.event.id,
      attendeeName,
      issuedAt,
    });

    const ticket: CulturalTicket = {
      id: ticketId,
      eventId: this.event.id,
      eventTitle: this.event.title,
      attendeeName,
      attendeeEmail,
      status: 'VALID',
      issuedAt,
      signedPayload,
      qrString: JSON.stringify(signedPayload),
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  getTicketById(ticketId: string): CulturalTicket | undefined {
    return this.tickets.get(ticketId);
  }

  getAllTickets(): CulturalTicket[] {
    return Array.from(this.tickets.values());
  }

  async performCheckIn(qrPayloadString: string): Promise<CheckInResult> {
    let payload: SignedQRPayload;

    // 1. Parse QR string
    try {
      payload = typeof qrPayloadString === 'string' ? JSON.parse(qrPayloadString) : qrPayloadString;
    } catch {
      return {
        success: false,
        statusCode: 'INVALID_SIGNATURE',
        message: 'Código QR no reconocido o formato corrupto.',
        stellarStatus: 'STELLAR_UNAVAILABLE',
        timestamp: Date.now(),
        verifiedBy: 'CulturaGO Gate Engine',
      };
    }

    // 2. Cryptographic signature check against TRUSTED CulturaGO authority
    const verification = verifyTicketSignature(payload);
    if (!verification.isValid) {
      const isUntrusted = verification.reason?.includes('Emisor no confiable');
      return {
        success: false,
        statusCode: isUntrusted ? 'UNTRUSTED_ISSUER' : 'INVALID_SIGNATURE',
        message: `Firma digital rechazada: ${verification.reason}`,
        stellarStatus: 'STELLAR_UNAVAILABLE',
        timestamp: Date.now(),
        verifiedBy: 'CulturaGO Gate Engine',
      };
    }

    // 3. Locate ticket in repository
    const ticket = this.tickets.get(payload.ticketId);
    if (!ticket) {
      return {
        success: false,
        statusCode: 'TICKET_NOT_FOUND',
        message: `Ticket ${payload.ticketId} no encontrado en el registro local.`,
        stellarStatus: 'STELLAR_UNAVAILABLE',
        timestamp: Date.now(),
        verifiedBy: 'CulturaGO Gate Engine',
      };
    }

    // 4. Single-Use Check (Anti-Fraud / Prevention of double use)
    if (ticket.status === 'USED') {
      return {
        success: false,
        statusCode: 'TICKET_ALREADY_USED',
        message: `El ticket ${ticket.id} YA FUE UTILIZADO previamente a las ${new Date(
          ticket.usedAt || Date.now()
        ).toLocaleTimeString()}. Acceso denegado.`,
        ticket,
        stellarStatus: ticket.stellarStatus || 'CONFIRMED',
        stellarTxHash: ticket.stellarTxHash,
        stellarExplorerUrl: ticket.stellarExplorerUrl,
        timestamp: Date.now(),
        verifiedBy: 'CulturaGO Gate Engine',
      };
    }

    // 5. Gate Access Granted: Mark as USED immediately to prevent double scan at door
    const usedAt = Date.now();
    ticket.status = 'USED';
    ticket.usedAt = usedAt;

    // 6. Anchor Proof of Attendance to Stellar Testnet
    const anchorResult = await anchorAttendanceToStellar({
      ticketId: ticket.id,
      eventId: ticket.eventId,
      attendeeName: ticket.attendeeName,
      timestamp: usedAt,
    });

    ticket.stellarStatus = anchorResult.status;
    ticket.stellarTxHash = anchorResult.txHash;
    ticket.stellarExplorerUrl = anchorResult.explorerUrl;

    // 7. Store participation record for Cultural Passport
    const participation: ParticipationRecord = {
      ticketId: ticket.id,
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      attendeeName: ticket.attendeeName,
      verifiedAt: usedAt,
      stellarStatus: anchorResult.status,
      stellarTxHash: anchorResult.txHash,
      stellarExplorerUrl: anchorResult.explorerUrl,
      badgeName: this.event.badgeName,
      badgePoints: this.event.badgePoints,
    };

    this.participations.set(ticket.id, participation);

    const message =
      anchorResult.status === 'CONFIRMED'
        ? `¡Check-in exitoso! Bienvenido ${ticket.attendeeName}. Participación confirmada en Stellar Testnet.`
        : `¡Acceso autorizado! Bienvenido ${ticket.attendeeName}. (Registro en Stellar Testnet temporalmente pendiente/no disponible).`;

    return {
      success: true, // Gate access granted
      statusCode: 'CHECK_IN_SUCCESSFUL',
      message,
      ticket,
      stellarStatus: anchorResult.status,
      stellarTxHash: anchorResult.txHash,
      stellarExplorerUrl: anchorResult.explorerUrl,
      timestamp: usedAt,
      verifiedBy: `CulturaGO Gate / Key ${getTrustedAuthorityPublicKey().slice(0, 8)}...`,
    };
  }

  getParticipation(ticketId: string): ParticipationRecord | undefined {
    return this.participations.get(ticketId);
  }

  resetDemo(): void {
    this.tickets.clear();
    this.participations.clear();
    this.seedDefaultTicket();
  }
}

export const ticketRepository = new InMemoryTicketRepository();
