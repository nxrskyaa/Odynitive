import { getAddress, isAddress, zeroAddress, type Address } from 'viem'

export type Market = {
  token: Address
  creator: Address
  name: string
  symbol: string
  description: string
  imageURI: string
  website: string
  social: string
  virtualRitualReserve: bigint
  virtualTokenReserve: bigint
  realRitualReserve: bigint
  tokensSold: bigint
  totalVolume: bigint
  createdAt: bigint
  tradeCount: bigint
  active: boolean
}

export type MarketTuple = readonly [Address, Address, string, string, string, string, string, string, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean]
export type MarketResult = MarketTuple | (Omit<Market, 'social'> & { socialLink: string })

export function adaptMarket(value: MarketResult): Market {
  if (!Array.isArray(value)) {
    const market = value as Omit<Market, 'social'> & { socialLink: string }
    return { ...market, social: market.socialLink }
  }
  const [token, creator, name, symbol, description, imageURI, website, social, virtualRitualReserve, virtualTokenReserve, realRitualReserve, tokensSold, totalVolume, createdAt, tradeCount, active] = value as MarketTuple
  return { token, creator, name, symbol, description, imageURI, website, social, virtualRitualReserve, virtualTokenReserve, realRitualReserve, tokensSold, totalVolume, createdAt, tradeCount, active }
}

export function calculateProgress(value: bigint, target: bigint) {
  if (target <= 0n) return 0
  return Math.max(0, Math.min(100, Number((value * 10_000n) / target) / 100))
}

export function isFactoryConfigured(value?: string): value is Address {
  return Boolean(value && isAddress(value) && getAddress(value) !== zeroAddress)
}

export function normalizeWeb3Error(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  if (/reject|denied|cancel/i.test(message)) return 'Request cancelled in your wallet.'
  if (/insufficient funds/i.test(message)) return 'Not enough RITUAL for this transaction and gas.'
  if (/chain|network/i.test(message)) return 'Switch your wallet to Ritual and try again.'
  if (/slippage|minimum output/i.test(message)) return 'Price moved beyond your slippage limit. Refresh the quote.'
  return 'The transaction could not be completed. Check your wallet and try again.'
}

export const factoryAddress = (import.meta.env.VITE_FACTORY_ADDRESS || '0xcE90B3b816741EEf0B67C0dA5c81288eCc000D37') as Address
export const liveMode = isFactoryConfigured(factoryAddress)
