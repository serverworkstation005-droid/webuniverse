import { STREAMING_PROVIDERS } from '../pages/Streaming';
import { MOVIE_PROVIDERS } from '../pages/Movies';
import { ANIME_SECTIONS } from '../pages/Anime';
import { SOFTWARE_SECTIONS } from '../pages/Software';
import { TECH_SECTIONS } from '../pages/Tech';
import { GAMES_PORTALS } from '../pages/Games';
import { TORRENT_PORTALS } from '../pages/Torrents';
import { BOOKS_SECTIONS } from '../pages/Books';
import { TYPING_SECTIONS } from '../pages/Typing';

export interface PortalItem {
  name: string;
  domain: string;
  description: string;
  url: string;
  tags: string[];
  type: string;
  category: string;
  logo?: string;
  rating?: number;
  tier?: string;
  smartRank?: number;
  responseTime?: number;
}

export const getAllResources = (): PortalItem[] => {
  const resources: PortalItem[] = [];
  const seenSearchKeys = new Set<string>();

  const addSearchResource = (item: any, category: string) => {
    const domainKey = item.domain ? item.domain.replace(/^www\./, '').toLowerCase().trim() : '';
    const nameKey = item.name ? item.name.toLowerCase().trim() : '';
    
    // Check either name or domain
    if (seenSearchKeys.has(domainKey) || seenSearchKeys.has(nameKey)) return;
    
    seenSearchKeys.add(domainKey);
    seenSearchKeys.add(nameKey);

    resources.push({ ...item, category });
  };

  // Add Movies
  MOVIE_PROVIDERS.forEach(item => addSearchResource(item, 'Movies & Shows'));

  // Add Streaming
  STREAMING_PROVIDERS.forEach(item => addSearchResource(item, 'Streaming'));

  // Add Anime
  ANIME_SECTIONS.forEach(section => {
    section.portals.forEach(item => addSearchResource(item, 'Anime Universe'));
  });

  // Add Software
  SOFTWARE_SECTIONS.forEach(section => {
    section.portals.forEach(item => addSearchResource(item, 'Software Universe'));
  });

  // Add Typing
  TYPING_SECTIONS.forEach(section => {
    section.portals.forEach(item => addSearchResource(item, 'Typing & Tech Tools'));
  });

  // Add Tech
  TECH_SECTIONS.forEach(section => {
    section.portals.forEach(item => addSearchResource(item, 'Typing & Tech Tools'));
  });

  // Add Games
  GAMES_PORTALS.forEach(item => addSearchResource(item, 'Games Universe'));

  // Add Torrents
  TORRENT_PORTALS.forEach(item => addSearchResource(item, 'Torrent Universe'));

  // Add Books
  BOOKS_SECTIONS.forEach(section => {
    section.portals.forEach(item => addSearchResource(item, 'Knowledge & learning Hub'));
  });

  return resources;
};
