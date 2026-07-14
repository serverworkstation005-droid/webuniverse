import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('will-change-[transform,opacity]', '')

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/index.css', 'r') as f:
    css_content = f.read()

# CSS will-change could also be harmful if applied globally to many elements
# Removing all will-change from index.css
css_content = re.sub(r'will-change:[^;]+;', '', css_content)

with open('src/index.css', 'w') as f:
    f.write(css_content)

print("Optimized Dashboard and CSS layers")
