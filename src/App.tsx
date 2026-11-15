import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProgressProvider } from './lib/progress'
import { Home } from './pages/Home'
import { Learn } from './pages/Learn'
import { Track } from './pages/Track'
import { LessonPage } from './pages/LessonPage'
import { Cases } from './pages/Cases'
import { CaseDetail } from './pages/CaseDetail'
import { Glossary } from './pages/Glossary'
import { Dashboard } from './pages/Dashboard'
import { Resources } from './pages/Resources'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:level" element={<Track />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/progress" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ProgressProvider>
    </HashRouter>
  )
}
