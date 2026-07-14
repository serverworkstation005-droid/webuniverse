import DirectoryLayout from '@/src/components/DirectoryLayout';

export const TECH_SECTIONS = [
  {
    title: 'Web Intelligence',
    portals: [
    {
        name: 'Cloudflare Radar',
        domain: 'radar.cloudflare.com',
        description: 'Real-time internet traffic and security trends',
        url: 'https://radar.cloudflare.com/',
        tags: ['Internet Radar', 'Security'],
        type: 'Intel',
        logo: 'https://www.google.com/s2/favicons?domain=radar.cloudflare.com&sz=128'},
  {
        name: 'BuiltWith',
        domain: 'builtwith.com',
        description: 'Lookup the tech stack and tools used by any website',
        url: 'https://builtwith.com/',
        tags: ['Tech Stack', 'Profiler'],
        type: 'Intel',
        logo: 'https://www.google.com/s2/favicons?domain=builtwith.com&sz=128'},
  {
        name: 'TMDB',
        domain: 'themoviedb.org',
        description: 'Community-driven database for movies and TV shows',
        url: 'https://www.themoviedb.org/',
        tags: ['Media DB', 'API'],
        type: 'Intel',
        logo: 'https://www.google.com/s2/favicons?domain=themoviedb.org&sz=128'},
  {
        name: 'FaceCheck.ID',
        domain: 'facecheck.id',
        description: 'Reverse image search and facial recognition tool',
        url: 'https://facecheck.id/',
        tags: ['Facial Recognition', 'OSINT'],
        type: 'Search',
        logo: 'https://www.google.com/s2/favicons?domain=facecheck.id&sz=128'},
  ]},
  {
    title: 'Downloader & Converters',
    portals: [
    {
        name: 'Online-Convert',
        domain: 'online-convert.com',
        description: 'Convert videos, images, and documents online for free',
        url: 'https://www.online-convert.com/',
        tags: ['Convert', 'Media'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=online-convert.com&sz=128'},
  {
        name: 'ClipConverter',
        domain: 'clipconverter.cc',
        description: 'Record, convert and download YouTube videos easily',
        url: 'https://www.clipconverter.cc/3/',
        tags: ['Youtube', 'Convert'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=clipconverter.cc&sz=128'},
  {
        name: 'ddownr',
        domain: 'ddownr.org',
        description: 'High-speed YouTube playlist and video downloader',
        url: 'https://ddownr.org/',
        tags: ['Youtube', 'Playlist'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=ddownr.org&sz=128'},
  {
        name: 'YoutubePlaylist.cc',
        domain: 'youtubeplaylist.cc',
        description: 'Directly download and export YouTube playlists online',
        url: 'https://youtubeplaylist.cc/',
        tags: ['Youtube', 'Playlist'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=youtubeplaylist.cc&sz=128'},
  {
        name: 'SaveFrom.net',
        domain: 'savefrom.net',
        description: 'Download videos from YouTube, Instagram, and more',
        url: 'https://en1.savefrom.net/17Bb/',
        tags: ['Video DL', 'Social DL'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=savefrom.net&sz=128'},
  {
        name: 'Bangla Subtitle',
        domain: 'banglasubtitle.com',
        description: 'The largest collection of Bengali subtitles for movies',
        url: 'https://banglasubtitle.com/',
        tags: ['Subtitles', 'Bengali'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=banglasubtitle.com&sz=128'
      }
    ]},
  {
    title: 'AI & Handy Tools',
    portals: [
    {
        name: 'TinyWow',
        domain: 'tinywow.com',
        description: 'Free tools for PDF, image, video and writing tasks',
        url: 'https://tinywow.com/',
        tags: ['AI Tools', 'PDF Edit'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=tinywow.com&sz=128'},
  {
        name: 'Humbot',
        domain: 'humbot.ai',
        description: 'Rewrite AI content to sound more human and unique',
        url: 'https://humbot.ai/',
        tags: ['AI Rewriter', 'NLP'],
        type: 'AI',
        logo: 'https://www.google.com/s2/favicons?domain=humbot.ai&sz=128'},
  {
        name: 'Fake Detail',
        domain: 'fakedetail.com',
        description: 'Generate fake profiles and chat screenshots for UI tests',
        url: 'https://fakedetail.com/',
        tags: ['UI Test', 'Mockup'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=fakedetail.com&sz=128'},
  {
        name: 'Vocal Remover',
        domain: 'vocalremover.org',
        description: 'Separate voice from music in any song for free',
        url: 'https://vocalremover.org/',
        tags: ['Audio', 'AI'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=vocalremover.org&sz=128'},
  {
        name: 'BuildCores',
        domain: 'buildcores.com',
        description: 'Plan and organize your custom PC builds with ease',
        url: 'https://www.buildcores.com/',
        tags: ['PC Building', 'Hardware'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=buildcores.com&sz=128'},
  {
        name: 'MyInstants',
        domain: 'myinstants.com',
        description: 'Instant sound buttons for memes, games, and fun',
        url: 'https://www.myinstants.com/en/index/bd/',
        tags: ['Soundboard', 'Meme'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=myinstants.com&sz=128'},
  {
        name: 'Paper Animator',
        domain: 'paperanimator.com',
        description: 'Bring your paper drawings to life with simple animation',
        url: 'https://paperanimator.com/',
        tags: ['Animation', 'Creative'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=paperanimator.com&sz=128'
      },
  {
        name: 'Photoroom',
        domain: 'photoroom.com',
        description: 'AI-powered photo editing and background removal',
        url: 'https://www.photoroom.com/',
        tags: ['AI', 'Photo Editing'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=photoroom.com&sz=128'
      },
  {
        name: 'Genspark',
        domain: 'genspark.ai',
        description: 'Generative AI search and research assistant',
        url: 'https://www.genspark.ai/',
        tags: ['AI', 'Search'],
        type: 'AI',
        logo: 'https://www.google.com/s2/favicons?domain=genspark.ai&sz=128'
      }
    ]},
  {
    title: 'Image & Design Tools',
    portals: [
    {
        name: 'BeFunky',
        domain: 'befunky.com',
        description: 'Creative online photo editor and graphic design tool',
        url: 'https://www.befunky.com/',
        tags: ['Photo Editor', 'Design'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=befunky.com&sz=128'},
  {
        name: 'iPiccy',
        domain: 'ipiccy.com',
        description: 'Simple and powerful photo editing right in your browser',
        url: 'https://ipiccy.com/',
        tags: ['Photo Editor', 'Design'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=ipiccy.com&sz=128'},
  {
        name: 'Animoto',
        domain: 'animoto.com',
        description: 'Create professional quality videos with easy templates',
        url: 'https://animoto.com/',
        tags: ['Video Edit', 'AI'],
        type: 'Video',
        logo: 'https://www.google.com/s2/favicons?domain=animoto.com&sz=128'},
  {
        name: 'piZap',
        domain: 'pizap.com',
        description: 'Fun and easy to use online photo editor and collage maker',
        url: 'https://www.pizap.com/',
        tags: ['Collage', 'Design'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=pizap.com&sz=128'},
  {
        name: 'Font Generator',
        domain: 'font-generator.com',
        description: 'Create stylish and creative fonts for social media',
        url: 'https://www.font-generator.com/',
        tags: ['Fonts', 'Social Media'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=font-generator.com&sz=128'},
  {
        name: 'ICO Converter',
        domain: 'icoconverter.com',
        description: 'Easy way to convert any image into a favicon icon',
        url: 'https://www.icoconverter.com/',
        tags: ['Favicon', 'ICO'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=icoconverter.com&sz=128'},
  {
        name: 'Jitter',
        domain: 'jitter.video',
        description: 'Motion design tool for creating professional animations',
        url: 'https://jitter.video/',
        tags: ['Motion', 'Video'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=jitter.video&sz=128'},
  {
        name: 'Uizard',
        domain: 'uizard.io',
        description: 'AI-powered design tool for rapid UI prototyping',
        url: 'https://uizard.io/',
        tags: ['UI/UX', 'AI'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=uizard.io&sz=128'},
  {
        name: 'Uiverse',
        domain: 'uiverse.io',
        description: 'Community library of open-source UI elements',
        url: 'https://uiverse.io/',
        tags: ['UI', 'Tailwind'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=uiverse.io&sz=128'},
  {
        name: 'Napkin AI',
        domain: 'napkin.ai',
        description: 'Turn your text into visuals and workflows automatically',
        url: 'https://www.napkin.ai/',
        tags: ['AI', 'Visuals'],
        type: 'Creative',
        logo: 'https://www.google.com/s2/favicons?domain=napkin.ai&sz=128'},
  {
        name: 'Slidesgo AI',
        domain: 'slidesgo.com',
        description: 'AI presentation maker for quick and beautiful slides',
        url: 'https://slidesgo.com/ai/presentation-maker',
        tags: ['AI', 'Slides'],
        type: 'Presentation',
        logo: 'https://www.google.com/s2/favicons?domain=slidesgo.com&sz=128'},
  {
        name: 'Remove Photos',
        domain: 'remove.photos',
        description: 'Instantly remove backgrounds from images online',
        url: 'https://remove.photos/',
        tags: ['Background', 'AI'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=remove.photos&sz=128'},
  {
        name: 'Sejda',
        domain: 'sejda.com',
        description: 'Easy, pleasant and productive PDF editor',
        url: 'https://www.sejda.com/',
        tags: ['PDF', 'Editor'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=sejda.com&sz=128'},
  {
        name: 'LightPDF',
        domain: 'lightpdf.com',
        description: 'Cloud-based PDF solution for editing and converting',
        url: 'https://lightpdf.com/',
        tags: ['PDF', 'Cloud'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=lightpdf.com&sz=128'},
  {
        name: 'Space Type',
        domain: 'spacetypegenerator.com',
        description: 'Interactive typography generator for motion design',
        url: 'https://spacetypegenerator.com/',
        tags: ['Type', 'Interactive'],
        type: 'Design',
        logo: 'https://www.google.com/s2/favicons?domain=spacetypegenerator.com&sz=128'
      }
    ]},
  {
    title: 'Wallpapers & Visual Assets',
    portals: [
    {
        name: 'Unsplash',
        domain: 'unsplash.com',
        description: 'Beautiful free images for personal and commercial use',
        url: 'https://unsplash.com/',
        tags: ['Stock Photos', 'Free Images'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=unsplash.com&sz=128'},
  {
        name: 'DeviantArt',
        domain: 'deviantart.com',
        description: 'Large community for finding digital art and wallpapers',
        url: 'https://www.deviantart.com/',
        tags: ['Digital Art', 'Wallpapers'],
        type: 'Social',
        logo: 'https://www.google.com/s2/favicons?domain=deviantart.com&sz=128'},
  {
        name: 'The Poster DB',
        domain: 'themoviedb.org',
        description: 'Huge archive of high-quality movie and TV show posters',
        url: 'https://theposterdb.com/',
        tags: ['Posters', 'Archive'],
        type: 'Posters',
        logo: 'https://www.google.com/s2/favicons?domain=theposterdb.com&sz=128'},
  {
        name: 'Alternative Movie Posters',
        domain: 'alternativemovieposters.com',
        description: 'Collection of artistic and fan-made alternative posters',
        url: 'https://alternativemovieposters.com/',
        tags: ['Fan Art', 'Posters'],
        type: 'Posters',
        logo: 'https://www.google.com/s2/favicons?domain=alternativemovieposters.com&sz=128'},
  {
        name: 'Wallhaven',
        domain: 'wallhaven.cc',
        description: 'The best source for high-quality desktop wallpapers',
        url: 'https://wallhaven.cc/',
        tags: ['Wallpapers', '4K/8K'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=wallhaven.cc&sz=128'},
  {
        name: 'Wallpapers Home',
        domain: 'wallpapershome.com',
        description: 'Ultra-HD 4K and 8K wallpapers for any display',
        url: 'https://wallpapershome.com/',
        tags: ['Ultra HD', 'Wallpapers'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=wallpapershome.com&sz=128'},
  {
        name: 'Mob.org',
        domain: 'mob.org',
        description: 'Resource for finding mobile games, apps, and themes',
        url: 'https://mob.org/en',
        tags: ['Mobile Themes', 'Ringtones'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=mob.org&sz=128'},
  {
        name: 'MotionBGS',
        domain: 'motionbgs.com',
        description: 'High-quality animated backgrounds for creators',
        url: 'https://motionbgs.com/',
        tags: ['Animated', 'Video'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=motionbgs.com&sz=128'},
  {
        name: 'PNGimg',
        domain: 'pngimg.com',
        description: 'Huge database of free PNG images with transparency',
        url: 'https://pngimg.com/',
        tags: ['PNG', 'Transparent'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=pngimg.com&sz=128'},
  {
        name: 'MoeWalls',
        domain: 'moewalls.com',
        description: 'Premium anime engine and live wallpapers archive',
        url: 'https://moewalls.com/',
        tags: ['Anime', 'Live'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=moewalls.com&sz=128'},
  {
        name: 'Thiings',
        domain: 'thiings.co',
        description: 'Gallery of 3D objects and digital artifacts',
        url: 'https://www.thiings.co/things',
        tags: ['3D', 'Artifacts'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=thiings.co&sz=128'},
  {
        name: 'PaperMe',
        domain: 'pixzens.com',
        description: 'Create and print your own paper avatars',
        url: 'https://paperme.pixzens.com/en',
        tags: ['Paper', 'Avatar'],
        type: 'Creative',
        logo: 'https://www.google.com/s2/favicons?domain=pixzens.com&sz=128'
      }
    ]},
  {
    title: 'Privacy & Anonymous Email',
    portals: [
    {
        name: 'Privnote',
        domain: 'privnote.com',
        description: 'Send self-destructing notes to protect your privacy',
        url: 'https://privnote.com/',
        tags: ['Privacy', 'Encrypted'],
        type: 'Privacy',
        logo: 'https://www.google.com/s2/favicons?domain=privnote.com&sz=128'},
  {
        name: 'Proxyium',
        domain: 'proxyium.com',
        description: 'Free web proxy to browse any website anonymously',
        url: 'https://proxyium.com/',
        tags: ['Proxy', 'VPN'],
        type: 'Privacy',
        logo: 'https://www.google.com/s2/favicons?domain=proxyium.com&sz=128'},
  {
        name: 'CryptoGmail',
        domain: 'cryptogmail.com',
        description: 'Temporary and anonymous disposable email service',
        url: 'https://cryptogmail.com/',
        tags: ['Temp Mail', 'Crypto'],
        type: 'Privacy',
        logo: 'https://www.google.com/s2/favicons?domain=cryptogmail.com&sz=128'},
  {
        name: 'Mail.tm',
        domain: 'mail.tm',
        description: 'Fast disposable email service for private registration',
        url: 'https://mail.tm/en/',
        tags: ['Temp Mail', 'Disposable'],
        type: 'Mail',
        logo: 'https://www.google.com/s2/favicons?domain=mail.tm&sz=128'},
  {
        name: 'Temporary Mail',
        domain: 'temp-mail.org',
        description: 'Anonymous and secure temporary mailbox service',
        url: 'https://temp-mail.org/',
        tags: ['Temp Mail', 'Privacy'],
        type: 'Mail',
        logo: '/logos/temp-mail.png'
      }
    ]},
  {
    title: 'Security & Data Tools',
    portals: [
    {
        name: 'VirusTotal',
        domain: 'virustotal.com',
        description: 'Scan files and URLs to detect malware and viruses',
        url: 'https://www.virustotal.com/',
        tags: ['Malware Scan', 'Security'],
        type: 'Security',
        logo: 'https://www.google.com/s2/favicons?domain=virustotal.com&sz=128'},
  {
        name: 'CyberChef',
        domain: 'gchq.github.io',
        description: 'The Swiss army knife for data conversion and encryption',
        url: 'https://gchq.github.io/CyberChef/',
        tags: ['Data Tool', 'Encryption'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=github.io&sz=128'
      }
    ]
  }
];

export default function Tech() {
  return (
    <DirectoryLayout
      title="Tech Utilities."
      subtitle="Resources"
      description="System optimization and diagnostic portals. Essential tools for data manipulation, security verification, and asset retrieval."
      sections={TECH_SECTIONS}
      categoryId="tech"
    />
  );
}
