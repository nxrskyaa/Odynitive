# ODYNITIVE PROJECT CHECKPOINT

## Goal
Build and ship **Odynitive**, a simple token launchpad for Ritual Chain testnet inspired by Varo's clarity, Pure Alpha's restraint, and Odyvion's Aegean pixel-art identity.

## Current state
- Project root initialized at `/home/ubuntu/Odynitive` on branch `main`.
- Ritual Chain docs and official dApp skills inspected.
- No contract address is configured yet; deploy is intentionally left to the user's Remix wallet flow.

## Chain
- Chain ID: `1979`
- Currency: `RITUAL` (18 decimals)
- RPC: `https://rpc.ritualfoundation.org`
- Explorer: `https://explorer.ritualfoundation.org`
- Faucet: `https://faucet.ritualfoundation.org`

## Product decisions
- Standard deterministic EVM launchpad; no Ritual async precompile is needed.
- One self-contained Solidity source for straightforward Remix compile/deploy.
- Fixed token supply sold through per-token constant-product virtual-reserve curves.
- 1% protocol fee, 0.5% creator fee; fees are explicit in UI and contract.
- Wallet: injected EIP-1193 wallet, wagmi + viem, wrong-chain switch/add flow.
- Frontend remains usable without a factory address using clearly labeled preview seed data; trading/deployment actions are disabled until configured.
- Premium restrained UI: marble/ink foundation, antique gold/bronze/lapis accents, pixel art only as texture and iconography.

## Verification target
- Solidity unit tests for launch, quote, buy, sell, slippage, fees, access control, and reentrancy-sensitive flows.
- Frontend unit tests for formatting and data adapters.
- Typecheck, lint, test, production build, responsive browser QA, and live Vercel smoke test.

## Delivery target
- GitHub repository under `nxrskyaa`.
- Vercel production deployment.
- README includes Remix deployment and `VITE_FACTORY_ADDRESS` wiring instructions.
