import DirectoryLayout from '@/src/components/DirectoryLayout';

export const MOVIE_PROVIDERS = [
  {
    name: '4K HD Hub',
    domain: '4khdhub.one',
    description: 'High resolution movies in 4K and HEVC formats',
    url: 'https://4khdhub.one/',
    tags: ['4K UHD', 'HEVC', 'Trusted'],
    type: 'Streaming',
    logo: 'https://4khdhub.one/images/4KHDHUB-Bright-Logo.png'
  },
  {
    name: 'UHD Movies',
    domain: 'uhdmovies.food',
    description: 'Specialized hub for 4K and ultra high definition movies',
    url: 'https://uhdmovies.food/',
    tags: ['4K', 'UHD', 'Trusted'],
    type: 'Streaming',
    logo: 'https://uhdmovies.food/wp-content/uploads/2021/03/uhdmovieslogonew.png'
  },
  {
    name: 'Movies Drives',
    domain: 'new3.moviesdrives.my',
    description: 'Stream and download latest movies',
    url: 'https://new3.moviesdrives.my/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: 'https://new3.moviesdrives.my/wp-content/uploads/2026/01/log.png'
  },
  {
    name: 'VegaMovies',
    domain: 'vegamovies.mq',
    description: 'Popular site with a massive library of HD movies and shows',
    url: 'https://vegamovies.mq/',
    tags: ['Massive', 'DDL'],
    type: 'Download',
    logo: '/logos/vegamovies.png'
  },
  {
    name: 'Kmmovies',
    domain: 'kmmovies.lol',
    description: 'Movies Hub',
    url: 'https://kmmovies.lol/',
    tags: ["Movies"],
    type: 'Streaming',
    logo: '/logos/KMMovies.png'
  },
  {
    name: 'Multi Shows',
    domain: 'multishows.top',
    description: 'Stream and download latest movies',
    url: 'https://multishows.top/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: 'https://multishows.top/static/img/logo-1755528085.png'
  },
  {
    name: 'KatMovieHD',
    domain: 'katmoviehd.cymru',
    description: 'Specialist in multilingual content and foreign films',
    url: 'https://new1.katmoviehd.cymru/',
    tags: ['Multi', 'Dual Audio'],
    type: 'Download',
    logo: 'https://new1.katmoviehd.cymru/wp-content/uploads/2022/03/cropped-cropped-KatMovie-G-S1.png'
  },
  {
    name: 'XD Movies',
    domain: 'top.xdmovies.wtf',
    description: 'Stream and download latest movies',
    url: 'https://top.xdmovies.wtf/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: '/logos/XDMOVIES.png'
  },
  {
    name: 'CloudMoviez',
    domain: 'new.cloudmoviez.shop',
    description: 'High quality cloud movie streaming and download links',
    url: 'https://new.cloudmoviez.shop/',
    tags: ['Cloud', 'Movies'],
    logo: '/logos/cloudmoviez.png',
    type: 'Streaming'
  },
  {
    name: 'TamilTVToons',
    domain: 'tamiltvtoons.site',
    description: 'Specialized hub for Tamil TV toons and shows',
    url: 'https://tamiltvtoons.site/',
    tags: ['Tamil', 'Toons'],
    logo: '/logos/tamiltvtoons.png',
    type: 'Streaming'
  },
  {
    name: 'Extraflix',
    domain: 'e5.extraflix.mobi',
    description: 'Download latest movies and web series',
    url: 'https://e5.extraflix.mobi/',
    tags: ['Movies', 'HD'],
    type: 'Download',
    logo: '/logos/extraflix.png'
  },
  {
    name: 'MovieNest BD',
    domain: 'movienestbd.pics',
    description: 'Stream and download latest movies',
    url: 'https://movienestbd.pics/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: '/logos/movienestbd.png'
  },
  {
    name: 'Ola Movies',
    domain: 'v2.olamovies.mov',
    description: 'Fast Google Drive download links with no annoying redirects',
    url: 'https://v2.olamovies.mov/',
    tags: ['GDrive', 'Direct', 'New'],
    type: 'Download',
    logo: '/logos/olamovies.png'
  },
  {
    name: 'DDLBase',
    domain: 'ddlbase.com',
    description: 'Direct download links for the latest movies and TV shows',
    url: 'https://ddlbase.com/',
    tags: ['Movies', 'DDL'],
    type: 'Download',
    logo: 'https://i0.wp.com/i.postimg.cc/SQH79wgy/668271557-yyskgnc.png'
  },
  {
    name: 'ZinkMovies',
    domain: 'zinkmovies.today',
    description: 'Daily updated library for latest movies and shows',
    url: 'https://zinkmovies.today/',
    tags: ['Latest', 'Movies'],
    logo: '/logos/zinkmovies.org.png',
    type: 'Streaming'
  },
  {
    name: 'CinemaLux',
    domain: 'cinemalux.wiki',
    description: 'Premium streaming experience with a massive library',
    url: 'https://cinemalux.wiki/',
    tags: ['Premium', 'HD'],
    type: 'Streaming',
    logo: '/logos/cinemalux.png'
  },
  {
    name: 'CineFreak',
    domain: 'cinefreak.nl',
    description: 'Modern interface to stream international movies and series',
    url: 'https://cinefreak.nl/',
    tags: ['Global', 'HD'],
    type: 'Streaming',
    logo: '/logos/cinefreak.png'
  },
  {
    name: 'MLSBD',
    domain: 'mlsbd.co',
    description: 'Huge collection of movies and series for Bangladeshi users',
    url: 'https://mlsbd.co/',
    tags: ['Bangla', 'HD'],
    type: 'Download',
    logo: '/logos/mlsbd.png'
  },
  {
    name: 'Joya9 TV',
    domain: 'joya9tv1.com',
    description: 'Stream and download latest movies',
    url: 'https://joya9tv1.com/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: '/logos/joya9.tv.png'
  },
  {
    name: 'CineDoze',
    domain: 'cinedoze.tv',
    description: 'Stream and download the latest movies in high definition',
    url: 'https://cinedoze.tv/',
    tags: ['HD', 'Dual Audio'],
    type: 'Streaming',
    logo: '/logos/cinedoze.png'
  },
  {
    name: 'DownloadHub',
    domain: 'd5.downloadhub.food',
    description: 'A classic choice for quick movie and series downloads',
    url: 'https://d5.downloadhub.food/',
    tags: ['Classic', 'DDL'],
    type: 'Download',
    logo: 'https://d5.downloadhub.food/logo.png'
  },
  {
    name: 'SouthFreak',
    domain: 'southfreak.ink',
    description: 'Best place for South Indian and dubbed movie collections',
    url: 'https://southfreak.fyi/',
    tags: ['Dubbed', 'South'],
    type: 'Streaming',
    logo: '/logos/southfreak.png'
  },
  {
    name: '1DesireMovies',
    domain: '1desiremovies.dad',
    description: 'Latest movies and web series',
    url: 'https://1desiremovies.dad/',
    tags: ['Movies', 'HD'],
    type: 'Download',
    logo: '/logos/1desiremovies.png'
  },
  {
    name: 'MovieBaaz',
    domain: 'moviebaaz.cfd',
    description: 'The ultimate hub for Bollywood, Hollywood and dubbed movie releases',
    url: 'https://moviebaaz.cfd/',
    tags: ['Bollywood', 'Dubbed'],
    type: 'Streaming',
    logo: '/logos/moviebaaz.png'
  },
  {
    name: 'Movie Dokan',
    domain: 'moviedokan.co',
    description: 'Stream and download latest movies',
    url: 'https://moviedokan.co/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: '/logos/moviedokan.png'
  },
  {
    name: 'Movie Drive BD',
    domain: 'moviedrivebd.com',
    description: 'Stream and download latest movies',
    url: 'https://moviedrivebd.com/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: 'https://moviedrivebd.com/wp-content/uploads/2025/02/movieDriveBD.me-14.png'
  },
  {
    name: 'MyFlix BD',
    domain: 'myflixbd.to',
    description: 'Latest movies and web series',
    url: 'https://myflixbd.to/',
    tags: ['Movies', 'Web Series'],
    type: 'Streaming',
    logo: '/logos/myflixbd.png'
  },
  {
    name: 'TheMoviesBoss',
    domain: 'ww2.themoviesboss.blog',
    description: 'Premium collection of movies and shows',
    url: 'https://ww2.themoviesboss.blog/',
    tags: ['HD', 'Movies'],
    type: 'Download',
    logo: '/logos/themoviesboss.png'
  },
  {
    name: 'FreeDriveMovie',
    domain: 'freedrivemovie.cfd',
    description: 'Fast Google Drive links for high-speed movie downloads',
    url: 'https://freedrivemovie.cfd/',
    tags: ['GDrive', 'Ads-Free'],
    type: 'Download',
    logo: '/logos/freedrivemovie.png'
  },
  {
    name: 'Fojik',
    domain: 'fojik.site',
    description: 'Comprehensive aggregator for finding movie streaming links',
    url: 'https://fojik.site/',
    tags: ['Aggregator', 'Search'],
    type: 'Resource',
    logo: '/logos/fojik.png'
  },
  {
    name: 'HDMovie2',
    domain: 'newhdmovie2.top',
    description: 'Great source for High Definition movies',
    url: 'https://newhdmovie2.top/',
    tags: ['HD', 'Movies'],
    logo: '/logos/hdmovie2.png',
    type: 'Streaming'
  },
  {
    name: 'MLFBD',
    domain: 'mlfbd.best',
    description: 'Best source for movies and shows in Bangladesh',
    url: 'https://mlfbd.best/',
    tags: ['Bengali', 'Movies'],
    logo: '/logos/mlfbd.net.png',
    type: 'Streaming'
  },
  {
    name: 'BollyFlix',
    domain: 'new.bollyflix.gd',
    description: 'Specialized hub for watching all types of Bollywood movies',
    url: 'https://bollyflix.med/',
    tags: ['Bollywood', 'Fast'],
    type: 'Streaming',
    logo: '/logos/bollyflix.png'
  },
  {
    name: 'Private Moviez',
    domain: 'a.privatemoviez.surf',
    description: 'Stream and download latest movies',
    url: 'https://a.privatemoviez.surf/',
    tags: ['HD', 'Movies'],
    type: 'Streaming',
    logo: '/logos/privatemoviez_v2.png'
  },
  {
    name: 'HDHub4U',
    domain: 'new1.hdhub4u.cl',
    description: 'Popular streaming destination for the latest movie releases',
    url: 'https://new1.hdhub4u.cl/',
    tags: ['Latest', 'Streaming'],
    type: 'Streaming',
    logo: 'https://new1.hdhub4u.cl/wp-content/uploads/2021/05/hdhub4ulogo.png'
  },
  {
    name: 'India4Movies',
    domain: 'go.india4movies.net',
    description: 'Curated collection of Indian and local language content',
    url: 'https://go.india4movies.net/',
    tags: ['Indian', 'HD'],
    type: 'Streaming',
    logo: '/logos/India4Movies.png'
  },
  {
    name: 'SSR Movies',
    domain: 'ssrmovies.taxi',
    description: 'A classic choice for quick movie and series downloads',
    url: 'https://ssrmovies.taxi/',
    tags: ['Classic', 'DDL'],
    type: 'Download',
    logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ssrmovies.taxi&size=128'
  },
  {
    name: 'MoviesLeech',
    domain: 'moviesleech.link',
    description: 'Fast and direct links for movie downloading',
    url: 'https://moviesleech.link/',
    tags: ['Direct', 'Fast'],
    type: 'Download',
    logo: 'https://moviesleech.bar/wp-content/uploads/2024/07/topmovies-logo.png'
  },
  {
    name: 'MoviesMod',
    domain: 'moviesmod.farm',
    description: 'High-quality movie encodes with small file sizes',
    url: 'https://moviesmod.farm/',
    tags: ['Encoded', 'HEVC'],
    type: 'Download',
    logo: 'https://moviesmod.army/wp-content/uploads/2022/12/moviesmodnew-Custom.png'
  },
  {
    name: 'HDMovieVerse',
    domain: 'hdmovieverse.xyz',
    description: 'A wide variety of HD content from across the globe',
    url: 'https://hdmovieverse.xyz/',
    tags: ['Global', 'HD'],
    type: 'Streaming',
    logo: 'https://hdmovieverse.xyz/wp-content/uploads/moviesverse-202222.webp'
  },
  {
    name: '1TamilMV',
    domain: '1tamilmv.futbol',
    description: 'The premier source for South Indian movies and shows',
    url: 'https://www.1tamilmv.futbol/',
    tags: ['Tamil', 'Telugu'],
    type: 'Download',
    logo: 'https://www.1tamilmv.cards/uploads/monthly_2026_04/logo.png.a2fe3a46dd23c8b4b3798642925294b9.png'
  },
  {
    name: 'AllMoviesHub',
    domain: 'allmovieshub.gives',
    description: 'Comprehensive library with almost every movie you need',
    url: 'https://allmovieshub.gives/',
    tags: ['Library', 'Massive'],
    type: 'Download',
    logo: '/logos/MoviHUB.png'
  },
  {
    name: 'World4ufree',
    domain: 'world4ufree.tw',
    description: 'Movies Hub',
    url: 'https://world4ufree.tw/',
    tags: ["Movies"],
    logo: '/logos/World4uFree.png',
    type: 'Streaming'
  },
  {
    name: 'Thenextplanet',
    domain: 'www.thenextplanet.living',
    description: 'Movies Hub',
    url: 'https://www.thenextplanet.living/tag/',
    tags: ["Movies"],
    logo: '/logos/TheNextPlanet.png',
    type: 'Streaming'
  },
  {
    name: 'BollyZone',
    domain: 'www.bollyzone.to',
    description: 'Movies & Series Hub',
    url: 'https://www.bollyzone.to/homepage/',
    tags: ['Movies', 'Series'],
    type: 'Streaming',
    logo: '/logos/bollyzone.png'
  },
  {
    name: 'Desi-Serials',
    domain: 'www.desi-serials.to',
    description: 'Desi Serials and Shows',
    url: 'https://www.desi-serials.to/',
    tags: ['Serials', 'Desi'],
    type: 'Streaming',
    logo: '/logos/desi-serials.png'
  },
  {
    name: 'DesiTV',
    domain: 'watch.desitv.ru',
    description: 'Desi TV Shows & Serials',
    url: 'https://watch.desitv.ru/',
    tags: ['TV Shows', 'Desi'],
    type: 'Streaming',
    logo: '/logos/desitv.png'
  },
  {
    name: 'MKVBase',
    domain: 'mkvbase.site',
    description: 'MKV Movies and Shows Hub',
    url: 'https://mkvbase.site/',
    tags: ['Movies', 'MKV'],
    logo: 'https://www.google.com/s2/favicons?domain=mkvbase.site&sz=128',
    type: 'Download'
  }
];

export default function Movies() {
  return (
    <DirectoryLayout
      title="Movies & Shows."
      subtitle="Media"
      description="Access the most resilient streaming networks. High-bandwidth, encrypted pipelines for global media consumption."
      portals={MOVIE_PROVIDERS}
      categoryId="movies"
    />
  );
}

