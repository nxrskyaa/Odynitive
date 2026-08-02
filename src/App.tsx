import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { PreviewBanner } from './components/PreviewBanner'
import { HomePage } from './pages/HomePage'
import { LaunchPage } from './pages/LaunchPage'
import { TokenPage } from './pages/TokenPage'
import { liveMode } from './lib/market'

export function App() {
  return <div className="app-shell">
    <Header />
    {!liveMode && <PreviewBanner />}
    <main><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/launch" element={<LaunchPage />} />
      <Route path="/token/:address" element={<TokenPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></main>
    <footer><div className="shell footer-inner"><span>ODYNITIVE / RITUAL TESTNET</span><span>Built by <a href="https://github.com/nxrskyaa">nxrskyaa</a></span></div></footer>
  </div>
}
