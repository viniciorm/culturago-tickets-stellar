export type TicketStatus = 'VALID' | 'USED' | 'INVALID';

export type StellarAnchorStatus = 'CONFIRMED' | 'ANCHOR_PENDING' | 'STELLAR_UNAVAILABLE';

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
  signature: string; // Ed25519 signature of canonical payload string
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
  stellarStatus?: StellarAnchorStatus;
  stellarTxHash?: string;
  stellarExplorerUrl?: string;
}

export type CheckInStatusCode =
  | 'CHECK_IN_SUCCESSFUL'
  | 'TICKET_ALREADY_USED'
  | 'UNTRUSTED_ISSUER'
  | 'INVALID_SIGNATURE'
  | 'TICKET_NOT_FOUND'
  | 'PROCESSING';

export interface CheckInResult {
  success: boolean; // Access granted at gate
  statusCode: CheckInStatusCode;
  message: string;
  ticket?: CulturalTicket;
  stellarStatus: StellarAnchorStatus;
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
  stellarStatus: StellarAnchorStatus;
  stellarTxHash?: string;
  stellarExplorerUrl?: string;
  badgeName: string;
  badgePoints: number;
}
