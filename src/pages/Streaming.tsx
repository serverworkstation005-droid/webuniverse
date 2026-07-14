import DirectoryLayout from '@/src/components/DirectoryLayout';

export const STREAMING_PROVIDERS = [
  // Tier 1: Premium, No Ads, Outstanding Interfaces & Top Quality
  {
    name: 'Flixer',
    domain: 'flixer.su',
    description: 'Most Popular • Buffering-free Engine',
    url: 'https://flixer.su/',
    tags: ['No Ads', 'HD', 'Trending'],
    type: 'Streaming',
    logo: '/logos/skyflixer.png'
  },
  {
    name: 'FlixHub',
    domain: 'flixhub.aniflix.uno',
    description: 'Extensive movie and series streaming catalog',
    url: 'https://flixhub.aniflix.uno/',
    tags: ['HD', 'Movies', 'Series'],
    type: 'Streaming',
    logo: '/logos/flixhub.png'
  },
  {
    name: 'ScreenScape',
    domain: 'screenscape.me',
    description: 'Ultimate cinematic escape with seamless playback',
    url: 'https://screenscape.me/',
    tags: ['Movies', 'Shows', 'HD'],
    type: 'Streaming',
    logo: '/logos/screenscape.png'
  },
  {
    name: 'CineHub',
    domain: 'cinehub.one',
    description: 'Premier Zero-Ad Sanctuary • Smooth 1080p Engine',
    url: 'https://cinehub.one/',
    tags: ['No Ads', 'HD Player', 'Aesthetic'],
    type: 'Streaming',
    logo: 'https://cinehub.one/cinehub-logo2.svg'
  },
  {
    name: 'RiveStream',
    domain: 'rivestream.app',
    description: 'State-of-the-art PWA • Ultra Modern UI',
    url: 'https://www.rivestream.app/',
    tags: ['Modern UI', 'PWA', 'Fast'],
    type: 'Streaming',
    logo: '/logos/rivestream.png'
  },
  {
    name: 'Nepu',
    domain: 'nepu.to',
    description: 'Minimalist Layout • Zero Intrusive Ads',
    url: 'https://nepu.to/',
    tags: ['No Ads', 'Minimalist', 'HD'],
    type: 'Streaming',
    logo: '/logos/RarToNepu.png'
  },
  {
    name: 'Cineby TV',
    domain: 'cinebytv.com',
    description: 'Perfect Companion Client • Premium Media Vault',
    url: 'https://cinebytv.com/',
    tags: ['Premium UI', 'HD Streams', 'Sleek'],
    type: 'Streaming',
    logo: '/logos/CINEBYTV.png'
  },
  {
    name: 'Cineby',
    domain: 'cineby.app',
    description: 'Premium Netflix Style Layout',
    url: 'https://www.cineby.app/',
    tags: ['Modern UI', 'Fast', 'Featured'],
    type: 'Streaming',
    logo: '/logos/Cineby.png'
  },
  {
    name: 'RedFlix',
    domain: 'redflix.co',
    description: 'Netflix-Style Dashboard • Instant Playback Speeds',
    url: 'https://redflix.co/',
    tags: ['Modern UI', 'Fast', 'Trending'],
    type: 'Streaming',
    logo: '/logos/REDFLIX.png'
  },
  {
    name: 'CineVibe',
    domain: 'cinevibe.to',
    description: 'Immersive Catalog Layout • Incredible Curation',
    url: 'https://cinevibe.to/',
    tags: ['High-speed', 'No Ads', 'Curated'],
    type: 'Streaming',
    logo: '/logos/Cine Vibe.png'
  },
  {
    name: 'Streamr',
    domain: 'streamr.pages.dev',
    description: 'Sleek Serverless Front-end • Buttery Smooth PWA',
    url: 'https://streamr.pages.dev/',
    tags: ['Clean UI', 'PWA', 'Zero Ads'],
    type: 'Streaming',
    logo: '/logos/Streamr.png'
  },
  {
    name: 'Flixzy',
    domain: 'flixzy.pages.dev',
    description: 'Gorgeous Glassmorphic Layout • Highly Fluid UX',
    url: 'https://flixzy.pages.dev/',
    tags: ['Glassmorphism', 'Lightweight', 'Minimalist'],
    type: 'Streaming',
    logo: '/logos/FlixZy.png'
  },
  {
    name: 'FlickerMini',
    domain: 'flickermini.pages.dev',
    description: 'Ultra-Minimal Mobile Optimized Pocket Cinema',
    url: 'https://flickermini.pages.dev/',
    tags: ['Minimalist', 'Responsive', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/Flicker.png'
  },
  {
    name: 'KaitoVault',
    domain: 'kaitovault.com',
    description: 'Majestic Virtual Vault for Movies, Series & Anime',
    url: 'https://www.kaitovault.com/',
    tags: ['Rich Library', 'HD Content', 'Aesthetic'],
    type: 'Streaming',
    logo: '/logos/Kaitovault.png'
  },
  {
    name: 'Showbox',
    domain: 'showbox.media',
    description: 'The Ultimate High-end Media Experience',
    url: 'https://www.showbox.media/',
    tags: ['Premium', 'Trending', 'UHD'],
    type: 'Streaming',
    logo: '/logos/SHOWBOX.png'
  },
  {
    name: 'Aurora Screen',
    domain: 'aurorascreen.org',
    description: 'Aesthetic Interface • High Bitrate CDN',
    url: 'https://www.aurorascreen.org/',
    tags: ['Aesthetic', '4K', 'Smooth'],
    type: 'Streaming',
    logo: '/logos/Aurorascreen.png'
  },
  {
    name: 'Popcorn Movies',
    domain: 'popcornmovies.org',
    description: 'Dynamic Slider Design • Direct Multi-server Links',
    url: 'https://popcornmovies.org/home',
    tags: ['Modern Grid', 'Multi-server', 'HD'],
    type: 'Streaming',
    logo: '/logos/PopcornMovies.png'
  },
  {
    name: 'BingeBox',
    domain: 'bingebox.to',
    description: 'Curated Playlists • Lightning Fast Stream Hub',
    url: 'https://bingebox.to/',
    tags: ['HD', 'New Releases', 'Fast'],
    type: 'Streaming',
    logo: '/logos/BingeBox.png'
  },
  {
    name: 'WatchFlix',
    domain: 'watchflix.to',
    description: 'Sleek Autoplay Player • Pure Cinematic Motion',
    url: 'https://watchflix.to/',
    tags: ['Sleek', 'UHD', 'Auto-next'],
    type: 'Streaming',
    logo: '/logos/WatchFlix.png'
  },
  {
    name: 'Cinegram',
    domain: 'cinegram.tv',
    description: 'Infinite Scroll Video Catalog • Beautiful Experience',
    url: 'https://cinegram.tv/home',
    tags: ['Clean UI', 'Fluid Layout', 'Fast'],
    type: 'Streaming',
    logo: '/logos/Cinegram.png'
  },

  // Tier 2: Highly Reliable, Vast Catalog & Solid Performing Databases
  {
    name: 'BingeFlix',
    domain: 'bingeflix.tv',
    description: 'Dedicated TV Show & Movie Relay • Direct Player',
    url: 'https://bingeflix.tv/',
    tags: ['Dual Playback', 'HD', 'Trending'],
    type: 'Streaming',
    logo: '/logos/Bingeflix.png'
  },
  {
    name: 'SkyFlixer',
    domain: 'skyflixer.fun',
    description: 'Premium Streaming Portal • Comprehensive Indexes',
    url: 'https://skyflixer.fun/browse',
    tags: ['HD', 'Movies', 'Global'],
    type: 'Streaming',
    logo: '/logos/skyflixer.png'
  },
  {
    name: 'LordFlix',
    domain: 'lordflix.org',
    description: 'Vast Database • Clean Mirror Network',
    url: 'https://lordflix.org/',
    tags: ['Daily Updates', 'Fast CDN'],
    type: 'Streaming',
    logo: 'https://www.google.com/s2/favicons?domain=lordflix.org&sz=128'
  },
  {
    name: 'RidoMovies',
    domain: 'ridomovies.is',
    description: 'No-ads Native Player Option • Multi-mirrors',
    url: 'https://ridomovies.is/home-rd1',
    tags: ['Multi-server', 'HD', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/RidoMovies.png'
  },
  {
    name: 'VibeMax',
    domain: 'vibemax.to',
    description: 'Full Featured High-Performance Content Hub',
    url: 'https://vibemax.to/',
    tags: ['Vast Library', 'HD Streams'],
    type: 'Streaming',
    logo: '/logos/VibeMax.png'
  },
  {
    name: 'Flixvo',
    domain: 'flixvo.live',
    description: 'Sleek Layout with Advanced Server Handshakes',
    url: 'https://flixvo.live/',
    tags: ['Interactive', 'Multi-mirrors'],
    type: 'Streaming',
    logo: '/logos/Flixvo.png'
  },
  {
    name: 'OnoFlix',
    domain: 'onoflix.live',
    description: 'Global Multilingual Media Stream Repository',
    url: 'https://onoflix.live/en',
    tags: ['Multilingual', 'Advanced CDN'],
    type: 'Streaming',
    logo: '/logos/Onoflix.png'
  },
  {
    name: 'StreamGoblin',
    domain: 'streamgoblin.com',
    description: 'Lightning-Fast Search Matrices & Direct Video Playback',
    url: 'https://streamgoblin.com/',
    tags: ['Fast Stream', 'HD Archive'],
    type: 'Streaming',
    logo: '/logos/StreamGoblin.png'
  },
  {
    name: 'FluxTV',
    domain: 'fluxtv.qzz.io',
    description: 'Decentralized Community Portal • Instant Loading',
    url: 'https://fluxtv.qzz.io/',
    tags: ['Decentralized', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/FluxTV.png'
  },
  {
    name: 'WarFlix',
    domain: 'warflix.nl',
    description: 'Dutch-optimized Premium Theater Server Nodes',
    url: 'https://warflix.nl/home',
    tags: ['Premium CDN', 'HD Video'],
    type: 'Streaming',
    logo: '/logos/Warflix.png'
  },
  {
    name: 'MovieBite',
    domain: 'moviebite.cc',
    description: 'Instant Streaming Access • Zero Delay Buffering',
    url: 'https://moviebite.cc/',
    tags: ['Minimalist UI', 'Fast Loading'],
    type: 'Streaming',
    logo: '/logos/moviebite.png'
  },
  {
    name: 'AZMovies',
    domain: 'azmovies.to',
    description: 'Excellent Backup Directory • Highly Reliable',
    url: 'https://azmovies.to/',
    tags: ['Classic', 'HD archive'],
    type: 'Streaming',
    logo: '/logos/AZMovies.png'
  },
  {
    name: 'Vyla',
    domain: 'vyla.pages.dev',
    description: 'Minimal Fluid Frontend • Highly Experimental',
    url: 'https://vyla.pages.dev/',
    tags: ['Glassmorphic', 'Lightweight'],
    type: 'Streaming',
    logo: 'https://www.google.com/s2/favicons?domain=vyla.pages.dev&sz=128'
  },
  {
    name: 'FireFlix HD',
    domain: 'fireflixhd.vercel.app',
    description: 'Serverless Direct Link Player • Light & Snappy',
    url: 'https://fireflixhd.vercel.app/',
    tags: ['Lightweight', 'No Ads', 'Fast'],
    type: 'Streaming',
    logo: '/logos/FireFlix.png'
  },
  {
    name: 'Cinezo',
    domain: 'cinezo.net',
    description: 'Immersive Dark Cinematic Canvas',
    url: 'https://www.cinezo.net/',
    tags: ['Immersive', 'Aesthetic'],
    type: 'Streaming',
    logo: '/logos/Cinezo.png'
  },
  {
    name: 'Donkey',
    domain: 'donkey.to',
    description: 'Versatile Streaming Engine with Multi-audio options',
    url: 'https://donkey.to/',
    tags: ['Movies', 'Specialty'],
    type: 'Streaming',
    logo: '/logos/DONKEY.png'
  },
  {
    name: 'Cinebolt',
    domain: 'cinebolt.net',
    description: 'Instant Streaming Handshakes • Low Latency',
    url: 'https://cinebolt.org/',
    tags: ['Fast Loading', 'Movies'],
    type: 'Streaming',
    logo: '/logos/CineBolt.png'
  },
  {
    name: 'CinemaOS',
    domain: 'cinemaos.live',
    description: 'Advanced Interactive Desktop Environment Interface',
    url: 'https://cinemaos.live/',
    tags: ['Interactive OS', 'Futuristic'],
    type: 'Streaming',
    logo: '/logos/CinemaOS.png'
  },
  {
    name: '345Movie',
    domain: '345movie.nl',
    description: 'Curated Dutch & Global High-fidelity Server',
    url: 'https://345movie.nl/home',
    tags: ['Movies', 'HD Stream'],
    type: 'Streaming',
    logo: '/logos/345movie.png'
  },
  {
    name: '1Shows',
    domain: '1shows.org',
    description: 'Vast Library • Interactive Episode Selector',
    url: 'https://www.1shows.org/',
    tags: ['Library', 'HD Tv'],
    type: 'Streaming',
    logo: '/logos/1Shows.png'
  },
  {
    name: '1Flex',
    domain: '1flex.org',
    description: 'Responsive Grid • Lightweight Playback Layer',
    url: 'https://www.1flex.org/',
    tags: ['Fast', 'Responsive'],
    type: 'Streaming',
    logo: '/logos/1Flex.png'
  },
  {
    name: 'Vidbox',
    domain: 'vidbox.dev',
    description: 'Premium Developer Streaming Interface',
    url: 'https://vidbox.dev/home',
    tags: ['Dev Native', '4K Codecs'],
    type: 'Streaming',
    logo: '/logos/vidbox.png'
  },
  {
    name: 'Dulo TV',
    domain: 'dulo.tv',
    description: 'Sophisticated Next-gen Media Player Node',
    url: 'https://dulo.tv',
    tags: ['Fluid Player', '4K'],
    type: 'Streaming',
    logo: '/logos/DuloTV.png'
  },
  {
    name: 'YouFlex',
    domain: 'youflex.top',
    description: 'Real-time Adaptive Resolution Optimization',
    url: 'https://youflex.top/',
    tags: ['Adaptive', 'Premium Engine'],
    type: 'Streaming',
    logo: '/logos/YouFlex.png'
  },

  // Tier 3: Classic Directories, Niche, and Alternate Engines
  {
    name: 'GGFlix',
    domain: 'ggflix.pro',
    description: 'Sleek Neon Accent Layout with Direct Video Resolvers',
    url: 'https://ggflix.pro/',
    tags: ['Dark Theme', 'High Quality'],
    type: 'Streaming',
    logo: '/logos/GGFlix.png'
  },
  {
    name: 'BoredFlix',
    domain: 'boredflix.tv',
    description: 'Comprehensive Library designed to Cure Boredom',
    url: 'https://www.boredflix.tv/',
    tags: ['Vast Catalog', 'Alternative Links'],
    type: 'Streaming',
    logo: '/logos/BoredFlix.png'
  },
  {
    name: 'HDToday Z',
    domain: 'hdtodayz.net',
    description: 'Huge Database Archive of High Definition Media',
    url: 'https://hdtodayz.net/',
    tags: ['Massive', 'HD Movies'],
    type: 'Streaming',
    logo: '/logos/HDToday.png'
  },
  {
    name: '7Reels',
    domain: '7reels.cc',
    description: 'Simple and Direct Subtitle & Film Vault',
    url: 'https://7reels.cc/',
    tags: ['Minimalist', 'Classics'],
    type: 'Streaming',
    logo: '/logos/7Reels.png'
  },
  {
    name: 'Way2Movies',
    domain: 'way2movies.live',
    description: 'Speed-optimized Database with Multi-source Resolvers',
    url: 'https://way2movies.live/',
    tags: ['Multi-Host', 'Direct Streams'],
    type: 'Streaming',
    logo: '/logos/Way2Movies.png'
  },
  {
    name: 'M-Zone',
    domain: 'm-zone.org',
    description: 'High-speed Minimal Media Zone Index',
    url: 'https://www.m-zone.org/',
    tags: ['Minimalist', 'Fast CDN'],
    type: 'Streaming',
    logo: '/logos/MovieZone.png'
  },
  {
    name: 'ZeroStream',
    domain: 'zerostream.alwaysdata.net',
    description: 'Completely Ad-free and Lightweight API Gateway',
    url: 'https://zerostream.alwaysdata.net/',
    tags: ['Ad-free', 'Minimalist'],
    type: 'Streaming',
    logo: '/logos/ZeroStream.png'
  },
  {
    name: 'SnowStream',
    domain: 'snowstream.vercel.app',
    description: 'Pure Open Source Video Streaming Project',
    url: 'https://snowstream.vercel.app/',
    tags: ['Open Source', 'Fast Loading'],
    type: 'Streaming',
    logo: '/logos/Snowstream.png'
  },
  {
    name: 'Heartive TV',
    domain: 'heartivetv.pages.dev',
    description: 'Aesthetic Minimalist Multi-server Player Dashboard',
    url: 'https://heartivetv.pages.dev/',
    tags: ['Aesthetic UI', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/Heartive.png'
  },
  {
    name: 'Telev',
    domain: 'telev.tv',
    description: 'Futuristic WebTV Stream Consolidation',
    url: 'https://telev.tv/',
    tags: ['WebTV', 'Modern Design'],
    type: 'Streaming',
    logo: '/logos/TELEV.png'
  },
  {
    name: 'CineWave',
    domain: 'watch.cinewave.qzz.io',
    description: 'Decentralized Edge Network Video Player',
    url: 'https://watch.cinewave.qzz.io/',
    tags: ['Decentralized', 'HD'],
    type: 'Streaming',
    logo: '/logos/CINEWAVE.png'
  },
  {
    name: 'ZXCPrime',
    domain: 'zxcprime.icu',
    description: 'Ultra Optimized Media Proxy',
    url: 'https://zxcprime.icu/',
    tags: ['UHD Content', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/ZXC[STREAM].png'
  },
  {
    name: '1Tube',
    domain: '1tube.org',
    description: 'Super Minimalist Ad-free Portal',
    url: 'https://www.1tube.org/',
    tags: ['Minimalist', 'No Ads'],
    type: 'Streaming',
    logo: '/logos/1tube.png'
  },
  {
    name: 'FlikHub',
    domain: 'flikhub.net',
    description: 'Central Hub for Global Series & Trending Movies',
    url: 'https://www.flikhub.net/',
    tags: ['Trending', 'Series Source'],
    type: 'Streaming',
    logo: '/logos/Flikhub.png'
  },
  {
    name: 'Hexa',
    domain: 'hexa.su',
    description: 'Aesthetic Flat Design Media Relay',
    url: 'https://hexa.su/',
    tags: ['Flat UI', 'High-speed'],
    type: 'Streaming',
    logo: '/logos/hexa.png'
  },
  {
    name: 'MeowTV',
    domain: 'meowtv.ru',
    description: 'Playful UI Design paired with Highly Snappy CDN',
    url: 'https://meowtv.ru/',
    tags: ['Fluid Player', 'Playful Theme'],
    type: 'Streaming',
    logo: 'https://www.google.com/s2/favicons?domain=meowtv.ru&sz=128'
  },
  {
    name: 'PrimeShows',
    domain: 'primeshows.uk',
    description: 'High Bitrate UK Server Node',
    url: 'https://primeshows.uk/',
    tags: ['Premium UK', '4K Codecs'],
    type: 'Streaming',
    logo: '/logos/Primeshows.png'
  },
  {
    name: 'NetPlayz',
    domain: 'netplayz.live',
    description: 'Interactive Multimedia Sandbox Player',
    url: 'https://netplayz.live/',
    tags: ['Interactive UX', 'UHD Streams'],
    type: 'Streaming',
    logo: '/logos/Netplay.png'
  },
  {
    name: 'Icefy',
    domain: 'icefy.top',
    description: 'Brushed Ice Dark Theme Compact Player',
    url: 'https://icefy.top/',
    tags: ['Minimalist UI', 'Compact Mode'],
    type: 'Streaming',
    logo: '/logos/Icefy.png'
  },
  {
    name: 'CineLove',
    domain: 'cinelove.live',
    description: 'Passionate Curated Cinema & Indie Classics',
    url: 'https://cinelove.live/',
    tags: ['Indie Curations', 'HD'],
    type: 'Streaming',
    logo: '/logos/Cinelove.png'
  },
  {
    name: 'StreamWatch',
    domain: 'streamwatch.online',
    description: 'Highly Comprehensive Alternate Link Portal',
    url: 'https://streamwatch.online/',
    tags: ['Deep Indexer', 'Alternative Links'],
    type: 'Streaming',
    logo: '/logos/StreamWatch.png'
  },
  {
    name: 'StigStream',
    domain: 'stigstream.ru',
    description: 'High Altitude High-Throughput Buffering Bypass',
    url: 'https://stigstream.ru/',
    tags: ['High-speed Network', 'Secure Protocol'],
    type: 'Streaming',
    logo: '/logos/Stigstream.png'
  },
  {
    name: 'TheMovieBox',
    domain: 'themoviebox.org',
    description: 'Vintage Golden Age & Contemporary Media Chest',
    url: 'https://themoviebox.org/',
    tags: ['Library', 'Retro Catalog'],
    type: 'Streaming',
    logo: '/logos/MovieBox.png'
  },
  {
    name: 'UniqueStream',
    domain: 'uniquestream.net',
    description: 'Rare Releases & Uncensored Film Vault',
    url: 'https://uniquestream.net/',
    tags: ['Rare Collections', 'UHD Streams'],
    type: 'Streaming',
    logo: '/logos/uniquestream.png'
  },
  {
    name: 'WatchSurface',
    domain: 'watchsurface.stream',
    description: 'Tactile Floating Player Layout with Multi-hosts',
    url: 'https://watchsurface.stream/',
    tags: ['Fluid UI', 'Alternate Hosts'],
    type: 'Streaming',
    logo: '/logos/Surface Stream.png'
  },
  {
    name: '1PrimeShow',
    domain: '1primeshow.online',
    description: 'Expressive TV Network Proxy',
    url: 'https://1primeshow.online/',
    tags: ['Network Proxy', 'HD Live'],
    type: 'Streaming',
    logo: '/logos/1PRIMESHOW.png'
  },
  {
    name: 'StreamVaults',
    domain: 'streamvaults.ru',
    description: 'Advanced Secure Media Archival Engine',
    url: 'https://streamvaults.ru/',
    tags: ['Vault Protocol', 'Secure Stream'],
    type: 'Streaming',
    logo: '/logos/StreamVaults.png'
  },
  {
    name: 'GaiaFlix',
    domain: 'gaiaflix.live',
    description: 'Clean Glassmorphic Layout Media Node',
    url: 'https://gaiaflix.live/',
    tags: ['Aesthetic UI', 'Instant Mirrors'],
    type: 'Streaming',
    logo: '/logos/GaiaFlix.png'
  },
  
  {
    name: 'FlixTrz',
    domain: 'flixtrz.com',
    description: 'Socially Integrated Movie Stream Feed',
    url: 'https://flixtrz.com/',
    tags: ['Social Feed', 'HD Player'],
    type: 'Streaming',
    logo: '/logos/Flixtrz.png'
  },
  {
    name: 'ZetMoon',
    domain: 'zetmoon.live',
    description: 'Cosmic Outer-Space Themed Video Interface',
    url: 'https://zetmoon.live/',
    tags: ['Aesthetic Design', 'Cosmic Theme'],
    type: 'Streaming',
    logo: '/logos/ZetMoon.png'
  },
  {
    name: 'TouStream',
    domain: 'toustream.xyz',
    description: 'Compact Index Built by Community Curators',
    url: 'https://toustream.xyz/',
    tags: ['Community Curated', 'Lightweight'],
    type: 'Streaming',
    logo: '/logos/Toustream.png'
  },
  
  {
    name: 'Filmu TV',
    domain: 'tv.filmu.in',
    description: 'Premium Multi-regional Language Broadcaster',
    url: 'https://tv.filmu.in/en',
    tags: ['Multi-Languages', 'HD Broadcast'],
    type: 'Streaming',
    logo: '/logos/Filmu.png'
  },
  {
    name: 'NetShows',
    domain: 'netshows.xyz',
    description: 'Exclusive High Bitrate TV Show Repository',
    url: 'https://netshows.xyz/',
    tags: ['TV Shows', 'UHD Mirrors'],
    type: 'Streaming',
    logo: '/logos/NETSHOWS.png'
  },
  {
    name: 'Filmex',
    domain: 'filmex.to',
    description: 'Enormous Global Catalog • Decoupled CDN',
    url: 'https://filmex.to/',
    tags: ['Global Archive', 'Direct Links'],
    type: 'Streaming',
    logo: '/logos/Filmex.png'
  },
  {
    name: 'FlickyStream',
    domain: 'flickystream.ru',
    description: 'Instant Handshake Movie Stream Node',
    url: 'https://flickystream.ru/',
    tags: ['Instant Handshake', 'Fast Playback'],
    type: 'Streaming',
    logo: '/logos/flickystream.png'
  },
  {
    name: 'Cinemora',
    domain: 'cinemora.ru',
    description: 'Bespoke Mirror Network with High Bitrates',
    url: 'https://cinemora.ru/',
    tags: ['Bespoke CDN', 'Responsive Feed'],
    type: 'Streaming',
    logo: '/logos/cinemora.png'
  },

  {
    name: '67Movies',
    domain: '67movies.net',
    description: 'Dedicated High Definition Network Hub',
    url: 'https://67movies.net/',
    tags: ['HD Stream', 'Daily Updates'],
    type: 'Streaming',
    logo: '/logos/67Movies.png'
  },
  {
    name: 'Shuttle TV',
    domain: 'shuttletv.su',
    description: 'High-speed TV Broadcaster Proxy Node',
    url: 'https://shuttletv.su/',
    tags: ['Fast Stream', 'Proxy Node'],
    type: 'Streaming',
    logo: '/logos/ShuttleTV.png'
  },
  {
    name: 'Mappl TV',
    domain: 'mappl.tv',
    description: 'Advanced Geographically Balanced Broadcaster Node',
    url: 'https://mappl.tv/',
    tags: ['Geo CDN', 'TV Channels'],
    type: 'Streaming',
    logo: '/logos/Mapple.png'
  },
  {
    name: 'Movish',
    domain: 'movish.net',
    description: 'Vast Collection of Modern Movies & Docs',
    url: 'https://movish.net/home',
    tags: ['Massive', 'Decoupled CDN'],
    type: 'Streaming',
    logo: '/logos/movish.png'
  },
  {
    name: 'MultiMovies',
    domain: 'multimovies.fyi',
    description: 'Curated Multi-server Global Catalog Index',
    url: 'https://multimovies.makeup/',
    tags: ['Global Mirrors', 'High-Speed'],
    type: 'Streaming',
    logo: '/logos/multimovies.png'
  },
  {
    name: 'Luna Stream',
    domain: 'lunastream.watch',
    description: 'High Bitrate Server • Perfect for Late Night Watching',
    url: 'https://lunastream.watch/',
    tags: ['HD Stream', 'Luxurious player'],
    type: 'Streaming',
    logo: '/logos/Lunastream.png'
  },
  {
    name: 'Movieplex',
    domain: 'movieplex.online',
    description: 'Premium Virtual Cinematic Theater Player',
    url: 'https://movieplex.online/',
    tags: ['Multiplex', 'Online Server'],
    type: 'Streaming',
    logo: '/logos/Movieplex.png'
  },
  {
    name: 'WMovies',
    domain: 'wmovies.org',
    description: 'Global Unified Search Engine for All Media',
    url: 'https://wmovies.org/home/',
    tags: ['Search Matrix', 'Worldwide'],
    type: 'Streaming',
    logo: '/logos/Wmovies.png'
  },
  {
    name: 'Moviepire',
    domain: 'moviepire.org',
    description: 'High Bandwidth Cinema Gateway',
    url: 'https://moviepire.org/',
    tags: ['Cinema Gateway', '4K UHD'],
    type: 'Streaming',
    logo: '/logos/MoviePire.png'
  },
  {
    name: 'StreamEx',
    domain: 'streamex.sh',
    description: 'Ultra Light and Fast Hybrid Exchange Streamer',
    url: 'https://streamex.sh/',
    tags: ['Hybrid stream', 'Super Fast'],
    type: 'Streaming',
    logo: '/logos/StreameX.png'
  },
  {
    name: 'Cinema.bz',
    domain: 'cinema.bz',
    description: 'Classy Minimalist high speed Direct Streamer',
    url: 'https://cinema.bz/',
    tags: ['HD Stream', 'Low Bitrate high quality'],
    type: 'Streaming',
    logo: '/logos/Cinema.bz.png'
  },
  {
    name: 'HydraHD',
    domain: 'hydrahd.ru',
    description: 'Robust Multi-source High Bitrate Broadcaster',
    url: 'https://hydrahd.ru/',
    tags: ['Robust CDN', '4K UHD'],
    type: 'Streaming',
    logo: '/logos/hydrahd.ru.png'
  },
  {
    name: 'NetPrime',
    domain: 'netprime.to',
    description: 'Premium High Fidelity Cinematic Network',
    url: 'https://netprime.to/',
    tags: ['Premium Net', 'HD Content'],
    type: 'Streaming',
    logo: '/logos/netprime.png'
  },
  {
    name: 'OnlyFlix',
    domain: 'onlyflix.to',
    description: 'Custom Streaming Pipeline for Movie Connoisseurs',
    url: 'https://onlyflix.to/',
    tags: ['Bespoke', 'High Bitrate'],
    type: 'Streaming',
    logo: '/logos/onlyflix-logo.png'
  }
,
  {
    name: 'Veloratv',
    domain: 'www.veloratv.in',
    description: 'Streaming Portal',
    url: 'https://www.veloratv.in/',
    tags: ["New"],
    type: 'Streaming',
    logo: '/logos/Velora.png'

  },
  {
    name: 'Corsflix',
    domain: 'watch.corsflix.net',
    description: 'Streaming Portal',
    url: 'https://watch.corsflix.net/',
    tags: ["New"],
    logo: '/logos/corsflix.png',
    type: 'Streaming'
  },
  {
    name: 'Streamwatch',
    domain: 'streamwatch.online',
    description: 'Streaming Portal',
    url: 'https://streamwatch.online/',
    tags: ["New"],
    logo: '/logos/StreamWatch.png',
    type: 'Streaming'
  },
  {
    name: 'Zstream',
    domain: 'zstream.mov',
    description: 'Streaming Portal',
    url: 'https://zstream.mov/',
    tags: ["New"],
    logo: '/logos/Z-Stream.png',
    type: 'Streaming'
  },
  {
    name: 'Moviebite',
    domain: 'moviebite.cc',
    description: 'Streaming Portal',
    url: 'https://moviebite.cc/',
    tags: ["New"],
    logo: '/logos/moviebite.png',
    type: 'Streaming'
  },
  {
    name: 'Bcine',
    domain: 'bcine.ru',
    description: 'Streaming Portal',
    url: 'https://bcine.ru/',
    tags: ["New"],
    type: 'Streaming',
    logo: '/logos/BCine.png'
  },
  {
    name: 'Overlook',
    domain: 'overlook.to',
    description: 'Streaming Portal',
    url: 'https://overlook.to/',
    tags: ["New"],
    type: 'Streaming',
    logo: '/logos/Overlook.png'
  },
  {
    name: 'Filmcave',
    domain: 'filmcave.ru',
    description: 'Streaming Portal',
    url: 'https://filmcave.ru/',
    tags: ["New"],
    type: 'Streaming',
    logo: '/logos/FilmCave.png'
  },
  {
    name: 'Spencerdevs',
    domain: 'watch.spencerdevs.xyz',
    description: 'Streaming Portal',
    url: 'https://watch.spencerdevs.xyz/',
    tags: ["New"],
    logo: '/logos/StreamWatch.png'
  },
  {
    name: 'Willow',
    domain: 'willow.arlen.icu',
    description: 'Streaming Portal',
    url: 'https://willow.arlen.icu/',
    tags: ["New"],
    logo: '/logos/willow.png',
    type: 'Streaming'
  },
  {
    name: 'Watchott',
    domain: 'watchott.ru',
    description: 'Streaming Portal',
    url: 'https://watchott.ru/',
    tags: ["New"],
    logo: '/logos/watchott.png',
    type: 'Streaming'
  },
  {
    name: 'Flixway',
    domain: 'flixway.ru',
    description: 'Streaming Portal',
    url: 'https://flixway.ru/',
    tags: ["New"],
    logo: '/logos/flixway.png',
    type: 'Streaming'
  },
  {
    name: 'Cinephilee',
    domain: 'cinephilee.pages.dev',
    description: 'Streaming Portal',
    url: 'https://cinephilee.pages.dev/',
    tags: ["New"],
    logo: '/logos/Cinephile.png',
    type: 'Streaming'
  },
  {
    name: 'Watch V2',
    domain: 'watch-v2.autoembed.app',
    description: 'Autoembed Streaming Portal',
    url: 'https://watch-v2.autoembed.app/',
    tags: ['New', 'Streaming'],
    logo: '/logos/autoembed.png',
    type: 'Streaming'
  }
];

export default function Streaming() {
  return (
    <DirectoryLayout
      title="HD Streaming."
      subtitle="Streaming"
      description="Direct access to premium streaming portals. No ads, high-speed delivery, and global content availability."
      portals={STREAMING_PROVIDERS}
      categoryId="streaming"
    />
  );
}
