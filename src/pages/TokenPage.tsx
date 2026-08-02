import { Link, useParams } from 'react-router-dom'
import { calculateProgress } from '../lib/market'
import { explorerUrl } from '../lib/chain'
import { formatCompact, formatRitual, shortenAddress, timeAgo } from '../lib/format'
import { useMarket } from '../hooks/useMarket'
import { CurveChart } from '../components/CurveChart'
import { TradePanel } from '../components/TradePanel'
import { ErrorState, LoadingState } from '../components/States'

const supply = 1_000_000_000n * 10n ** 18n

export function TokenPage() {
  const { address } = useParams()
  const { market, isLoading, isError, refetch } = useMarket(address)
  if (isLoading) return <section className="shell token-page"><LoadingState /></section>
  if (isError) return <section className="shell token-page"><ErrorState onRetry={() => refetch()} /></section>
  if (!market) return <section className="shell not-found"><span>◇</span><h1>Market not found</h1><p>This address has not launched through Odynitive.</p><Link className="button ghost" to="/">Back to discover</Link></section>
  const progress = calculateProgress(market.tokensSold, supply)
  const price = Number(market.virtualRitualReserve * 10n**18n / market.virtualTokenReserve) / 1e18

  return <section className="shell token-page">
    <Link className="text-link" to="/">← All markets</Link>
    <div className="token-hero"><div className="detail-image"><img src={market.imageURI || '/token-default.svg'} alt="" onError={(event)=>{event.currentTarget.src='/token-default.svg'}}/></div><div className="token-identity"><span className="token-symbol">{market.symbol}</span><h1>{market.name}</h1><p>{market.description}</p><div className="identity-links">{market.website&&<a href={market.website} target="_blank" rel="noreferrer">Website ↗</a>}{market.social&&<a href={market.social} target="_blank" rel="noreferrer">Social ↗</a>}<a href={`${explorerUrl}/address/${market.token}`} target="_blank" rel="noreferrer">Contract ↗</a></div></div></div>
    <div className="token-layout"><div className="token-main">
      <div className="stats-grid"><div><span>PRICE</span><b>{price.toFixed(7)} RITUAL</b></div><div><span>POOLED</span><b>{formatRitual(market.realRitualReserve)}</b></div><div><span>VOLUME</span><b>{formatRitual(market.totalVolume)}</b></div><div><span>TRADES</span><b>{market.tradeCount.toString()}</b></div></div>
      <div className="panel chart-panel"><div className="panel-head"><div><span className="kicker">MARKET SHAPE</span><h2>Price discovery</h2></div><span>{progress.toFixed(1)}% distributed</span></div><CurveChart progress={progress}/></div>
      <div className="panel provenance"><span className="kicker">PROVENANCE</span><div><span>Creator</span><a href={`${explorerUrl}/address/${market.creator}`} target="_blank" rel="noreferrer">{shortenAddress(market.creator)} ↗</a></div><div><span>Launched</span><b>{timeAgo(market.createdAt)}</b></div><div><span>Supply circulating</span><b>{formatCompact(Number(market.tokensSold / 10n**18n))} {market.symbol}</b></div></div>
    </div><TradePanel market={market}/></div>
  </section>
}
