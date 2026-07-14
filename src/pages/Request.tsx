import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Send, CheckCircle2, XCircle, Link as LinkIcon, Tag, LayoutGrid, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Request() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Movies/TV');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) {
      toast.error('Please provide at least a URL and Site Name.');
      return;
    }

    const body = `Site URL: ${url}
Site Name: ${name}
Category: ${category}
Why should we add it: ${reason}`;

    const mailto = `mailto:fahimahmedpc@gmail.com?subject=New Site Request: ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    
    toast.success('Opening your email client...');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="text-center mb-16 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-6 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent pb-2">
          Request a Site
        </h1>
        <p className="text-white/50 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
          Help us grow the ultimate digital collection.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start relative isolate">
        {/* Glows */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="lg:col-span-7 bg-[#12121a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-white">Submit your request</h2>
            <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">
              Verification Route
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-wider">
                <LinkIcon size={16} className="text-indigo-400" />
                Site URL
              </label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/20 text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-wider">
                <Tag size={16} className="text-indigo-400" />
                Site Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Awesome Streaming Site"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/20 text-lg"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-wider">
                <LayoutGrid size={16} className="text-indigo-400" />
                Category
              </label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none text-lg cursor-pointer"
                >
                  <option value="Movies/TV" className="bg-[#12121a]">Movies/TV</option>
                  <option value="Streaming" className="bg-[#12121a]">Streaming</option>
                  <option value="Anime" className="bg-[#12121a]">Anime</option>
                  <option value="Games" className="bg-[#12121a]">Games</option>
                  <option value="Software" className="bg-[#12121a]">Software</option>
                  <option value="Torrent" className="bg-[#12121a]">Torrent</option>
                  <option value="Typing" className="bg-[#12121a]">Typing</option>
                  <option value="Tech Tools" className="bg-[#12121a]">Tech Tools</option>
                  <option value="Learning" className="bg-[#12121a]">Learning</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/80 uppercase tracking-wider">
                <MessageSquare size={16} className="text-indigo-400" />
                Why should we add it?
              </label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us what makes this site special... (large library, fast streaming, mobile-friendly, etc.)"
                rows={4}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/20 resize-none text-lg"
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="group relative w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] overflow-hidden isolate"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
                <Send size={20} className="relative z-10" />
                <span className="relative z-10 uppercase tracking-widest">Submit Request</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Guidelines Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="bg-[#12121a]/60 backdrop-blur-3xl border border-emerald-500/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            
            <h3 className="flex items-center gap-3 text-emerald-400 font-bold mb-8 text-xl tracking-tight">
              <CheckCircle2 size={24} />
              Acceptance Rules
            </h3>
            <ul className="space-y-5">
              {[
                'Quality working websites',
                'Rich and diverse contents',
                'Easy to navigate UI',
                'Mobile device ready',
                'Ad-free or minimal ads'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-base text-white/80 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#12121a]/60 backdrop-blur-3xl border border-rose-500/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_0_30px_rgba(244,63,94,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
            
            <h3 className="flex items-center gap-3 text-rose-400 font-bold mb-8 text-xl tracking-tight">
              <XCircle size={24} />
              Refusal Criteria
            </h3>
            <ul className="space-y-5">
              {[
                'Links that no longer work',
                'Websites with annoying popups',
                'Suspected deceptive platforms',
                'Fully paid content without trials'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-base text-white/80 font-medium">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
