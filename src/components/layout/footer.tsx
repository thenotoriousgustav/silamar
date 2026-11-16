import { Zap } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Produk: [
    { label: "Resume Builder ATS", href: "/documents/resumes" },
    { label: "Job Tracker Kanban", href: "/job-tracker" },
    { label: "AI ATS Analyzer", href: "/resume-analysis" },
    { label: "AI Cover Letter", href: "/documents/cover-letter" },
  ],
  Ekosistem: [
    { label: "Dokumentasi", href: "#" },
    { label: "Panduan Rekruter ID", href: "#" },
    { label: "Format CV ATS", href: "#" },
    { label: "Open Source", href: "https://github.com/thenotoriousgustav/silamar" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Keamanan Data", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-none text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-foreground text-base font-bold tracking-tight">
                SiLamar
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-xs leading-relaxed">
              Platform persiapan karir dan pelacakan lamaran terpadu untuk talenta
              Indonesia. Dibangun dengan komitmen 100% akses terbuka tanpa paywall.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-emerald-400"></span>
              <span className="text-muted-foreground text-xs font-mono">
                Status Sistem: Seluruh Modul Beroperasi Normal
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-foreground mb-4 text-xs font-bold tracking-wider uppercase font-mono">
                {category}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SiLamar. Open Access for Indonesian Job Seekers.
          </p>
          <div className="flex items-center gap-4 font-mono">
            <span>Next.js 16</span>
            <span>·</span>
            <span>Drizzle ORM</span>
            <span>·</span>
            <span>Tailwind v4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
