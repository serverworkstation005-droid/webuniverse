export function analyzeSearchQuery(query: string): 'game' | 'movie' | 'software' | 'all' {
  const qL = query.toLowerCase().trim();

  // Strong Software Signals
  const softwareRegex = /\b(photoshop|illustrator|premiere|after effects|microsoft|office|windows|macos|linux|ubuntu|adobe|figma|sketch|vscode|intellij|pycharm|webstorm|docker|slack|discord|telegram|whatsapp|obs|winrar|7zip|vlc|chrome|firefox|brave|opera|safari|notion|obsidian|spotify|app|software|apk|exe|dmg|deb|keygen|tools?)\b/i;
  
  // Strong Game Signals
  const gameRegex = /\b(gta|grand theft auto|minecraft|roblox|fortnite|call of duty|valorant|league of legends|dota|csgo|counter strike|cyberpunk|witcher|red dead redemption|skyrim|fallout|doom|half life|portal|zelda|mario|pokemon|elden ring|dark souls|bloodborne|sekiro|resident evil|silent hill|final fantasy|assassin's creed|far cry|halo|gears of war|god of war|fifa|madden|nba 2k|pubg|apex legends|overwatch|rainbow six siege|destiny 2|warframe|genshin impact|honkai|black myth|wukong|game|pc game|ps4|ps5|xbox|nintendo switch|steam|epic games)\b/i;

  // Strong Movie/TV Signals
  const movieRegex = /\b(movie|film|tv show|season|episode|netflix|hulu|hbo|disney\+|prime video|1080p|720p|4k|bluray|blu-ray|web-dl|hdrip|camrip|imax|cinema|anime|manga|crunchyroll)\b/i;

  // Extremely ambiguous franchises that have huge games AND movies, defaulting to 'all' allows cross-search
  const ambiguousFranchises = /\b(batman|spider-man|spiderman|star wars|harry potter|lord of the rings|lotr|marvel|avengers|dc|transformers|lego|dune|tomb raider|matrix|alien|predator|jurassic)\b/i;

  let scoreSoftware = softwareRegex.test(qL) ? 1 : 0;
  let scoreGame = gameRegex.test(qL) ? 1 : 0;
  let scoreMovie = movieRegex.test(qL) ? 1 : 0;

  if (ambiguousFranchises.test(qL)) {
    // If it has strong ambiguous term without a specific qualifier, return 'all'
    if (scoreSoftware === 0 && scoreGame === 0 && scoreMovie === 0) {
      return 'all';
    }
  }

  // Calculate generic intent
  if (scoreSoftware > 0 && scoreGame === 0 && scoreMovie === 0) return 'software';
  if (scoreGame > 0 && scoreSoftware === 0 && scoreMovie === 0) return 'game';
  if (scoreMovie > 0 && scoreSoftware === 0 && scoreGame === 0) return 'movie';

  // If no strong signal, default to 'all' so UI shows unified results
  return 'all';
}
