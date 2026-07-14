import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Remove will-change which causes too many layers
content = content.replace('will-change-[transform,opacity]', '')

# Simplify the mouse move spotlight effect (it can be heavy)
# Just removing requestAnimationFrame overhead and sticking to simple css
# Actually, the spotlight uses radial-gradient on mouse move which repaints the element
# That repaint is very expensive on a card with a lot of shadows.
# Let's completely remove the JS mouse move spotlight and rely on CSS hover state for a simple spotlight

# Remove handleMouseMove
content = re.sub(r'  function handleMouseMove\(\{ clientX, clientY \}: React\.MouseEvent\) \{[\s\S]*?    \}\);\n  \}\n', '', content)
content = content.replace('onMouseMove={handleMouseMove}', '')

# Simplify hover effects to not use CSS variables
content = content.replace('var(--mouse-x, 0)', '50%')
content = content.replace('var(--mouse-y, 0)', '50%')

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Optimized layers")
