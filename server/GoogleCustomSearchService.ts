export class GoogleCustomSearchService {
  private static get apiKey() { return process.env.GOOGLE_CUSTOM_SEARCH_API_KEY; }
  private static get cx() { return process.env.GOOGLE_CUSTOM_SEARCH_CX; }

  public static async fetchHighQualityImage(query: string, type: string): Promise<string | null> {
    if (!this.apiKey || !this.cx) return null;
    
    // Tailor query to ensure clear logos or posters with good aspect ratio
    const isSoftware = type === "software" || type === "system" || type === "tool";
    const cleanQuery = query.replace(/(download|free|pc|mac|windows|linux|apk|iso)/gi, "").trim();
    
    const q = isSoftware 
        ? `${cleanQuery || query} official (logo OR icon) transparent -screenshot -ui` 
        : `${query} ${type} poster cover high resolution`;

    // &imgType=photo&imgSize=large for posters to ensure high quality
    // &imgSize=medium for software icons to get a good square 1:1 roughly
    const sizeParam = isSoftware ? "&imgSize=medium" : "&imgSize=large&imgType=photo";
    const aspectParam = isSoftware ? "&imgType=logo" : "";

    const url = `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.cx}&q=${encodeURIComponent(q)}&searchType=image&num=3${sizeParam}${aspectParam}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        let validItems = data.items;
        if (!isSoftware) {
          validItems = data.items.filter((item: any) => 
              !item.link.includes('wikimedia.org') && 
              !item.link.includes('wikipedia.org') &&
              !item.link.includes('apple.com') 
          );
        } else {
          // Allow wikimedia for software because they are often the exact official vector logos!
          validItems = data.items.filter((item: any) => !item.link.includes('apple.com'));
        }
        
        let validItem = validItems.length > 0 ? validItems[0] : data.items[0];
        
        // If we want slightly better matching for software without overly strict rules
        if (isSoftware && validItems.length > 1) {
          const queryLower = (cleanQuery || query).toLowerCase().split(' ')[0]; // use primary keyword
          const matchedItem = validItems.find((item: any) => 
            item.title?.toLowerCase().includes(queryLower) || item.snippet?.toLowerCase().includes(queryLower)
          );
          if (matchedItem) validItem = matchedItem;
        }

        return validItem ? validItem.link : data.items[0].link;
      }
    } catch (e) {
      console.error("GoogleCustomSearchService error:", e);
    }
    return null;
  }
}
