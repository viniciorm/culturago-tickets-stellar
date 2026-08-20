# System Architecture — CulturaGO Tickets

Este documento describe la arquitectura técnica propuesta y el ciclo de vida del ticket cultural en Stellar.

---

## 🏛️ 1. Diagrama de Flujo (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuario (Asistente)
    participant UI as CulturaGO App (Frontend)
    participant Auth as CulturaGO Signer / Engine
    participant Gate as Punto de Check-in (Puerta)
    participant Stellar as Stellar Testnet (Ledger)

    User->>UI: 1. Selecciona Evento y solicita Ticket ("Get Ticket")
    UI->>Auth: 2. Genera TicketID + Hash + Firma de Emisión
    Auth-->>UI: 3. Retorna Ticket con Payload de QR Seguro
    UI->>User: 4. Muestra Ticket Digital + Código QR (Estado: VALID)
    
    Note over User,Gate: En la entrada del evento
    Gate->>UI: 5. Escanea QR en Puerta
    UI->>Gate: 6. Valida firma y estado único (No usado)
    alt Ticket Válido y No Usado
        Gate-->>UI: 7. CHECK-IN SUCCESSFUL -> Estado: TICKET USED
        Gate->>Stellar: 8. Ancla Transacción de Asistencia (Memo Hash / Record)
        Stellar-->>UI: 9. Tx Hash confirmado en Testnet
        UI->>User: 10. PARTICIPATION VERIFIED (Badge Pasaporte Cultural)
    else Ticket Ya Usado (Reintento)
        Gate-->>UI: ❌ TICKET ALREADY USED (Acceso denegado)
    end
```

---

## 🔒 2. Seguridad del QR y Prevención de Doble Uso

1. **Payload del QR**:
   ```json
   {
     "ticketId": "CG-SBN-2026-8841",
     "eventId": "stellar-builder-night",
     "timestamp": 1787268000,
     "signature": "3045022100...ed25519"
   }
   ```
2. **Sin Secretos en el QR**: El QR contiene únicamente identificadores públicos y una firma criptográfica verificable. No almacena claves privadas ni datos sensibles.
3. **Atomic State & Single-Use Lock**: Una vez validado en el check-in, el identificador pasa al estado inmutable `USED` tanto en memoria de aplicación como registrado en el Ledger de Stellar. Cualquier lectura posterior es rechazada de inmediato.

---

## 🌐 3. Integración Futura con Pasaporte Cultural

* **Soulbound Tokens (SBTs) / Proof of Attendance**: Cada transacción de participación en Stellar constituye un sello digital en el Pasaporte Cultural del usuario.
* **Smart Accounts & Passkeys**: Migración transparente hacia cuentas controladas por Passkey (WebAuthn) cuando el usuario desee exportar sus sellos o canjear beneficios culturales.
