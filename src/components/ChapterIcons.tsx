'use client';
import React from 'react';

// Custom SVG icons for each of the 25 Patente B chapters
// Each icon represents the chapter's driving topic

interface ChapterIconProps {
  chapterId: number;
  size?: number;
  className?: string;
}

export default function ChapterIcon({ chapterId, size = 40, className = '' }: ChapterIconProps) {
  const icons: Record<number, React.ReactNode> = {
    // 1: Definizioni generali e Doveri del conducente - Open book with steering wheel
    1: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="8" y="12" width="48" height="40" rx="4" fill="rgba(255,255,255,0.2)" />
        <path d="M32 12v40" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16 Q20 22 28 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M36 16 Q44 22 52 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M12 22 Q20 28 28 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M36 22 Q44 28 52 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M12 28 Q20 34 28 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M36 28 Q44 34 52 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="42" r="8" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5" />
        <circle cx="32" cy="42" r="3" fill="white" />
        <path d="M32 34v-2M32 50v2M24 42h-2M40 42h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),

    // 2: Segnali di pericolo - Warning triangle sign (red triangle with exclamation)
    2: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="14" y="8" width="36" height="48" rx="4" fill="rgba(255,255,255,0.15)" />
        <path d="M32 16L52 52H12L32 16Z" fill="rgba(255,255,255,0.9)" stroke="white" strokeWidth="1" />
        <path d="M32 16L50 48H14L32 16Z" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        <rect x="15" y="48" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
        <path d="M32 26v14" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="44" r="2.5" fill="#DC2626" />
      </svg>
    ),

    // 3: Segnali di divieto - Prohibition (circle with diagonal line)
    3: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="12" y="8" width="40" height="48" rx="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="32" cy="30" r="18" fill="white" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
        <circle cx="32" cy="30" r="14" fill="none" stroke="#DC2626" strokeWidth="4" />
        <line x1="22" y1="20" x2="42" y2="40" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
        <rect x="15" y="48" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),

    // 4: Segnali di obbligo - Obligation circle (blue circle with white arrow up)
    4: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="12" y="8" width="40" height="48" rx="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="32" cy="30" r="18" fill="white" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
        <circle cx="32" cy="30" r="14" fill="#1E40AF" />
        <path d="M32 20v16M26 26l6-6 6 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="15" y="48" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),

    // 5: Segnali di precedenza - Priority / Yield (inverted triangle)
    5: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="10" y="8" width="44" height="48" rx="4" fill="rgba(255,255,255,0.15)" />
        <path d="M12 48L32 14L52 48H12Z" fill="white" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
        <path d="M17 44L32 19L47 44H17Z" fill="#DC2626" stroke="white" strokeWidth="2" />
        <rect x="26" y="32" width="12" height="6" fill="white" rx="1" />
        <rect x="14" y="48" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),

    // 6: Segnaletica orizzontale e ostacoli - Road markings (dashed lines on road)
    6: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="16" y="6" width="32" height="52" rx="3" fill="rgba(255,255,255,0.15)" />
        <path d="M18 10h28v44H18z" fill="rgba(255,255,255,0.3)" rx="2" />
        <rect x="20" y="12" width="24" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="20" y="20" width="24" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="20" y="28" width="24" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="20" y="36" width="24" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="20" y="44" width="24" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="30" y="12" width="4" height="35" fill="white" opacity="0.4" />
        <path d="M26 6l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M22 52l10 6 10-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),

    // 7: Semafori e segnali dei vigili - Traffic light
    7: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="22" y="6" width="20" height="48" rx="6" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
        <circle cx="32" cy="17" r="6" fill="#EF4444" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <circle cx="32" cy="33" r="6" fill="#F59E0B" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <circle cx="32" cy="49" r="5" fill="#22C55E" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <rect x="28" y="54" width="8" height="4" rx="1" fill="rgba(255,255,255,0.5)" />
        <path d="M24 10l-8-2v6l8-2" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),

    // 8: Segnali di indicazione - Direction / Info sign (rectangle with arrow)
    8: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="10" y="8" width="44" height="48" rx="4" fill="rgba(255,255,255,0.15)" />
        <rect x="14" y="12" width="36" height="40" rx="2" fill="white" />
        <path d="M24 32h16" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 26l6 6-6 6" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="12" width="36" height="10" rx="2" fill="#1E40AF" />
        <text x="32" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">INFO</text>
        <rect x="18" y="40" width="28" height="2" fill="rgba(0,0,0,0.1)" rx="1" />
        <rect x="18" y="46" width="20" height="2" fill="rgba(0,0,0,0.1)" rx="1" />
      </svg>
    ),

    // 9: Segnali complementari e di cantiere - Construction cone/barrier
    9: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <path d="M20 54h24" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
        <path d="M22 54L28 22h8l6 32" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
        <rect x="18" y="18" width="28" height="8" rx="2" fill="white" opacity="0.9" />
        <rect x="18" y="18" width="10" height="8" rx="2" fill="#EF4444" />
        <rect x="38" y="18" width="8" height="8" rx="2" fill="#EF4444" />
        <circle cx="32" cy="10" r="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
        <path d="M18 54h28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    // 10: Pannelli integrativi - Supplementary panels (small signs with arrows)
    10: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="12" y="10" width="40" height="16" rx="3" fill="white" opacity="0.9" />
        <path d="M20 18h8M24 14v8" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
        <path d="M38 14l4 4-4 4" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="30" width="32" height="16" rx="3" fill="white" opacity="0.9" />
        <rect x="20" y="34" width="10" height="3" rx="1" fill="#F59E0B" />
        <rect x="34" y="34" width="10" height="3" rx="1" fill="#F59E0B" />
        <rect x="20" y="40" width="24" height="2" fill="rgba(0,0,0,0.15)" rx="1" />
        <rect x="8" y="50" width="48" height="8" rx="3" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1" />
        <path d="M28 54h8M30 52l2 2 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),

    // 11: Limiti di velocita - Speed limit sign
    11: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <circle cx="32" cy="30" r="22" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        <circle cx="32" cy="30" r="18" fill="none" stroke="#DC2626" strokeWidth="5" />
        <text x="32" y="36" textAnchor="middle" fill="#1E293B" fontSize="18" fontWeight="bold">50</text>
        <rect x="14" y="54" width="36" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
        <rect x="22" y="58" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),

    // 12: Distanza di sicurezza - Safe distance (two cars with gap)
    12: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Car 1 */}
        <rect x="4" y="20" width="20" height="14" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="8" y="14" width="12" height="8" rx="2" fill="rgba(255,255,255,0.7)" />
        <circle cx="8" cy="36" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="20" cy="36" r="3" fill="rgba(255,255,255,0.5)" />
        {/* Distance arrows */}
        <path d="M28 27h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <path d="M34 24v6M30 24v6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        {/* Car 2 */}
        <rect x="40" y="20" width="20" height="14" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="44" y="14" width="12" height="8" rx="2" fill="rgba(255,255,255,0.7)" />
        <circle cx="44" cy="36" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="56" cy="36" r="3" fill="rgba(255,255,255,0.5)" />
        {/* Road */}
        <rect x="0" y="42" width="64" height="10" fill="rgba(255,255,255,0.15)" rx="2" />
        <path d="M8 47h8M24 47h8M40 47h8M56 47h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Safe distance label */}
        <rect x="20" y="50" width="24" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),

    // 13: Norme di circolazione - Road rules (road with direction arrows)
    13: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        <rect x="8" y="4" width="48" height="56" rx="3" fill="rgba(255,255,255,0.15)" />
        <rect x="12" y="8" width="40" height="48" rx="2" fill="rgba(255,255,255,0.2)" />
        {/* Center line */}
        <path d="M32 8v48" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        {/* Top arrow */}
        <path d="M32 16v12M26 22l6-6 6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom arrow */}
        <path d="M32 48v-12M26 42l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Side arrows */}
        <path d="M18 32h8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M38 32h8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        {/* Corners */}
        <circle cx="16" cy="14" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="48" cy="14" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="16" cy="50" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="48" cy="50" r="3" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),

    // 14: Precedenza e incroci - Crossroads / Intersection
    14: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Background */}
        <rect x="6" y="6" width="52" height="52" rx="4" fill="rgba(255,255,255,0.12)" />
        {/* Roads */}
        <rect x="22" y="4" width="20" height="56" fill="rgba(255,255,255,0.25)" />
        <rect x="4" y="22" width="56" height="20" fill="rgba(255,255,255,0.25)" />
        {/* Center markings */}
        <path d="M32 4v18M32 42v18M4 32h18M42 32h18" stroke="white" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        {/* Intersection box */}
        <rect x="22" y="22" width="20" height="20" fill="rgba(255,255,255,0.15)" />
        {/* Arrows showing right of way */}
        <path d="M26 18v8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M46 26h-8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M38 46v-8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M18 38h8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Priority diamond */}
        <path d="M32 26l6 6-6 6-6-6z" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1" />
      </svg>
    ),

    // 15: Sorpasso - Overtaking (car passing another)
    15: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Road */}
        <rect x="0" y="44" width="64" height="12" fill="rgba(255,255,255,0.15)" rx="2" />
        <path d="M6 50h10M22 50h10M38 50h10M54 50h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Back car */}
        <rect x="6" y="22" width="22" height="16" rx="4" fill="rgba(255,255,255,0.6)" />
        <rect x="10" y="16" width="14" height="8" rx="2" fill="rgba(255,255,255,0.4)" />
        <circle cx="10" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="24" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
        {/* Overtaking car (larger, in front) */}
        <rect x="30" y="18" width="26" height="18" rx="5" fill="rgba(255,255,255,0.95)" stroke="white" strokeWidth="1" />
        <rect x="34" y="11" width="18" height="9" rx="3" fill="rgba(255,255,255,0.7)" />
        <circle cx="35" cy="38" r="3.5" fill="rgba(255,255,255,0.6)" />
        <circle cx="51" cy="38" r="3.5" fill="rgba(255,255,255,0.6)" />
        {/* Speed lines */}
        <path d="M4 26l-3 0M4 32l-4 0M5 38l-3 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        {/* Arrow */}
        <path d="M18 30l8-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M24 26l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </svg>
    ),

    // 16: Fermata, sosta e arresto - Parking / Stop
    16: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Parking sign post */}
        <rect x="29" y="8" width="6" height="48" rx="2" fill="rgba(255,255,255,0.3)" />
        {/* P sign circle */}
        <circle cx="32" cy="22" r="14" fill="#1E40AF" stroke="white" strokeWidth="2" />
        <text x="32" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">P</text>
        {/* Car below */}
        <rect x="16" y="40" width="32" height="14" rx="5" fill="rgba(255,255,255,0.8)" />
        <rect x="22" y="35" width="20" height="7" rx="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="22" cy="56" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="42" cy="56" r="3" fill="rgba(255,255,255,0.5)" />
        {/* No parking sign (X) */}
        <circle cx="50" cy="18" r="8" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5" />
        <path d="M46 14l8 8M54 14l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),

    // 17: Norme varie, autostrade e pannelli - Highway sign (green)
    17: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Highway sign */}
        <rect x="8" y="8" width="48" height="36" rx="4" fill="#059669" />
        <rect x="12" y="12" width="40" height="28" rx="2" fill="rgba(255,255,255,0.15)" />
        <path d="M12 26h40" stroke="white" strokeWidth="1" opacity="0.3" />
        {/* Highway symbol */}
        <path d="M18 20h6l3-4 3 4h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M18 34h6l3 4 3-4h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Road below */}
        <rect x="0" y="48" width="64" height="10" fill="rgba(255,255,255,0.12)" rx="2" />
        <path d="M8 53h10M26 53h12M46 53h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        {/* Post */}
        <rect x="30" y="44" width="4" height="8" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),

    // 18: Luci e dispositivi acustici - Headlights / Car with light beams
    18: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Car body */}
        <rect x="10" y="22" width="36" height="16" rx="6" fill="rgba(255,255,255,0.6)" />
        <rect x="16" y="15" width="24" height="9" rx="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="16" cy="40" r="3.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="40" cy="40" r="3.5" fill="rgba(255,255,255,0.5)" />
        {/* Headlight beams */}
        <path d="M48 26l14-4v8l-14-4" fill="rgba(255,255,255,0.3)" />
        <path d="M48 30l14-2v4l-14-2" fill="rgba(255,255,255,0.2)" />
        <path d="M48 28l10-2v4l-10-2" fill="rgba(255,255,255,0.5)" />
        {/* Light rays */}
        <line x1="52" y1="24" x2="58" y2="22" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="52" y1="28" x2="60" y2="28" stroke="white" strokeWidth="1" opacity="0.6" />
        <line x1="52" y1="32" x2="58" y2="34" stroke="white" strokeWidth="1" opacity="0.6" />
        {/* Tail light */}
        <rect x="8" y="26" width="4" height="6" rx="1" fill="#EF4444" opacity="0.8" />
        {/* Horn symbol */}
        <path d="M14 14l-4-2v6l4-2" fill="white" opacity="0.6" />
        <rect x="14" y="11" width="4" height="6" rx="1" fill="white" opacity="0.4" />
        {/* Road */}
        <rect x="0" y="46" width="64" height="10" fill="rgba(255,255,255,0.1)" rx="2" />
      </svg>
    ),

    // 19: Cinture, casco e sicurezza - Seatbelt / Safety vest
    19: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Person silhouette */}
        <circle cx="28" cy="14" r="8" fill="rgba(255,255,255,0.4)" />
        <path d="M16 64v-20c0-8 6-14 12-14s12 6 12 14v20" fill="rgba(255,255,255,0.25)" />
        {/* Seatbelt */}
        <path d="M16 34l12 8 12-8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 42v8" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="52" r="2" fill="white" />
        {/* Safety vest stripes */}
        <path d="M18 30h20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M16 36h24" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Helmet */}
        <path d="M20 12a8 8 0 0116 0v2H20v-2z" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5" />
        {/* Shield checkmark */}
        <circle cx="48" cy="14" r="10" fill="rgba(255,255,255,0.2)" />
        <path d="M48 6l6 4v6c0 4-6 8-6 8s-6-4-6-8v-6l6-4z" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1" />
        <path d="M45 14l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),

    // 20: Patente a punti e documenti - License / ID card
    20: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Card */}
        <rect x="6" y="12" width="52" height="36" rx="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
        {/* Photo placeholder */}
        <rect x="12" y="18" width="18" height="22" rx="2" fill="rgba(255,255,255,0.3)" />
        <circle cx="21" cy="26" r="4" fill="rgba(255,255,255,0.5)" />
        <path d="M13 38l8-6 4 4 4-6 6 8" fill="rgba(255,255,255,0.2)" />
        {/* Text lines */}
        <rect x="34" y="20" width="18" height="3" rx="1.5" fill="white" opacity="0.7" />
        <rect x="34" y="26" width="14" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="34" y="31" width="18" height="2" rx="1" fill="white" opacity="0.4" />
        <rect x="34" y="36" width="12" height="2" rx="1" fill="white" opacity="0.4" />
        {/* Points stars */}
        <circle cx="20" cy="56" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="28" cy="56" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="36" cy="56" r="3" fill="rgba(255,255,255,0.6)" />
        <circle cx="44" cy="56" r="3" fill="rgba(255,255,255,0.7)" />
      </svg>
    ),

    // 21: Incidenti Stradali Comportamenti - Car crash / Accident
    21: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Road */}
        <rect x="0" y="40" width="64" height="14" fill="rgba(255,255,255,0.12)" rx="2" />
        <path d="M6 47h10M24 47h16M46 47h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        {/* Car 1 (damaged, tilted) */}
        <g transform="rotate(-12, 20, 32)">
          <rect x="6" y="24" width="22" height="14" rx="4" fill="rgba(255,255,255,0.7)" />
          <rect x="10" y="18" width="14" height="8" rx="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="10" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
          <circle cx="24" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
        </g>
        {/* Car 2 (damaged, tilted other way) */}
        <g transform="rotate(10, 44, 32)">
          <rect x="36" y="24" width="22" height="14" rx="4" fill="rgba(255,255,255,0.7)" />
          <rect x="40" y="18" width="14" height="8" rx="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="40" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
          <circle cx="54" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
        </g>
        {/* Impact star */}
        <circle cx="32" cy="30" r="6" fill="#EF4444" opacity="0.6" />
        <path d="M32 24v2M32 34v2M26 30h2M36 30h2M28 26l1.5 1.5M34.5 32.5L36 34M28 34l1.5-1.5M34.5 27.5L36 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {/* Warning triangle */}
        <path d="M32 4l6 10H26l6-10z" fill="#F59E0B" opacity="0.8" />
        <text x="32" y="12" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">!</text>
      </svg>
    ),

    // 22: Alcool Droga Primo Soccorso - First aid / No alcohol / Medical
    22: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Medical cross */}
        <rect x="18" y="18" width="28" height="28" rx="4" fill="white" opacity="0.9" />
        <rect x="28" y="22" width="8" height="20" rx="2" fill="#DC2626" />
        <rect x="22" y="28" width="20" height="8" rx="2" fill="#DC2626" />
        {/* No alcohol circle */}
        <circle cx="14" cy="14" r="8" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1.5" />
        <path d="M12 10v4c0 1 1 2 2 2s2-1 2-2v-4" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M10 14l8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {/* Heart rate line */}
        <path d="M8 52h10l4-8 6 16 6-16 4 8h18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      </svg>
    ),

    // 23: Responsabilita Civile Penale E Assicurazione - Scales of justice / Legal
    23: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Pillar */}
        <rect x="30" y="20" width="4" height="36" rx="1" fill="rgba(255,255,255,0.5)" />
        {/* Base */}
        <rect x="18" y="54" width="28" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
        {/* Top bar */}
        <rect x="8" y="16" width="48" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
        {/* Top triangle */}
        <path d="M28 16l4-8 4 8z" fill="rgba(255,255,255,0.5)" />
        {/* Left scale */}
        <line x1="12" y1="20" x2="8" y2="36" stroke="white" strokeWidth="1.5" />
        <line x1="12" y1="20" x2="16" y2="36" stroke="white" strokeWidth="1.5" />
        <path d="M4 36h16l-2 8H6l-2-8z" fill="rgba(255,255,255,0.3)" />
        {/* Right scale */}
        <line x1="52" y1="20" x2="48" y2="32" stroke="white" strokeWidth="1.5" />
        <line x1="52" y1="20" x2="56" y2="32" stroke="white" strokeWidth="1.5" />
        <path d="M44 32h16l-2 8H46l-2-8z" fill="rgba(255,255,255,0.3)" />
        {/* Euro/insurance symbol */}
        <circle cx="32" cy="44" r="6" fill="rgba(255,255,255,0.2)" />
        <text x="32" y="48" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">EUR</text>
      </svg>
    ),

    // 24: Consumi Ambiente Inquinamento - Leaf / Environment / Eco
    24: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Leaf shape */}
        <path d="M32 8c16 0 24 12 24 24 0 16-24 28-24 28S8 48 8 32C8 20 16 8 32 8z" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1.5" />
        {/* Leaf vein */}
        <path d="M32 14v36" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <path d="M32 24l-10 8" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <path d="M32 30l12 8" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        <path d="M32 38l-8 6" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
        {/* CO2 text */}
        <text x="32" y="52" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.7">CO2</text>
        {/* Small recycling arrows */}
        <path d="M18 10a3 3 0 014-1l2 2-2 2a3 3 0 01-4-3z" fill="rgba(255,255,255,0.3)" />
      </svg>
    ),

    // 25: Elementi Veicolo Manutenzione Comportamenti - Wrench / Car maintenance
    25: (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
        {/* Car silhouette */}
        <rect x="10" y="30" width="40" height="16" rx="5" fill="rgba(255,255,255,0.4)" />
        <rect x="18" y="22" width="24" height="10" rx="3" fill="rgba(255,255,255,0.25)" />
        <circle cx="18" cy="48" r="4" fill="rgba(255,255,255,0.4)" />
        <circle cx="42" cy="48" r="4" fill="rgba(255,255,255,0.4)" />
        {/* Wrench */}
        <g transform="rotate(-45, 48, 16)">
          <rect x="45" y="6" width="6" height="20" rx="3" fill="white" opacity="0.8" />
          <path d="M46 6l2-4 2 4" fill="white" opacity="0.8" />
          <path d="M46 26l2 4 2-4" fill="white" opacity="0.8" />
        </g>
        {/* Gear */}
        <circle cx="20" cy="14" r="7" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="1" />
        <circle cx="20" cy="14" r="3" fill="rgba(255,255,255,0.2)" />
        <path d="M20 7v-2M20 21v2M13 14h-2M27 14h2M15 9l-1.5-1.5M25 19l1.5 1.5M15 19l-1.5 1.5M25 9l1.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {/* Oil drop */}
        <path d="M40 10c0 0 4 5 4 8a4 4 0 01-8 0c0-3 4-8 4-8z" fill="rgba(255,255,255,0.4)" stroke="white" strokeWidth="1" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center justify-center">
      {icons[chapterId] || (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
          <rect x="12" y="12" width="40" height="40" rx="8" fill="rgba(255,255,255,0.2)" />
          <text x="32" y="37" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{chapterId}</text>
        </svg>
      )}
    </div>
  );
}

// Export chapter icon mapping with small icons for chips/badges
export function ChapterIconSmall({ chapterId, size = 20 }: { chapterId: number; size?: number }) {
  return <ChapterIcon chapterId={chapterId} size={size} />;
}
