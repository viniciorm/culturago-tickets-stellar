export type TicketStatus = 'VALID' | 'USED' | 'INVALID';

export interface CulturalEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: string;
  category: string;
  description: string;
  organizer: string;
  badgeName: string;
  badgePoints: number;
  availableTickets: number;
}

export interface SignedQRPayload {
  ticketId: string;
  eventId: string;
  attendeeName: string;
  issuedAt: number;
  nonce: string;
  authorityPublicKey: string;
  signature: string; // Ed25519 signature of payload
}

export interface CulturalTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  status: TicketStatus;
  issuedAt: number;
  usedAt?: number;
  signedPayload: SignedQRPayload;
  qrString: string;
  stellarTxHash?: string;
}

export type CheckInStatusCode =
  | 'CHECK_IN_SUCCESSFUL'
  | 'TICKET_ALREADY_USED'
  | 'INVALID_SIGNATURE'
  | 'TICKET_NOT_FOUND'
  | 'PROCESSING';

export interface CheckInResult {
  success: boolean;
  statusCode: CheckInStatusCode;
  message: string;
  ticket?: CulturalTicket;
  stellarTxHash?: string;
  stellarExplorerUrl?: string;
  timestamp: number;
  verifiedBy: string;
}

export interface ParticipationRecord {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  verifiedAt: number;
  stellarTxHash: string;
  stellarExplorerUrl: string;
  badgeName: string;
  badgePoints: number;
}
