# Party Mode — CulturaGO Tickets

## Purpose

This document preserves the context to expose or reuse as a Raven-oriented module named **Party Mode**.

Party Mode is the working context for the CulturaGO ticketing experiment created during the Stellar Builder Night Challenge.

## Core concept

CulturaGO Tickets turns a cultural event ticket into a verifiable proof of participation.

Primary flow:

`Event → Ticket → QR → Check-in → USED → Stellar Proof → Cultural Passport`

The application keeps blockchain infrastructure below the user experience. The attendee should not need to understand wallets, seed phrases, gas, transactions, or Stellar.

## Challenge approach

The project followed the challenge sequence:

`IDEA → RAVEN → BUILD → STELLAR`

Instead of assuming that the solution required NFTs or a smart contract, Raven MCP was used to investigate the Stellar ecosystem and compare technical alternatives before implementing the final architecture.

Raven MCP endpoint used during the build:

`https://raven.stellar.org/mcp`

## Architecture selected

A hybrid architecture was selected.

### Off-chain / fast access layer

- Event and ticket UX in React + TypeScript.
- Ticket payload signed with Ed25519.
- QR contains ticket identifiers, nonce, issuer information and signature.
- Scanner validates against the trusted CulturaGO issuer public key.
- Ticket lifecycle includes `VALID` and `USED`.
- The current MVP uses an in-memory `ITicketRepository` abstraction for single-use state.

### Stellar layer

After a successful check-in, the prototype anchors a proof of attendance in **Stellar Testnet**.

Components used:

- `@stellar/stellar-sdk`
- Stellar Testnet
- Horizon Testnet
- Friendbot for ephemeral Testnet funding
- `ManageData`
- Transaction Memo
- Public transaction hash / Stellar Explorer verification

Testnet Horizon endpoint:

`https://horizon-testnet.stellar.org`

## Important design decisions

### 1. Ticket is not fully on-chain

The ticket itself is validated quickly off-chain. Stellar is used where it adds clear value: publicly verifiable proof of attendance.

### 2. Trusted issuer

The scanner must not blindly trust a public key supplied by the QR. The CulturaGO issuer public key must come from trusted application configuration and the QR issuer must match it.

### 3. No fake blockchain proofs

If Stellar Testnet is unavailable, the application must return an explicit pending/unavailable state. It must never generate a local hash and present it as a Stellar transaction hash.

### 4. MVP single-use limitations

The current `USED` state is a demo abstraction. Production-grade distributed anti-reuse would require a persistent backend, transactional locking, or a Soroban state machine.

### 5. User experience

The user should experience a conventional application:

- receive ticket;
- show QR;
- enter event;
- receive participation credential.

Stellar remains infrastructure underneath the experience.

## Cultural Passport evolution

After check-in, an attendance record can feed the future CulturaGO Cultural Passport.

Potential passport data:

- events attended;
- festivals;
- workshops;
- museums;
- concerts;
- cultural achievements;
- verified participation;
- community reputation and benefits.

The ticket therefore evolves from an access instrument into a participation record.

## Future directions

Potential next phases include:

- persistent backend;
- multi-scanner concurrency;
- operator authentication;
- Soroban ticket state machine;
- smart accounts / passkeys;
- paid tickets;
- transfers;
- controlled resale;
- complimentary tickets;
- discounts and loyalty;
- complete Cultural Passport integration.

## Educational takeaway

The central lesson from Party Mode is:

> Do not build a blockchain ticket simply because blockchain is available. Build the cultural ticket first, and use Stellar only where it provides measurable value.

For this prototype, that value was verifiable proof of attendance while keeping the end-user experience simple.

## Project references

- Repository: `https://github.com/viniciorm/culturago-tickets-stellar`
- Educational guide: `https://viniciorm.github.io/culturago-tickets-stellar-guide/`
- Raven MCP: `https://raven.stellar.org/mcp`

This file is intended to be used as the stable source context for the Raven module/context called **Party Mode**.
