/**
 * Automatic List Formatting Utility for Search Results
 * Detects and formats list structures with proper spacing and hierarchy
 */

import React from 'react';

export interface ListFormattingOptions {
  baseIndent?: number;
  listItemSpacing?: number;
  nestedIndentMultiplier?: number;
  bulletStyle?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha';
  preserveOriginalFormatting?: boolean;
  responsiveSpacing?: boolean;
  maxWidth?: number;
}

export interface FormattedListItem {
  content: string;
  level: number;
  type: 'ordered' | 'unordered' | 'text';
  index?: number;
  children?: FormattedListItem[];
}

export interface FormattedSearchResult {
  originalContent: string;
  formattedContent: string;
  hasLists: boolean;
  listItems: FormattedListItem[];
  metadata: {
    totalItems: number;
    maxNestingLevel: number;
    listTypes: string[];
  };
}

/**
 * Main function to format search results with automatic list detection
 */
export function formatSearchResultsWithLists(
  searchResults: any[],
  options: ListFormattingOptions = {}
): FormattedSearchResult[] {
  const defaultOptions: Required<ListFormattingOptions> = {
    baseIndent: 16,
    listItemSpacing: 8,
    nestedIndentMultiplier: 1.5,
    bulletStyle: 'disc',
    preserveOriginalFormatting: true,
    responsiveSpacing: true,
    maxWidth: 600,
    ...options
  };

  return searchResults.map(result => {
    const content = extractTextContent(result);
    const detectedLists = detectListStructures(content);
    const formattedItems = formatListItems(detectedLists, defaultOptions);
    
    return {
      originalContent: content,
      formattedContent: generateFormattedHTML(formattedItems, defaultOptions),
      hasLists: detectedLists.length > 0,
      listItems: formattedItems,
      metadata: {
        totalItems: countTotalItems(formattedItems),
        maxNestingLevel: getMaxNestingLevel(formattedItems),
        listTypes: getUniqueListTypes(formattedItems)
      }
    };
  });
}

/**
 * Detects list structures in text content
 */
function detectListStructures(content: string): FormattedListItem[] {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const listItems: FormattedListItem[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listItem = parseListItem(line, i);
    
    if (listItem) {
      listItems.push(listItem);
    } else if (line.length > 0) {
      // Regular text content
      listItems.push({
        content: line,
        level: 0,
        type: 'text'
      });
    }
  }
  
  return buildListHierarchy(listItems);
}

/**
 * Parses a single line to detect if it's a list item
 */
function parseListItem(line: string, index: number): FormattedListItem | null {
  // Detect ordered lists (1. 2. 3. or 1) 2) 3) or a. b. c.)
  const orderedPatterns = [
    /^(\s*)(\d+)[\.\)]\s+(.+)$/,
    /^(\s*)([a-zA-Z])[\.\)]\s+(.+)$/,
    /^(\s*)([ivxlcdm]+)[\.\)]\s+(.+)$/i
  ];
  
  // Detect unordered lists (• - * +)
  const unorderedPatterns = [
    /^(\s*)[•\-\*\+]\s+(.+)$/,
    /^(\s*)[\u2022\u2023\u25E6\u2043\u204C\u204D]\s+(.+)$/
  ];
  
  // Check ordered lists
  for (const pattern of orderedPatterns) {
    const match = line.match(pattern);
    if (match) {
      const [, indent, marker, content] = match;
      return {
        content: content.trim(),
        level: Math.floor(indent.length / 2),
        type: 'ordered',
        index: isNaN(parseInt(marker)) ? index + 1 : parseInt(marker)
      };
    }
  }
  
  // Check unordered lists
  for (const pattern of unorderedPatterns) {
    const match = line.match(pattern);
    if (match) {
      const [, indent, content] = match;
      return {
        content: content.trim(),
        level: Math.floor(indent.length / 2),
        type: 'unordered'
      };
    }
  }
  
  return null;
}

/**
 * Builds hierarchical structure from flat list items
 */
function buildListHierarchy(items: FormattedListItem[]): FormattedListItem[] {
  const result: FormattedListItem[] = [];
  const stack: FormattedListItem[] = [];
  
  for (const item of items) {
    // Pop items from stack until we find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // Top-level item
      result.push(item);
    } else {
      // Nested item
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
    
    if (item.type !== 'text') {
      stack.push(item);
    }
  }
  
  return result;
}

/**
 * Formats list items with proper spacing and styling
 */
function formatListItems(
  items: FormattedListItem[],
  options: Required<ListFormattingOptions>
): FormattedListItem[] {
  return items.map(item => ({
    ...item,
    children: item.children ? formatListItems(item.children, options) : undefined
  }));
}

/**
 * Generates formatted HTML with proper spacing and styling
 */
function generateFormattedHTML(
  items: FormattedListItem[],
  options: Required<ListFormattingOptions>
): string {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const spacing = options.responsiveSpacing && isMobile 
    ? Math.floor(options.listItemSpacing * 0.75) 
    : options.listItemSpacing;
  
  return items.map(item => formatItemHTML(item, options, spacing, 0)).join('');
}

/**
 * Formats individual item as HTML
 */
function formatItemHTML(
  item: FormattedListItem,
  options: Required<ListFormattingOptions>,
  spacing: number,
  depth: number
): string {
  const indent = options.baseIndent + (depth * options.baseIndent * options.nestedIndentMultiplier);
  const marginBottom = depth === 0 ? spacing * 1.5 : spacing;
  
  let html = '';
  
  if (item.type === 'text') {
    html = `
      <div style="
        margin-bottom: ${marginBottom}px;
        line-height: 1.5;
        color: #374151;
        font-size: 14px;
      ">
        ${escapeHTML(item.content)}
      </div>
    `;
  } else {
    const bullet = getBulletStyle(item, options, depth);
    html = `
      <div style="
        display: flex;
        align-items: flex-start;
        margin-bottom: ${marginBottom}px;
        margin-left: ${indent}px;
        line-height: 1.5;
      ">
        <span style="
          margin-right: 8px;
          color: #6B7280;
          font-weight: 500;
          font-size: 14px;
          min-width: 20px;
          display: inline-block;
        ">
          ${bullet}
        </span>
        <span style="
          color: #374151;
          font-size: 14px;
          flex: 1;
        ">
          ${escapeHTML(item.content)}
        </span>
      </div>
    `;
  }
  
  // Add children
  if (item.children && item.children.length > 0) {
    html += item.children
      .map(child => formatItemHTML(child, options, spacing, depth + 1))
      .join('');
  }
  
  return html;
}

/**
 * Gets appropriate bullet style for list item
 */
function getBulletStyle(
  item: FormattedListItem,
  options: Required<ListFormattingOptions>,
  depth: number
): string {
  if (item.type === 'ordered') {
    return `${item.index || 1}.`;
  }
  
  const bullets = ['•', '◦', '▪', '▫'];
  return bullets[depth % bullets.length] || '•';
}

/**
 * Utility functions
 */
function extractTextContent(result: any): string {
  if (typeof result === 'string') return result;
  if (result && typeof result.content === 'string') return result.content;
  if (result && typeof result.text === 'string') return result.text;
  return JSON.stringify(result);
}

function countTotalItems(items: FormattedListItem[]): number {
  return items.reduce((count, item) => {
    return count + 1 + (item.children ? countTotalItems(item.children) : 0);
  }, 0);
}

function getMaxNestingLevel(items: FormattedListItem[]): number {
  return items.reduce((maxLevel, item) => {
    const childLevel = item.children ? getMaxNestingLevel(item.children) : 0;
    return Math.max(maxLevel, item.level + childLevel);
  }, 0);
}

function getUniqueListTypes(items: FormattedListItem[]): string[] {
  const types = new Set<string>();
  
  function collectTypes(items: FormattedListItem[]) {
    items.forEach(item => {
      types.add(item.type);
      if (item.children) {
        collectTypes(item.children);
      }
    });
  }
  
  collectTypes(items);
  return Array.from(types);
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * React hook for responsive spacing
 */
export function useResponsiveListSpacing() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const getSpacingConfig = React.useCallback((): ListFormattingOptions => {
    switch (screenSize) {
      case 'mobile':
        return {
          baseIndent: 12,
          listItemSpacing: 6,
          nestedIndentMultiplier: 1.2,
          responsiveSpacing: true
        };
      case 'tablet':
        return {
          baseIndent: 14,
          listItemSpacing: 7,
          nestedIndentMultiplier: 1.3,
          responsiveSpacing: true
        };
      default:
        return {
          baseIndent: 16,
          listItemSpacing: 8,
          nestedIndentMultiplier: 1.5,
          responsiveSpacing: true
        };
    }
  }, [screenSize]);
  
  return {
    isMobile,
    screenSize,
    spacingConfig: getSpacingConfig()
  };
}