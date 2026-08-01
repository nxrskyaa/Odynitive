# Odynitive — Design Specification

**Date:** 2026-08-02

## Product
Odynitive is a Ritual-native token launchpad that makes launching and trading a testnet token feel like one clean action, not a dashboard. The product has three core surfaces: discover, launch, and token detail/trade.

## Chosen approach

### Considered
1. **Fixed-price sale** — simplest contract and UI, but weak price discovery and no sell path.
2. **Virtual-reserve bonding curve** — still compact, supports buy/sell immediately, and creates an understandable live market without depending on an unverified DEX deployment.
3. **DEX-first launch + LP migration** — most market-like, but depends on canonical router/factory availability and creates operational complexity unsuitable for a first Ritual testnet release.

### Decision
Use a **virtual-reserve constant-product curve**. Each token has a deterministic market owned by the factory. The curve begins with virtual RITUAL and virtual token reserves, and real RITUAL accumulates as users buy. Users can sell purchased tokens back while the pool remains solvent.

## Contract architecture

A single Remix-friendly Solidity file contains:
- `OdynitiveToken`: fixed-supply ERC-20 with metadata URI and factory-controlled initial mint.
- `OdynitiveFactory`: launches tokens, stores market metadata, quotes trades, executes buys/sells, accrues protocol and creator fees, and exposes pagination-friendly getters.
- Minimal internal ERC-20 and reentrancy guard implementations to avoid Remix import resolution.

### Initial parameters
- Supply: 1,000,000,000 tokens (18 decimals).
- Virtual RITUAL reserve: 10,000 RITUAL.
- Virtual token reserve: full token supply.
- Protocol fee: 100 bps (1%).
- Creator fee: 50 bps (0.5%).
- No launch fee on testnet.
- Minimum output protects both buy and sell from slippage.

### Lifecycle
1. Creator submits name, symbol, description, image URI, website, and social link.
2. Factory deploys token and escrows all supply.
3. Buyers send RITUAL; fees are separated; net amount moves the virtual-reserve curve and tokens transfer to buyer.
4. Sellers approve the factory, then return tokens; curve calculates RITUAL output and pays from real pool balance.
5. Protocol and creator fees are pull-withdrawn, not pushed during trades.

### Security model
- Checks-effects-interactions and a reentrancy guard on value-moving functions.
- Bounded fee configuration and owner-only protocol controls.
- Pull payments for fees.
- Input validation for metadata length, amount, market existence, and slippage.
- Exact integer quote functions are shared with execution logic.
- No upgradeability, hidden mint, blacklist, transfer tax, or privileged market seizure.
- `BUILDER = "nxrskyaa"` and immutable `BUILDER_ADDRESS` establish proof of building.

## Ritual projection

**Mapped capabilities**
- ERC-20 issuance and deterministic AMM math → standard EVM contracts on Ritual.
- Native RITUAL payments → standard payable EVM functions.
- Wallet connection and reads → off-chain React UI with wagmi/viem.
- Image hosting → off-chain URI supplied by token creator.

**Precompiles:** none. The product does not need HTTP, AI inference, scheduling, encrypted secrets, or long-running computation. Avoiding unnecessary precompiles removes async sender-lock and RitualWallet fee-deposit complexity.

**Reference contracts:** registry examples use Scheduler/HTTP/Secrets and do not overlap this deterministic launchpad.

## Frontend architecture

- Vite + React + TypeScript.
- wagmi v2 + viem + TanStack Query.
- React Router routes: `/`, `/launch`, `/token/:address`.
- `VITE_FACTORY_ADDRESS` controls live contract mode.
- If absent, the discover UI shows explicit preview listings; wallet writes remain disabled and explain how to configure the contract.
- Reads poll conservatively and refetch after confirmed writes.

### Discover
- Compact sticky header, wordmark, Ritual status, wallet button.
- Hero with one clear promise and two actions: Launch token / Explore tokens.
- Search and newest/activity filters.
- Token cards show image, symbol, price, pooled RITUAL, progress, creator, and activity.
- A small “How it works” strip replaces a dashboard.

### Launch
- One progressive form on a single page.
- Immediate token-card preview beside the form.
- Clear constraints, fee summary, network state, and one final launch button.
- Transaction state: waiting for wallet → submitted → confirmed → direct link to token.

### Token detail
- Token identity and links on top.
- Price/liquidity stats and lightweight curve visualization.
- Buy/sell panel with tabs, balance shortcut, quote, fee disclosure, slippage, and explicit approval state.
- Recent on-chain activity list when factory is configured.

## Visual system

### Principles
- Pure Alpha restraint: generous negative space, quiet borders, crisp hierarchy, subtle motion.
- Odyvion materiality: warm marble, ink, aged gold, bronze, lapis, terracotta.
- Pixel art appears as a logo/ornament and 1px stepped corners—not as an arcade HUD.

### Tokens
- Ink: `#231E15`
- Marble: `#F8F3E7`
- Gold: `#B39350`
- Antique gold: `#8E6D10`
- Lapis: `#1F5B93`
- Terracotta: `#9B3324`
- Ivory: `#F5EDD9`

Typography uses a refined serif display face plus a clean grotesk body; `Silkscreen` is limited to micro-labels. Motion is 160–260ms, transform/opacity only, with full `prefers-reduced-motion` support.

## Error handling
- Human-readable wallet rejection, wrong-network, insufficient balance, allowance, slippage, and RPC errors.
- Empty and loading states preserve layout.
- Writes never run when factory address is unset or invalid.
- Explorer links appear for every confirmed transaction and configured contract.

## Accessibility and responsive behavior
- WCAG-aware contrast, visible focus, semantic labels, keyboard-operable tabs/dialogs.
- Touch targets at least 44px.
- Desktop two-column token/form layouts collapse to one column; trade panel becomes inline rather than sticky on mobile.
- Decorative textures are ignored by assistive tech.

## Deployment
- Smart contract: user deploys `contracts/OdynitiveLaunchpad.sol` in Remix with Solidity 0.8.24, optimizer enabled, constructor treasury address, on Ritual chain ID 1979.
- Frontend: Vercel static Vite deployment.
- After contract deployment, set `VITE_FACTORY_ADDRESS` and redeploy.
