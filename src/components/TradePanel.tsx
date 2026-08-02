import { useMemo, useState } from 'react'
import { formatEther, parseEther, type Address } from 'viem'
import { useAccount, useBalance, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { erc20Abi, odynitiveFactoryAbi } from '../contracts/odynitiveAbi'
import { ritual } from '../lib/chain'
import { factoryAddress, liveMode, normalizeWeb3Error, type Market } from '../lib/market'
import { formatCompact } from '../lib/format'

export function TradePanel({ market }: { market: Market }) {
  const [side, setSide] = useState<'buy'|'sell'>('buy')
  const [amount, setAmount] = useState('')
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const parsed = useMemo(() => { try { return amount ? parseEther(amount) : 0n } catch { return 0n } }, [amount])
  const configuredFactory = factoryAddress as Address
  const nativeBalance = useBalance({ address, chainId: ritual.id, query: { enabled: Boolean(address) } })
  const tokenBalance = useReadContract({ address: market.token, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address], query: { enabled: Boolean(address) && liveMode } })
  const quote = useReadContract({ address: configuredFactory, abi: odynitiveFactoryAbi, functionName: side === 'buy' ? 'quoteBuy' : 'quoteSell', args: [market.token, parsed], query: { enabled: liveMode && parsed > 0n, refetchInterval: 8_000 } })
  const allowance = useReadContract({ address: market.token, abi: erc20Abi, functionName: 'allowance', args: [address as Address, configuredFactory], query: { enabled: liveMode && Boolean(address) && side === 'sell' } })
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash })
  const values = quote.data as readonly [bigint, bigint, bigint] | undefined
  const output = values?.[0] ?? 0n
  const needsApproval = side === 'sell' && parsed > 0n && (allowance.data ?? 0n) < parsed
  const available = side === 'buy' ? nativeBalance.data?.value ?? 0n : tokenBalance.data ?? 0n

  const submit = () => {
    if (!liveMode || !parsed) return
    if (needsApproval) writeContract({ address: market.token, abi: erc20Abi, functionName: 'approve', args: [configuredFactory, parsed] })
    else if (side === 'buy') writeContract({ address: configuredFactory, abi: odynitiveFactoryAbi, functionName: 'buy', args: [market.token, output * 99n / 100n], value: parsed })
    else writeContract({ address: configuredFactory, abi: odynitiveFactoryAbi, functionName: 'sell', args: [market.token, parsed, output * 99n / 100n] })
  }

  const disabled = !liveMode || !isConnected || chainId !== ritual.id || parsed <= 0n || parsed > available || quote.isLoading
  return <aside className="trade-panel panel">
    <div className="trade-tabs"><button className={side==='buy'?'active':''} onClick={()=>{setSide('buy');setAmount('')}}>Buy</button><button className={side==='sell'?'active':''} onClick={()=>{setSide('sell');setAmount('')}}>Sell</button></div>
    <label className="trade-input"><span>You {side}</span><div><input inputMode="decimal" value={amount} onChange={(event)=>setAmount(event.target.value.replace(/[^0-9.]/g,''))} placeholder="0.0"/><b>{side==='buy'?'RITUAL':market.symbol}</b></div><small>Balance {formatCompact(Number(formatEther(available)))}</small></label>
    <button className="max-button" onClick={()=>setAmount(formatEther(available))}>Use max</button>
    <div className="quote-box"><span>You receive</span><b>{quote.isLoading ? 'Quoting…' : `${formatCompact(Number(formatEther(output)))} ${side==='buy'?market.symbol:'RITUAL'}`}</b></div>
    <div className="fee-lines"><span><i>Trading fee</i><b>1.5%</b></span><span><i>Slippage protection</i><b>1.0%</b></span></div>
    <button className="button primary wide" onClick={submit} disabled={disabled || isPending || receipt.isLoading}>{!liveMode?'Preview only':!isConnected?'Connect wallet':chainId!==ritual.id?'Switch to Ritual':parsed>available?'Insufficient balance':needsApproval?'Approve token':isPending?'Confirm in wallet…':receipt.isLoading?'Confirming…':`${side==='buy'?'Buy':'Sell'} ${market.symbol}`}</button>
    {error && <p className="form-error">{normalizeWeb3Error(error)}</p>}
    {receipt.isSuccess && <p className="trade-success">Confirmed on Ritual. Quote refreshed.</p>}
    <p className="microcopy">Quotes come directly from the on-chain virtual-reserve curve.</p>
  </aside>
}
