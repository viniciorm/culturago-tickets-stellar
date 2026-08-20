# CulturaGO Tickets — Stellar Builder Night Challenge

## 💡 1. IDEA

**CulturaGO** busca conectar a los ciudadanos con la oferta cultural de sus ciudades. Sin embargo, el ticketing tradicional presenta dos problemas clave:
1. **Falta de interoperabilidad y trazabilidad**: Las entradas quedan atrapadas en silos cerrados y son vulnerables a duplicaciones.
2. **Desconexión con la identidad cultural**: Asistir a conciertos, museos o festivales no construye un historial verificable ni recompensa la fidelidad del asistente.

Nuestra idea: un módulo de ticketing cultural donde el ticket actúa como una credencial digital y, al utilizarse en la entrada, se transforma en una **prueba verificable de participación cultural en Stellar** que alimenta el futuro **Pasaporte Cultural de CulturaGO**. Todo bajo una experiencia 100% Web2 (sin seed phrases, sin fricción de gas, sin wallets manuales).

---

## 🦅 2. RAVEN

En lugar de asumir a ciegas que debíamos almacenar cada ticket como un NFT on-chain o requerir smart contracts pesados para la lectura en puerta, usamos **Raven MCP** (`https://raven.stellar.org/mcp`) para investigar las primitivas de Stellar.

Descubrimientos clave con Raven:
* **Separación de responsabilidades**: La validación de acceso en puerta requiere latencia submétrica (< 200 ms) que se resuelve con firmas criptográficas Ed25519; el registro de asistencia se resuelve de forma inmutable y asíncrona en el Ledger de Stellar.
* **Sponsored Reserves & Cero Gas para el Usuario**: CulturaGO actúa como emisor y patrocinador de comisiones, manteniendo la experiencia invisible para el asistente.
* **Passkeys y Smart Accounts**: El ecosistema Stellar avanza hacia WebAuthn (Secp256r1 en Soroban), lo que marca el camino evolutivo para exportar sellos del Pasaporte Cultural.

---

## 🔨 3. BUILD

Construimos un flujo funcional completo:
* **Emisión de Ticket**: Generación de identificador único y firma Ed25519 con la autoridad de CulturaGO.
* **QR Seguro**: QR dinámico con payload firmado (sin claves privadas ni datos sensibles).
* **Check-in Instantáneo**: Escaneo y validación en puerta en < 200 ms (`CHECK-IN SUCCESSFUL` $\to$ `TICKET USED`).
* **Prevención de Reúso**: Detección inmediata y bloqueo de reintentos (`TICKET ALREADY USED`).
* **Pasaporte Cultural**: Pantalla `PARTICIPATION VERIFIED` con sello cultural y puntos acreditados.

---

## 🌌 4. STELLAR

Stellar funciona como **infraestructura invisible debajo de la aplicación**:
* **Arquitectura Híbrida**: No colocamos el ticket completo on-chain para evitar cuellos de botella en la puerta. Al completarse el check-in, anclamos la prueba de asistencia directamente en **Stellar Testnet Horizon** mediante operaciones `ManageData` y `Memo.text`.
* **Prueba Pública Verificable**: Cada check-in genera un `Transaction Hash` verificable en cualquier explorador de bloques de Stellar (e.g. Stellar Expert).
* **Base del Pasaporte Cultural**: Estas transacciones constituyen el registro inmutable para certificar la asistencia histórica del usuario.
