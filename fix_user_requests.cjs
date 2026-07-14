const fs = require("fs");
let content = fs.readFileSync("/app/applet/src/pages/SmartSearch.tsx", "utf-8");

// 1. Add back the block for scroll locking when search is focused
const scrollLockEffect = `
  // --- SCROLL LOCK: Search Stage ---
  useEffect(() => {
    if (isInputFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputFocused]);
`;

// Insert after the existing scrolling hook or somewhere around line 935.
// Let us replace the comment that was added earlier:
content = content.replace(/\/\/ Removed document\.body\.style\.overflow locked scrolling logic as requested by user to allow natural scroll./g, scrollLockEffect);

// 2. Remove "Quick Access" / "Recent" Fullscreen overlay
// Let us find the block starting at {/* Fullscreen Blur Overlay when Search is Focused and Empty */}
const overlayRegex = /\{\/\* Fullscreen Blur Overlay[\s\S]*?\{\/\* Static Hero Section \*\//;
content = content.replace(overlayRegex, "{/* Static Hero Section */");

// 3. Revert Floating morphing search bar
const morphSearchBarRegex = /<AnimatePresence mode="wait">[\s\S]*?<\/AnimatePresence>\s*<AnimatePresence>/;
content = content.replace(morphSearchBarRegex, "{searchBarNode}\n             <AnimatePresence>");

// Save
fs.writeFileSync("/app/applet/src/pages/SmartSearch.tsx", content);
console.log("Fixed!");
