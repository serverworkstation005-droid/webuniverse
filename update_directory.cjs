const fs = require('fs');

let code = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

// 1. Revert to grid
const targetGrid = `              <div 
                className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 xl:columns-7 gap-6 w-full mt-4 [column-fill:_balance]"
              >`;
const replaceGrid = `              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 w-full mt-4" style={{ gridAutoRows: 'minmax(min-content, max-content)' }}
              >`;
code = code.replace(targetGrid, replaceGrid);

// 2. Remove the break-inside-avoid modifications
const targetItem = `          className="block transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] will-change-transform ease-out break-inside-avoid mb-6"`;
const replaceItem = `          className="block transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] will-change-transform ease-out h-full"`;
code = code.split(targetItem).join(replaceItem);

// 3. Add scroll lock state and effect
const isPendingLine = `  const [isPending, startTransition] = useTransition();`;
const newStates = `  const [isPending, startTransition] = useTransition();
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    // Lock scrolling on search input focus
    if (isInputFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputFocused]);`;
code = code.replace(isPendingLine, newStates);

// 4. Update the input field handlers
const targetInput = `              <input 
                type="text"
                placeholder="Search sites in this category (Fast Search)..."
                onChange={handleSearchChange}
                defaultValue={searchQuery}
                className="w-full bg-slate-900/5 dark:bg-[#0a0a10]/80 border border-slate-900/10 dark:border-white/10 rounded-[20px] pl-14 lg:pl-16 pr-6 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 dark:focus:ring-purple-500/30 focus:bg-white/80 dark:group-focus-within:bg-[#0f0f18]/90 transition-all font-mono text-xs md:text-sm backdrop-blur-[40px] shadow-sm py-4"
              />`;
const replaceInput = `              <input 
                type="text"
                placeholder="Search sites in this category (Fast Search)..."
                onChange={handleSearchChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                defaultValue={searchQuery}
                className="w-full bg-slate-900/5 dark:bg-[#0a0a10]/80 border border-slate-900/10 dark:border-white/10 rounded-[20px] pl-14 lg:pl-16 pr-6 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 dark:focus:ring-purple-500/30 focus:bg-white/80 dark:group-focus-within:bg-[#0f0f18]/90 transition-all font-mono text-xs md:text-sm backdrop-blur-[40px] shadow-sm py-4"
              />`;
code = code.replace(targetInput, replaceInput);

fs.writeFileSync('src/components/DirectoryLayout.tsx', code);
