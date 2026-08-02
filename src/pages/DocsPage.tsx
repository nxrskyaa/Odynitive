import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

const idSteps = [
  ['01', 'Buat token', 'Creator mengisi nama, ticker, deskripsi, gambar, website, dan sosial. Satu transaksi membuat ERC-20 baru dengan suplai tetap 1 miliar token. Tidak ada pre-sale dan creator tidak menerima alokasi otomatis.'],
  ['02', 'Pasar langsung aktif', 'Seluruh suplai awal ditahan kontrak factory. Kontrak membuat cadangan virtual 10.000 RITUAL dan 1 miliar token untuk membentuk harga awal tanpa modal awal dari creator.'],
  ['03', 'Beli lewat kurva', 'Pembeli mengirim RITUAL. Setelah fee, RITUAL bersih masuk ke cadangan nyata dan pembeli menerima token dari factory. Semakin banyak token keluar, harga marginal naik.'],
  ['04', 'Jual kembali', 'Holder menyetujui token ke factory lalu menjualnya ke kurva. Token kembali ke factory dan RITUAL dibayar dari cadangan nyata yang tersedia. Harga marginal turun saat token kembali.'],
]
const enSteps = [
  ['01', 'Create a token', 'A creator submits a name, ticker, description, image, website, and social link. One transaction deploys a new ERC-20 with a fixed supply of one billion tokens. There is no presale and no automatic creator allocation.'],
  ['02', 'The market opens instantly', 'The factory escrows the full initial supply. Virtual reserves of 10,000 RITUAL and one billion tokens establish the starting curve without requiring creator-provided liquidity.'],
  ['03', 'Buy from the curve', 'A buyer sends RITUAL. After fees, net RITUAL enters the real reserve and tokens leave the factory. As circulating supply increases, the marginal price rises.'],
  ['04', 'Sell back to the curve', 'A holder approves and returns tokens to the factory. RITUAL is paid from available real reserves. As tokens return, the marginal price falls.'],
]

function Mechanism({ lang }: { lang: Language }) {
  const steps = lang === 'id' ? idSteps : enSteps
  return <div className="mechanism-list">{steps.map(([n,t,b]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{b}</p></div></article>)}</div>
}

export function DocsPage() {
  const [lang, setLang] = useState<Language>('id')
  return <section className="shell info-page">
    <div className="info-hero">
      <div><span className="eyebrow">DOCUMENTATION / V1 TESTNET</span><h1>Understand the market<br/><em>before you move.</em></h1></div>
      <LanguageTabs language={lang} onChange={setLang}/>
    </div>
    <BilingualSection language={lang}
      id={<><p className="lead">Odynitive adalah launchpad dan pasar token berbasis bonding curve di Ritual Testnet. Token dapat dibuat tanpa coding, lalu langsung dibeli dan dijual melalui kontrak yang sama.</p><div className="notice"><b>Status saat ini: testnet</b><span>Token dan RITUAL di sini tidak mewakili aset mainnet. Sistem masih dalam tahap pengujian.</span></div></>}
      en={<><p className="lead">Odynitive is a bonding-curve token launchpad and marketplace on Ritual Testnet. Tokens can be created without code, then bought and sold immediately through the same contract.</p><div className="notice"><b>Current status: testnet</b><span>Tokens and RITUAL shown here do not represent mainnet assets. The system is still being tested.</span></div></>}/>

    <section className="docs-section"><div className="section-number">01</div><div className="section-content">
      <BilingualSection language={lang} id={<><span className="kicker">MEKANISME INTI</span><h2>Bagaimana launchpad bekerja</h2></>} en={<><span className="kicker">CORE MECHANISM</span><h2>How the launchpad works</h2></>}/>
      <Mechanism lang={lang}/>
    </div></section>

    <section className="docs-section"><div className="section-number">02</div><div className="section-content">
      <BilingualSection language={lang}
        id={<><span className="kicker">BONDING CURVE</span><h2>Harga bukan ditentukan admin</h2><p>Harga dihitung dari model <code>x × y = k</code> menggunakan cadangan virtual. Pada pembelian, cadangan RITUAL virtual bertambah dan cadangan token virtual berkurang. Pada penjualan, arahnya berbalik. Karena itu setiap transaksi mengubah quote berikutnya.</p><div className="formula-card"><span>Quote beli</span><strong>token keluar = token virtual × RITUAL bersih ÷ (RITUAL virtual + RITUAL bersih)</strong><small>Quote ditarik langsung dari kontrak sebelum wallet meminta konfirmasi.</small></div></>}
        en={<><span className="kicker">BONDING CURVE</span><h2>The admin does not set the price</h2><p>Price is calculated from an <code>x × y = k</code> model using virtual reserves. A buy increases the virtual RITUAL reserve and decreases the virtual token reserve. A sell moves them in the opposite direction. Every trade therefore changes the next quote.</p><div className="formula-card"><span>Buy quote</span><strong>tokens out = virtual tokens × net RITUAL ÷ (virtual RITUAL + net RITUAL)</strong><small>The interface reads the quote directly from the contract before asking the wallet to confirm.</small></div></>}/>
    </div></section>

    <section className="docs-section"><div className="section-number">03</div><div className="section-content">
      <BilingualSection language={lang}
        id={<><span className="kicker">BIAYA & SLIPPAGE</span><h2>Apa yang dibayar pengguna</h2><div className="facts-grid"><article><b>1.00%</b><span>Protocol fee saat ini</span></article><article><b>0.50%</b><span>Creator fee saat ini</span></article><article><b>1.00%</b><span>Proteksi slippage UI</span></article><article><b>10.00%</b><span>Batas total fee kontrak</span></article></div><p>Fee dikenakan pada buy dan sell. Creator fee tercatat sebagai saldo yang bisa ditarik creator. Protocol fee hanya dapat ditarik treasury. Nilai fee dapat diubah owner, tetapi kontrak membatasi totalnya maksimal 10%.</p></>}
        en={<><span className="kicker">FEES & SLIPPAGE</span><h2>What users pay</h2><div className="facts-grid"><article><b>1.00%</b><span>Current protocol fee</span></article><article><b>0.50%</b><span>Current creator fee</span></article><article><b>1.00%</b><span>Interface slippage protection</span></article><article><b>10.00%</b><span>Contract fee ceiling</span></article></div><p>Fees apply to both buys and sells. Creator fees accrue as a withdrawable creator balance. Protocol fees can only be withdrawn by the treasury. The owner can update fee rates, but the contract enforces a 10% maximum combined fee.</p></>}/>
    </div></section>

    <section className="docs-section"><div className="section-number">04</div><div className="section-content">
      <BilingualSection language={lang}
        id={<><span className="kicker">TRANSPARANSI SISTEM</span><h2>Yang tetap, yang bisa berubah</h2><div className="comparison-table"><div><b>Tetap di kode</b><span>Suplai 1 miliar</span><span>18 desimal</span><span>Rumus kurva</span><span>Batas fee 10%</span></div><div><b>Dapat diubah owner</b><span>Protocol fee</span><span>Creator fee</span><span>Alamat treasury</span><span>Kepemilikan kontrak</span></div><div><b>Tidak tersedia saat ini</b><span>Creator mint tambahan</span><span>Pause market</span><span>Blacklist holder</span><span>Migrasi otomatis ke DEX</span></div></div></>}
        en={<><span className="kicker">SYSTEM TRANSPARENCY</span><h2>What is fixed and what can change</h2><div className="comparison-table"><div><b>Fixed in code</b><span>One billion supply</span><span>18 decimals</span><span>Curve formula</span><span>10% fee ceiling</span></div><div><b>Owner-controlled</b><span>Protocol fee</span><span>Creator fee</span><span>Treasury address</span><span>Contract ownership</span></div><div><b>Not currently available</b><span>Additional creator minting</span><span>Market pause</span><span>Holder blacklist</span><span>Automatic DEX migration</span></div></div></>}/>
    </div></section>

    <section className="docs-section final-doc"><div className="section-number">05</div><div className="section-content">
      <BilingualSection language={lang}
        id={<><span className="kicker">SEBELUM TRANSAKSI</span><h2>Checklist singkat</h2><ul className="check-list"><li>Pastikan wallet berada di Ritual Testnet (Chain ID 1979).</li><li>Baca quote, fee, dan minimum output sebelum konfirmasi.</li><li>Buy memakai RITUAL; sell membutuhkan approval token terlebih dahulu.</li><li>Likuiditas sell berasal dari RITUAL nyata yang masuk melalui pembelian sebelumnya.</li><li>Market dengan volume rendah dapat mengalami perubahan harga lebih besar.</li></ul></>}
        en={<><span className="kicker">BEFORE A TRANSACTION</span><h2>Quick checklist</h2><ul className="check-list"><li>Confirm your wallet is on Ritual Testnet (Chain ID 1979).</li><li>Read the quote, fees, and minimum output before confirming.</li><li>Buys use RITUAL; sells require a token approval first.</li><li>Sell liquidity comes from real RITUAL deposited by earlier buyers.</li><li>Low-volume markets may experience larger price movement.</li></ul></>}/>
      <div className="doc-actions"><Link className="button primary" to="/actions/token">Launch a token</Link><a className="button ghost" href="https://explorer.ritualfoundation.org/address/0xcE90B3b816741EEf0B67C0dA5c81288eCc000D37" target="_blank" rel="noreferrer">View contract ↗</a></div>
    </div></section>
  </section>
}
