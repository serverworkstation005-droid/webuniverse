import re

# Optimize DirectoryLayout.tsx
with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# 1. Reduce complex shadow in Placeholder
content = content.replace('shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]', 'shadow-inner')
content = content.replace('drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]', 'drop-shadow-sm')

# 2. Reduce complex shadows in PortalCard
content = content.replace('shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)]', 'shadow-md')
content = content.replace('shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_12px_40px_rgba(0,0,0,0.6)]', 'shadow-lg')
content = content.replace('backdrop-blur-[40px]', 'backdrop-blur-md')
content = content.replace('backdrop-blur-xl', 'backdrop-blur-md')
content = content.replace('backdrop-blur-[32px]', 'backdrop-blur-md')
content = content.replace('backdrop-blur-[64px]', 'backdrop-blur-md')

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

# Optimize GlobalSearchModal.tsx
with open('src/components/GlobalSearchModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('backdrop-blur-[64px]', 'backdrop-blur-md')
content = content.replace('backdrop-blur-[32px]', 'backdrop-blur-sm')
content = content.replace('shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)]', 'shadow-2xl')
content = content.replace('drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)]', 'drop-shadow-sm')
content = content.replace('backdrop-blur-[40px]', 'backdrop-blur-md')

with open('src/components/GlobalSearchModal.tsx', 'w') as f:
    f.write(content)

print("Optimized styling")
