# Odynitive Implementation Plan

> Execute autonomously. Keep the product simple, production-polished, and fully verified.

## Task 1 — Scaffold and quality gates
**Files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.gitignore`, `.env.example`, `index.html`
1. Scaffold Vite React TypeScript.
2. Install React Router, wagmi, viem, TanStack Query, Vitest, RTL, Playwright, ESLint.
3. Add `lint`, `typecheck`, `test`, `build`, and `check` scripts.
4. Verify a clean baseline build.

## Task 2 — Contract tests first
**Files:** `contracts/test/OdynitiveLaunchpad.test.ts`, `contracts/hardhat.config.ts`, `contracts/package.json`
1. Write failing tests for launch metadata/supply, buy quote/execution, sell quote/execution, fees, slippage, invalid market, withdrawals, and owner controls.
2. Run tests and confirm RED failures are due to missing contract.

## Task 3 — Smart contracts
**Files:** `contracts/OdynitiveLaunchpad.sol`, `contracts/scripts/deploy.ts`, `contracts/remix/README.md`
1. Implement self-contained ERC-20, guard, and factory.
2. Add builder identity constants.
3. Run contract tests to GREEN.
4. Compile optimized bytecode and record ABI for frontend.

## Task 4 — Frontend domain layer tests first
**Files:** `src/lib/market.test.ts`, `src/lib/format.test.ts`, `src/lib/*`
1. Write failing tests for contract tuple adaptation, quote display, progress, address shortening, and error normalization.
2. Implement chain definition, ABI, address guard, adapters, and formatting.
3. Run focused and full tests.

## Task 5 — Brand system and generated assets
**Files:** `public/*`, `src/styles.css`, `src/components/BrandMark.tsx`
1. Create Odynitive logo/brand art in marble, antique gold, bronze, and lapis.
2. Implement material tokens, typography, subtle textures, stepped details, and reduced motion.
3. Verify desktop/mobile rendering and asset loading.

## Task 6 — Application shell and wallet
**Files:** `src/main.tsx`, `src/App.tsx`, `src/components/Header.tsx`, `src/components/WalletButton.tsx`, `src/lib/wagmi.ts`
1. Add provider stack and router.
2. Implement wallet connect, add/switch Ritual, chain status, and explorer links.
3. Add safe preview mode when factory address is absent.

## Task 7 — Discover experience
**Files:** `src/pages/HomePage.tsx`, `src/components/TokenCard.tsx`, `src/hooks/useMarkets.ts`
1. Build hero, search/filter controls, token grid, activity, and how-it-works strip.
2. Read factory markets in live mode and use labeled seed data in preview mode.
3. Handle loading, error, empty, and responsive states.

## Task 8 — Launch flow
**Files:** `src/pages/LaunchPage.tsx`, `src/components/LaunchForm.tsx`
1. Implement validated one-page form and live preview.
2. Submit `launchToken`, wait for confirmation, decode `TokenLaunched`, and route to detail.
3. Provide clear disabled and transaction states.

## Task 9 — Token detail and trading
**Files:** `src/pages/TokenPage.tsx`, `src/components/TradePanel.tsx`, `src/components/CurveChart.tsx`, `src/hooks/useMarket.ts`
1. Read market/token balances and quote functions.
2. Implement buy, sell approval, sell, slippage, max shortcuts, and receipt feedback.
3. Display stats, curve visualization, metadata, and activity.

## Task 10 — Verification and polish
1. Run `npm run check` and contract test suite.
2. Run Playwright at desktop and mobile sizes.
3. Inspect console, network failures, overflow, keyboard focus, reduced motion, and wrong-chain behavior.
4. Run `git diff --check` and dependency audit.

## Task 11 — Delivery
1. Commit clean logical changes.
2. Create/push GitHub repository under `nxrskyaa`.
3. Deploy production to Vercel.
4. Verify live HTTP response, rendered UI, assets, browser console, and routing.
5. Report URLs, verification evidence, and exact Remix contract deployment steps.
