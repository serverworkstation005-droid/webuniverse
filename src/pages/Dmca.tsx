import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, FileWarning, Search, Link2, MessageSquare } from 'lucide-react';

export default function Dmca() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="text-center mb-12 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4 text-white">DMCA Policy</h1>
        <p className="text-white/50 text-lg">Digital Millennium Copyright Act Notice & Takedown Procedure.</p>
      </motion.div>

      <div className="w-full max-w-4xl space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="bg-[#12121a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
            <h2 className="text-2xl font-bold">Copyright Statement</h2>
          </div>
          <p className="text-white/70 leading-relaxed mb-6">
            Universal Hub strictly operates as an indexing and directory service. <strong>We do not host, store, upload, or distribute any copyrighted materials (movies, software, anime, books, etc.) on our servers.</strong> We simply provide links to external third-party content that is already publicly available on the internet.
          </p>
          <p className="text-white/70 leading-relaxed">
            We highly respect the intellectual property rights of others. If you believe your copyrighted work has been linked or indexed inappropriately, you can submit a takedown request, and we will promptly remove the offending links.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
            className="bg-[#12121a]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
          >
            <FileWarning className="w-10 h-10 text-[#5A45FF] mb-4" />
            <h3 className="text-lg font-bold mb-2">Takedown Requirements</h3>
            <ul className="text-white/50 text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Identify the copyrighted work being infringed.</li>
              <li>Provide exact URLs of the infringing links.</li>
              <li>Include your contact info (Name, Email).</li>
              <li>A statement of good faith belief.</li>
              <li>A physical or electronic signature.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
            className="bg-[#12121a]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
          >
            <Search className="w-10 h-10 text-[#5A45FF] mb-4" />
            <h3 className="text-lg font-bold mb-2">Review Process</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Upon receiving a valid DMCA request, we will initiate an investigation. If the claim is verified, we will permanently remove the reported links or directory entries from our platform within 24-48 hours.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
               Please note that we cannot remove content from external third-party hosts.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="bg-[#12121a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 text-center"
        >
          <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Submit a Request</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            To file a notice of copyright infringement or to submit a complete DMCA request, please contact our administrative team via email. Ensure all required information is attached.
          </p>
          <a
             href="mailto:contact@universalhub.com"
             onClick={(e) => {
               e.preventDefault();
               window.dispatchEvent(new CustomEvent('open-contact-modal'));
             }}
             className="inline-flex items-center gap-2 bg-[#5A45FF] hover:bg-[#5A45FF]/80 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(90,69,255,0.4)]"
          >
             Contact Administrator
          </a>
        </motion.div>
      </div>
    </div>
  );
}
