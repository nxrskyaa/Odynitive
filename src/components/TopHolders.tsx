import { useEffect, useState } from 'react'
import { formatEther, parseAbiItem, type Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { explorerUrl, ritual } from '../lib/chain'
import { factoryAddress, liveMode } from '../lib/market'
import { shortenAddress } from '../lib/format'

const transferEvent = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)')
const ZERO = '0x0000000000000000000000000000000000000000'

type Holder = {
  address: Address
  balance: bigint
  share: number
}

const previewHolders: Holder[] = [
  { address: '0x6458E24f3B95d8C2bA6c9E45C1f2D3a4b51A1ecD' as Address, balance: 41_000_000n * 10n ** 18n, share: 21.1 },
  { address: '0x8F3A2B1c9d4E5f60718293a4B5c6D7e8F9012345' as Address, balance: 19_400_000n * 10n ** 18n, share: 10.0 },
  { address: '0x2b7C1D8e9F0a1B2c3D4e5F60718293A4B5C6D7E8' as Address, balance: 11_250_000n * 10n ** 18n, share: 5.8 },
]

function useHolders(token: Address | undefined, tokensSold: bigint) {
  const client = usePublicClient({ chainId: ritual.id })
  const [holders, setHolders] = useState<Holder[]>(liveMode ? [] : previewHolders)
  const [isLoading, setIsLoading] = useState(liveMode)

  useEffect(() => {
    let cancelled = false
    if (!liveMode || !client || !token) { setHolders(previewHolders); setIsLoading(false); return }
    setIsLoading(true)
    ;(async () => {
      try {
        const latest = await client.getBlockNumber()
        // RPC caps getLogs ranges at 100k blocks — scan backwards in chunks.
        // Tokens launch recently, so if the first chunks are empty, stop fast.
        const CHUNK = 95_000n
        const MAX_CHUNKS = 3
        const logs: Array<{ args: { from?: Address; to?: Address; value?: bigint } }> = []
        let end = latest
        for (let i = 0; i < MAX_CHUNKS && end > 0n; i++) {
          const start = end > CHUNK ? end - CHUNK : 0n
          const chunk = await client.getLogs({ address: token, event: transferEvent, fromBlock: start, toBlock: end }) as Array<{ args: { from?: Address; to?: Address; value?: bigint } }>
          logs.push(...chunk)
          if (start === 0n) break
          end = start - 1n
        }
        // Net balances across all observed transfers (factory contract excluded).
        const balances = new Map<string, bigint>()
        for (const log of logs) {
          const from = (log.args.from as Address | undefined)?.toLowerCase()
          const to = (log.args.to as Address | undefined)?.toLowerCase()
          const value = (log.args.value as bigint | undefined) ?? 0n
          if (to && to !== ZERO) balances.set(to, (balances.get(to) ?? 0n) + value)
          if (from && from !== ZERO) balances.set(from, (balances.get(from) ?? 0n) - value)
        }
        const factory = factoryAddress.toLowerCase()
        const top = [...balances.entries()]
          .filter(([address, balance]) => balance > 0n && address !== factory)
          .sort((a, b) => (a[1] > b[1] ? -1 : 1))
          .slice(0, 8)
          .map(([address, balance]) => ({
            address: address as Address,
            balance,
            share: tokensSold > 0n ? Number((balance * 10_000n) / tokensSold) / 100 : 0,
          }))
        if (!cancelled) setHolders(top)
      } catch {
        if (!cancelled) setHolders([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [client, token, tokensSold])

  return { holders, isLoading }
}

export function TopHolders({ token, tokensSold }: { token: Address; tokensSold: bigint }) {
  const { holders, isLoading } = useHolders(token, tokensSold)
  return <div className="panel holders-panel">
    <div className="panel-head"><div><span className="kicker">DISTRIBUTION</span><h2>Top holders</h2></div><span>{holders.length || '—'} wallets</span></div>
    {isLoading ? <p className="holders-empty">Reading Transfer logs from Ritual…</p>
      : holders.length === 0 ? <p className="holders-empty">No holder data in the scanned range yet.</p>
      : <div className="holders-table">
          <div className="holders-row head"><span>#</span><span>Wallet</span><span>Balance</span><span>Share</span></div>
          {holders.map((holder, index) => <div className="holders-row" key={holder.address}>
            <span className="holder-rank">{index + 1}</span>
            <a href={`${explorerUrl}/address/${holder.address}`} target="_blank" rel="noreferrer">{shortenAddress(holder.address)} ↗</a>
            <b>{Number(formatEther(holder.balance)).toLocaleString('en-US', { maximumFractionDigits: 0 })}</b>
            <span className="holder-share"><i style={{ width: `${Math.min(100, holder.share * 4)}%` }} />{holder.share.toFixed(2)}%</span>
          </div>)}
        </div>}
  </div>
}
