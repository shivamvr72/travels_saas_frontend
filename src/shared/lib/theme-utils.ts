/**
 * Utility functions for dynamically applying tenant colors and theme CSS variables
 */

export interface HslColor {
  h: number;
  s: number;
  l: number;
  str: string;
}

export function hexToHsl(hex: string): HslColor | null {
  if (!hex) return null;
  hex = hex.replace(/^#/, '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  if (hex.length !== 6) return null;

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return {
    h: hDeg,
    s: sPct,
    l: lPct,
    str: `${hDeg} ${sPct}% ${lPct}%`,
  };
}

export function applyThemeColors(primaryHex?: string | null, secondaryHex?: string | null) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (primaryHex) {
    const priHsl = hexToHsl(primaryHex);
    if (priHsl) {
      // Set main primary CSS variables used by Tailwind v4
      root.style.setProperty('--primary', priHsl.str);
      root.style.setProperty('--ring', priHsl.str);
      root.style.setProperty('--sidebar-primary', priHsl.str);
      root.style.setProperty('--sidebar-ring', priHsl.str);

      // Determine appropriate foreground text contrast
      // If lightness > 65%, use dark text; otherwise pure white
      const priForeground = priHsl.l > 65 ? '222.2 47.4% 11.2%' : '0 0% 100%';
      root.style.setProperty('--primary-foreground', priForeground);
      root.style.setProperty('--sidebar-primary-foreground', priForeground);

      // Cache for instant restore without flash
      try {
        localStorage.setItem('tenant_primary_color', primaryHex);
      } catch {}
    }
  }

  if (secondaryHex) {
    const secHsl = hexToHsl(secondaryHex);
    if (secHsl) {
      root.style.setProperty('--secondary', secHsl.str);
      const secForeground = secHsl.l > 65 ? '222.2 47.4% 11.2%' : '0 0% 100%';
      root.style.setProperty('--secondary-foreground', secForeground);

      try {
        localStorage.setItem('tenant_secondary_color', secondaryHex);
      } catch {}
    }
  }
}
