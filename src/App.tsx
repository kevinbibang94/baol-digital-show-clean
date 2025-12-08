import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Breadcrumb from './components/Breadcrumb'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Programme from './pages/Programme'
import Intervenants from './pages/Intervenants'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-950 text-slate-100 overflow-x-hidden">
        <Header />
        <Breadcrumb />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/intervenants" element={<Intervenants />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <ScrollToTop />
      </div>
    </BrowserRouter>
  )
}
