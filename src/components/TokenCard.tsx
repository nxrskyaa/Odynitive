import { Link } from 'react-router-dom'
import type { Market } from '../lib/market'
import { calculateProgress } from '../lib/market'
import { formatRitual, shortenAddress, timeAgo } from '../lib/format'

export function TokenCard({ market }: { market: Market }) {
  const progress = calculateProgress(market.tokensSold, 1_000_000_000n * 10n ** 18n)
  const price = market.virtualTokenReserve ? Number(market.virtualRitualReserve * 10n ** 18n / market.virtualTokenReserve) / 1e18 : 0
  return <Link className="token-card" to={`/token/${market.token}`}>
    <div className="token-image"><img src={market.imageURI || '/token-default.svg'} alt="" onError={(event) => { event.currentTarget.src = '/token-default.svg' }}/><span className="token-symbol">{market.symbol}</span></div>
    <div className="token-body">
      <div className="token-title"><div><h3>{market.name}</h3><p>{market.description}</p></div><span className="arrow" aria-hidden>↗</span></div>
      <div className="stats-row"><span><small>PRICE</small>{price.toFixed(6)} RITUAL</span><span><small>POOLED</small>{formatRitual(market.realRitualReserve)} RITUAL</span></div>
      <div className="progress-track"><i style={{ width: `${progress}%` }}/></div><div className="card-progress">{progress.toFixed(1)}% distributed</div>
      <div className="card-foot"><span>by {shortenAddress(market.creator)}</span><span>{market.tradeCount.toString()} trades · {timeAgo(market.createdAt)}</span></div>
    </div>
  </Link>
}
