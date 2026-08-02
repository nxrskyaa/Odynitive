import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TokenCard } from '../components/TokenCard'
import { EmptyState, ErrorState, LoadingCards } from '../components/States'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'
import { useMarkets } from '../hooks/useMarkets'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'new'|'active'>('new')
  const [lang, setLang] = useState<Language>('id')
  const [experience, setExperience] = useState<'tokens'|'nfts'|'agentz'>('tokens')
  const { data: markets, isLoading, isError, refetch } = useMarkets()
  const shown = useMemo(() => markets.filter(m => `${m.name} ${m.symbol}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort==='new' ? Number(b.createdAt-a.createdAt) : Number(b.tradeCount-a.tradeCount)), [markets, query, sort])
  return <>
    <section className="home-hero shell">
      <div className="hero-copy"><div className="network-line"><span className="status-dot"/>RITUAL TESTNET / CHAIN 1979</div><h1>Where ideas become<br/><em>on-chain worlds.</em></h1><p>Launch tokens today. Explore the NFT and autonomous Agentz experiences being built next.</p><div className="hero-actions"><Link className="button primary" to="/actions/token">Launch a token <span>↗</span></Link><Link className="button ghost" to="/docs">Understand the system</Link></div></div>
      <div className="hero-orbit" aria-hidden="true"><span className="orbit o1"/><span className="orbit o2"/><span className="orbit o3"/><strong>O</strong><i className="orbit-node n1"/><i className="orbit-node n2"/><div><b>3</b><small>PRODUCT REALMS</small></div></div>
    </section>

    <section className="product-switcher">
      <div className="shell"><div className="experience-tabs" role="tablist" aria-label="Odynitive products">
        <button className={experience==='tokens'?'active':''} onClick={()=>setExperience('tokens')}><span>01</span><div><b>Tokens</b><small>Launchpad · Live</small></div></button>
        <button className={experience==='nfts'?'active':''} onClick={()=>setExperience('nfts')}><span>02</span><div><b>NFTs</b><small>Marketplace · In development</small></div></button>
        <button className={experience==='agentz'?'active':''} onClick={()=>setExperience('agentz')}><span>03</span><div><b>Agentz</b><small>Autonomous arena · In development</small></div></button>
      </div>
      <div className={`experience-panel ${experience}`}>
        {experience==='tokens' && <><div><span className="kicker">AVAILABLE NOW</span><h2>Create a market in one transaction.</h2><p>Fixed supply, immediate price discovery, and transparent on-chain quotes. No code required.</p></div><div className="panel-metric"><span>SUPPLY MODEL</span><b>1,000,000,000</b><small>Fixed per token</small></div><Link className="text-link" to="/actions/token">Open token launch →</Link></>}
        {experience==='nfts' && <><div><span className="kicker">CONCEPT FRONTEND</span><h2>Collect, list, and discover Aegean artifacts.</h2><p>Preview the collection marketplace and activity experience currently in development.</p></div><div className="mini-art"><i>Ω</i><span>COMING SOON</span></div><Link className="text-link" to="/actions/nfts">Preview NFT Marketplace →</Link></>}
        {experience==='agentz' && <><div><span className="kicker">CONCEPT FRONTEND</span><h2>Configure an agent. Enter the arena.</h2><p>A no-code autonomous trading competition planned around Ritual inference.</p></div><div className="mini-agent"><span>Δ</span><i>VS</i><span>◎</span></div><Link className="text-link" to="/actions/agentz">Preview Agentz →</Link></>}
      </div></div>
    </section>

    <section className="how-section shell"><div className="section-heading"><div><span className="kicker">HOW THE TOKEN LAUNCHPAD WORKS</span><h2>Clear before you commit.</h2></div><LanguageTabs language={lang} onChange={setLang}/></div>
      <BilingualSection language={lang}
        id={<div className="home-steps"><article><span>01</span><h3>Buat token</h3><p>Isi metadata dan tandatangani satu transaksi. Kontrak membuat suplai tetap 1 miliar token.</p></article><article><span>02</span><h3>Kurva dibuka</h3><p>Factory menahan suplai dan menghitung harga dari cadangan virtual—tanpa order book.</p></article><article><span>03</span><h3>Pasar bergerak</h3><p>Buy menaikkan harga marginal; sell mengembalikan token dan menurunkannya.</p></article><article><span>04</span><h3>Quote transparan</h3><p>Output, fee 1,5%, dan slippage tampil sebelum transaksi dikonfirmasi.</p></article></div>}
        en={<div className="home-steps"><article><span>01</span><h3>Create a token</h3><p>Submit metadata and sign one transaction. The contract creates a fixed one-billion supply.</p></article><article><span>02</span><h3>The curve opens</h3><p>The factory escrows supply and calculates price from virtual reserves—no order book.</p></article><article><span>03</span><h3>The market moves</h3><p>Buys raise the marginal price; sells return tokens and move it lower.</p></article><article><span>04</span><h3>Transparent quote</h3><p>Output, the current 1.5% fee, and slippage are shown before confirmation.</p></article></div>}/>
      <Link className="inline-doc-link" to="/docs"><b>Read the full mechanism</b><span>Fees, formula, owner controls, liquidity, and transaction flow →</span></Link>
    </section>

    <section className="market-section shell"><div className="section-heading market-heading"><div><span className="kicker">LIVE TOKEN MARKETS</span><h2>Discover what is moving.</h2></div><div className="market-controls"><label><span>Search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name or ticker" /></label><div className="sort-tabs"><button className={sort==='new'?'active':''} onClick={()=>setSort('new')}>Newest</button><button className={sort==='active'?'active':''} onClick={()=>setSort('active')}>Most active</button></div></div></div>
      {isLoading ? <LoadingCards /> : isError ? <ErrorState onRetry={() => refetch()} /> : shown.length ? <div className="token-grid">{shown.map(m=><TokenCard market={m} key={m.token}/>)}</div> : <EmptyState />}
    </section>

    <section className="odyvion-banner"><div className="shell"><div><span className="eyebrow">BEYOND THE MARKET</span><h2>Enter the Aegean realm.</h2><p>Odyvion is a separate game from the same creative world—now visible directly from Odynitive.</p><a className="button primary" href="https://odyvion.vercel.app" target="_blank" rel="noreferrer">Play Odyvion ↗</a></div><div className="realm-mark"><span>Ο</span><i>ODYVION</i></div></div></section>
  </>
}
