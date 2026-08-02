import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenCard } from '../components/TokenCard'
import { LoadingState, ErrorState } from '../components/States'
import { useMarkets } from '../hooks/useMarkets'

export function HomePage() {
  const { data, isLoading, isError, refetch } = useMarkets()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'new' | 'active'>('new')
  const markets = useMemo(() => data
    .filter((market) => `${market.name} ${market.symbol} ${market.description}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'new' ? Number(b.createdAt - a.createdAt) : Number(b.tradeCount - a.tradeCount)), [data, query, sort])

  return <>
    <section className="hero shell">
      <div className="eyebrow"><span className="status-dot" /> LIVE ON RITUAL TESTNET</div>
      <h1>Ideas deserve<br/><em>a market.</em></h1>
      <p>Launch a token in one transaction. Trade it on a transparent curve from the first block.</p>
      <div className="hero-actions"><Link className="button primary" to="/launch">Launch a token <span>↗</span></Link><a className="button ghost" href="#markets">Explore markets</a></div>
      <div className="hero-orbit" aria-hidden><span>O</span><i/><b/></div>
    </section>

    <section className="principles"><div className="shell principles-grid">
      <div><b>01</b><h3>Set the name</h3><p>One clear form. Fixed supply. No hidden switches.</p></div>
      <div><b>02</b><h3>Open the curve</h3><p>Your market is live the moment the launch confirms.</p></div>
      <div><b>03</b><h3>Let it move</h3><p>Buy and sell with explicit quotes and visible fees.</p></div>
    </div></section>

    <section className="shell market-section" id="markets">
      <div className="section-head"><div><span className="kicker">THE AGORA</span><h2>Newly set in motion</h2></div><div className="market-controls"><label><span className="sr-only">Search tokens</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or ticker" /></label><div className="segmented"><button className={sort==='new'?'active':''} onClick={()=>setSort('new')}>Newest</button><button className={sort==='active'?'active':''} onClick={()=>setSort('active')}>Active</button></div></div></div>
      {isLoading ? <LoadingState /> : isError ? <ErrorState onRetry={() => refetch()} /> : markets.length ? <div className="token-grid">{markets.map((market) => <TokenCard key={market.token} market={market}/>)}</div> : <div className="empty-state"><span>◇</span><h3>No tokens found</h3><p>Try a different search, or launch the first one.</p></div>}
    </section>
  </>
}
