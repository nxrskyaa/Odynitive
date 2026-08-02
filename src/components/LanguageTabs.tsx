import type { ReactNode } from 'react'

export type Language = 'id' | 'en'

export function LanguageTabs({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  return <div className="language-tabs" role="tablist" aria-label="Language / Bahasa">
    <button role="tab" aria-selected={language === 'id'} className={language === 'id' ? 'active' : ''} onClick={() => onChange('id')}>ID <span>Indonesia</span></button>
    <button role="tab" aria-selected={language === 'en'} className={language === 'en' ? 'active' : ''} onClick={() => onChange('en')}>EN <span>English</span></button>
  </div>
}

export function BilingualSection({ language, id, en }: { language: Language; id: ReactNode; en: ReactNode }) {
  return <div className="language-panel" role="tabpanel">{language === 'id' ? id : en}</div>
}
