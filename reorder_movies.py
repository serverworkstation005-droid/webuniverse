import re

with open('src/pages/Movies.tsx', 'r') as f:
    content = f.read()

match = re.search(r'export const MOVIE_PROVIDERS = \[\s*(.*?)\s*\];\s*export default function Movies', content, re.DOTALL)
if not match:
    print("Could not find MOVIE_PROVIDERS array")
    exit(1)

array_content = match.group(1)

items = re.findall(r'(\{[^{}]*name:\s*\'([^\']+)\'[^{}]*\})', array_content, re.DOTALL)

order = [
    'tamiltvtoons',
    'extraflix',
    'movienestbd',
    'olamovies',
    'ddlbase',
    'zinkmovies',
    'cinemalux',
    'cinefreak',
    'mlsbd',
    'joya9tv',
    'cinedoze',
    'downloadhub',
    'southfreak'
]

items_dict = {}
for full, name in items:
    clean_name = name.lower().replace(' ', '').replace('-', '')
    items_dict[clean_name] = full

# We want everything before tamiltvtoons to stay the same.
# We want these ordered items to be placed right after the item before tamiltvtoons (which means starting at tamiltvtoons).
# But wait, tamiltvtoons is part of the order list. We can just insert them at the position of tamiltvtoons, and remove them from the rest of the list.

new_items = []
inserted = False

for full, name in items:
    clean_name = name.lower().replace(' ', '').replace('-', '')
    if clean_name == 'tamiltvtoons':
        # insert ordered items
        for ord_name in order:
            if ord_name in items_dict:
                new_items.append(items_dict[ord_name])
            else:
                print(f"Missing: {ord_name}")
        inserted = True
    elif clean_name not in order:
        new_items.append(full)

new_array_content = ',\n  '.join(new_items)
new_content = content.replace(array_content, new_array_content)

with open('src/pages/Movies.tsx', 'w') as f:
    f.write(new_content)

print("Done")
