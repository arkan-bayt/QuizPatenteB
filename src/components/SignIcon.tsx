'use client';
import React from 'react';

interface SignIconProps {
  signalId: string;
  categoryId: string;
  size?: number;
  className?: string;
}

// Wrapper that draws the appropriate Italian traffic sign as SVG
export default function SignIcon({ signalId, categoryId, size = 80, className = '' }: SignIconProps) {
  // Danger signs: equilateral triangle, red border, white bg
  if (categoryId === 'pericolo') {
    return <DangerSign signalId={signalId} size={size} className={className} />;
  }
  // Prohibition signs: red circle border, white bg (or full red circle)
  if (categoryId === 'divieto') {
    return <DivietoSign signalId={signalId} size={size} className={className} />;
  }
  // Obligation signs: blue circle or rectangle
  if (categoryId === 'obbligo') {
    return <ObbligoSign signalId={signalId} size={size} className={className} />;
  }
  // Priority signs: inverted triangle, octagon, diamond
  if (categoryId === 'precedenza') {
    return <PrecedenzaSign signalId={signalId} size={size} className={className} />;
  }
  // Indication signs: colored rectangles
  if (categoryId === 'indicazione') {
    return <IndicazioneSign signalId={signalId} size={size} className={className} />;
  }
  // Supplementary panels: white rectangles
  if (categoryId === 'pannelli') {
    return <PannelloSign signalId={signalId} size={size} className={className} />;
  }
  return null;
}

// ================================================================
// DANGER SIGNS - Equilateral triangle with red border, white bg
// ================================================================
function DangerSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const s = size;
  const cx = s / 2;
  const triH = s * 0.86;
  const triW = s * 0.92;
  const topY = (s - triH) / 2 + 4;
  const triLeft = (s - triW) / 2;

  // Triangle points (equilateral, pointing up)
  const pts = `${cx},${topY} ${cx + triW / 2},${topY + triH} ${cx - triW / 2},${topY + triH}`;

  // Inner triangle (slightly smaller)
  const shrink = s * 0.08;
  const innerTriW = triW - shrink * 2;
  const innerTriH = triH - shrink * 1.5;
  const innerTopY = topY + shrink;
  const innerPts = `${cx},${innerTopY} ${cx + innerTriW / 2},${innerTopY + innerTriH} ${cx - innerTriW / 2},${innerTopY + innerTriH}`;

  // Content area center
  const contentCY = topY + triH * 0.52;
  const contentScale = s / 90;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className={className}>
      {/* Metal effect background */}
      <polygon points={pts} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      {/* White background */}
      <polygon points={innerPts} fill="white" />
      {/* Red border */}
      <polygon points={pts} fill="none" stroke="#D32F2F" strokeWidth={s * 0.065} strokeLinejoin="round" />
      {/* Inner content */}
      <g transform={`translate(${cx}, ${contentCY}) scale(${contentScale})`}>
        <DangerContent signalId={signalId} />
      </g>
    </svg>
  );
}

function DangerContent({ signalId }: { signalId: string }) {
  switch (signalId) {
    case 'curva-sinistra':
      return (
        <g>
          <path d="M-2,12 L-2,-8 Q-2,-16 6,-16 L12,-16" fill="none" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
          <polygon points="12,-16 6,-22 8,-13" fill="#1a1a1a" />
        </g>
      );
    case 'curva-destra':
      return (
        <g>
          <path d="M2,12 L2,-8 Q2,-16 -6,-16 L-12,-16" fill="none" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
          <polygon points="-12,-16 -6,-22 -8,-13" fill="#1a1a1a" />
        </g>
      );
    case 'doppia-curva':
      return (
        <g>
          <path d="M-8,10 L-4,-4 Q0,-14 6,-8 L10,10" fill="none" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="10,10 4,8 8,16" fill="#1a1a1a" />
        </g>
      );
    case 'passaggio-livello':
      return (
        <g>
          {/* Train */}
          <rect x="-12" y="-8" width="24" height="14" rx="3" fill="#1a1a1a" />
          <rect x="-8" y="-12" width="16" height="6" rx="2" fill="#1a1a1a" />
          {/* Chimney */}
          <rect x="-4" y="-16" width="4" height="5" fill="#1a1a1a" />
          {/* Smoke */}
          <circle cx="-2" cy="-19" r="2.5" fill="#1a1a1a" opacity="0.5" />
          {/* Wheels */}
          <circle cx="-6" cy="8" r="3" fill="#1a1a1a" />
          <circle cx="6" cy="8" r="3" fill="#1a1a1a" />
          {/* Rails */}
          <line x1="-18" y1="14" x2="18" y2="14" stroke="#1a1a1a" strokeWidth="2.5" />
        </g>
      );
    case 'incrocio':
      return (
        <g>
          {/* Vertical road */}
          <rect x="-2" y="-16" width="4" height="32" fill="#1a1a1a" rx="1" />
          {/* Horizontal road */}
          <rect x="-16" y="-2" width="32" height="4" fill="#1a1a1a" rx="1" />
          {/* Center */}
          <rect x="-4" y="-4" width="8" height="8" fill="#1a1a1a" />
        </g>
      );
    case 'pedoni':
      return (
        <g>
          {/* Person walking */}
          <circle cx="0" cy="-14" r="4" fill="#1a1a1a" />
          <line x1="0" y1="-10" x2="0" y2="4" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-4" x2="-8" y2="2" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="-4" x2="8" y2="2" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="4" x2="-7" y2="16" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="4" x2="7" y2="16" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'bambini':
      return (
        <g>
          {/* Adult */}
          <circle cx="-6" cy="-12" r="3.5" fill="#1a1a1a" />
          <line x1="-6" y1="-8" x2="-6" y2="4" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="-6" y1="-3" x2="-12" y2="0" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-6" y1="-3" x2="0" y2="0" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-6" y1="4" x2="-10" y2="14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-6" y1="4" x2="-2" y2="14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Child (smaller) */}
          <circle cx="8" cy="-8" r="3" fill="#1a1a1a" />
          <line x1="8" y1="-5" x2="8" y2="4" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="0" x2="4" y2="2" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="0" x2="12" y2="4" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="4" x2="5" y2="14" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="4" x2="11" y2="14" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'lavori':
      return (
        <g>
          {/* Person with shovel */}
          <circle cx="-2" cy="-14" r="3.5" fill="#1a1a1a" />
          <line x1="-2" y1="-10" x2="-2" y2="4" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
          <line x1="-2" y1="-6" x2="6" y2="-14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Shovel head */}
          <ellipse cx="8" cy="-15" rx="4" ry="2.5" fill="#1a1a1a" transform="rotate(-30, 8, -15)" />
          <line x1="-2" y1="-3" x2="-8" y2="2" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-2" y1="4" x2="-6" y2="14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-2" y1="4" x2="2" y2="14" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'scivolosa':
      return (
        <g>
          {/* Car body */}
          <rect x="-10" y="-2" width="20" height="10" rx="3" fill="#1a1a1a" />
          <rect x="-6" y="-8" width="14" height="8" rx="2" fill="#1a1a1a" />
          {/* Wheels */}
          <circle cx="-6" cy="10" r="3" fill="#1a1a1a" />
          <circle cx="6" cy="10" r="3" fill="#1a1a1a" />
          {/* Skid marks */}
          <line x1="-8" y1="14" x2="-12" y2="20" stroke="#1a1a1a" strokeWidth="2" opacity="0.6" />
          <line x1="-4" y1="14" x2="-8" y2="20" stroke="#1a1a1a" strokeWidth="2" opacity="0.6" />
          {/* Wavy lines for slipping */}
          <path d="M-14,0 Q-16,-3 -14,-6" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M14,0 Q16,-3 14,-6" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        </g>
      );
    case 'caduta-massi':
      return (
        <g>
          {/* Cliff/mountain */}
          <polygon points="-14,-16 -2,-4 -16,-4" fill="#1a1a1a" />
          <polygon points="0,-16 14,-4 -4,-4" fill="#1a1a1a" />
          {/* Falling rocks */}
          <circle cx="-4" cy="4" r="4" fill="#1a1a1a" />
          <circle cx="6" cy="8" r="3" fill="#1a1a1a" />
          <circle cx="0" cy="14" r="3.5" fill="#1a1a1a" />
          {/* Motion lines */}
          <line x1="-2" y1="-2" x2="-6" y2="0" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.5" />
          <line x1="8" y1="2" x2="10" y2="5" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.5" />
        </g>
      );
    case 'galleria':
      return (
        <g>
          {/* Tunnel arch */}
          <path d="M-16,10 L-16,-6 Q-16,-16 0,-16 Q16,-16 16,-6 L16,10" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          {/* Road */}
          <line x1="-16" y1="10" x2="16" y2="10" stroke="#1a1a1a" strokeWidth="3" />
          {/* Side walls */}
          <line x1="-16" y1="-6" x2="-16" y2="10" stroke="#1a1a1a" strokeWidth="3" />
          <line x1="16" y1="-6" x2="16" y2="10" stroke="#1a1a1a" strokeWidth="3" />
          {/* Dashed center line */}
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4 3" />
        </g>
      );
    case 'ponte-mobile':
      return (
        <g>
          {/* Bridge base left */}
          <rect x="-16" y="2" width="10" height="4" fill="#1a1a1a" />
          {/* Bridge base right */}
          <rect x="6" y="2" width="10" height="4" fill="#1a1a1a" />
          {/* Raised bridge center */}
          <path d="M-6,2 L-3,-8 L3,-8 L6,2" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
          {/* Water */}
          <path d="M-14,12 Q-10,10 -6,12 Q-2,14 2,12 Q6,10 10,12 Q14,14 18,12" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M-16,16 Q-12,14 -8,16 Q-4,18 0,16 Q4,14 8,16 Q12,18 16,16" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.5" />
          {/* Pillars */}
          <rect x="-7" y="6" width="2" height="8" fill="#1a1a1a" />
          <rect x="5" y="6" width="2" height="8" fill="#1a1a1a" />
        </g>
      );
    case 'neve-ghiaccio':
      return (
        <g>
          {/* Snowflake */}
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#1a1a1a" strokeWidth="2.5" />
          <line x1="-14" y1="-8" x2="14" y2="8" stroke="#1a1a1a" strokeWidth="2.5" />
          <line x1="-14" y1="8" x2="14" y2="-8" stroke="#1a1a1a" strokeWidth="2.5" />
          {/* Branches */}
          <line x1="0" y1="-16" x2="-4" y2="-12" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="0" y1="-16" x2="4" y2="-12" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="0" y1="16" x2="-4" y2="12" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="0" y1="16" x2="4" y2="12" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="-14" y1="-8" x2="-10" y2="-8" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="-14" y1="-8" x2="-12" y2="-12" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="14" y1="8" x2="10" y2="8" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="14" y1="8" x2="12" y2="12" stroke="#1a1a1a" strokeWidth="2" />
        </g>
      );
    case 'vento':
      return (
        <g>
          {/* Wind lines blowing from left */}
          <path d="M-16,-10 Q-4,-14 8,-10 Q14,-8 16,-10" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-16,0 Q-2,-6 10,0 Q16,2 18,0" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-16,10 Q0,6 8,10 Q12,12 16,10" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Small tree bending */}
          <line x1="14" y1="16" x2="14" y2="4" stroke="#1a1a1a" strokeWidth="2.5" />
          <path d="M14,4 Q6,-2 10,-10" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return <text textAnchor="middle" fontSize="10" fill="#1a1a1a" dy="4">!</text>;
  }
}

// ================================================================
// PROHIBITION SIGNS - Red circle border, white bg (or full red)
// ================================================================
function DivietoSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeWidth = size * 0.065;
  const contentScale = size / 90;

  // Special case: divieto-accesso is a full red circle with white horizontal bar
  if (signalId === 'divieto-accesso') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <circle cx={cx} cy={cy} r={r + 2} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r={r} fill="#D32F2F" />
        <rect x={cx - r * 0.7} y={cy - r * 0.15} width={r * 1.4} height={r * 0.3} fill="white" rx="1" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      {/* Metal effect */}
      <circle cx={cx} cy={cy} r={r + 2} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      {/* White bg */}
      <circle cx={cx} cy={cy} r={r} fill="white" />
      {/* Red border ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D32F2F" strokeWidth={strokeWidth} />
      {/* Inner content */}
      <g transform={`translate(${cx}, ${cy}) scale(${contentScale})`}>
        <DivietoContent signalId={signalId} />
      </g>
    </svg>
  );
}

function DivietoContent({ signalId }: { signalId: string }) {
  switch (signalId) {
    case 'senso-vietato':
      return (
        <g>
          {/* Red arrow pointing right */}
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#D32F2F" strokeWidth="4" />
          <polygon points="12,0 4,-6 4,6" fill="#D32F2F" />
        </g>
      );
    case 'divieto-sosta':
      return (
        <g>
          {/* Blue circle base */}
          <circle cx="0" cy="0" r="22" fill="#1565C0" />
          {/* Red diagonal cross */}
          <line x1="-14" y1="14" x2="14" y2="-14" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
          <line x1="-14" y1="-14" x2="14" y2="14" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'divieto-fermata':
      return (
        <g>
          {/* Two red X crosses */}
          <line x1="-14" y1="-6" x2="-2" y2="-14" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
          <line x1="-14" y1="-14" x2="-2" y2="-6" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
          <line x1="2" y1="-6" x2="14" y2="-14" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
          <line x1="2" y1="-14" x2="14" y2="-6" stroke="#D32F2F" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'limite-velocita':
      return (
        <g>
          {/* "50" number */}
          <text textAnchor="middle" fontSize="28" fontWeight="900" fill="#1a1a1a" dy="10" fontFamily="Arial, sans-serif">50</text>
        </g>
      );
    case 'divieto-sorpasso':
      return (
        <g>
          {/* Two cars side by side, left one with red stripe */}
          {/* Rear car */}
          <rect x="-16" y="-6" width="14" height="10" rx="2" fill="#1a1a1a" />
          <rect x="-13" y="-10" width="8" height="6" rx="1.5" fill="#1a1a1a" />
          {/* Front car */}
          <rect x="2" y="-6" width="14" height="10" rx="2" fill="#1a1a1a" />
          <rect x="5" y="-10" width="8" height="6" rx="1.5" fill="#1a1a1a" />
          {/* Red stripe on rear car */}
          <line x1="-12" y1="-2" x2="-2" y2="-2" stroke="#D32F2F" strokeWidth="3" />
        </g>
      );
    case 'ztl':
      return (
        <g>
          <text textAnchor="middle" fontSize="16" fontWeight="900" fill="#1a1a1a" dy="2" fontFamily="Arial, sans-serif">ZTL</text>
          <rect x="-18" y="6" width="36" height="2" fill="#1a1a1a" />
        </g>
      );
    default:
      return <text textAnchor="middle" fontSize="10" fill="#1a1a1a" dy="4">!</text>;
  }
}

// ================================================================
// OBLIGATION SIGNS - Blue circle or rectangle, white symbol
// ================================================================
function ObbligoSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const contentScale = size / 90;

  // senso-unico is rectangular
  if (signalId === 'sens-unico') {
    const w = size * 0.55;
    const h = size * 0.75;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <rect x={cx - w / 2 - 2} y={cy - h / 2 - 2} width={w + 4} height={h + 4} rx="3" fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
        <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" fill="#1565C0" />
        <g transform={`translate(${cx}, ${cy}) scale(${contentScale})`}>
          {/* White arrow pointing up */}
          <line x1="0" y1="12" x2="0" y2="-10" stroke="white" strokeWidth="4" />
          <polygon points="0,-12 -7,-4 7,-4" fill="white" />
        </g>
      </svg>
    );
  }

  const r = size * 0.38;
  const strokeWidth = size * 0.065;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle cx={cx} cy={cy} r={r + 2} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r} fill="#1565C0" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth={strokeWidth} />
      <g transform={`translate(${cx}, ${cy}) scale(${contentScale})`}>
        <ObbligoContent signalId={signalId} />
      </g>
    </svg>
  );
}

function ObbligoContent({ signalId }: { signalId: string }) {
  switch (signalId) {
    case 'pista-ciclabile':
      return (
        <g>
          {/* Bicycle */}
          <circle cx="-8" cy="6" r="8" fill="none" stroke="white" strokeWidth="2.5" />
          <circle cx="10" cy="6" r="8" fill="none" stroke="white" strokeWidth="2.5" />
          <line x1="-8" y1="6" x2="0" y2="-4" stroke="white" strokeWidth="2.5" />
          <line x1="0" y1="-4" x2="10" y2="6" stroke="white" strokeWidth="2.5" />
          <line x1="0" y1="-4" x2="-4" y2="-8" stroke="white" strokeWidth="2" />
          {/* Handlebar */}
          <line x1="-6" y1="-8" x2="-4" y2="-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Seat */}
          <line x1="-4" y1="-10" x2="0" y2="-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'dritto':
      return (
        <g>
          {/* White arrow pointing up */}
          <line x1="0" y1="14" x2="0" y2="-12" stroke="white" strokeWidth="4" />
          <polygon points="0,-14 -8,-5 8,-5" fill="white" />
        </g>
      );
    case 'catene-neve':
      return (
        <g>
          {/* Chain links */}
          <ellipse cx="-8" cy="-4" rx="6" ry="8" fill="none" stroke="white" strokeWidth="3" />
          <ellipse cx="0" cy="6" rx="6" ry="8" fill="none" stroke="white" strokeWidth="3" />
          <ellipse cx="8" cy="-4" rx="6" ry="8" fill="none" stroke="white" strokeWidth="3" />
        </g>
      );
    default:
      return <text textAnchor="middle" fontSize="10" fill="white" dy="4">!</text>;
  }
}

// ================================================================
// PRIORITY SIGNS - Inverted triangle, octagon, diamond
// ================================================================
function PrecedenzaSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const contentScale = size / 90;

  // STOP - Red octagon
  if (signalId === 'stop') {
    const r = size * 0.38;
    const cut = r * 0.38;
    const pts = [
      `${cx - r + cut},${cy - r}`, `${cx + r - cut},${cy - r}`,
      `${cx + r},${cy - r + cut}`, `${cx + r},${cy + r - cut}`,
      `${cx + r - cut},${cy + r}`, `${cx - r + cut},${cy + r}`,
      `${cx - r},${cy + r - cut}`, `${cx - r},${cy - r + cut}`,
    ].join(' ');
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <polygon points={pts} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
        <polygon points={pts} fill="#D32F2F" />
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.22} fontWeight="900" fill="white" fontFamily="Arial, sans-serif" letterSpacing="1">STOP</text>
      </svg>
    );
  }

  // Strada prioritaria / fine prioritaria - Yellow diamond
  if (signalId === 'strada-prioritaria' || signalId === 'fine-prioritaria') {
    const dw = size * 0.42;
    const dh = size * 0.55;
    const pts = `${cx},${cy - dh} ${cx + dw},${cy} ${cx},${cy + dh} ${cx - dw},${cy}`;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
        <polygon points={pts} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
        <polygon points={pts} fill="white" />
        <polygon points={pts} fill="none" stroke="#1a1a1a" strokeWidth={size * 0.04} />
        {/* Inner diamond */}
        <polygon points={`${cx},${cy - (dh - 8)} ${cx + (dw - 8)},${cy} ${cx},${cy + (dh - 8)} ${cx - (dw - 8)},${cy}`} fill="#FDD835" stroke="none" />
        {signalId === 'fine-prioritaria' && (
          <line x1={cx - dw * 0.5} y1={cy + dh * 0.3} x2={cx + dw * 0.5} y2={cy - dh * 0.3} stroke="#1a1a1a" strokeWidth={size * 0.03} />
        )}
      </svg>
    );
  }

  // Dare precedenza - Inverted triangle
  const triW = size * 0.82;
  const triH = size * 0.7;
  const topY = (size - triH) / 2 + 4;
  const pts = `${cx},${topY + triH} ${cx + triW / 2},${topY} ${cx - triW / 2},${topY}`;
  const shrink = size * 0.06;
  const innerPts = `${cx},${topY + triH - shrink * 1.5} ${cx + triW / 2 - shrink},${topY + shrink} ${cx - triW / 2 + shrink},${topY + shrink}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <polygon points={pts} fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      <polygon points={innerPts} fill="white" />
      <polygon points={pts} fill="none" stroke="#D32F2F" strokeWidth={size * 0.06} strokeLinejoin="round" />
    </svg>
  );
}

// ================================================================
// INDICATION SIGNS - Colored rectangles
// ================================================================
function IndicazioneSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const w = size * 0.58;
  const h = size * 0.78;
  const contentScale = size / 90;

  let bgColor = '#1565C0'; // blue default for services
  let content = null;

  switch (signalId) {
    case 'autostrada':
      bgColor = '#2E7D32'; // green
      content = <AutostradaContent />;
      break;
    case 'fine-autostrada':
      bgColor = '#2E7D32';
      content = <FineAutostradaContent />;
      break;
    case 'parcheggio':
      bgColor = '#1565C0';
      content = <ParcheggioContent />;
      break;
    case 'ospedale':
      bgColor = '#1565C0';
      content = <OspedaleContent />;
      break;
    case 'area-servizio':
      bgColor = '#1565C0';
      content = <AreaServizioContent />;
      break;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <rect x={cx - w / 2 - 2} y={cy - h / 2 - 2} width={w + 4} height={h + 4} rx="4" fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="3" fill={bgColor} />
      <g transform={`translate(${cx}, ${cy}) scale(${contentScale})`}>
        {content}
      </g>
    </svg>
  );
}

function AutostradaContent() {
  return (
    <g>
      {/* Highway bridge symbol */}
      <path d="M-16,8 L-16,-2 Q-16,-12 0,-12 Q16,-12 16,-2 L16,8" fill="none" stroke="white" strokeWidth="3" />
      <line x1="-16" y1="8" x2="16" y2="8" stroke="white" strokeWidth="3" />
      {/* Road under */}
      <line x1="-16" y1="14" x2="16" y2="14" stroke="white" strokeWidth="2" />
    </g>
  );
}

function FineAutostradaContent() {
  return (
    <g>
      <AutostradaContent />
      {/* Diagonal red line */}
      <line x1="-20" y1="16" x2="20" y2="-16" stroke="#D32F2F" strokeWidth="3.5" />
    </g>
  );
}

function ParcheggioContent() {
  return (
    <g>
      <text textAnchor="middle" fontSize="32" fontWeight="900" fill="white" dy="10" fontFamily="Arial, sans-serif">P</text>
    </g>
  );
}

function OspedaleContent() {
  return (
    <g>
      {/* Cross/H for hospital */}
      <rect x="-4" y="-16" width="8" height="32" rx="2" fill="white" />
      <rect x="-16" y="-4" width="32" height="8" rx="2" fill="white" />
    </g>
  );
}

function AreaServizioContent() {
  return (
    <g>
      {/* Fuel pump */}
      <rect x="-10" y="-14" width="16" height="22" rx="3" fill="white" />
      <rect x="-6" y="-18" width="8" height="6" rx="2" fill="white" />
      {/* Nozzle */}
      <line x1="8" y1="-8" x2="16" y2="-12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="-12" x2="16" y2="-4" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Fuel drops */}
      <circle cx="16" cy="2" r="2.5" fill="white" />
    </g>
  );
}

// ================================================================
// SUPPLEMENTARY PANELS - White rectangles with text/symbols
// ================================================================
function PannelloSign({ signalId, size, className }: { signalId: string; size: number; className: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const w = size * 0.65;
  const h = size * 0.45;
  const contentScale = size / 90;

  let content = null;

  switch (signalId) {
    case 'pannello-distanza':
      content = <PannelloDistanzaContent />;
      break;
    case 'pannello-direzione':
      content = <PannelloDirezioneContent />;
      break;
    case 'pannello-validita':
      content = <PannelloValiditaContent />;
      break;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}>
      <rect x={cx - w / 2 - 2} y={cy - h / 2 - 2} width={w + 4} height={h + 4} rx="2" fill="#f0f0f0" stroke="#999" strokeWidth="0.5" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="1.5" fill="white" />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="1.5" fill="none" stroke="#1a1a1a" strokeWidth={size * 0.02} />
      <g transform={`translate(${cx}, ${cy}) scale(${contentScale})`}>
        {content}
      </g>
    </svg>
  );
}

function PannelloDistanzaContent() {
  return (
    <g>
      <text textAnchor="middle" fontSize="22" fontWeight="700" fill="#1a1a1a" dy="2" fontFamily="Arial, sans-serif">200 m</text>
    </g>
  );
}

function PannelloDirezioneContent() {
  return (
    <g>
      {/* Arrow pointing left */}
      <line x1="10" y1="0" x2="-10" y2="0" stroke="#1a1a1a" strokeWidth="4" />
      <polygon points="-10,0 -2,-6 -2,6" fill="#1a1a1a" />
    </g>
  );
}

function PannelloValiditaContent() {
  return (
    <g>
      <text textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a1a1a" dy="-4" fontFamily="Arial, sans-serif">Lun-Ven</text>
      <text textAnchor="middle" fontSize="16" fontWeight="900" fill="#1a1a1a" dy="14" fontFamily="Arial, sans-serif">8:00-18:00</text>
    </g>
  );
}
