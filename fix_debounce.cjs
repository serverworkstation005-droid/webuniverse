const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const importTarget = 'import React, { useState, useEffect, useRef, useMemo } from "react";';

const replacement = `import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`;

code = code.replace(importTarget, replacement);
fs.writeFileSync('src/pages/SmartSearch.tsx', code);
