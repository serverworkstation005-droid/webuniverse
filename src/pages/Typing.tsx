import DirectoryLayout from '@/src/components/DirectoryLayout';

export const TYPING_SECTIONS = [
  {
    title: 'Global Performance Portals',
    portals: [
    {
        name: 'Monkeytype',
        domain: 'monkeytype.com',
        description: 'Minimalist & Customizable Typing Tool • Pro Choice',
        url: 'https://monkeytype.com/',
        tags: ['Pro', 'Minimal'],
        type: 'Trainer',
        logo: 'https://www.google.com/s2/favicons?domain=monkeytype.com&sz=128'},
  {
        name: 'TypingTest.com',
        domain: 'typingtest.com',
        description: 'The Industry Standard for Online Typing Speed Metrics',
        url: 'https://www.typingtest.com/',
        tags: ['Standard', 'WPM'],
        type: 'Test',
        logo: 'https://www.google.com/s2/favicons?domain=typingtest.com&sz=128'},
  {
        name: 'LiveChat Speed Test',
        domain: 'livechat.com',
        description: 'Professional Grade Assessment for Support Dynamics',
        url: 'https://www.livechat.com/typing-speed-test/',
        tags: ['Professional', 'Test'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=livechat.com&sz=128'},
  {
        name: '10FastFingers',
        domain: '10fastfingers.com',
        description: 'Classic Typing Speed Test • Multiple Languages',
        url: 'https://10fastfingers.com/',
        tags: ['Speed Test', 'Multi-Lang'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=10fastfingers.com&sz=128'},
  {
        name: 'Keybr',
        domain: 'keybr.com',
        description: 'Algorithmic Typing Training • Dynamic Learning',
        url: 'https://www.keybr.com/',
        tags: ['Learning', 'AI'],
        type: 'Trainer',
        logo: 'https://www.google.com/s2/favicons?domain=keybr.com&sz=128'
      }
    ]},
  {
    title: 'Bengali Specialization',
    portals: [
    {
        name: 'TypingTop Bengali',
        domain: 'typingtop.com',
        description: 'Advanced Bengali Script Practice & Speed Metrics',
        url: 'https://typingtop.com/bengali',
        tags: ['Bengali', 'Advanced'],
        type: 'Trainer',
        logo: 'https://www.google.com/s2/favicons?domain=typingtop.com&sz=128'},
  {
        name: 'Bangla Plus',
        domain: 'bangla.plus',
        description: 'Precision Focused Bengali Typing Test Interface',
        url: 'https://bangla.plus/bangla-typing-test/',
        tags: ['Bengali', 'Testing'],
        type: 'Tool',
        logo: 'https://www.google.com/s2/favicons?domain=bangla.plus&sz=128'},
  {
        name: 'Free Online Writing',
        domain: 'free-online-writing.com',
        description: 'Native Script Assessment with Accuracy Diagnostics',
        url: 'https://www.free-online-writing.com/bengali-typing-tests.html',
        tags: ['Bengali', 'Accuracy'],
        type: 'Test',
        logo: 'https://www.google.com/s2/favicons?domain=free-online-writing.com&sz=128'
      }
    ]},
  {
    title: 'Competitive & Education',
    portals: [
    {
        name: 'TypeRacer',
        domain: 'typeracer.com',
        description: 'Competitive Typing Portal • Global Races',
        url: 'https://play.typeracer.com/',
        tags: ['Racing', 'Global'],
        type: 'Competition',
        logo: 'https://www.google.com/s2/favicons?domain=typeracer.com&sz=128'},
  {
        name: 'Nitro Type',
        domain: 'nitrotype.com',
        description: 'Gamified Typing Experience • High Engagement',
        url: 'https://www.nitrotype.com/',
        tags: ['Gamified', 'Fun'],
        type: 'Play',
        logo: 'https://www.google.com/s2/favicons?domain=nitrotype.com&sz=128'},
  {
        name: 'Typing Games Zone',
        domain: 'typinggames.zone',
        description: 'Entertainment-First Neural Training Network',
        url: 'https://www.typinggames.zone/',
        tags: ['Games', 'Training'],
        type: 'Play',
        logo: 'https://www.google.com/s2/favicons?domain=typinggames.zone&sz=128'},
  {
        name: 'TypingClub',
        domain: 'typingclub.com',
        description: 'Comprehensive Typing Courses for Beginners',
        url: 'https://www.typingclub.com/',
        tags: ['Beginner', 'Lessons'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=typingclub.com&sz=128'
      }
    ]
  }
];

export default function Typing() {
  return (
    <DirectoryLayout
      title="Typing Tools."
      subtitle="Utility"
      description="Optimization portals for digital input. Enhance your data transmission speed through advanced neural-muscular training."
      sections={TYPING_SECTIONS}
      categoryId="typing"
    />
  );
}
