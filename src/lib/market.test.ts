import { describe, expect, it } from 'vitest'
import { adaptMarket, calculateProgress, isFactoryConfigured, normalizeWeb3Error } from './market'

describe('market domain', () => {
  it('adapts the factory tuple to a named market', () => {
    const market = adaptMarket(['0x1234567890abcdef1234567890abcdef12345678','0xabcdefabcdefabcdefabcdefabcdefabcdefabcd','Thalassa','THAL','Tides made liquid.','ipfs://thalassa','https://thalassa.example','https://x.com/thalassa',10n,20n,30n,40n,50n,60n,70n,true] as const)
    expect(market).toMatchObject({ name: 'Thalassa', symbol: 'THAL', active: true, realRitualReserve: 30n })
  })
  it('bounds curve progress between zero and one hundred', () => {
    expect(calculateProgress(0n, 100n)).toBe(0)
    expect(calculateProgress(125n, 100n)).toBe(100)
  })
  it('only enables live mode for a valid nonzero address', () => {
    expect(isFactoryConfigured(undefined)).toBe(false)
    expect(isFactoryConfigured('0x0000000000000000000000000000000000000000')).toBe(false)
    expect(isFactoryConfigured('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
  })
  it('turns wallet rejection into useful copy', () => expect(normalizeWeb3Error(new Error('User rejected the request.'))).toBe('Request cancelled in your wallet.'))
})
