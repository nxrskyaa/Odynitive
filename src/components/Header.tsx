import { NavLink } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { WalletButton } from './WalletButton'
export function Header() { return <header className="site-header"><div className="shell header-inner"><BrandMark /><nav aria-label="Primary navigation"><NavLink to="/">Discover</NavLink><NavLink to="/launch">Launch</NavLink><a href="https://explorer.ritualfoundation.org" target="_blank" rel="noreferrer">Explorer ↗</a></nav><WalletButton /></div></header> }
