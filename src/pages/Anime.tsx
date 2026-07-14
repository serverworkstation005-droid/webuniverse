import DirectoryLayout from '@/src/components/DirectoryLayout';

export const ANIME_SECTIONS = [
  {
    title: 'Complete Otaku Universe: Anime, Toons & Manga',
    portals: [
    {
        name: 'AnimeRulzx',
        domain: 'animerulzx.net',
        description: 'High-quality anime streaming with dual audio and fast servers',
        url: 'https://animerulzx.net/',
        tags: ['Sub/Dub', 'Fast'],
    logo: '/logos/animerulz.png'
     },
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
  },
  {
    name: 'Kartoons',
    domain: 'kartoons.me',
    description: 'Anime & Toons Network',
    url: 'https://kartoons.me/home',
    tags: ['Anime', 'Toons'],
    logo: '/logos/kartoons.png'
  },

  {
    name: 'Enma',
    domain: 'www.enma.lol',
    description: 'Anime Network',
    url: 'https://www.enma.lol/',
    tags: ["Anime","Sub"],
    logo: '/logos/enma.png'},
  {
    name: 'Senpaiflix',
    domain: 'senpaiflix.fun',
    description: 'Anime Network',
    url: 'https://senpaiflix.fun/',
    tags: ["Anime","Sub"],
    logo: '/logos/senpaiflix.png'},
  {
    name: 'Animex',
    domain: 'animex.one',
    description: 'Anime Network',
    url: 'https://animex.one/home',
    tags: ["Anime","Sub"],
    logo: '/logos/animex.png'},
  {
    name: 'Voidanime',
    domain: 'www.voidanime.tech',
    description: 'Anime Network',
    url: 'https://www.voidanime.tech/home#/',
    tags: ["Anime","Sub"],
    logo: '/logos/voidanime.tech.png'},
  {
    name: 'Justanime',
    domain: 'justanime.to',
    description: 'Anime Network',
    url: 'https://justanime.to/',
    tags: ["Anime","Sub"],
    logo: '/logos/justanime.png'},
  {
    name: 'Ag48anime',
    domain: 'www.ag48anime.site',
    description: 'Anime Network',
    url: 'https://www.ag48anime.site/',
    tags: ["Anime","Sub"],
    logo: '/logos/ag48anime.png'},
  {
    name: 'Anikototv',
    domain: 'anikototv.to',
    description: 'Anime Network',
    url: 'https://anikototv.to/home',
    tags: ["Anime","Sub"],
    logo: '/logos/anikoto.png'},
  {
    name: 'Anidb',
    domain: 'anidb.app',
    description: 'Anime Network',
    url: 'https://anidb.app/home',
    tags: ["Anime","Sub"],
    logo: '/logos/AniDB.png'},
  {
    name: 'Anitaku',
    domain: 'anitaku.io',
    description: 'Anime Network',
    url: 'https://anitaku.io/browse/',
    tags: ["Anime","Sub"],
    logo: '/logos/anitaku.png'},
  {
    name: 'Lunaranime',
    domain: 'lunaranime.ru',
    description: 'Anime Network',
    url: 'https://lunaranime.ru/anime',
    tags: ["Anime","Sub"],
    logo: '/logos/Lunar.png'},
  {
    name: 'Allmanga',
    domain: 'allmanga.to',
    description: 'Anime Network',
    url: 'https://allmanga.to/',
    tags: ["Anime","Sub"],
    logo: '/logos/AllManga.png'},
  {
    name: 'Nexus',
    domain: 'anime.nexus',
    description: 'Anime Network',
    url: 'https://anime.nexus/',
    tags: ["Anime","Sub"],
    logo: '/logos/AnimeNexus.png'},
  {
    name: 'Miruro',
    domain: 'www.miruro.to',
    description: 'Anime Network',
    url: 'https://www.miruro.to/',
    tags: ["Anime","Sub"],
    logo: '/logos/MiruroTV.png'},
  {
    name: 'Kaa',
    domain: 'kaa.lt',
    description: 'Anime Network',
    url: 'https://kaa.lt/',
    tags: ["Anime","Sub"],
    logo: '/logos/kaa.it.png'},
  {
    name: 'Anistream',
    domain: 'anistream.one',
    description: 'Anime Network',
    url: 'https://anistream.one/home',
    tags: ["Anime","Sub"],
    logo: '/logos/AniStream.png'},
  {
    name: 'Fanime',
    domain: 'fanime.tv',
    description: 'Anime Network',
    url: 'https://fanime.tv/',
    tags: ["Anime","Sub"],
    logo: '/logos/FanimeTV.png'},
  {
    name: 'Animetsu',
    domain: 'animetsu.bz',
    description: 'Anime Network',
    url: 'https://animetsu.bz/',
    tags: ["Anime","Sub"],
    logo: '/logos/Animetsu.png'},
  {
    name: 'Toonstream',
    domain: 'toonstream.vip',
    description: 'Anime Network',
    url: 'https://toonstream.vip/home/',
    tags: ["Anime","Sub"],
    logo: '/logos/TOONSTREAM.png',
    type: 'Streaming'},
  {
    name: 'Animesalt',
    domain: 'animesalt.ac',
    description: 'Anime Network',
    url: 'https://animesalt.ac/',
    tags: ["Anime","Sub"],
    type: 'Streaming',
    logo: 'https://animesalt.ac/wp-content/uploads/AnimeSaltLong.png'},
  {
    name: 'Reanime',
    domain: 'reanime.to',
    description: 'Anime Network',
    url: 'https://reanime.to/home',
    tags: ["Anime","Sub"],
    logo: '/logos/reanime.png'},
  {
    name: 'Anikage',
    domain: 'anikage.cc',
    description: 'Anime Network',
    url: 'https://anikage.cc/home',
    tags: ["Anime","Sub"],
    logo: '/logos/anikage.png'},
  {
    name: 'Anidap',
    domain: 'anidap.se',
    description: 'Anime Network',
    url: 'https://anidap.se/home',
    tags: ["Anime","Sub"],
    logo: '/logos/Anidap.png'},
  {
    name: 'Animedekho',
    domain: 'animedekho.app',
    description: 'Anime Network',
    url: 'https://animedekho.app/home/',
    tags: ["Anime","Sub"],
    logo: '/logos/animedekho.png'},
  {
    name: 'Animelok',
    domain: 'animelok.net',
    description: 'Anime Network',
    url: 'https://animelok.net/',
    tags: ["Anime","Sub"],
    logo: '/logos/AnimeLok.png'},
  {
    name: 'Animepahe',
    domain: 'animepahe.pw',
    description: 'Anime Network',
    url: 'https://animepahe.pw/',
    tags: ["Anime","Sub"],
    logo: '/logos/AnimePahe.png'},
  {
    name: 'Aniwaves',
    domain: 'aniwaves.ru',
    description: 'Anime Network',
    url: 'https://aniwaves.ru/home',
    tags: ["Anime","Sub"],
    logo: '/logos/aniwave.png'},
  {
    name: 'Animesogo',
    domain: 'animesogo.to',
    description: 'Anime Network',
    url: 'https://animesogo.to/home',
    tags: ["Anime","Sub"],
    logo: '/logos/AnimeSOG.png'},
  {
    name: 'Animesuge',
    domain: 'animesuge.cz',
    description: 'Anime Network',
    url: 'https://animesuge.cz/',
    tags: ["Anime","Sub"],
    type: 'Streaming'},
  {
    name: 'Rareanimes',
    domain: 'www.rareanimes.mov',
    description: 'Anime Network',
    url: 'https://www.rareanimes.mov/',
    tags: ["Anime","Sub"],
    logo: '/logos/RareAnimesIndia.png'
  },
  {
    name: 'Anime Rulzx',
    domain: 'animerulzx.net',
    description: 'Anime Network',
    url: 'https://animerulzx.net/',
    tags: ["Anime","Sub"],
    type: 'Streaming',
    logo: '/logos/animerulz.png'
  },
  {
        name: 'Anime World',
        domain: 'watchanimeworld.net',
        description: 'Stream latest anime episodes with multiple source options',
        url: 'https://watchanimeworld.net/',
        tags: ['Ongoing', 'HD'],
        type: 'Streaming',
        logo: '/logos/AnimeWorld.png'},
  {
        name: 'AnimeFlix',
        domain: 'animeflix.dad',
        description: 'Stream high-quality anime with both sub and dub versions',
        url: 'https://animeflix.dad/',
        tags: ['Subbed', 'Dubbed'],
        type: 'Streaming',
        logo: '/logos/AnimeFlix.png'},
  {
        name: 'Anisuge',
        domain: 'anisuge.tv',
        description: 'Fast and reliable streaming portal for ongoing anime series',
        url: 'https://anisuge.tv/home',
        tags: ['Fast', 'Ongoing'],
        type: 'Streaming',
        logo: '/logos/Anisuge.tv.png'},
  {
        name: 'AniZone',
        domain: 'anizone.to',
        description: 'The go-to zone for watching trending anime in ultra HD',
        url: 'https://anizone.to/',
        tags: ['UHD', 'Trending'],
        type: 'Streaming',
        logo: '/logos/anizone.png'},
  {
        name: 'AniTaku',
        domain: 'anitaku.io',
        description: 'Massive database of anime shows available for free streaming',
        url: 'https://anitaku.io/',
        tags: ['Library', 'Sub/Dub'],
        type: 'Streaming',
        logo: '/logos/anitaku.png'},
  {
        name: 'Animetoon',
        domain: 'animetoon.in',
        description: 'Best place for dubbed animated series and classic cartoons',
        url: 'https://www.animetoon.in/',
        tags: ['Cartoons', 'Dubbed'],
        type: 'Streaming',
        logo: '/logos/AnimeToon.png'},
  {
        name: 'ToonWorld4All',
        domain: 'toonworld4all.me',
        description: 'All-in-one hub for cartoons, anime and animated series',
        url: 'https://toonworld4all.me/',
        tags: ['Animated', 'Dual Audio'],
        type: 'Streaming',
        logo: '/logos/Toonworld4all.png'},
  {
        name: 'RareAnimes',
        domain: 'rareanimes.buzz',
        description: 'Find exclusive dubbed anime and rare cartoon collections',
        url: 'https://www.rareanimes.buzz/',
        tags: ['Rare', 'Exclusive'],
        type: 'Streaming',
        logo: '/logos/RareAnimesIndia.png'},
  {
        name: 'PureToons',
        domain: 'puretoons.in',
        description: 'Clean and simple portal to watch kids cartoons and anime',
        url: 'https://puretoons.in/',
        tags: ['Kids', 'Clean'],
        type: 'Streaming',
        logo: '/logos/PureToons.png'},
  {
        name: 'WCOStream',
        domain: 'wcostream.tv',
        description: 'Legacy site for streaming cartoons and anime online',
        url: 'https://www.wcostream.tv/',
        tags: ['Classic', 'Toons'],
        type: 'Streaming',
        logo: '/logos/WCOStream.png'},
  {
        name: 'MangaDex',
        domain: 'mangadex.org',
        description: 'Open source and ad-free community for reading manga',
        url: 'https://mangadex.org/',
        tags: ['Manga', 'Ad-Free'],
        type: 'Reader',
        logo: '/logos/MangaDex.png'},
  {
        name: 'MangaFire',
        domain: 'mangafire.to',
        description: 'Ultra-fast reading platform for the latest manga chapters',
        url: 'https://mangafire.to/home',
        tags: ['Manga', 'HD'],
        type: 'Reader',
        logo: '/logos/MangaFire.to.png'},
  {
        name: 'Comix',
        domain: 'comix.to',
        description: 'Extensive repository for high-quality comics and manga',
        url: 'https://comix.to/',
        tags: ['Comics', 'Manga'],
        type: 'Reader',
        logo: '/logos/XComix.png'},
  {
        name: 'MangaGo',
        domain: 'mangago.me',
        description: 'Social platform for manga readers with a mobile-friendly site',
        url: 'https://mangago.me/',
        tags: ['Social', 'Manga'],
        type: 'Reader',
        logo: '/logos/mangago.png'},
  {
        name: 'Manganato',
        domain: 'manganato.gg',
        description: 'Huge archive of ongoing and completed manga titles',
        url: 'https://www.manganato.gg/',
        tags: ['Manga', 'Archive'],
        type: 'Reader',
        logo: '/logos/Manganato.png'},
  {
        name: 'Kagane',
        domain: 'kagane.org',
        description: 'Simple and fast manga reader with a minimalist design',
        url: 'https://kagane.org/',
        tags: ['Minimalist', 'Manga'],
        type: 'Reader',
        logo: '/logos/Kagane.png'}
    ]
  },
  {
    title: 'Global High-Speed Archives',
    portals: [
    {
        name: 'GokuHD',
        domain: 'gokuhd.com',
        description: 'High speed streaming platform for anime and TV shows',
        url: 'https://www.gokuhd.com/',
        tags: ['Speed', 'HD'],
        type: 'Streaming',
        logo: '/logos/GokuHD.png'},
  
  {
        name: 'AnimeNexus',
        domain: 'anime.nexus',
        description: 'Global network for watching the latest anime releases',
        url: 'https://anime.nexus/',
        tags: ['Global', 'HQ'],
        type: 'Streaming',
        logo: '/logos/AnimeNexus.png'},
  {
        name: 'AniWorld',
        domain: 'aniworld.to',
        description: 'Community hub for exploring the world of anime and shows',
        url: 'https://aniworld.to/',
        tags: ['Community', 'EU'],
        type: 'Streaming',
        logo: '/logos/AniWorld.png'}
    ]
  }
];

export default function Anime() {
  return (
    <DirectoryLayout
      title="Anime, Toons & Manga."
      subtitle="Entertainment"
      description="Direct access to dedicated anime portals, global animation archives, and massive manga libraries. Optimized for otaku universe."
      sections={ANIME_SECTIONS}
      categoryId="anime"
    />
  );
}

