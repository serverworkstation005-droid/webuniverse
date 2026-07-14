import DirectoryLayout from '@/src/components/DirectoryLayout';

export const BOOKS_SECTIONS = [
  {
    title: 'Practical Knowledge & Skills',
    portals: [
    {
        name: 'W3Schools',
        domain: 'w3schools.com',
        description: 'Web development tutorials and interactive online coding learning',
        url: 'https://www.w3schools.com/',
        tags: ['Web Dev', 'Tutorials'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=w3schools.com&sz=128'},
  {
        name: 'GeeksforGeeks',
        domain: 'geeksforgeeks.org',
        description: 'Computer science portal with programming tutorials and interview preparation',
        url: 'https://www.geeksforgeeks.org/',
        tags: ['CS', 'Interview Prep'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=geeksforgeeks.org&sz=128'},
  {
        name: 'Tutorialspoint',
        domain: 'tutorialspoint.com',
        description: 'Library of tech tutorials, video courses, and online compilers',
        url: 'https://www.tutorialspoint.com/',
        tags: ['Tutorials', 'Video'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=tutorialspoint.com&sz=128'},
  {
        name: 'freeCodeCamp',
        domain: 'freecodecamp.org',
        description: 'Free verified curriculum, coding platforms, and certificates',
        url: 'https://www.freecodecamp.org/',
        tags: ['Free Certified', 'Coding'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=freecodecamp.org&sz=128'},
  {
        name: 'Codecademy',
        domain: 'codecademy.com',
        description: 'Learn to code interactively with hands-on practice programs',
        url: 'https://www.codecademy.com/',
        tags: ['Interactive', 'Languages'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=codecademy.com&sz=128'},
  {
        name: 'LeetCode',
        domain: 'leetcode.com',
        description: 'The best platform to help you enhance your programming skills and prepare for technical interviews',
        url: 'https://leetcode.com/',
        tags: ['Algorithms', 'Interview'],
        type: 'Practice',
        logo: 'https://www.google.com/s2/favicons?domain=leetcode.com&sz=128'},
  {
        name: 'HackerRank',
        domain: 'hackerrank.com',
        description: 'Practice coding skills, solve challenges, and get noticed by recruiters',
        url: 'https://www.hackerrank.com/',
        tags: ['Coding', 'Rankings'],
        type: 'Practice',
        logo: 'https://www.google.com/s2/favicons?domain=hackerrank.com&sz=128'},
  {
        name: 'Hackathon',
        domain: 'hackathon.com',
        description: 'Directory and platform for discovering international hackathons and technology contests',
        url: 'https://www.hackathon.com/',
        tags: ['Hackathons', 'Contests'],
        type: 'Platform',
        logo: 'https://www.google.com/s2/favicons?domain=hackathon.com&sz=128'},
  {
        name: 'MuscleWiki',
        domain: 'musclewiki.com',
        description: 'Simplified fitness and anatomy-based exercise platform',
        url: 'https://musclewiki.com/',
        tags: ['Fitness', 'Anatomy'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=musclewiki.com&sz=128'},
  {
        name: 'Workout Cool',
        domain: 'workout.cool',
        description: 'Interactive workout planner and exercise guides',
        url: 'https://www.workout.cool/en',
        tags: ['Fitness', 'Workout'],
        type: 'Utility',
        logo: 'https://www.google.com/s2/favicons?domain=workout.cool&sz=128'},
  {
        name: 'iFixit',
        domain: 'ifixit.com',
        description: 'The free repair manual for every device and machine',
        url: 'https://www.ifixit.com/',
        tags: ['Repair', 'Open Source'],
        type: 'Manual',
        logo: 'https://www.google.com/s2/favicons?domain=ifixit.com&sz=128'},
  {
        name: 'CarCareKiosk',
        domain: 'carcarekiosk.com',
        description: 'Deep library of free car repair and maintenance videos',
        url: 'https://www.carcarekiosk.com/',
        tags: ['Automotive', 'Repair'],
        type: 'Video',
        logo: 'https://www.google.com/s2/favicons?domain=carcarekiosk.com&sz=128'},
  {
        name: 'WithDiode',
        domain: 'tinkered.ai',
        description: 'AI-powered exploration of electronics and circuits',
        url: 'https://www.tinkered.ai/withdiode',
        tags: ['Electronics', 'AI'],
        type: 'Education',
        logo: 'https://www.google.com/s2/favicons?domain=tinkered.ai&sz=128'},
  {
        name: 'Sketchfab',
        domain: 'sketchfab.com',
        description: 'Discover and share trillions of 3D models and artifacts',
        url: 'https://sketchfab.com/',
        tags: ['3D', 'Modeling'],
        type: 'Archive',
        logo: 'https://www.google.com/s2/favicons?domain=sketchfab.com&sz=128'},
  {
        name: 'Coddy',
        domain: 'coddy.tech',
        description: 'Interactive byte-sized coding lessons for all levels',
        url: 'https://coddy.tech/',
        tags: ['Coding', 'Development'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=coddy.tech&sz=128'
      }
    ]},
  {
    title: 'Board Results & Official Data',
    portals: [
    {
        name: 'E-Board Results',
        domain: 'eboardresults.com',
        description: 'Check SSC, HSC and other board exam results online',
        url: 'https://eboardresults.com/v2/home',
        tags: ['Results', 'Official'],
        type: 'Service',
        logo: 'https://www.google.com/s2/favicons?domain=eboardresults.com&sz=128'},
  {
        name: 'Education Board',
        domain: 'educationboardresults.gov.bd',
        description: 'Official archive for Bangladesh education board results',
        url: 'https://www.educationboardresults.gov.bd/v2/home',
        tags: ['Results', 'Gov'],
        type: 'Official',
        logo: 'https://www.google.com/s2/favicons?domain=educationboardresults.gov.bd&sz=128'
      }
    ]},
  {
    title: 'Study Materials & Exam Intel',
    portals: [
    {
        name: 'Admission War',
        domain: 'admissionwar.com',
        description: 'University admission info and previous question bank',
        url: 'https://www.admissionwar.com/',
        tags: ['Academic', 'Admission'],
        type: 'Library',
        logo: 'https://www.google.com/s2/favicons?domain=admissionwar.com&sz=128'},
  {
        name: 'Courstika',
        domain: 'courstika.com',
        description: 'Guidebooks and creative academic solutions for students',
        url: 'https://courstika.com/',
        tags: ['Guides', 'Creative'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=courstika.com&sz=128'},
  {
        name: 'Proshna',
        domain: 'proshna.com',
        description: 'Archive of previous years national examination questions',
        url: 'https://proshna.com/',
        tags: ['Questions', 'Archive'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=proshna.com&sz=128'},
  {
        name: 'Onushilon Edu',
        domain: 'onushilonedu.com',
        description: 'Practice hub and study materials for school and college',
        url: 'https://onushilonedu.com/',
        tags: ['Practice', 'School'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=onushilonedu.com&sz=128'},
  {
        name: 'Education Blog 24',
        domain: 'educationblog24.com',
        description: 'Latest educational news, result updates and resources',
        url: 'https://www.educationblog24.com/',
        tags: ['News', 'Updates'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=educationblog24.com&sz=128'},
  {
        name: 'Teaching BD',
        domain: 'teachingbd24.com',
        description: 'Digital classroom and educational lessons for all levels',
        url: 'https://teachingbd24.com/',
        tags: ['School', 'Teaching'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=teachingbd24.com&sz=128'},
  {
        name: 'Accounting Mama',
        domain: 'accountingmama.com',
        description: 'Resources for business studies and accounting students',
        url: 'https://www.accountingmama.com/',
        tags: ['Finance', 'Study'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=accountingmama.com&sz=128'},
  {
        name: '1 Time School',
        domain: '1timeschool.com',
        description: 'Learning hub for HSC and secondary school students',
        url: 'https://www.1timeschool.com/p/hsc.html',
        tags: ['HSC', 'School'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=1timeschool.com&sz=128'
      }
    ]},
  {
    title: 'Learning Platforms & Academies',
    portals: [
    {
        name: '10 Minute School',
        domain: '10minuteschool.com',
        description: 'All-in-one digital education platform for Bangladesh',
        url: 'https://10minuteschool.com/',
        tags: ['Learning', 'Video'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=10minuteschool.com&sz=128'},
  {
        name: 'Satt Academy',
        domain: 'sattacademy.com',
        description: 'Online learning and exam portal for job preparation',
        url: 'https://sattacademy.com/',
        tags: ['Course', 'Exam'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=sattacademy.com&sz=128'},
  {
        name: 'EDPDU BD',
        domain: 'edpdu.com',
        description: 'Educational document and exam result retrieval portal',
        url: 'https://edpdu.com/bn',
        tags: ['Resource', 'Academic'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=edpdu.com&sz=128'},
  {
        name: 'MCQ Academy',
        domain: 'mcqacademy.com',
        description: 'Practice hub for competitive MCQ based examinations',
        url: 'https://mcqacademy.com/',
        tags: ['MCQ', 'Prep'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=mcqacademy.com&sz=128'},
  {
        name: 'Bissoy',
        domain: 'bissoy.com',
        description: 'Community-driven knowledge and question-answer hub',
        url: 'https://www.bissoy.com/home',
        tags: ['Q&A', 'Knowledge'],
        type: 'Intel',
        logo: 'https://www.google.com/s2/favicons?domain=bissoy.com&sz=128'},
  {
        name: 'Class Central',
        domain: 'classcentral.com',
        description: 'Aggregator of free online courses from top universities worldwide',
        url: 'https://www.classcentral.com/',
        tags: ['MOOC', 'Courses'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=classcentral.com&sz=128'},
  {
        name: 'BioDigital Human',
        domain: 'human.biodigital.com',
        description: 'Interactive 3D visualization of human anatomy and health conditions',
        url: 'https://human.biodigital.com/',
        tags: ['Anatomy', 'Interactive'],
        type: 'Academy',
        logo: 'https://www.google.com/s2/favicons?domain=human.biodigital.com&sz=128'
      }
    ]},
  {
    title: 'Digital Libraries & Knowledge Hubs',
    portals: [
    {
        name: 'Banglapedia',
        domain: 'banglapedia.org',
        description: 'The national encyclopedia for knowledge about Bangladesh',
        url: 'https://bn.banglapedia.org/',
        tags: ['History', 'Culture'],
        type: 'Library',
        logo: 'https://www.google.com/s2/favicons?domain=banglapedia.org&sz=128'},
  {
        name: 'Accessible Dictionary',
        domain: 'accessibledictionary.gov.bd',
        description: 'Official Bengali and English dictionary by the government',
        url: 'https://accessibledictionary.gov.bd/',
        tags: ['Dictionary', 'Gov'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=accessibledictionary.gov.bd&sz=128'},
  {
        name: 'BOU E-books',
        domain: 'ebookbou.edu.bd',
        description: 'Online library for Bangladesh Open University textbooks',
        url: 'https://www.ebookbou.edu.bd/index.php',
        tags: ['Open Univ', 'Books'],
        type: 'Library',
        logo: 'https://www.google.com/s2/favicons?domain=ebookbou.edu.bd&sz=128'},
  {
        name: 'Scribd',
        domain: 'scribd.com',
        description: 'Digital library for documents, books and audiobooks',
        url: 'https://www.scribd.com/',
        tags: ['Library', 'Audio'],
        type: 'Service',
        logo: 'https://www.google.com/s2/favicons?domain=scribd.com&sz=128'},
  {
        name: 'PDF Hubs',
        domain: 'pdfhubs.com',
        description: 'Archive of diverse literature and English/Bengali book PDFs',
        url: 'https://pdfhubs.com/',
        tags: ['Literature', 'PDF'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=pdfhubs.com&sz=128'
      },
  {
        name: 'Learn Anything',
        domain: 'learn-anything.xyz',
        description: 'Organize world knowledge, explore and share learning resources',
        url: 'https://learn-anything.xyz/',
        tags: ['Learning', 'Knowledge'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=learn-anything.xyz&sz=128'
      },
  {
        name: 'QuickRef',
        domain: 'quickref.me',
        description: 'Quick reference cheat sheets for developers and tech enthusiasts',
        url: 'https://quickref.me/',
        tags: ['Cheat Sheet', 'Dev'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=quickref.me&sz=128'
      }
    ]},
  {
    title: 'Global Knowledge Archives',
    portals: [
    {
        name: 'Internet Archive',
        domain: 'archive.org',
        description: 'Non-profit library of millions of free books and movies',
        url: 'https://archive.org/details/texts',
        tags: ['Universal', 'History'],
        type: 'Library',
        logo: 'https://www.google.com/s2/favicons?domain=archive.org&sz=128'},
  {
        name: 'PDF Drive',
        domain: 'pdfdrive.com',
        description: 'Search engine for finding and downloading PDF titles',
        url: 'https://www.pdfdrive.com/',
        tags: ['Search', 'PDF'],
        type: 'Resource',
        logo: 'https://www.google.com/s2/favicons?domain=pdfdrive.com&sz=128'},
  {
        name: 'Project Gutenberg',
        domain: 'gutenberg.org',
        description: 'Over 70,000 free public domain classic ebooks',
        url: 'https://www.gutenberg.org/',
        tags: ['Public Domain', 'Classic'],
        type: 'Archive',
        logo: 'https://www.google.com/s2/favicons?domain=gutenberg.org&sz=128'
      }
    ]
  }
];

export default function Books() {
  return (
    <DirectoryLayout
      title="Knowledge & Learning Hub."
      subtitle="Knowledge"
      description="Unlimited knowledge portals. Centralized access to global literature, scientific discourse, and historical archives."
      sections={BOOKS_SECTIONS}
      categoryId="books"
    />
  );
}
