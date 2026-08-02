import { NavLink } from 'react-router-dom'

const actions = [
  { to: '/actions/token', label: 'Token Launch', index: '01', status: 'Live', external: false },
  { to: '/actions/nfts', label: 'NFTs', index: '02', status: 'In development', external: false },
  { to: '/actions/agentz', label: 'Agentz', index: '03', status: 'In development', external: false },
  { to: 'https://odyvion.vercel.app', label: 'Odyvion', index: '04', status: 'GameFi · Live', external: true },
]

export function ActionTabs() {
  return <nav className="action-tabs" aria-label="Odynitive products">
    {actions.map((action) => action.external
      ? <a key={action.to} href={action.to} target="_blank" rel="noreferrer">
          <span className="action-index">{action.index}</span>
          <span><b>{action.label}</b><small>{action.status} ↗</small></span>
        </a>
      : <NavLink key={action.to} to={action.to} className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="action-index">{action.index}</span>
          <span><b>{action.label}</b><small>{action.status}</small></span>
        </NavLink>)}
  </nav>
}
