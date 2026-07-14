import re

with open('src/pages/Games.tsx', 'r') as f:
    content = f.read()

# find the GAMES_PORTALS array
match = re.search(r'export const GAMES_PORTALS = \[\s*(.*?)\s*\];\s*export default function Games', content, re.DOTALL)
if not match:
    print("Could not find GAMES_PORTALS array")
    exit(1)

array_content = match.group(1)

items = re.findall(r'(\{[^{}]*name:\s*\'([^\']+)\'[^{}]*\})', array_content, re.DOTALL)

ocean_idx = -1
axekin_idx = -1
for i, (full, name) in enumerate(items):
    if name == 'Ocean of Games':
        ocean_idx = i
    if name == 'Axekin':
        axekin_idx = i

if ocean_idx == -1 or axekin_idx == -1:
    print("Missing items")
    exit(1)

# we want to take everything from axekin_idx to the end, and put it after ocean_idx
to_move = items[axekin_idx:]
remaining = items[:axekin_idx]

# now insert to_move after ocean_idx
new_items = remaining[:ocean_idx+1] + to_move + remaining[ocean_idx+1:]

new_array_content = ',\n  '.join(i[0] for i in new_items)
new_content = content.replace(array_content, new_array_content)

with open('src/pages/Games.tsx', 'w') as f:
    f.write(new_content)

print("Done")
