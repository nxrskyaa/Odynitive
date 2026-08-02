# Odynitive

A restrained token launchpad for [Ritual Chain](https://ritualfoundation.org): launch a fixed-supply token in one transaction, then buy or sell it on a transparent constant-product curve.

## Live deployment

- **App:** [odynitive.vercel.app](https://odynitive.vercel.app)
- **Network:** Ritual testnet (`1979`)
- **Factory:** [`0xcE90B3b816741EEf0B67C0dA5c81288eCc000D37`](https://explorer.ritualfoundation.org/address/0xcE90B3b816741EEf0B67C0dA5c81288eCc000D37)
- **Deployment transaction:** [`0x1a1d5f5b7e69196d5d36ab8c65f6b74d12ae2ef2335f2d8bf7549c6edd5972f9`](https://explorer.ritualfoundation.org/tx/0x1a1d5f5b7e69196d5d36ab8c65f6b74d12ae2ef2335f2d8bf7549c6edd5972f9)
- **Builder:** `nxrskyaa`
- **Builder address:** `0x645881c3e59eAed072FECDFCC757280C49F01ecD`

## Product flow

1. Connect an injected EVM wallet and switch to Ritual testnet.
2. Enter a token name, symbol, description, image, and optional links.
3. Launch the fixed 1 billion supply token; the factory initializes its virtual reserves.
4. Trade through explicit buy/sell quotes with protocol and creator fees shown before confirmation.

## Local development

```bash
npm install
npm run dev
```

The deployed testnet factory is the default. To target another deployment:

```bash
cp .env.example .env.local
# Set VITE_FACTORY_ADDRESS
```

## Verification

```bash
# frontend lint, types, unit tests, production build
NODE_OPTIONS=--max-old-space-size=1280 npm run check

# contract compile + test suite
cd contracts
npm install
npm test
npm run compile
```

## Contract deployment

```bash
cd contracts
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:ritual
```

The contract source is self-contained in `contracts/OdynitiveLaunchpad.sol`. See [`docs/design.md`](docs/design.md) and [`docs/implementation-plan.md`](docs/implementation-plan.md) for the product and implementation rationale.

## Stack

React, TypeScript, Vite, wagmi, viem, Solidity, Hardhat, OpenZeppelin.
