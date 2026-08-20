# Guión de Demo (45 Segundos) — CulturaGO Tickets

Guión optimizado para presentar el proyecto durante el **Stellar Builder Night Challenge**.

---

## ⏱️ Estructura del Pitch (45 Segundos)

### 💡 1. IDEA (0 - 10s)
> *"En CulturaGO necesitamos que una entrada a un concierto o museo no sea basura digital, sino que al utilizarse se transforme en una **prueba verificable de participación cultural** para el usuario."*

### 🦅 2. RAVEN (10 - 20s)
> *"En vez de asumir a ciegas que necesitábamos NFTs o smart contracts pesados, consultamos a **Raven MCP**. Con Raven descubrimos una **arquitectura híbrida**: validación de acceso instantánea en puerta con firmas criptográficas Ed25519 y anclaje asíncrono de la prueba de asistencia directamente en el Ledger de Stellar."*

### 🔨 3. BUILD (20 - 35s)
> *(Demostración en pantalla)*
> 1. *"Hacemos clic en **Get Ticket**: se genera el ticket con QR dinámico y payload firmado."*
> 2. *"En puerta, el lector escanea el QR en milisegundos: **CHECK-IN SUCCESSFUL** y el ticket pasa a estado **USED**."*
> 3. *"Si alguien intenta usar el mismo ticket otra vez: **TICKET ALREADY USED**, bloqueando el reintento de inmediato."*

### 🌌 4. STELLAR (35 - 45s)
> *"Al validarse el acceso, el sistema ancla la prueba real de asistencia en **Stellar Testnet**. Aquí vemos la pantalla de **PARTICIPATION VERIFIED** con el sello del Pasaporte Cultural y su Transaction Hash público en Stellar Explorer. **Stellar opera como infraestructura invisible debajo de una experiencia 100% Web2.**"*

---

## 🎯 Instrucciones para Hacer la Demo en Vivo

1. **Abrir la Aplicación**: Ingresa a la URL desplegada o `http://localhost:5173`.
2. **Paso 1 (Emitir Ticket)**:
   * En la pestaña **1. Evento**, mantén el nombre predeterminado o ingresa uno nuevo y haz clic en **`Get Ticket`**.
   * La app navega automáticamente a la pestaña **2. Ticket**. Muestra el ticket digital con estado **`VALID`** y el QR firmado. Puedes desplegar el inspector para mostrar la firma Ed25519.
3. **Paso 2 (Escanear en Puerta)**:
   * Haz clic en **`Ir a Check-in en Puerta`** (pestaña **3. Check-in**).
   * Haz clic en **`Escanear Ticket`**.
   * Observa el resultado instantáneo: 🟢 **`CHECK-IN SUCCESSFUL`** y el inicio del anclaje en Stellar Testnet.
4. **Paso 3 (Demostrar Antifraude / Doble Uso)**:
   * Vuelve a hacer clic en **`Escanear Ticket`** con el mismo ticket.
   * Observa el bloqueo inmediato: 🔴 **`TICKET ALREADY USED`**.
5. **Paso 4 (Ver Pasaporte y Stellar Explorer)**:
   * Haz clic en **`Ver Pasaporte Cultural`** (pestaña **4. Pasaporte**).
   * Muestra la pantalla **`PARTICIPATION VERIFIED`**, los puntos del Pasaporte Cultural y haz clic en **`Ver en Stellar Explorer`** para abrir la transacción real en Testnet.
