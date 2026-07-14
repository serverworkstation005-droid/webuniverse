import re

with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

# The current img tag:
#         <img 
#           src={sources[loadStep]}
#           alt={name}
#           referrerPolicy="no-referrer"
#           loading="lazy"
#           onLoad={() => setIsLoaded(true)}
#           onError={handleNext}
#           className={`w-full h-full object-contain relative z-10 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)] logo-img ${
#             isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
#           }`}
#         />

content = re.sub(
    r'className=\{`w-full h-full object-contain relative z-10 transition-all duration-\[950ms\].*?\}`\}',
    r'className={`w-full h-full object-contain relative z-10 transition-opacity duration-150 filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)] logo-img ${isLoaded ? "opacity-100" : "opacity-0"}`}',
    content,
    flags=re.DOTALL
)

# And remove the loading shimmer from SearchItemLogo
shimmer_regex = r'\{\(isFailedAll \|\| !isLoaded\) && \(\s*<div className="absolute inset-0 z-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 border border-indigo-500/10 text-indigo-400 overflow-hidden">\s*<div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-\[shimmer_3s_infinite\] pointer-events-none" />\s*<div className="relative z-10 scale-95 animate-pulse">\s*\{getIcon\(category\)\}\s*</div>\s*</div>\s*\)\}'

content = re.sub(shimmer_regex, '', content, flags=re.MULTILINE | re.DOTALL)

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("Updated GlobalSearchModal.tsx for faster logo")
