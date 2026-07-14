import re

with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

bad_jsx = r'''\{\!isFailedAll && \(\s*<div className=\{`absolute inset-0 z-0 bg-white/5 rounded transition-opacity duration-500 ease-\[cubic-bezier\(0\.16,1,0\.3,1\)\] \$\{isLoaded \? \'opacity-0\' : \'opacity-100\'\}`\} />\s*<img\s+src=\{sources\[loadStep\]\}\s+alt=\{name\}\s+referrerPolicy="no-referrer"\s+onLoad=\{\(\) => setIsLoaded\(true\)\}\s+onError=\{handleNext\}\s+className=\{`w-full h-full object-contain relative z-10 transition-opacity duration-500 ease-\[cubic-bezier\(0\.16,1,0\.3,1\)\] filter drop-shadow-\[0_1\.5px_3px_rgba\(0,0,0,0\.15\)\] logo-img \$\{isLoaded \? \'opacity-100\' : \'opacity-0\'\}`\}\s*/>\s*\)\}'''

good_jsx = r'''{!isFailedAll && (
        <>
          <div className={`absolute inset-0 z-0 bg-white/5 rounded transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <img 
            src={sources[loadStep]}
            alt={name}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={handleNext}
            className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)] logo-img ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      )}'''

content = re.sub(bad_jsx, good_jsx, content, flags=re.MULTILINE | re.DOTALL)

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("Fixed syntax in GlobalSearchModal.tsx")
