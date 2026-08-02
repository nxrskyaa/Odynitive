import { useState } from 'react'
import { ActionTabs } from '../components/ActionTabs'
import { LanguageTabs, type Language } from '../components/LanguageTabs'
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { odynitiveFactoryAbi } from '../contracts/odynitiveAbi'
import { explorerUrl, ritual } from '../lib/chain'
import { factoryAddress, liveMode, normalizeWeb3Error } from '../lib/market'
import type { Address } from 'viem'

const initial = { name: '', symbol: '', description: '', imageURI: '', website: '', social: '' }

export function LaunchPage() {
  const [form, setForm] = useState(initial)
  const [lang, setLang] = useState<Language>('id')
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash })
  const valid = form.name.trim() && form.symbol.trim() && form.description.trim() && form.imageURI.trim()
  const configuredFactory = factoryAddress as Address
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: event.target.value })

  const launch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!liveMode || !valid) return
    writeContract({ address: configuredFactory, abi: odynitiveFactoryAbi, functionName: 'launchToken', args: [form.name.trim(), form.symbol.trim().toUpperCase(), form.description.trim(), form.imageURI.trim(), form.website.trim(), form.social.trim()] })
  }

  const disabledReason = !liveMode ? 'Deploy and configure the factory to enable launches.' : !isConnected ? 'Connect a wallet to launch.' : chainId !== ritual.id ? 'Switch to Ritual before launching.' : !valid ? 'Complete the required fields.' : ''

  return <section className="shell launch-page action-page">
    <ActionTabs />
    <div className="action-hero compact"><div><span className="status-pill live">LIVE ON RITUAL TESTNET</span><span className="eyebrow">TOKEN LAUNCHPAD</span><h1>Launch something<br/><em>worth finding.</em></h1><p>{lang === 'id' ? 'Satu miliar token dengan suplai tetap. Pasar langsung aktif. Tanpa presale yang membingungkan.' : 'One billion fixed-supply tokens. An instantly active market. No presale maze.'}</p></div><LanguageTabs language={lang} onChange={setLang}/></div>
    <div className="launch-layout">
      <form className="launch-form panel" onSubmit={launch}>
        <div className="form-section-title"><span>01</span><div><h2>Token identity</h2><p>The essentials shown across the agora.</p></div></div>
        <div className="field-grid"><label>Name *<input maxLength={64} value={form.name} onChange={set('name')} placeholder="e.g. Marble Signal" /></label><label>Symbol *<input maxLength={16} value={form.symbol} onChange={set('symbol')} placeholder="MRBL" /></label></div>
        <label>Description *<textarea maxLength={512} rows={4} value={form.description} onChange={set('description')} placeholder="What is this token setting in motion?"/><small>{form.description.length}/512</small></label>
        <div className="form-section-title"><span>02</span><div><h2>Image & links</h2><p>Use an IPFS or public HTTPS image.</p></div></div>
        <label>Image URI *<input maxLength={256} value={form.imageURI} onChange={set('imageURI')} placeholder="ipfs://… or https://…" /></label>
        <div className="field-grid"><label>Website<input maxLength={256} value={form.website} onChange={set('website')} placeholder="https://" /></label><label>Social<input maxLength={256} value={form.social} onChange={set('social')} placeholder="https://x.com/" /></label></div>
        <div className="launch-summary"><div><span>Supply</span><b>1,000,000,000</b></div><div><span>Trade fee</span><b>1.5%</b></div><div><span>Launch cost</span><b>Gas only</b></div></div>
        <button className="button primary wide" disabled={Boolean(disabledReason) || isPending || receipt.isLoading}>{isPending ? 'Confirm in wallet…' : receipt.isLoading ? 'Setting it in motion…' : 'Launch token ↗'}</button>
        {disabledReason && <p className="form-note">{disabledReason}</p>}
        {error && <p className="form-error">{normalizeWeb3Error(error)}</p>}
        {receipt.isSuccess && hash && <div className="success-box"><b>Token launched.</b><span>The market is now live on Ritual.</span><a href={`${explorerUrl}/tx/${hash}`} target="_blank" rel="noreferrer">View transaction ↗</a></div>}
      </form>
      <aside className="launch-preview"><span className="kicker">LIVE PREVIEW</span><div className="preview-token panel"><div className="preview-image">{form.imageURI ? <img src={form.imageURI} alt=""/> : <span>{form.symbol.slice(0,2) || 'O'}</span>}</div><div className="token-symbol">{form.symbol.toUpperCase() || 'TOKEN'}</div><h2>{form.name || 'Untitled token'}</h2><p>{form.description || 'A short, concrete description will make this easier to discover.'}</p><div className="preview-line"><span>Starting price</span><b>0.00001 RITUAL</b></div><div className="preview-line"><span>Network</span><b>Ritual · 1979</b></div></div><a href="/" className="text-link">← Back to discover</a></aside>
    </div>
  </section>
}
