const fs = require('fs');

let code = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

// Replace handleSearchChange with Debounce
const debounceImplement = `  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    startTransition(() => {
      searchTimeoutRef.current = setTimeout(() => {
        setSearchQuery(val);
      }, 150);
    });
  }, []);`;

code = code.replace(/const handleSearchChange = useCallback\(\(e: React\.ChangeEvent<HTMLInputElement>\) => {[\s\S]*?}, \[\]\);/ || /const handleSearchChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => {[\s\S]*?};/, debounceImplement);

// In case the replacement failed because it doesn't match perfectly, using a more generic approach:
code = code.replace(/const handleSearchChange[\s\S]*?setSearchQuery.*?}[\s\S]*?\};?/, debounceImplement);

// Update PortalCard to have an onSelect prop, aspect-[2/3]
const targetCard = /const PortalCard = memo\(function PortalCard[\s\S]*? className="group relative block gpu-layer will-change-\[transform,opacity\] w-full">((?:.|\\n)*?)<\/motion\.div>\n\);\n\}\);/g;

code = code.replace(/const PortalCard = memo\(function PortalCard[\s\S]*?className="group relative block gpu-layer will-change-\[transform,opacity\] w-full">[\s\S]*?<\/motion\.div>\n\);\n\}\);/, `const PortalCard = memo(function PortalCard({ portal, categoryId, onSelect }: { portal: Portal; categoryId: string; onSelect: (p: Portal) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block w-full will-change-[transform,opacity] transform-gpu"
    >
      {isInView ? (
        <div
          onClick={(e) => { e.preventDefault(); onSelect(portal); }}
          className="aspect-[2/3] block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 active:scale-[0.97] will-change-transform cursor-pointer w-full transform-gpu"
        >
          <div className="glass-card rounded-[22px] p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-3 group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border-white/[0.08] relative isolate bg-[#080810]/40 backdrop-blur-3xl hover:bg-[#0a0a16]/80 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] h-full overflow-hidden transform-gpu translate-z-0">
            <div className="absolute top-2.5 right-2.5 text-white/10 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 pointer-events-none">
               <ExternalLink size={12} strokeWidth={3} />
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative shrink-0">
              <PortalLogo domain={portal.domain} name={portal.name} categoryId={categoryId} customLogo={portal.logo} />
            </div>

            <div className="min-w-0 w-full flex flex-col items-center mt-2">
              <h3 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-300 truncate w-full uppercase">
                {portal.name}
              </h3>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40 truncate w-full group-hover:text-white/60 transition-colors">
                {portal.domain}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card aspect-[2/3] rounded-[22px] p-3.5 sm:p-5 flex flex-col items-center justify-center text-center border-white/[0.08] animate-pulse w-full h-full">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 shrink-0" />
        </div>
      )}
    </motion.div>
  );
});`);

// Insert selectedPortal state
code = code.replace('const [isInputFocused, setIsInputFocused] = useState(false);', `const [isInputFocused, setIsInputFocused] = useState(false);\n  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);\n\n  useEffect(() => {\n    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedPortal(null); };\n    window.addEventListener("keydown", handleKey);\n    return () => window.removeEventListener("keydown", handleKey);\n  }, []);`);

const mainMapRegex = /<PortalCard key=\{portal\.name\} portal=\{portal\} categoryId=\{categoryId\} \/>/g;
code = code.replace(mainMapRegex, '<PortalCard key={portal.name} portal={portal} categoryId={categoryId} onSelect={setSelectedPortal} />');

const contextSheet = `
      {/* Premium Multi-Dimensional Context Sheet */}
      <AnimatePresence>
        {selectedPortal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedPortal(null)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setSelectedPortal(null);
              }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-[#0a0a0f]/90 border-t border-white/10 backdrop-blur-[40px] rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10 max-h-[90vh] overflow-y-auto will-change-transform translate-z-0 overscroll-none"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />
              
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start max-w-4xl mx-auto">
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-4">
                  <PortalLogo domain={selectedPortal.domain} name={selectedPortal.name} categoryId={categoryId} customLogo={selectedPortal.logo} />
                </div>
                
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                    {selectedPortal.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 text-white/70 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-2">{selectedPortal.name}</h2>
                  <p className="text-sm sm:text-base text-white/50 font-mono mb-6 max-w-xl leading-relaxed">{selectedPortal.description}</p>
                  
                  {/* Premium Quality Links / Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-auto">
                    <a href={selectedPortal.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-colors active:scale-[0.98]">
                      LAUNCH
                      <ExternalLink size={16} />
                    </a>
                    <a href={selectedPortal.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors active:scale-[0.98]">
                      4K UHD PREMIUM
                    </a>
                    <a href={selectedPortal.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors active:scale-[0.98]">
                      MAGNET TORRENT
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// replace the last two `</div>\n  );\n}` basically
let lastReturnIndex = code.lastIndexOf('</div>');
if (lastReturnIndex !== -1) {
  let outerLastIndex = code.lastIndexOf('</div>', lastReturnIndex - 1);
  if (outerLastIndex !== -1) {
     code = code.substring(0, outerLastIndex) + contextSheet;
  }
}

fs.writeFileSync('src/components/DirectoryLayout.tsx', code);
