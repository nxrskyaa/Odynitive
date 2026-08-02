import { defineChain } from 'viem'
export const ritual = defineChain({
  id: 1979,
  name: 'Ritual',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: { default: { http: [import.meta.env.VITE_RITUAL_RPC_URL || 'https://rpc.ritualfoundation.org'] } },
  blockExplorers: { default: { name: 'Ritual Explorer', url: 'https://explorer.ritualfoundation.org' } },
  testnet: true,
})
export const explorerUrl = ritual.blockExplorers.default.url
