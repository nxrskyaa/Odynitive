import { Link } from 'react-router-dom'
export function BrandMark({ compact = false }: { compact?: boolean }) { return <Link className="brand" to="/" aria-label="Odynitive home"><img src="/odynitive-logo.jpg" alt="" /><span>ODYNITIVE</span>{!compact && <small>ON RITUAL</small>}</Link> }
