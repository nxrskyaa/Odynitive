import { NavLink } from 'react-router-dom'

const actions = [
  { to: '/actions/token', label: 'Token Launch', index: '01', status: 'Live' },
  { to: '/actions/nfts', label: 'NFTs', index: '02', status: 'In development' },
  { to: '/actions/agentz', label: 'Agentz', index: '03', status: 'In development' },
]

export function ActionTabs() {
  return <nav className="action-tabs" aria-label="Odynitive actions">
    {actions.map((action) => <NavLink key={action.to} to={action.to} className={({ isActive }) => isActive ? 'active' : ''}>
      <span className="action-index">{action.index}</span>
      <span><b>{action.label}</b><small>{action.status}</small></span>
    </NavLink>)}
  </nav>
}
