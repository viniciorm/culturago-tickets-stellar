# CulturaGO Tickets — Stellar Builder Night Challenge

## 💡 1. IDEA

**CulturaGO** busca conectar a los ciudadanos con la oferta cultural de sus ciudades. Sin embargo, el ticketing tradicional presenta dos problemas clave:
1. **Falta de interoperabilidad y trazabilidad**: Las entradas quedan atrapadas en silos y son vulnerables a fraudes o duplicaciones.
2. **Desconexión con la identidad cultural**: Asistir a 10 conciertos, museos o festivales no construye un historial verificable ni recompensa la fidelidad del usuario.

Nuestra idea es crear un módulo experimental de ticketing donde:
* La entrada actúa como un activo digital seguro con ownership.
* El check-in en puerta valida el ticket una sola vez.
* La asistencia validada se convierte en una **prueba de participación cultural** lista para integrarse al futuro **Pasaporte Cultural de CulturaGO**.
* La experiencia para el usuario es 100% Web2 (sin seed phrases, sin fricción de gas, sin wallets complejas).

---

## 🦅 2. RAVEN

Para no improvisar la arquitectura ni tomar decisiones sesgadas, nos conectamos a **Raven MCP** (`https://raven.stellar.org/mcp`), el servidor oficial de contexto de Stellar.

A través de Raven investigamos:
* Capacidades de **Stellar Classic** (Account Data, Manage Data, Claimable Balances, Transaction Memos).
* Capacidades de **Soroban Smart Contracts** (NFTs, Events, Custom State Registries).
* Estándares de **Smart Wallets & Passkeys** (WebAuthn / Secp256r1 en Soroban) para onboarding transparente.
* Mecanismos de verificación de tickets y prevención de doble uso on-chain vs. off-chain con anclaje criptográfico.

---

## 🔨 3. BUILD

Construimos un prototipo funcional end-to-end:
* **Frontend**: React + TypeScript + Tailwind CSS (Mobile-First, optimizado para escaneo en puerta).
* **Generador de Tickets & QR**: QR dinámico y seguro que transporta un payload firmado de validación sin exponer llaves privadas.
* **Módulo de Check-in en Puerta**: Escaneo/ingreso de tickets con feedback visual inmediato (`CHECK-IN SUCCESSFUL`, `TICKET USED`, `TICKET ALREADY USED`).
* **Verificador de Participación**: Registro inmutable de asistencia cultural.

---

## 🌌 4. STELLAR

Stellar opera como **infraestructura invisible**:
* **Bajas comisiones y liquidación en ~3-5 segundos**: Ideal para flujos de acceso masivo a eventos.
* **Inmutabilidad y verificación pública**: Cualquier organizador o el usuario puede verificar la validez de su participación en Testnet/Mainnet.
* **Base para el Pasaporte Cultural**: Las participaciones verificadas forman las credenciales del pasaporte de fidelidad de CulturaGO.
