import type { Metadata } from 'next';
import './globals.css';
import '@/shared/config/init-features';
import { ThemeProvider } from '@/providers/theme-provider';
import { TenantThemeProvider } from '@/providers/tenant-theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: '%s | SVR Travels SaaS',
    default: 'SVR Travels SaaS',
  },
  description: 'Travel Business Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hex = localStorage.getItem('tenant_primary_color');
                  var secHex = localStorage.getItem('tenant_secondary_color');
                  function hexToHsl(h) {
                    if (!h) return null;
                    h = h.replace(/^#/, '');
                    if (h.length === 3) h = h.split('').map(function(c) { return c + c; }).join('');
                    if (h.length !== 6) return null;
                    var r = parseInt(h.substring(0, 2), 16) / 255;
                    var g = parseInt(h.substring(2, 4), 16) / 255;
                    var b = parseInt(h.substring(4, 6), 16) / 255;
                    var max = Math.max(r, g, b), min = Math.min(r, g, b);
                    var hu = 0, s = 0, l = (max + min) / 2;
                    if (max !== min) {
                      var d = max - min;
                      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                      switch (max) {
                        case r: hu = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: hu = (b - r) / d + 2; break;
                        case b: hu = (r - g) / d + 4; break;
                      }
                      hu /= 6;
                    }
                    return { h: Math.round(hu * 360), s: Math.round(s * 100), l: Math.round(l * 100), str: Math.round(hu * 360) + ' ' + Math.round(s * 100) + '% ' + Math.round(l * 100) + '%' };
                  }
                  if (hex) {
                    var pri = hexToHsl(hex);
                    if (pri) {
                      document.documentElement.style.setProperty('--primary', pri.str);
                      document.documentElement.style.setProperty('--ring', pri.str);
                      document.documentElement.style.setProperty('--sidebar-primary', pri.str);
                      document.documentElement.style.setProperty('--sidebar-ring', pri.str);
                      document.documentElement.style.setProperty('--primary-foreground', pri.l > 65 ? '222.2 47.4% 11.2%' : '0 0% 100%');
                      document.documentElement.style.setProperty('--sidebar-primary-foreground', pri.l > 65 ? '222.2 47.4% 11.2%' : '0 0% 100%');
                    }
                  }
                  if (secHex) {
                    var sec = hexToHsl(secHex);
                    if (sec) {
                      document.documentElement.style.setProperty('--secondary', sec.str);
                      document.documentElement.style.setProperty('--secondary-foreground', sec.l > 65 ? '222.2 47.4% 11.2%' : '0 0% 100%');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TenantThemeProvider>
            <QueryProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
              <Toaster position="top-right" />
            </QueryProvider>
          </TenantThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
