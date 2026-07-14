import re
with open('src/pages/Movies.tsx', 'r') as f:
    content = f.read()

match = re.search(r'export const MOVIE_PROVIDERS = \[\s*(.*?)\s*\];\s*export default function Movies', content, re.DOTALL)
array_content = match.group(1)
items = re.findall(r'name:\s*\'([^\']+)\'', array_content, re.DOTALL)

for i, name in enumerate(items):
    print(f"{i}. {name}")
