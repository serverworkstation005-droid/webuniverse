import re

with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'list\.push\(logoUrl\);',
    r'list.push(logoUrl.startsWith("/logos/") ? logoUrl + "?v=4" : logoUrl);',
    content
)

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("GlobalSearchModal.tsx updated")
