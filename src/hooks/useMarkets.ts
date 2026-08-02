import { useReadContract } from 'wagmi'
import { odynitiveFactoryAbi } from '../contracts/odynitiveAbi'
import { factoryAddress, liveMode, adaptMarket, type MarketResult } from '../lib/market'
import { previewMarkets } from '../lib/preview'

export function useMarkets() {
  const query = useReadContract({
    address: factoryAddress as `0x${string}`,
    abi: odynitiveFactoryAbi,
    functionName: 'getMarkets',
    args: [0n, 24n],
    query: { enabled: liveMode, refetchInterval: 15_000 },
  })
  const data = liveMode && query.data
    ? (query.data as unknown as readonly MarketResult[]).map(adaptMarket)
    : previewMarkets
  return { ...query, data, isLoading: liveMode && query.isLoading, isError: liveMode && query.isError }
}
