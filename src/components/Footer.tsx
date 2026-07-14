import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/10 dark:border-white/10 border-slate-900/10 px-6 md:px-12 flex flex-col gap-10 bg-[#04060f] dark:bg-[#04060f] light:bg-[#f1f5f9] relative z-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h3 className="text-white dark:text-white text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Web Universe</h3>
          <p className="text-white/40 dark:text-white/40 text-slate-600 text-[10px] leading-relaxed max-w-sm normal-case mb-6">
            The ultimate digital directory indexing the world's most premium resources. From 4K cinema to elite developer tools, we curate the web's finest content in one central universe.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <span className="text-white/70 dark:text-white/70 text-slate-800 font-black text-[9px] uppercase tracking-[0.2em] mb-2">Navigation</span>
          <a href="/" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Home</a>
          <a href="/movies" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Movies</a>
          <a href="/games" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Games</a>
          <a href="/software" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Software</a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-white/70 dark:text-white/70 text-slate-800 font-black text-[9px] uppercase tracking-[0.2em] mb-2">Resources</span>
          <a href="/tech" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Tech Tools</a>
          <a href="/anime" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Anime</a>
          <a href="/torrents" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Torrents</a>
          <a href="/typing" className="text-white/50 dark:text-white/50 text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-xs font-medium">Typing Tools</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full border-t border-white/5 dark:border-white/5 border-slate-900/10 pt-8 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-white/30 dark:text-white/30 text-slate-500">
        <div className="flex gap-8 items-center italic">
          <span>© {new Date().getFullYear()} Web Universe Directory</span>
          <span className="hidden md:inline text-indigo-500/50 dark:text-indigo-400/50">&copy; copyright by Fahim Ahmed</span>
        </div>
        <button
          onClick={scrollToTop}
          className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-1 group font-bold"
        >
          Back To Top <ArrowUp size={8} className="group-hover:-translate-y-0.5 transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
        </button>
      </div>
    </footer>
  );
}
