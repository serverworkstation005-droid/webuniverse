export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'streaming',
    title: 'Streaming',
    description: 'Ultra-fast portals for 4K cinema and live streaming with zero interruptions.',
    icon: 'MonitorPlay',
    color: 'from-blue-500/20 to-indigo-500/20',
    link: '/streaming'
  },
  {
    id: 'movies',
    title: 'Movies & Shows',
    description: 'Your gateway to the latest blockbusters and complete series archives in high definition.',
    icon: 'Clapperboard',
    color: 'from-purple-500/20 to-pink-500/20',
    link: '/movies'
  },
  {
    id: 'games',
    title: 'Games Universe',
    description: 'A massive multi-platform archive of AAA titles, retro ROMs, and indie masterpieces.',
    icon: 'Gamepad2',
    color: 'from-emerald-500/20 to-teal-500/20',
    link: '/games'
  },
  {
    id: 'torrents',
    title: 'Torrent Universe',
    description: 'Harness the power of P2P with the web\'s most trusted decentralized file networks.',
    icon: 'Magnet',
    color: 'from-orange-500/20 to-red-500/20',
    link: '/torrents'
  },
  {
    id: 'anime',
    title: 'Anime, Toons & Manga',
    description: 'An endless collection of trending anime series, nostalgic toons, and legendary manga chapters.',
    icon: 'Sparkles',
    color: 'from-pink-500/20 to-rose-500/20',
    link: '/anime'
  },
  {
    id: 'software_apks',
    title: 'Software, APKs & OS',
    description: 'Premium tools for every platform—from professional desktop suites to optimized mobile APKs.',
    icon: 'Package',
    color: 'from-cyan-500/20 to-blue-500/20',
    link: '/software'
  },
  {
    id: 'books',
    title: 'Knowledge & Learning Hub',
    description: 'Unlock a boundless vault of knowledge featuring global academic papers and rare digital volumes.',
    icon: 'Library',
    color: 'from-amber-500/20 to-orange-500/20',
    link: '/books'
  },
  {
    id: 'typing',
    title: 'Typing Tools',
    description: 'Ascend the ranks of elite typists with hyper-responsive trainers and competitive speed tests.',
    icon: 'Keyboard',
    color: 'from-rose-500/20 to-pink-500/20',
    link: '/typing'
  },
  {
    id: 'tech',
    title: 'Tech Utilities',
    description: 'A powerhouse of essential developer kits, web diagnostics, and tactical digital tools.',
    icon: 'Zap',
    color: 'from-sky-500/20 to-blue-500/20',
    link: '/tech'
  }
];
