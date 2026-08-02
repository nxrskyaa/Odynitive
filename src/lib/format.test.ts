import { describe, expect, it } from 'vitest'
import { formatCompact, formatRitual, shortenAddress } from './format'

describe('format helpers', () => {
  it('shortens an EVM address without hiding its identity', () => expect(shortenAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234…5678'))
  it('formats native wei into a readable RITUAL amount', () => expect(formatRitual(12_345_600_000_000_000_000n)).toBe('12.3456'))
  it('uses compact notation for large market values', () => expect(formatCompact(1_250_000)).toBe('1.25M'))
})
