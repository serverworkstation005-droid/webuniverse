import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# I will replace the new_img_render part I just inserted.
old_img_regex = r"<motion\.img\s+key=\{displayUrl\}\s+initial=\{\{\s*opacity:\s*0,\s*scale:\s*0\.95,\s*filter:\s*'blur\(8px\)'\s*\}\}.*?className=\{`w-full h-full max-w-full max-h-full relative z-10 \$\{isLoaded \? '' : 'pointer-events-none'\}`\}\s*/>\s*<AnimatePresence>\s*\{!isLoaded && \(\s*<motion\.div\s+key=\"loading-placeholder\".*?\{Placeholder\}\s*</motion\.div>\s*\)\}\s*</AnimatePresence>"

new_img_render = """
            <motion.img
              key={displayUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
"""

content = re.sub(old_img_regex, new_img_render.strip(), content, flags=re.MULTILINE | re.DOTALL)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Updated DirectoryLayout.tsx for faster logo")
