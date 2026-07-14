import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# 1. Update PortalCard animations (Apple-like smooth wave)
old_variants = r'      variants=\{\{\s*hidden: \{ opacity: 0, scale: 0\.9, y: 30 \},\s*visible: \{ \s*opacity: 1, \s*scale: 1,\s*y: 0,\s*transition: \{ type: "spring", stiffness: 85, damping: 15, mass: 1, delay: \(index % 15\) \* 0\.06 \}\s*\}\s*\}\}'
new_variants = r'''      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20, filter: 'blur(4px)' },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 15) * 0.04 }
        }
      }}'''
content = re.sub(old_variants, new_variants, content)

# 2. Update whileHover and whileTap
old_hover = r'whileHover=\{\{ scale: 1\.03, y: -6, zIndex: 50, transition: \{ type: "spring", stiffness: 150, damping: 22, mass: 0\.8 \} \}\}'
new_hover = r'whileHover={{ scale: 1.02, y: -4, zIndex: 50, transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 } }}'
content = re.sub(old_hover, new_hover, content)

old_tap = r'whileTap=\{\{ scale: 0\.98, transition: \{ type: "spring", stiffness: 150, damping: 15, mass: 1 \} \}\}'
new_tap = r'whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 25, mass: 1 } }}'
content = re.sub(old_tap, new_tap, content)


# 3. Update PortalLogo to have placeholder-then-fade
old_logo = r'<img\s+key=\{displayUrl\}\s+src=\{displayUrl\}\s+alt=\{name\}\s+referrerPolicy="no-referrer"\s+decoding="async"\s+onError=\{handleError\}\s+onLoad=\{handleLoad\}\s+style=\{\{\s*\.\.\.getSmartFitStyles\("logo"\) \}\}\s+className=\{`w-full h-full max-w-full max-h-full relative z-10 \$\{isLoaded \? \'\' : \'pointer-events-none\'\}`\}\s*/>'
new_logo = r'''<div className="absolute inset-0 z-0 bg-white/5 rounded-xl transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: isLoaded ? 0 : 1 }} />
            <img
              key={displayUrl}
              src={displayUrl}
              alt={name}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={handleError}
              onLoad={handleLoad}
              style={{
                ...getSmartFitStyles("logo") }}
              className={`w-full h-full max-w-full max-h-full relative z-10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />'''
content = re.sub(old_logo, new_logo, content)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Updated DirectoryLayout.tsx")
