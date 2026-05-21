import type { Metadata } from "next";
import {
  EB_Garamond,
  Geist,
  Inter,
  JetBrains_Mono,
  Lato,
  Roboto,
} from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Resume preview fonts — exposed as CSS variables so the HTML preview can
// switch between them based on the user's selected font.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-resume-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-resume-roboto",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-resume-lato",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-resume-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Lamar Kerja Lebih Cerdas`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  openGraph: {
    title: `${siteConfig.name} — Lamar Kerja Lebih Cerdas`,
    description: siteConfig.description,
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@silamar",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn(
        geist.variable,
        "font-mono",
        jetbrainsMono.variable,
        inter.variable,
        roboto.variable,
        lato.variable,
        garamond.variable,
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="antialiased"
        // eslint-disable-next-line react/no-unknown-property
        vaul-drawer-wrapper=""
        suppressHydrationWarning
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <NuqsAdapter>
              <TooltipProvider>{children}</TooltipProvider>
            </NuqsAdapter>
          </QueryProvider>
          <Toaster
            position="top-right"
            theme="system"
            richColors
            toastOptions={{
              style: {
                background: "oklch(16% 0.02 240)",
                border: "1px solid oklch(25% 0.02 240)",
                color: "oklch(97% 0.005 240)",
              },
            }}
          />
        </NextThemesProvider>
      </body>
    </html>
  );
}
