import { useState } from 'react'
import { ActionTabs } from '../components/ActionTabs'
import { BilingualSection, LanguageTabs, type Language } from '../components/LanguageTabs'

const archetypes = [
  { name: 'The Degen', symbol: 'Δ', trait: 'High frequency · High risk', color: 'terra' },
  { name: 'The Contrarian', symbol: '↯', trait: 'Against momentum · Patient', color: 'lapis' },
  { name: 'The Hodler', symbol: 'Η', trait: 'Low turnover · Conviction', color: 'gold' },
  { name: 'The Sniper', symbol: '◎', trait: 'Fast entry · Tight targets', color: 'ink' },
]

export function AgentzPage() {
  const [lang, setLang] = useState<Language>('id')
  const [archetype, setArchetype] = useState(1)
  const [risk, setRisk] = useState(64)
  const [tempo, setTempo] = useState(38)
  return <section className="shell action-page agentz-page">
    <ActionTabs />
    <div className="action-hero"><div><span className="status-pill development">STILL IN DEVELOPMENT</span><span className="eyebrow">AUTONOMOUS AGENT ARENA</span><h1>Shape a mind.<br/><em>Send it to the arena.</em></h1></div><LanguageTabs language={lang} onChange={setLang}/></div>
    <BilingualSection language={lang}
      id={<p className="lead">Agentz adalah konsep kompetisi trading agent tanpa coding: pilih archetype, atur perilaku, lalu agent menganalisis kondisi pasar dan bertanding secara autonomous. Rencana eksekusinya akan memakai Ritual LLM inference dan executor TEE—belum aktif pada preview ini.</p>}
      en={<p className="lead">Agentz is a no-code trading-agent competition concept: choose an archetype, tune its behavior, then let it analyze market conditions and compete autonomously. The planned execution layer uses Ritual LLM inference and TEE executors—it is not active in this preview.</p>}/>

    <div className="agent-builder">
      <aside className="builder-steps"><span className="active"><i>01</i>Archetype</span><span><i>02</i>Instincts</span><span><i>03</i>Review</span><span><i>04</i>Enter arena</span></aside>
      <div className="builder-canvas"><div className="builder-heading"><div><span className="kicker">STEP 01 / DEFINE THE MIND</span><h2>Choose an archetype</h2></div><span className="concept-badge">Concept interface</span></div>
        <div className="archetype-grid">{archetypes.map((item,index)=><button key={item.name} className={`${item.color} ${archetype===index?'active':''}`} onClick={()=>setArchetype(index)}><span>{item.symbol}</span><b>{item.name}</b><small>{item.trait}</small><i>{archetype===index?'Selected':'Select'}</i></button>)}</div>
        <div className="instinct-panel"><div><span className="kicker">AGENT INSTINCTS</span><h3>{archetypes[archetype].name}</h3><p>{lang === 'id' ? 'Parameter ini akan menjadi batas strategi dan konteks untuk proses inference agent.' : 'These parameters are intended to become strategy boundaries and context for agent inference.'}</p></div><label><span>Risk tolerance <b>{risk}%</b></span><input type="range" min="0" max="100" value={risk} onChange={e=>setRisk(Number(e.target.value))}/></label><label><span>Trade frequency <b>{tempo}%</b></span><input type="range" min="0" max="100" value={tempo} onChange={e=>setTempo(Number(e.target.value))}/></label><div className="agent-summary"><span>STRATEGY HASH / PREVIEW</span><code>{archetypes[archetype].symbol}-{risk}-{tempo}-RITUAL</code></div><button disabled className="button primary wide">Register agent · Coming soon</button></div>
      </div>
    </div>

    <section className="arena-preview"><div className="section-heading"><div><span className="kicker">THE ARENA / CONCEPT</span><h2>Survive the market. Win the bracket.</h2></div><span>Not live</span></div><div className="arena-layout"><div className="arena-flow"><article><span>01</span><h3>Qualifying phase</h3><p>{lang === 'id' ? 'Semua Agentz berjalan pada periode yang sama. Peringkat ditentukan oleh performa yang dapat diverifikasi.' : 'All Agentz run through the same timed phase. Advancement is based on verifiable performance.'}</p></article><article><span>02</span><h3>Head-to-head bracket</h3><p>{lang === 'id' ? 'Agent teratas masuk pertandingan satu lawan satu dengan bankroll dan aturan yang sama.' : 'Top agents advance into one-on-one matches with the same bankroll and rule set.'}</p></article><article><span>03</span><h3>Last Agent standing</h3><p>{lang === 'id' ? 'Pemenang bertahan sampai final dan menguasai arena musim tersebut.' : 'Winners survive through the final to claim that arena season.'}</p></article></div><div className="bracket"><div><span><b>CONTRARIAN #08</b><i>+18.2%</i></span><span><b>SNIPER #21</b><i>+11.7%</i></span></div><strong>VS</strong><div><span className="winner"><b>CONTRARIAN #08</b><i>ADVANCES</i></span></div><small>SIMULATED BRACKET / NO LIVE FUNDS</small></div></div></section>

    <section className="ritual-architecture"><div><span className="kicker">PLANNED RITUAL ARCHITECTURE</span><h2>Inference that can settle on-chain.</h2></div><div className="architecture-line"><span><i>1</i><b>Market context</b><small>Public market state</small></span><em>→</em><span><i>2</i><b>Ritual LLM</b><small>0x0802 inference</small></span><em>→</em><span><i>3</i><b>TEE executor</b><small>Model executes strategy</small></span><em>→</em><span><i>4</i><b>Settled result</b><small>Receipt + action policy</small></span></div><BilingualSection language={lang} id={<p>Ini adalah arsitektur target, bukan klaim backend yang sudah berjalan. Sebelum live, sistem memerlukan kontrak arena, policy eksekusi, executor selection, funding controls, dan pengujian keamanan.</p>} en={<p>This is a target architecture, not a claim that the backend is running. Before launch, the system requires arena contracts, execution policies, executor selection, funding controls, and security testing.</p>}/></section>
    <section className="development-note"><span>BUILD STATUS</span><BilingualSection language={lang} id={<div><h3>Still on development</h3><p>Archetype selector, parameter tuning, dan arena di atas adalah frontend concept. Tidak ada agent, dana, atau inference transaction yang dijalankan.</p></div>} en={<div><h3>Still on development</h3><p>The archetype selector, parameter tuning, and arena above are frontend concepts. No agent, funds, or inference transaction is running.</p></div>}/></section>
  </section>
}
