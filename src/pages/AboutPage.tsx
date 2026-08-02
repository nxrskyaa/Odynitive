import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

export function AboutPage() {
  const [lang, setLang] = useState<Language>('id')
  return <section className="shell info-page about-page">
    <div className="info-hero"><div><span className="eyebrow">ABOUT ODYNITIVE</span><h1>A public arena for<br/><em>on-chain creation.</em></h1></div><LanguageTabs language={lang} onChange={setLang}/></div>
    <BilingualSection language={lang}
      id={<><p className="lead">Odynitive dibangun sebagai satu rumah untuk aset, eksperimen, dan agen digital yang lahir di Ritual—dimulai dari token, lalu berkembang ke NFT dan autonomous Agentz.</p><p className="body-copy">Nama Odynitive menggabungkan rasa sebuah odyssey—perjalanan panjang yang terus berubah—dengan sifat native dari sistem on-chain. Identitas visualnya mengambil marmer, perunggu, lapis, dan tipografi editorial Aegean agar produk terasa seperti dunia yang punya sejarah, bukan dashboard kripto generik.</p></>}
      en={<><p className="lead">Odynitive is being built as one home for assets, experiments, and digital agents born on Ritual—starting with tokens, then expanding into NFTs and autonomous Agentz.</p><p className="body-copy">The name combines the spirit of an odyssey—a long, evolving journey—with the native nature of on-chain systems. Its visual identity uses marble, bronze, lapis, and Aegean editorial typography so the product feels like a world with history, not another generic crypto dashboard.</p></>}/>
    <div className="principle-grid">
      <BilingualSection language={lang}
        id={<><article><span>01</span><h3>Terbaca sebelum interaktif</h3><p>Mekanisme, biaya, dan status produk harus terlihat sebelum pengguna diminta menandatangani transaksi.</p></article><article><span>02</span><h3>Kontrak sebagai sumber kebenaran</h3><p>Quote dan market state dibaca langsung dari Ritual, bukan angka buatan interface.</p></article><article><span>03</span><h3>Bangun terbuka, label jujur</h3><p>Fitur konsep ditampilkan untuk memperjelas arah produk, tetapi selalu ditandai masih dalam pengembangan.</p></article></>}
        en={<><article><span>01</span><h3>Readable before interactive</h3><p>Mechanics, fees, and product status should be visible before a user is asked to sign anything.</p></article><article><span>02</span><h3>Contracts as the source of truth</h3><p>Quotes and market state are read directly from Ritual, not invented by the interface.</p></article><article><span>03</span><h3>Build openly, label honestly</h3><p>Concept features are shown to clarify product direction, but they remain clearly marked as in development.</p></article></>}/>
    </div>
    <section className="world-bridge"><div><span className="kicker">FROM THE SAME AEGEAN WORLD</span><h2>Meet Odyvion</h2><BilingualSection language={lang} id={<p>Odyvion adalah game Aegean buatan nxrskyaa dan sumber dunia visual Odynitive. Game ini tetap menjadi produk terpisah, tetapi hadir di navigasi sebagai bagian dari ekosistem kreatif yang sama.</p>} en={<p>Odyvion is nxrskyaa's Aegean game and the visual-world origin of Odynitive. It remains a separate product, while appearing in navigation as part of the same creative ecosystem.</p>}/><a className="button primary" href="https://odyvion.vercel.app" target="_blank" rel="noreferrer">Enter Odyvion ↗</a></div><div className="odyvion-emblem"><img src="/odynitive-logo.jpg" alt="Odynitive marble emblem"/><span>THE AEGEAN REALM</span></div></section>
    <div className="about-cta"><h2>Read the system, then decide.</h2><Link className="text-link" to="/docs">Open documentation →</Link></div>
  </section>
}
