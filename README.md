# CulturaGO Tickets

> **Tickets culturales con participación verificable**

Módulo experimental de ticketing cultural construido para el **Stellar Builder Night Challenge**.

---

## 🌐 Demo & Links

* **Live Demo (Vercel)**: [https://temporary-flying-ridge-1ut66q9.vercel.app](https://temporary-flying-ridge-1ut66q9.vercel.app)
* **GitHub Repository**: [https://github.com/viniciorm/culturago-tickets-stellar](https://github.com/viniciorm/culturago-tickets-stellar)
* **Stellar Testnet Transaction Real**: [`c0ed47e4113ddfc63776c3893f81a000565ad00aef2edd6998b23a3a2d68f322`](https://stellar.expert/explorer/testnet/tx/c0ed47e4113ddfc63776c3893f81a000565ad00aef2edd6998b23a3a2d68f322)

---

## 🎭 Concept

Transformar tickets de eventos culturales en **pruebas verificables de participación** en la red Stellar, sin que el usuario final requiera conocimientos previos de Web3, billeteras o claves privadas.

---

## ⚡ Flow

```text
Evento → Ticket Digital → QR Único → Check-in (Scan & Validate) → Ticket Usado → Participación Verificada (Pasaporte Cultural)
```

1. **Evento**: Visualizar y seleccionar el evento cultural.
2. **Ticket**: Emisión y asignación de ticket digital con firma Ed25519 de CulturaGO.
3. **QR**: Generación de un código QR seguro con payload criptográfico (sin claves privadas).
4. **Check-in**: Escaneo y validación en tiempo real en la entrada del evento (< 200 ms).
5. **Prevención de Reúso**: Detección inmediata y bloqueo de tickets duplicados/usados (`TICKET ALREADY USED`).
6. **Participación Verificada**: Anclaje de la prueba de asistencia en el Ledger de **Stellar Testnet** y acreditación de puntos para el **Pasaporte Cultural de CulturaGO**.

---

## 🏛️ Arquitectura Híbrida: Qué está Implementado vs. Qué es Conceptual

* **Arquitectura Híbrida**: El ticket no se almacena íntegramente on-chain para evitar latencia de red y costos innecesarios en la puerta del evento. En su lugar, se valida mediante firmas Ed25519 en el punto de acceso y se ancla la prueba de asistencia confirmada en Stellar Testnet.
* **Seguridad de Claves**: La emisión y validación utilizan claves públicas; las claves privadas se gestionan en memoria para la sesión de Testnet y nunca se transmiten ni se exponen en el QR.
* **Almacenamiento del Estado de Uso**: En este MVP, el estado `USED` se maneja a través de una interfaz de repositorio (`ITicketRepository`). En producción, esta interfaz se conectará a un backend persistente con base de datos distribuida o a una máquina de estados en contratos inteligentes Soroban.

---

## 🛠️ Built with

* **AI-Assisted Engineering**: Antigravity + Claude/Gemini pairing
* **Raven MCP**: Stellar Ecosystem Knowledge & Discovery Server (`https://raven.stellar.org/mcp`)
* **Stellar Network**: Testnet infrastructure (`@stellar/stellar-sdk`, Horizon RPC, `ManageData` + `Memo`)
* **React + TypeScript + Vite + Tailwind CSS**: Interfaz mobile-first, responsiva y rápida

---

## 🚀 Challenge Arc

$$\text{IDEA} \longrightarrow \text{RAVEN} \longrightarrow \text{BUILD} \longrightarrow \text{STELLAR}$$

Documentación del proyecto:
* [Challenge Journey (IDEA $\to$ RAVEN $\to$ BUILD $\to$ STELLAR)](docs/CHALLENGE.md)
* [Raven Discovery Log](docs/RAVEN_DISCOVERY.md)
* [System Architecture & Security Model](docs/ARCHITECTURE.md)
* [Guión de Demo en 45 Segundos](docs/DEMO.md)
