import re

with open('src/data/searchResources.ts', 'r') as f:
    text = f.read()

# We can find all blocks `{ ... }`
# A block starts with `{` at the beginning of a line with indentation `  {`
# and ends with `  }` or `  },`
# So we can match them using `r'  \{\n(?:.*?\n)*?  \},?'`

blocks = re.findall(r'  \{\n(?:.*?\n)*?  \},?', text)

# Now we categorize them
xd_domain = "top.xdmovies.wtf"
move_domains = [
    "cinefreak.nl",
    "mlsbd.co",
    "joya9tv1.com",
    "cinedoze.tv",
    "southfreak.fyi",
    "moviebaaz.cfd",
    "moviedokan.co",
    "moviedrivebd.com",
    "freedrivemovie.cfd",
    "fojik.site",
    "movienestbd.pics",
    "go.india4movies.net",
    "a.privatemoviez.surf",
    "new1.hdhub4u.cl"
]

def get_domain(block):
    m = re.search(r'domain:\s*["\']([^"\']+)["\']', block)
    return m.group(1).strip() if m else None

xd_block = None
move_blocks_dict = {}
other_blocks = []

for b in blocks:
    d = get_domain(b)
    if d == xd_domain:
        xd_block = b
    elif d in move_domains:
        move_blocks_dict[d] = b
    else:
        other_blocks.append(b)

# Construct new array contents
new_blocks = []
xd_index = -1

# We will put other_blocks in their original order, 
# and insert the move_domains right after xd_domain.
for i, b in enumerate(other_blocks):
    # wait, xd_block isn't in other_blocks.
    pass

# Actually, let's keep the order of everything that is not in move_domains.
# But where does xd_block go? Where it currently is among the remaining elements.
new_blocks_base = []
for b in blocks:
    d = get_domain(b)
    if d not in move_domains:
        new_blocks_base.append(b)

# Now find where xd_block is in new_blocks_base
final_blocks = []
for b in new_blocks_base:
    final_blocks.append(b)
    if get_domain(b) == xd_domain:
        # Append the move blocks in requested order
        for md in move_domains:
            if md in move_blocks_dict:
                # Ensure it has a comma if it's not the last one, but we can fix commas later.
                final_blocks.append(move_blocks_dict[md])

# Fix commas: all except last should end with `,`
for i in range(len(final_blocks)):
    final_blocks[i] = final_blocks[i].rstrip(",\n")
    if i < len(final_blocks) - 1:
        final_blocks[i] += ",\n"
    else:
        final_blocks[i] += "\n"

# Replace in file
# We'll just split text before the first block and after the last block
first_block_idx = text.find(blocks[0])
last_block_idx = text.find(blocks[-1]) + len(blocks[-1])

new_text = text[:first_block_idx] + "".join(final_blocks) + text[last_block_idx:]

with open('src/data/searchResources.ts', 'w') as f:
    f.write(new_text)

