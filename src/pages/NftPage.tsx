import { useState } from 'react'
import { ActionTabs } from '../components/ActionTabs'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

const collections = [
  { title: 'Bronze Oracles', supply: '1,111', floor: '—', tone: 'bronze', glyph: 'Ω' },
  { title: 'Marble Citizens', supply: '3,333', floor: '—', tone: 'marble', glyph: 'Μ' },
  { title: 'Lapis Relics', supply: '777', floor: '—', tone: 'lapis', glyph: '◆' },
]

export function NftPage() {
  const [lang, setLang] = useState<Language>('id')
  const [marketTab, setMarketTab] = useState<'discover'|'activity'>('discover')
  return <section className="shell action-page nft-page">
    <ActionTabs />
    <div className="action-hero"><div><span className="status-pill development">STILL IN DEVELOPMENT PROGRESS</span><span className="eyebrow">ODYNITIVE NFT MARKETPLACE</span><h1>Artifacts need<br/><em>a living market.</em></h1></div><LanguageTabs language={lang} onChange={setLang}/></div>
    <BilingualSection language={lang}
      id={<p className="lead">Ruang untuk membuat, menemukan, dan memperdagangkan koleksi NFT di Odynitive. Tampilan di bawah adalah concept frontend—belum ada mint, listing, atau transaksi NFT yang aktif.</p>}
      en={<p className="lead">A space to create, discover, and trade NFT collections inside Odynitive. The interface below is a frontend concept—minting, listings, and NFT transactions are not active yet.</p>}/>
    <div className="concept-toolbar"><div className="concept-tabs" role="tablist"><button className={marketTab==='discover'?'active':''} onClick={()=>setMarketTab('discover')}>Discover</button><button className={marketTab==='activity'?'active':''} onClick={()=>setMarketTab('activity')}>Live activity</button></div><button className="button disabled" disabled>Create collection <span>Coming soon</span></button></div>
    {marketTab === 'discover' ? <>
      <div className="nft-feature"><div className="feature-art"><span className="halo h1"/><span className="halo h2"/><strong>Ω</strong><i>GENESIS / 001</i></div><div><span className="kicker">FEATURED CONCEPT COLLECTION</span><h2>The Bronze Oracles</h2><p>{lang === 'id' ? 'Serangkaian penjaga Aegean yang dirancang sebagai collectible, identitas profil, dan akses ke pengalaman Odynitive di masa depan.' : 'A series of Aegean guardians imagined as collectibles, profile identities, and access pieces for future Odynitive experiences.'}</p><div className="nft-facts"><span><small>ITEMS</small>1,111</span><span><small>OWNERS</small>—</span><span><small>FLOOR</small>Not live</span></div><button disabled className="button primary">View collection · Coming soon</button></div></div>
      <div className="section-heading"><div><span className="kicker">EXPLORE THE ARCHIVE</span><h2>Concept collections</h2></div><span>Frontend preview</span></div>
      <div className="collection-grid">{collections.map((collection) => <article className={`collection-card ${collection.tone}`} key={collection.title}><div className="collection-art"><span>{collection.glyph}</span><i>ODYNITIVE ARCHIVE</i></div><div><h3>{collection.title}</h3><p><span>{collection.supply} items</span><span>Floor {collection.floor}</span></p><button disabled>Marketplace not live</button></div></article>)}</div>
    </> : <div className="activity-preview"><div className="activity-head"><span>EVENT</span><span>ITEM</span><span>FROM / TO</span><span>PRICE</span></div>{['Minted','Listed','Sale','Offer'].map((event,index)=><div className="activity-row muted" key={event}><span>{event}</span><b>{collections[index%3].title} #{String(index+1).padStart(4,'0')}</b><span>0x— / 0x—</span><span>Not live</span></div>)}<p>{lang === 'id' ? 'Aktivitas on-chain akan muncul di sini setelah kontrak marketplace tersedia.' : 'On-chain activity will appear here after marketplace contracts are available.'}</p></div>}
    <section className="development-note"><span>BUILD STATUS</span><BilingualSection language={lang} id={<div><h3>Masih dalam development progress</h3><p>Frontend ini menunjukkan arah UX: collection discovery, listing, activity feed, dan creator flow. Tidak ada tombol yang mengirim transaksi.</p></div>} en={<div><h3>Still in development progress</h3><p>This frontend shows the intended UX for collection discovery, listings, activity feeds, and creator flows. No control sends a transaction.</p></div>}/></section>
  </section>
}
