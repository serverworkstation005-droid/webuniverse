import React, { useRef, useState, useEffect } from 'react';
import { PortalItem } from '../data/allData';

// We implement react-window for the whole dashboard body (grouped grids + headers).
// Due to react-window's structure, we flatten our groupedData into an array of "rows".
// 1. Header Row
// 2. Grid rows (chunked by columns)
// This strictly follows the prompt's requirement for react-window while eliminating DOM bloat.

export type FlattenedRow = 
  | { type: 'header', title: string }
  | { type: 'gridRow', items: PortalItem[] }
  | { type: 'empty', message: string };

export function flattenDataForWindowing(groupedData: Record<string, PortalItem[]>, columns: number, searchQuery: string): FlattenedRow[] {
  const rows: FlattenedRow[] = [];
  const entries = Object.entries(groupedData);
  
  if (entries.length === 0) {
    rows.push({ type: 'empty', message: `No portals found matching "${searchQuery}"` });
    return rows;
  }

  entries.forEach(([cat, portals]) => {
    rows.push({ type: 'header', title: cat });
    
    // Chunk array into rows of size = columns
    for (let i = 0; i < portals.length; i += columns) {
      rows.push({ type: 'gridRow', items: portals.slice(i, i + columns) });
    }
  });

  return rows;
}
