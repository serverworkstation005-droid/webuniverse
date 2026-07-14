import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Make sure PortalLogo has a fixed aspect ratio container or its parent does
# Currently PortalLogo returns a div with "w-full h-full relative..."
# It's inside a flex container. We can enforce `aspect-video` or similar if needed, but it already has `w-full h-full`.

# The user mentioned: "logo card appear wave animation arro smooth kore dao apple er moto smoothness"
# We can make the initial render variants smoother.

old_variants = r'''variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20,  },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          
          transition: { duration: 0.6, ease: \[0\.16, 1, 0\.3, 1\], delay: \(index % 15\) \* 0\.02 \}
        }
      }}'''

new_variants = r'''variants={{
        hidden: { opacity: 0, scale: 0.98, y: 15 },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 200, damping: 25, mass: 0.8, delay: (index % 15) * 0.03 }
        }
      }}'''
content = re.sub(old_variants, new_variants, content)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Updated wave animation")
