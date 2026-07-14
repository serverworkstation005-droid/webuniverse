/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import React, { useEffect, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import MagneticController from "./components/MagneticController";
import ContactModal from "./components/ContactModal";
import Dashboard from "./pages/Dashboard";
import SmartSearch from "./pages/SmartSearch";
import Request from "./pages/Request";
import DeveloperPage from "./pages/DeveloperPage";
import About from "./pages/About";
import Dmca from "./pages/Dmca";

import Navbar from "./components/Navbar";
import ScrollNav from "./components/ScrollNav";
import MouseGlow from "./components/MouseGlow";

// Lazy loaded heavy components
const GlobalSearchModal = React.lazy(
  () => import("./components/GlobalSearchModal"),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.15, ease: "easeOut" } }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<SmartSearch />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request" element={<Request />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dmca" element={<Dmca />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1e1e1e",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)" } }}
        />
        <ScrollToTop />
        <MouseGlow />
        <MagneticController />
        <Suspense fallback={null}>
          <GlobalSearchModal />
        </Suspense>
        <ContactModal />
        <div className="min-h-screen w-full relative transition-colors duration-[950ms] selection:bg-blue-500/30 selection:text-blue-200 text-white dark isolate">
          <Navbar />
          <AnimatedRoutes />
          <ScrollNav />
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
