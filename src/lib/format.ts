import { formatEther } from 'viem'

export function shortenAddress(value?: string) {
  if (!value) return '—'
  return value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value
}
export function formatRitual(value: bigint) {
  return Number(formatEther(value)).toLocaleString('en-US', { maximumFractionDigits: 4 })
}
export function formatCompact(value: number) {
  return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)
}
export function timeAgo(timestamp: number | bigint) {
  const milliseconds = Number(timestamp) * 1_000
  const minutes = Math.max(1, Math.floor((Date.now() - milliseconds) / 60_000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`
}
