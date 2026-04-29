import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryProvider } from "@/components/providers/query-provider";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SiLamar — Lamar Kerja Lebih Cerdas",
    template: "%s | SiLamar",
  },
  description:
    "Platform AI-powered untuk membantu fresh graduate Indonesia melamar kerja lebih cerdas. Buat CV ATS-friendly, analisis resume, dan track lamaran kerja kamu.",
  keywords: [
    "lamar kerja",
    "fresh graduate",
    "Resume builder",
    "resume ATS",
    "AI interview",
    "job tracker",
    "indonesia",
  ],
  authors: [{ name: "SiLamar" }],
  openGraph: {
    title: "SiLamar — Lamar Kerja Lebih Cerdas",
    description:
      "Platform AI-powered untuk fresh graduate Indonesia. Buat CV ATS-friendly & track lamaran kerja kamu.",
    type: "website",
    locale: "id_ID",
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
      className={cn(geist.variable, "font-mono", jetbrainsMono.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="antialiased"
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
            <TooltipProvider>{children}</TooltipProvider>
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
