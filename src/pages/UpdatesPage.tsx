import { useState } from 'react'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

const releases = [
  { date: '02 AUG 2026', version: 'V0.3', titleId: 'Information architecture baru', titleEn: 'New information architecture', bodyId: 'Branding disederhanakan menjadi Odynitive. Navigasi Docs, About, Updates, Odyvion, dan Actions ditambahkan. NFT Marketplace dan Agentz kini memiliki concept preview dengan status pengembangan yang jelas.', bodyEn: 'Branding is now simply Odynitive. Docs, About, Updates, Odyvion, and Actions navigation were added. NFT Marketplace and Agentz now have concept previews with explicit development status.' },
  { date: '01 AUG 2026', version: 'V0.2', titleId: 'Token launchpad terhubung', titleEn: 'Token launchpad connected', bodyId: 'Frontend dihubungkan ke factory Ritual Testnet, lengkap dengan market discovery, quote buy/sell, slippage protection, approval token, dan riwayat market dasar.', bodyEn: 'The frontend was connected to the Ritual Testnet factory, including market discovery, buy/sell quotes, slippage protection, token approvals, and core market history.' },
  { date: '31 JUL 2026', version: 'V0.1', titleId: 'Genesis', titleEn: 'Genesis', bodyId: 'Kontrak fixed-supply dan virtual-reserve bonding curve pertama dideploy. Identitas Aegean dan market Odyvion diperkenalkan.', bodyEn: 'The first fixed-supply, virtual-reserve bonding-curve contract was deployed. The Aegean identity and Odyvion market were introduced.' },
]

export function UpdatesPage() {
  const [lang, setLang] = useState<Language>('id')
  return <section className="shell info-page updates-page">
    <div className="info-hero"><div><span className="eyebrow">BUILD IN PUBLIC</span><h1>The workshop<br/><em>ledger.</em></h1></div><LanguageTabs language={lang} onChange={setLang}/></div>
    <BilingualSection language={lang} id={<p className="lead">Catatan perubahan produk, status pengembangan, dan arah berikutnya—tanpa menyamarkan concept preview sebagai fitur yang sudah live.</p>} en={<p className="lead">A record of product changes, development status, and what comes next—without presenting concept previews as live features.</p>}/>
    <div className="release-list">{releases.map((release, index) => <article key={release.version} className={index === 0 ? 'current' : ''}><div className="release-meta"><span>{release.date}</span><b>{release.version}</b>{index === 0 && <i>Latest</i>}</div><div><h2>{lang === 'id' ? release.titleId : release.titleEn}</h2><p>{lang === 'id' ? release.bodyId : release.bodyEn}</p></div></article>)}</div>
    <section className="roadmap-block"><div><span className="kicker">DEVELOPMENT PROGRESS</span><h2>{lang === 'id' ? 'Yang sedang dikerjakan' : 'Currently in the workshop'}</h2></div><div className="roadmap-lines"><p><span>01</span><b>NFT Marketplace</b><i>Frontend concept / In development</i></p><p><span>02</span><b>Agentz on Ritual Inference</b><i>Product concept / In development</i></p><p><span>03</span><b>Launchpad hardening</b><i>Contract review / Testnet</i></p></div></section>
  </section>
}
