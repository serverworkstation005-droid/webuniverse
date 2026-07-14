import re

with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('loading="lazy"', '')

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("Updated GlobalSearchModal.tsx for eager loading logos")
