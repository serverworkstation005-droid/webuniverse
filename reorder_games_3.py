import re

with open('src/pages/Games.tsx', 'r') as f:
    content = f.read()

# find the GAMES_PORTALS array
match = re.search(r'export const GAMES_PORTALS = \[\s*(.*?)\s*\];\s*export default function Games', content, re.DOTALL)
if not match:
    print("Could not find GAMES_PORTALS array")
    exit(1)

array_content = match.group(1)

# split by { ... },
# a naive split
items = re.findall(r'(\{[^{}]*name:\s*\'([^\']+)\'[^{}]*\})', array_content, re.DOTALL)

items_dict = {name.lower().replace('-', '').replace(' ', ''): full_match for full_match, name in items}

order_names = [
    'repacklab',
    'worldofpcgames',
    'gamedrive',
    'astralgames',
    'goggames',
    'steamunlocked',
    'steamunderground',
    'steamora',
    'steamrip',
    'steamgg',
    'gamesleech',
    'ovagames',
    '4fnet',
    'repackgames',
    'elamigos',
    'dodirepacks',
    'fitgirlrepacks',
    'glitchify',
    'thedarkgames'
]

ordered_items = []
for name in order_names:
    if name in items_dict:
        ordered_items.append(items_dict[name])
    else:
        print(f"Not found: {name}")

# Now build the new array.
# Keep everything before Cracked Games in place.
# Everything after FitGirl Repacks/the-dark-games that is not in order_names.
new_items = []
after_cracked = False
for full_match, name in items:
    clean_name = name.lower().replace('-', '').replace(' ', '')
    
    if clean_name == 'crackedgames':
        new_items.append(full_match)
        # insert the ordered items here
        for i in ordered_items:
            if i not in new_items:
                new_items.append(i)
        after_cracked = True
    elif clean_name not in order_names:
        if full_match not in new_items:
            new_items.append(full_match)

new_array_content = ',\n  '.join(new_items)
new_content = content.replace(array_content, new_array_content)

with open('src/pages/Games.tsx', 'w') as f:
    f.write(new_content)

print("Done")
