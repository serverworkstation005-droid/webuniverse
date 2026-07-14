import re

with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

# Update SearchItemLogo to have a placeholder and fade
old_search_logo = r'<img \s+src=\{sources\[loadStep\]\}\s+alt=\{name\}\s+referrerPolicy="no-referrer"\s+onLoad=\{\(\) => setIsLoaded\(true\)\}\s+onError=\{handleNext\}\s+className=\{`w-full h-full object-contain relative z-10 transition-opacity duration-150 filter drop-shadow-\[0_1\.5px_3px_rgba\(0,0,0,0\.15\)\] logo-img \$\{isLoaded \? "opacity-100" : "opacity-0"\}`\}\s*/>'

new_search_logo = r'''<div className={`absolute inset-0 z-0 bg-white/5 rounded transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img 
          src={sources[loadStep]}
          alt={name}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleNext}
          className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)] logo-img ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />'''
content = re.sub(old_search_logo, new_search_logo, content)

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("Updated GlobalSearchModal.tsx")
