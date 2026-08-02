import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { PreviewBanner } from './components/PreviewBanner'
import { HomePage } from './pages/HomePage'
import { LaunchPage } from './pages/LaunchPage'
import { TokenPage } from './pages/TokenPage'
import { NftPage } from './pages/NftPage'
import { AgentzPage } from './pages/AgentzPage'
import { DocsPage } from './pages/DocsPage'
import { AboutPage } from './pages/AboutPage'
import { UpdatesPage } from './pages/UpdatesPage'
import { liveMode } from './lib/market'

function App() {
  return <div className="app-shell">
    <Header />
    {!liveMode && <PreviewBanner />}
    <main id="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/launch" element={<Navigate to="/actions/token" replace />} />
        <Route path="/actions" element={<Navigate to="/actions/token" replace />} />
        <Route path="/actions/token" element={<LaunchPage />} />
        <Route path="/actions/nfts" element={<NftPage />} />
        <Route path="/actions/agentz" element={<AgentzPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/token/:address" element={<TokenPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <footer><span>ODYNITIVE / RITUAL TESTNET</span><div><a href="/docs">Documentation</a><a href="https://odyvion.vercel.app" target="_blank" rel="noreferrer">Odyvion ↗</a><a href="https://github.com/nxrskyaa" target="_blank" rel="noreferrer">Built by nxrskyaa ↗</a></div></footer>
  </div>
}
export default App
