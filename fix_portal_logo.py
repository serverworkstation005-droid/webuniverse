import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Replace the img tag rendering
new_img_render = """
            <motion.img
              key={displayUrl}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95, filter: isLoaded ? 'blur(0px)' : 'blur(8px)' }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src={displayUrl}
              alt={name}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={handleError}
              onLoad={handleLoad}
              style={{
                ...getSmartFitStyles("logo") }}
              className={`w-full h-full max-w-full max-h-full relative z-10 ${isLoaded ? '' : 'pointer-events-none'}`}
            />
            
            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  key="loading-placeholder"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-0 flex items-center justify-center transform-gpu"
                >
                  {Placeholder}
                </motion.div>
              )}
            </AnimatePresence>
"""

# Find the current motion.img block and replace it
# It looks like:
#             <motion.img
#               key={displayUrl}
#               initial={{ opacity: 1 }}
#               animate={{ opacity: 1 }}
#               exit={{ opacity: 1 }}
#               transition={{ duration: 0 }}
#               src={displayUrl}
#               alt={name}
#               referrerPolicy="no-referrer"
#               loading="lazy"
#               decoding="async"
#               onError={handleError}
#               onLoad={handleLoad}
#               style={{
#                 ...getSmartFitStyles("logo") }}
#               className={`w-full h-full max-w-full max-h-full relative z-10`}
#             />

old_img_regex = r"<motion\.img\s+key=\{displayUrl\}\s+initial=\{\{\s*opacity:\s*1\s*\}\}\s+animate=\{\{\s*opacity:\s*1\s*\}\}\s+exit=\{\{\s*opacity:\s*1\s*\}\}\s+transition=\{\{\s*duration:\s*0\s*\}\}\s+src=\{displayUrl\}\s+alt=\{name\}\s+referrerPolicy=\"no-referrer\"\s+loading=\"lazy\"\s+decoding=\"async\"\s+onError=\{handleError\}\s+onLoad=\{handleLoad\}\s+style=\{\{\s*\.\.\.getSmartFitStyles\(\"logo\"\)\s*\}\}\s+className=\{`w-full h-full max-w-full max-h-full relative z-10`\}\s*/>"

content = re.sub(old_img_regex, new_img_render.strip(), content, flags=re.MULTILINE)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)
print("Updated DirectoryLayout.tsx")
