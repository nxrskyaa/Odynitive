import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreviewBanner } from './PreviewBanner'

describe('PreviewBanner', () => {
  it('clearly labels non-live data and explains activation', () => {
    render(<PreviewBanner />)
    expect(screen.getByText(/Preview mode/i)).toBeVisible()
    expect(screen.getByText(/VITE_FACTORY_ADDRESS/i)).toBeVisible()
  })
})
