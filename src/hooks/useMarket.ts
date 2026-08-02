import { useReadContract } from 'wagmi'
import { isAddress, type Address } from 'viem'
import { odynitiveFactoryAbi } from '../contracts/odynitiveAbi'
import { factoryAddress, liveMode, adaptMarket, type MarketResult } from '../lib/market'
import { previewMarkets } from '../lib/preview'

export function useMarket(address?: string) {
  const valid = Boolean(address && isAddress(address))
  const preview = previewMarkets.find((market) => market.token.toLowerCase() === address?.toLowerCase())
  const query = useReadContract({
    address: factoryAddress as Address,
    abi: odynitiveFactoryAbi,
    functionName: 'getMarket',
    args: [address as Address],
    query: { enabled: liveMode && valid, refetchInterval: 12_000 },
  })
  return {
    ...query,
    market: liveMode && query.data ? adaptMarket(query.data as unknown as MarketResult) : preview,
    isLoading: liveMode && query.isLoading,
    invalid: !valid,
  }
}
