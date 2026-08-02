# Odynitive — Design Record

**Status:** Implemented revision
**Product name:** Odynitive
**Design direction:** Aegean editorial utility — marble grid, ink, bronze, lapis, oversized serif type, compact mono metadata.

## Product structure

The interface treats Odynitive as one platform with three product realms:

1. **Token Launch** — live Ritual Testnet launchpad and bonding-curve market.
2. **NFTs** — frontend-only marketplace concept, explicitly labelled “Still in development progress”.
3. **Agentz** — frontend-only autonomous trading-agent arena concept, explicitly labelled “Still in development”.

Odyvion remains a separate game and external product. It is linked from the primary navigation because it belongs to the same creative Aegean world, but Odynitive does not merge the game into the launchpad.

## Navigation

Primary navigation:

- Discover
- Actions
  - Token Launch / Live
  - NFTs / In development
  - Agentz / In development
- Docs
- About
- Updates
- Odyvion ↗
- Connect wallet

The previous “Explorer” navigation item was removed. Ritual Explorer is now used only as a contextual external link from transactions and contract documentation.

## UX decisions

- Product status is visible before feature content or controls.
- Actions use a large, persistent three-tab rail instead of hidden standalone routes.
- Indonesian and English tabs appear on every explanatory area where product mechanics or status require prose.
- The homepage has interactive product tabs so users can understand what is live and what is being developed before entering a feature.
- Disabled concept controls use explicit “Coming soon” wording and never imply a transaction can be sent.
- Docs disclose fixed parameters, mutable owner controls, fees, slippage, reserve behavior, and testnet status in plain language.

## Agentz concept

The concept adapts the no-code arena flow shown in the supplied Agent Arena reference:

- choose an archetype;
- tune risk and trading frequency;
- preview a strategy identity;
- enter a qualifying phase;
- advance to a head-to-head bracket;
- determine a last agent standing.

The planned Ritual architecture is described as market context → Ritual LLM inference at `0x0802` → TEE executor → settled result. It is labelled as a target architecture, not a running backend.

## Responsive behavior

Desktop uses full editorial grids and multi-column comparison layouts. At tablet width, navigation moves into a horizontal second row. At mobile width, tabs become horizontally scrollable, product cards and information grids collapse to one column, sticky side panels become static, and all primary actions become full-width or stack vertically.

## Verification

- ESLint
- TypeScript project build
- Vitest suite
- Vite production build
- Desktop browser inspection of Discover, Agentz, Docs, and NFT pages
- Interaction checks for language tabs, NFT activity tabs, and Agentz controls
- Browser console checked for JavaScript errors
