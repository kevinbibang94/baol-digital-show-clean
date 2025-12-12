import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import Header from "./components/Header"
import Breadcrumb from "./components/Breadcrumb"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import PageTransition from "./components/PageTransition"

import Home from "./pages/Home"
import Programme from "./pages/Programme"
import Intervenants from "./pages/Intervenants"
import Contact from "./pages/Contact"

export default function App() {
  const location = useLocation()

  return (
    <div className="bg-slate-950 text-slate-100 overflow-x-hidden">
      <Header />
      <Breadcrumb />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/programme" element={<PageTransition><Programme /></PageTransition>} />
            <Route path="/intervenants" element={<PageTransition><Intervenants /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
