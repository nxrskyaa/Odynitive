import { useMemo, useState } from 'react'
import { TokenCard } from '../components/TokenCard'
import { EmptyState, ErrorState, LoadingCards } from '../components/States'
import { useMarkets } from '../hooks/useMarkets'
import { useState as useLangState } from 'react'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

type SortKey = 'volume' | 'new' | 'active'

export function MarketsPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('volume')
  const [lang, setLang] = useLangState<Language>('id')
  const { data: markets, isLoading, isError, refetch } = useMarkets()

  const shown = useMemo(() => markets
    .filter(m => `${m.name} ${m.symbol}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'new') return Number(b.createdAt - a.createdAt)
      if (sort === 'active') return Number(b.tradeCount - a.tradeCount)
      return Number(b.totalVolume - a.totalVolume)
    }), [markets, query, sort])

  const leader = shown[0]
  const totalVolume = markets.reduce((sum, m) => sum + m.totalVolume, 0n)

  return <section className="shell markets-page">
    <div className="info-hero markets-hero">
      <div>
        <span className="eyebrow">LIVE TOKEN MARKETS</span>
        <h1>Every launch,<br/><em>one board.</em></h1>
        <BilingualSection language={lang}
          id={<p className="markets-sub">Semua token yang diluncurkan lewat Odynitive, diurutkan dari volume tertinggi. Data dibaca langsung dari kontrak Ritual Testnet.</p>}
          en={<p className="markets-sub">Every token launched through Odynitive, ranked by volume. Data is read straight from the Ritual Testnet contract.</p>}/>
      </div>
      <LanguageTabs language={lang} onChange={setLang}/>
    </div>

    <div className="markets-board">
      <div className="board-stats">
        <div><span>MARKETS</span><b>{markets.length}</b></div>
        <div><span>TOTAL VOLUME</span><b>{(Number(totalVolume) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 2 })} RITUAL</b></div>
        <div><span>TOP VOLUME</span><b>{leader ? `${leader.symbol}` : '—'}</b></div>
      </div>
      <div className="market-controls">
        <label><span>Search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name or ticker" /></label>
        <div className="sort-tabs">
          <button className={sort==='volume'?'active':''} onClick={()=>setSort('volume')}>Top volume</button>
          <button className={sort==='new'?'active':''} onClick={()=>setSort('new')}>Newest</button>
          <button className={sort==='active'?'active':''} onClick={()=>setSort('active')}>Most active</button>
        </div>
      </div>
    </div>

    {isLoading ? <LoadingCards /> : isError ? <ErrorState onRetry={() => refetch()} /> : shown.length
      ? <div className="token-grid markets-grid">{shown.map((m, i) => <div className="ranked-card" key={m.token}><span className="rank-badge">#{i + 1}</span><TokenCard market={m}/></div>)}</div>
      : <EmptyState />}
  </section>
}
