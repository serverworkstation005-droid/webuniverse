import re

files = ['src/components/DirectoryLayout.tsx', 'src/components/GlobalSearchModal.tsx']

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    content = content.replace('?v=4', '?v=5')
    
    with open(file, 'w') as f:
        f.write(content)

print("Cache busted")
