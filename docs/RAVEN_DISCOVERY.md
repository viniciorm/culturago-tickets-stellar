# Raven MCP Discovery Log — Stellar Ecosystem Research

Este documento sintetiza la investigación realizada utilizando el contexto oficial de **Stellar Raven MCP** (`https://raven.stellar.org/mcp`).

---

## 🔍 1. Preguntas planteadas a Raven

1. **¿Qué primitivas de Stellar permiten representar un ticket digital con ownership verificable y prevención de doble gasto?**
2. **¿Cómo implementar check-in de una sola vez con latencia apta para puertas de eventos (< 1 segundo)?**
3. **¿Cuál es el mejor equilibrio entre Stellar Classic (Account Data / Manage Data / Transactions / Claimable Balances) y Soroban Smart Contracts para un MVP de Builder Night?**
4. **¿Cómo abstraer las claves privadas y transacciones para que la experiencia sea idéntica a una aplicación Web2?**
5. **¿Cómo evolucionar los registros de check-in hacia credenciales de participación (Pasaporte Cultural / SBTs)?**

---

## 💡 2. Tecnologías y Primitivas Descubiertas

### A. Soroban Smart Contracts (Custom State & Events)
* **Contratos inteligentes en Rust**: Permiten almacenar un mapa `ticket_id -> { owner, event_id, status: (Unused | Used), used_at }`.
* **Eventos de contrato (`env.events().publish`)**: Emiten eventos de asistencia indexables por Horizon / RPC.
* **Passkey Kit / Smart Accounts**: Soporte nativo de Soroban para firmas Secp256r1 (WebAuthn), eliminando seed phrases y permitiendo autenticación biométrica (FaceID/TouchID).

### B. Stellar Classic (Account Data & Cryptographic Signatures)
* **Manage Data Operations**: Permiten almacenar pares clave-valor (hasta 64 bytes por entrada) asociados a una cuenta emisora o de evento.
* **Hash Memo & Transaction Records**: Registrar hashes de validación (SHA-256 de Ticket ID + Timestamp + Nonce) en transacciones inmutables en Stellar Ledger.
* **Sponsored Reserves (SEP-0029 / Fee Sponsorship)**: La cuenta organizadora patrocina las reservas de red y fees de transacción, haciendo el costo $0 para el asistente.

### C. Hybrid Attestation Pattern (Optimistic Check-in + Ledger Proof)
* Generación de payload seguro en QR: `ticketId:eventId:nonce:signature`.
* La firma digital del emisor (CulturaGO Authority) garantiza autenticidad en milisegundos en el punto de acceso sin esperar bloqueos de red.
* El check-in actualiza el estado local y ancla la transacción de uso en Stellar Testnet inmediatamente.

---

## ⚖️ 3. Alternativas Consideradas

| Alternativa | Descripción | Pros | Contras |
| :--- | :--- | :--- | :--- |
| **Opción 1: Soroban NFT / State Contract** | Smart contract en Soroban que gestiona el ciclo de vida del ticket y marca el estado `used`. | Descentralizado, extensible para reventa con royalties. | Mayor complejidad de despliegue/testing en vivo en un hackathon corto. |
| **Opción 2: Stellar Classic Managed Data / Sponsored Tx** | Cuentas Stellar de evento con registros `ManageData` y transacciones firmadas con Memo hash. | Rápido de implementar, compatible 100% con `@stellar/stellar-sdk`, cero fricción para el usuario. | No cuenta con lógica Turing-complete on-chain para reglas complejas. |
| **Opción 3: Hybrid Cryptographic Tickets + Stellar Proof of Participation** | Emisión firmada por emisor, validación instantánea en QR, y acuñación de prueba de asistencia en Stellar Testnet. | **Ideal para Builder Night**: demo ultra rápida en 30s, cero fallos por congestión, trazable en Stellar Explorer. | Requiere que el emisor gestione el servicio de check-in. |

---

## 🧭 4. Decisiones y Justificación

* **Descartado temporalmente**: Soroban Full NFT Marketplace con subastas y reventa on-chain, debido a que añade complejidad innecesaria para el flujo central de acceso en puerta y participación cultural.
* **Recomendado para la demo**: **Arquitectura Híbrida Verificable (Opción 3 / Opción 2 refinada)**, que permite:
  1. Emisión y asignación inmediata de ticket.
  2. Generación de QR firmado con SHA-256.
  3. Validación de escaneo instantánea en puerta (<200ms).
  4. Bloqueo estricto contra doble uso.
  5. Registro on-chain de la participación en Stellar Testnet con enlace directo a Stellar Expert / Horizon.
