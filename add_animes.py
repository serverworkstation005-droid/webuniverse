import re

with open('src/pages/Anime.tsx', 'r') as f:
    content = f.read()

new_items = """
  {
    name: 'PirateXPlay',
    domain: 'piratexplay.cc',
    description: 'Anime Network',
    url: 'https://piratexplay.cc/home',
    tags: ['Anime', 'Streaming'],
    logo: '/logos/piratexplay.png'
  },
  {
    name: 'AnimeJoker',
    domain: 'animejoker.com',
    description: 'Anime Network',
    url: 'https://animejoker.com/',
    tags: ['Anime', 'Streaming'],
    logo: '/logos/animejoker.png'
  },
  {
    name: 'DesiDubAnime',
    domain: 'desidubanime.me',
    description: 'Anime Network',
    url: 'https://www.desidubanime.me/',
    tags: ['Anime', 'Hindi Dubbed'],
    logo: '/logos/desidubanime.png'
  },
  {
    name: 'AnimeDubHindi',
    domain: 'animedubhindi.link',
    description: 'Anime Network',
    url: 'https://www.animedubhindi.link/',
    tags: ['Anime', 'Hindi Dubbed'],
    logo: '/logos/animedubhindi.png'
  },
  {
    name: 'Animoye',
    domain: 'animoye.com',
    description: 'Anime Network',
    url: 'https://animoye.com/',
    tags: ['Anime', 'Streaming'],
    logo: '/logos/animoye.png'
  },
  {
    name: 'ToonHub4u',
    domain: 'toonhub4u.co',
    description: 'Anime Network',
    url: 'https://toonhub4u.co/home/',
    tags: ['Anime', 'Toons'],
    logo: '/logos/toonhub4u.png'
  },
  {
    name: '1XAnimes',
    domain: '1xanimes.com',
    description: 'Anime Network',
    url: 'https://1xanimes.com/',
    tags: ['Anime', 'Streaming'],
    logo: '/logos/1xanimes.png'
  },"""

# Insert after AnimeRulzx
match = re.search(r'(name:\s*\'AnimeRulzx\'.*?\},)', content, re.DOTALL)
if match:
    full_match = match.group(1)
    new_content = content.replace(full_match, full_match + new_items)
    with open('src/pages/Anime.tsx', 'w') as f:
        f.write(new_content)
    print("Added successfully")
else:
    print("AnimeRulzx not found")
