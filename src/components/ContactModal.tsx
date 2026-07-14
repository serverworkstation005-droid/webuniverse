import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const MAX_CHARS = 500;

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-contact-modal', handleOpen);
    return () => window.removeEventListener('open-contact-modal', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setSubmitted(false);
          setSubject('');
          setMessage('');
        }, 500); // Reset after close
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 100 }}
            className="relative w-full max-w-lg bg-[#12121a] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Send a Message</h3>
                  <p className="text-sm text-white/50">I'll get back to you as soon as possible.</p>
                </div>
              </div>
              <button 
                onClick={() => !isSubmitting && setIsOpen(false)}
                className="relative z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-2">
                    <Send className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Message Sent!</h4>
                  <p className="text-white/60">Thank you for reaching out. I'll be in touch soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">Name</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all outline-none ring-0"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">Email</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all outline-none ring-0"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50 pl-1">Subject</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all outline-none ring-0"
                        placeholder="Project Inquiry"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end pl-1 pr-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Message</label>
                      <span className={cn("text-[10px] font-mono", message.length > MAX_CHARS * 0.9 ? "text-rose-400" : "text-white/30")}>
                        {message.length} / {MAX_CHARS}
                      </span>
                    </div>
                    <div className="relative">
                      <textarea 
                        required
                        rows={4}
                        value={message}
                        maxLength={MAX_CHARS}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all resize-none outline-none ring-0 focus:ring-0"
                        placeholder="Your message here..."
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-[950ms]",
                        isSubmitting 
                          ? "bg-indigo-500/50 text-white/50 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                      )}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
