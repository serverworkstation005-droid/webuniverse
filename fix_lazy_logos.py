import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Change shouldLoad to always true
content = re.sub(
    r'const shouldLoad = priority \|\| isInView \|\| isLoaded \|\| !!persistedDataUrl;',
    r'const shouldLoad = true;',
    content
)

# Change motion.img to standard img without animation (or just remove the animation props)
# We can just change motion.img to a regular img tag and remove initial/animate/exit/transition
# Also remove loading="lazy"

old_img_regex = r'<motion\.img\s+key=\{displayUrl\}\s+initial=\{\{\s*opacity:\s*0\s*\}\}\s+animate=\{\{\s*opacity:\s*isLoaded\s*\?\s*1\s*:\s*0\s*\}\}\s+exit=\{\{\s*opacity:\s*0\s*\}\}\s+transition=\{\{\s*duration:\s*0\.15\s*\}\}'
new_img_start = r'<img\n              key={displayUrl}'

content = re.sub(old_img_regex, new_img_start, content, flags=re.MULTILINE | re.DOTALL)

# Remove loading="lazy"
content = re.sub(r'loading="lazy"\n\s*decoding="async"', r'decoding="async"', content)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Updated DirectoryLayout.tsx for eager loading logos")
