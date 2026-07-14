const fs = require('fs');

const path = 'src/components/DirectoryLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

// The regex might not match exactly due to indentation
const phStart = content.indexOf('const Placeholder = useMemo(() => {');
const phEnd = content.indexOf('  }, [initials, categoryId]);', phStart) + 29;

const newPlaceholder = `  const Placeholder = useMemo(() => {
    // Premium dynamic mesh gradient fallback
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl group/placeholder"
      >
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a103c] via-[#09090b] to-[#1e102f] z-0" />
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25)_0%,transparent_50%)] animate-[spin_10s_linear_infinite]" />
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] opacity-30 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25)_0%,transparent_50%)] animate-[spin_15s_linear_infinite_reverse]" />
        
        {/* Inner glow & border */}
        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/5 rounded-2xl z-10" />

        {/* Text */}
        <div className="relative z-20 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black font-sans tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase select-none group-hover/placeholder:scale-110 transition-transform duration-500">
            {initials ? initials[0] : '?'}
          </span>
        </div>
      </motion.div>
    );
  }, [initials]);`;

content = content.substring(0, phStart) + newPlaceholder + content.substring(phEnd);

// Also remove `FallbackIcon` completely if it exists. Wait, FallbackIcon is not used anymore. We fixed that.

fs.writeFileSync(path, content);
console.log('Fixed Placeholder');
