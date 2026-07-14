import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Replace list.push(localLogoUrl) with list.push(localLogoUrl + "?v=4")
content = re.sub(
    r'list\.push\(localLogoUrl\);',
    r'list.push(localLogoUrl + "?v=4");',
    content
)

# Replace list.push(customLogo) with list.push(customLogo + "?v=4")
content = re.sub(
    r'list\.push\(customLogo\);',
    r'list.push(customLogo.startsWith("/logos/") ? customLogo + "?v=4" : customLogo);',
    content
)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("DirectoryLayout.tsx updated")
