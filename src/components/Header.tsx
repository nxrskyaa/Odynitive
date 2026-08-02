import { NavLink } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { WalletButton } from './WalletButton'

const navClass = ({ isActive }: { isActive: boolean }) => isActive ? 'active' : ''

export function Header() {
  return <header className="site-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <BrandMark />
    <nav className="primary-nav" aria-label="Primary navigation">
      <NavLink className={navClass} to="/">Discover</NavLink>
      <div className="nav-group">
        <NavLink className={({ isActive }) => isActive ? 'active action-trigger' : 'action-trigger'} to="/actions/token">Actions <span>⌄</span></NavLink>
        <div className="nav-popover" aria-label="Action menu">
          <NavLink to="/actions/token"><span>01</span><b>Token Launch</b><small>Live</small></NavLink>
          <NavLink to="/actions/nfts"><span>02</span><b>NFTs</b><small>In development</small></NavLink>
          <NavLink to="/actions/agentz"><span>03</span><b>Agentz</b><small>In development</small></NavLink>
        </div>
      </div>
      <NavLink className={navClass} to="/docs">Docs</NavLink>
      <NavLink className={navClass} to="/about">About</NavLink>
      <NavLink className={navClass} to="/updates">Updates</NavLink>
      <a className="odyvion-link" href="https://odyvion.vercel.app" target="_blank" rel="noreferrer">Odyvion <span>↗</span></a>
    </nav>
    <div className="header-wallet"><WalletButton /></div>
  </header>
}
