import DirectoryLayout from '@/src/components/DirectoryLayout';

export const TORRENT_PORTALS = [
  {
    name: 'LimeTorrents',
    domain: 'limetorrents.fun',
    description: 'Clean and simple directory for finding verified torrents',
    url: 'https://www.limetorrents.fun/',
    tags: ['Verified', 'Simple'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=limetorrents.fun&sz=128'
  },
  {
    name: 'YTS',
    domain: 'yts.bz',
    description: 'The official home for downloading high-quality YIFY movies',
    url: 'https://yts.bz/',
    tags: ['Movies', 'HD'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=yts.bz&sz=128'
  },
  {
    name: 'EZTV',
    domain: 'eztvx.to',
    description: 'Specialized hub for the latest TV series releases and updates',
    url: 'https://eztvx.to/home',
    tags: ['TV Shows', 'Updates'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=eztvx.to&sz=128'
  },
  {
    name: 'TorrentGalaxy',
    domain: 'torrentgalaxy.one',
    description: 'Community-driven tracker with interactive social features',
    url: 'https://torrentgalaxy.one/',
    tags: ['Community', 'Streaming'],
    type: 'Tracker',
    logo: '/logos/torrentgalaxy.png'
  },
  {
    name: 'ExtraTorrent',
    domain: 'en.extratorrent-official.is',
    description: 'A revived legacy platform for downloading general torrents',
    url: 'https://en.extratorrent-official.is/home',
    tags: ['Legacy', 'General'],
    type: 'Tracker',
    logo: '/logos/extratorrent.png'
  },
  {
    name: 'Ext.to',
    domain: 'ext.to',
    description: 'Modern and fast search index for finding verified torrents',
    url: 'https://ext.to/',
    tags: ['Modern', 'Speed'],
    type: 'Index',
    logo: '/logos/ext.png'
  },
  {
    name: 'RARGB',
    domain: 'rargb.to',
    description: 'Clean interface for finding high-quality scene releases',
    url: 'https://rargb.to/',
    tags: ['High Quality', 'Scene'],
    type: 'Tracker',
    logo: '/logos/rarbg.png'
  },
  {
    name: 'The Pirate Bay',
    domain: 'thepiratebay.org',
    description: "The world's most resilient and famous torrent site",
    url: 'https://thepiratebay.org/index.html',
    tags: ['Galaxy', 'Resilient'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=thepiratebay.org&sz=128'
  },
  {
    name: 'Kickass Torrents',
    domain: 'thekickasstorrents.com',
    description: 'Community-driven library with a huge collection of torrents',
    url: 'https://www3.thekickasstorrents.com/',
    tags: ['Verified', 'Universal'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=thekickasstorrents.com&sz=128'
  },
  {
    name: 'Nyaa',
    domain: 'nyaa.si',
    description: 'The best public tracker for anime and eastern media',
    url: 'https://nyaa.si/',
    tags: ['Anime', 'Eastern'],
    type: 'Tracker',
    logo: 'https://www.google.com/s2/favicons?domain=nyaa.si&sz=128'
  },
  {
    name: 'FitGirl Repacks',
    domain: 'fitgirl-repacks.site',
    description: 'The most trusted source for compressed game repacks',
    url: 'https://fitgirl-repacks.site/',
    tags: ['Games', 'Repacks'],
    type: 'Direct',
    logo: '/logos/fitgirl-repacks.png'
  },
  {
    name: 'BitSearch',
    domain: 'bitsearch.eu',
    description: 'Ultra-fast, clean and lightweight search indexing over 17 million verified torrent files',
    url: 'https://bitsearch.eu/',
    tags: ['Verified', 'Clean UI'],
    type: 'Search',
    logo: 'https://www.google.com/s2/favicons?domain=bitsearch.eu&sz=128'
  }
];

export default function Torrents() {
  return (
    <DirectoryLayout
      title="Torrent Universe."
      subtitle="P2P Networks"
      description="Access the most reliable BitTorrent portals and P2P archives. High-speed protocols for direct decentralized transfers."
      portals={TORRENT_PORTALS}
      categoryId="torrents"
    />
  );
}
