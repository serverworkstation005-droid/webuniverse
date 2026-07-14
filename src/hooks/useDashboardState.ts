import { useState, useEffect, useDeferredValue, useMemo, useCallback } from 'react';
import { getAllResources, PortalItem } from '../data/allData';

export function useDashboardState() {
  const allData = useMemo(() => getAllResources(), []);
  
  const categories = useMemo(() => {
    return [
      "All",
      "Movies & Shows",
      "Streaming",
      "Anime Universe",
      "Games Universe",
      "Software Universe",
      "Torrent Universe",
      "Typing & Tech Tools",
      "Knowledge & learning Hub"
    ];
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const favs = localStorage.getItem("dash_favorites");
      if (favs) setFavorites(JSON.parse(favs));
      const recs = localStorage.getItem("dash_recent");
      if (recs) setRecent(JSON.parse(recs));
    } catch(e) {}
  }, []);

  const toggleFavorite = useCallback((portal: PortalItem) => {
    setFavorites(prev => {
      const newFavs = prev.includes(portal.domain) 
        ? prev.filter(d => d !== portal.domain)
        : [...prev, portal.domain];
      localStorage.setItem("dash_favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const handleVisit = useCallback((portal: PortalItem) => {
    setRecent(prev => {
      const filtered = prev.filter(d => d !== portal.domain);
      const newRecent = [portal.domain, ...filtered].slice(0, 5);
      localStorage.setItem("dash_recent", JSON.stringify(newRecent));
      return newRecent;
    });
  }, []);

  const clearVisitedHistory = useCallback(() => {
    setRecent([]);
    localStorage.removeItem("dash_recent");
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem("dash_favorites");
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      if (deferredSearchQuery) {
        const q = deferredSearchQuery.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(q) || 
                              item.domain.toLowerCase().includes(q) || 
                              (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
        if (!matchesSearch) return false;
      }

      if (activeCategory === "Favorites") {
        return favorites.includes(item.domain);
      }
      if (activeCategory !== "All") {
        return item.category === activeCategory;
      }
      
      return true;
    });
  }, [allData, deferredSearchQuery, activeCategory, favorites]);

  const groupedData = useMemo(() => {
    const groups: Record<string, PortalItem[]> = {};
    filteredData.forEach(item => {
      const cat = item.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    
    // Sort logic from previous query if any. Let's make "Movies & Shows" appear 1st, "Streaming" appear 2nd if present.
    // wait, we can sort object entries later or do it here. Or we just keep it as is.
    
    if (activeCategory !== "All" && activeCategory !== "Favorites") {
       return { [activeCategory]: groups[activeCategory] || [] };
    }
    
    // Ensure "Movies & Shows" is first, "Streaming" is second
    const sortedGroups: Record<string, PortalItem[]> = {};
    if (groups["Movies & Shows"]) sortedGroups["Movies & Shows"] = groups["Movies & Shows"];
    if (groups["Streaming"]) sortedGroups["Streaming"] = groups["Streaming"];
    
    Object.keys(groups).forEach(key => {
      if (key !== "Movies & Shows" && key !== "Streaming") {
        sortedGroups[key] = groups[key];
      }
    });
    
    return sortedGroups;
  }, [filteredData, activeCategory]);

  return {
    allData,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    favorites,
    recent,
    toggleFavorite,
    handleVisit,
    clearVisitedHistory,
    clearFavorites,
    groupedData
  };
}
