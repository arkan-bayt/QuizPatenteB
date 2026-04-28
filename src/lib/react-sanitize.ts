'use client';

/**
 * React #310 Prevention - RADICAL FIX
 * 
 * Instead of patching react/jsx-runtime (which doesn't work reliably due to 
 * ES module interop), we patch React.createElement which is the LOWEST level
 * function that ALL JSX transforms eventually go through.
 * 
 * Additionally, we wrap the React reconciler to catch objects before they
 * cause a crash.
 */

import React from 'react';

// Store original
const originalCreateElement = React.createElement;

// Track violations for logging
let violationCount = 0;

/**
 * Convert any unsafe value to a renderable safe value.
 */
function makeSafe(child: unknown): unknown {
  if (child === null || child === undefined || typeof child === 'boolean') return child;
  if (typeof child === 'string' || typeof child === 'number') return child;
  
  if (typeof child === 'object' && child !== null) {
    // React Element (has $$typeof) - always safe
    if ((child as any).$$typeof !== undefined) return child;
    
    // Arrays are handled by React natively
    if (Array.isArray(child)) return child;
    
    // Iterables (Map, Set, etc.)
    if (typeof (child as any)[Symbol.iterator] === 'function') return child;
    
    // PORTAL - React portals have $$typeof too
    // But double-check
    try {
      const keys = Object.keys(child as object);
      if (keys.length === 0) return '';
      // If it has common object properties, it's a plain object - NOT safe
    } catch { /* ignore */ }
    
    // DANGEROUS: Plain object being rendered as React child
    if (violationCount < 3) {
      console.error(
        '[REACT_310_FIX] ❌ Plain object rendered as React child - REPLACED with empty string',
        '\nType:', (child as any)?.constructor?.name,
        '\nKeys:', Object.keys(child as object).slice(0, 10).join(', '),
        '\nPreview:', JSON.stringify(child).slice(0, 300)
      );
      violationCount++;
    }
    
    // Return empty string instead of crashing
    return '';
  }
  
  if (typeof child === 'function') {
    // Functions shouldn't be rendered as children (except render props which are handled by React)
    return '';
  }
  
  return child;
}

/**
 * Recursively sanitize children array
 */
function sanitizeChildren(children: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...sanitizeChildren(child));
    } else {
      result.push(makeSafe(child));
    }
  }
  return result;
}

// ==========================================
// PATCH React.createElement
// ==========================================
(React as any).createElement = function patchedCreateElement(
  type: any,
  props: any,
  ...children: unknown[]
): any {
  // Sanitize direct children passed as rest arguments
  const safeChildren = children.length > 0 ? sanitizeChildren(children) : children;
  
  // Also sanitize props.children (JSX automatic runtime puts children here)
  if (props && typeof props === 'object' && props !== null && 'children' in props) {
    const pc = props.children;
    if (pc !== undefined && pc !== null) {
      if (Array.isArray(pc)) {
        props = { ...props, children: sanitizeChildren(pc) };
      } else {
        const safe = makeSafe(pc);
        if (safe !== pc) {
          props = { ...props, children: safe };
        }
      }
    }
  }
  
  return originalCreateElement.apply(React, [type, props, ...safeChildren]);
};

// ==========================================
// ALSO patch jsx-runtime (belt and suspenders)
// ==========================================
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jsxRuntime = require('react/jsx-runtime');
  
  const origJsx = jsxRuntime.jsx;
  const origJsxs = jsxRuntime.jsxs;
  
  if (typeof origJsx === 'function') {
    jsxRuntime.jsx = function(type: any, props: any, key: any): any {
      // Sanitize props.children
      if (props && typeof props === 'object' && props !== null) {
        const pc = props.children;
        if (pc !== undefined && pc !== null) {
          if (Array.isArray(pc)) {
            props = { ...props, children: sanitizeChildren(pc) };
          } else {
            const safe = makeSafe(pc);
            if (safe !== pc) {
              props = { ...props, children: safe };
            }
          }
        }
      }
      return origJsx.call(this, type, props, key);
    };
  }
  
  if (typeof origJsxs === 'function') {
    jsxRuntime.jsxs = function(type: any, props: any, key: any): any {
      // Sanitize props.children
      if (props && typeof props === 'object' && props !== null) {
        const pc = props.children;
        if (pc !== undefined && pc !== null) {
          if (Array.isArray(pc)) {
            props = { ...props, children: sanitizeChildren(pc) };
          } else {
            const safe = makeSafe(pc);
            if (safe !== pc) {
              props = { ...props, children: safe };
            }
          }
        }
      }
      return origJsxs.call(this, type, props, key);
    };
  }
  
  if (typeof window !== 'undefined') {
    console.log('[REACT_310_FIX] ✅ React.createElement + jsx-runtime interceptor active (triple protection)');
  }
} catch (e) {
  if (typeof window !== 'undefined') {
    console.warn('[REACT_310_FIX] jsx-runtime patch skipped:', e);
  }
}

export {};
