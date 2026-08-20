import * as StellarSdk from '@stellar/stellar-sdk';
import { Buffer } from 'buffer';
import type { SignedQRPayload, StellarAnchorStatus } from '../types/ticket';

// Stellar Testnet Configuration
export const STELLAR_HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const STELLAR_NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
export const STELLAR_EXPLORER_BASE = 'https://stellar.expert/explorer/testnet/tx/';

// In-memory authority keypair for the CulturaGO Issuer in this session (Testnet demo only)
let authorityKeypair: StellarSdk.Keypair | null = null;
let authorityAccountReady = false;

/**
 * Returns the active session authority keypair for issuing and signing testnet tickets.
 */
export function getAuthorityKeypair(): StellarSdk.Keypair {
  if (!authorityKeypair) {
    authorityKeypair = StellarSdk.Keypair.random();
  }
  return authorityKeypair;
}

/**
 * Trusted Issuer Public Key:
 * In production, this is a fixed, configured public key (e.g. from environment or on-chain registry).
 * The scanner must NEVER blindly trust any arbitrary public key provided in the QR payload.
 */
export function getTrustedAuthorityPublicKey(): string {
  return getAuthorityKeypair().publicKey();
}

/**
 * Signs a ticket payload using CulturaGO Authority's Ed25519 key.
 */
export function signTicketPayload(params: {
  ticketId: string;
  eventId: string;
  attendeeName: string;
  issuedAt: number;
}): SignedQRPayload {
  const kp = getAuthorityKeypair();
  const nonce = Math.random().toString(36).substring(2, 10);
  
  const message = `${params.ticketId}:${params.eventId}:${params.attendeeName}:${params.issuedAt}:${nonce}`;
  const signatureBytes = kp.sign(Buffer.from(message, 'utf-8'));
  const signature = signatureBytes.toString('hex');

  return {
    ticketId: params.ticketId,
    eventId: params.eventId,
    attendeeName: params.attendeeName,
    issuedAt: params.issuedAt,
    nonce,
    authorityPublicKey: kp.publicKey(),
    signature,
  };
}

/**
 * Verifies the Ed25519 signature of a QR payload against the TRUSTED CulturaGO Issuer.
 * 
 * SECURITY AUDIT FIX:
 * 1. Does NOT trust payload.authorityPublicKey blindly.
 * 2. Validates that the payload claims to be issued by our trusted CulturaGO public key.
 * 3. Verifies the cryptographic Ed25519 signature using the TRUSTED public key.
 */
export function verifyTicketSignature(payload: SignedQRPayload): { isValid: boolean; reason?: string } {
  try {
    if (!payload.signature) {
      return { isValid: false, reason: 'Payload carece de firma criptográfica' };
    }

    const trustedPublicKey = getTrustedAuthorityPublicKey();

    // 1. Verify that the claimed issuer matches our trusted CulturaGO Authority
    if (payload.authorityPublicKey && payload.authorityPublicKey !== trustedPublicKey) {
      return {
        isValid: false,
        reason: 'Emisor no confiable: la clave del QR no coincide con la Autoridad CulturaGO configurada',
      };
    }

    // 2. Canonical serialization check
    const message = `${payload.ticketId}:${payload.eventId}:${payload.attendeeName}:${payload.issuedAt}:${payload.nonce}`;
    const verifier = StellarSdk.Keypair.fromPublicKey(trustedPublicKey);
    
    const isValid = verifier.verify(
      Buffer.from(message, 'utf-8'),
      Buffer.from(payload.signature, 'hex')
    );

    return {
      isValid,
      reason: isValid ? undefined : 'Firma Ed25519 inválida o payload adulterado',
    };
  } catch (error) {
    return { isValid: false, reason: (error as Error).message || 'Fallo en verificación criptográfica' };
  }
}

export interface StellarAnchorResult {
  success: boolean;
  status: StellarAnchorStatus;
  txHash?: string;
  explorerUrl?: string;
  network: string;
  errorMessage?: string;
}

/**
 * Anchors the Proof of Attendance on Stellar Testnet.
 * Submits a real transaction to Stellar Horizon with ManageData & Memo.
 * 
 * PRECISION FIX:
 * If Horizon fails or is unreachable, returns status 'STELLAR_UNAVAILABLE'
 * without generating a fake SHA-256 hash or displaying broken explorer links.
 */
export async function anchorAttendanceToStellar(params: {
  ticketId: string;
  eventId: string;
  attendeeName: string;
  timestamp: number;
}): Promise<StellarAnchorResult> {
  const server = new StellarSdk.Horizon.Server(STELLAR_HORIZON_URL);
  const kp = getAuthorityKeypair();

  try {
    // 1. Ensure the authority account exists on Testnet via Friendbot if not funded yet
    if (!authorityAccountReady) {
      try {
        const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(kp.publicKey())}`;
        const fbRes = await fetch(friendbotUrl);
        if (fbRes.ok || fbRes.status === 400) {
          authorityAccountReady = true;
        }
      } catch (e) {
        console.warn('Friendbot funding check warning:', e);
      }
    }

    // 2. Load account sequence from Horizon
    const account = await server.loadAccount(kp.publicKey());

    // 3. Build Stellar Transaction recording proof of attendance
    const dataKey = `ATT_${params.ticketId.slice(-10)}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const dataValue = Buffer.from(
      `OK:${params.eventId.slice(0, 10)}:${params.timestamp}`
    );

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: dataKey,
          value: dataValue,
        })
      )
      .addMemo(StellarSdk.Memo.text(`CG:${params.ticketId.slice(-18)}`))
      .setTimeout(30)
      .build();

    // 4. Sign with CulturaGO Authority
    tx.sign(kp);

    // 5. Submit transaction to Testnet
    const result = await server.submitTransaction(tx);
    const txHash = result.hash;

    return {
      success: true,
      status: 'CONFIRMED',
      txHash,
      explorerUrl: `${STELLAR_EXPLORER_BASE}${txHash}`,
      network: 'Stellar Testnet',
    };
  } catch (error) {
    const errorMsg = (error as Error).message || 'Error al conectar con Horizon Testnet';
    console.error('Stellar Testnet anchor unavailable:', errorMsg);

    // Precise fallback: Explicitly report STELLAR_UNAVAILABLE without fake hashes
    return {
      success: false,
      status: 'STELLAR_UNAVAILABLE',
      network: 'Stellar Testnet',
      errorMessage: errorMsg,
    };
  }
}
