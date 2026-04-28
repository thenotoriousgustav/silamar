import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Produk: [
    { label: "Resume Builder", href: "/resume-builder" },
    { label: "Job Tracker", href: "/job-tracker" },
    { label: "Analisis Resume", href: "/resume-analysis" },
    { label: "Cover Letter", href: "/cover-letter" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "#tentang" },
    { label: "Blog", href: "#" },
    { label: "Karier", href: "#" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-brand-600 flex h-8 w-8 items-center justify-center rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text text-lg font-bold">SiLamar</span>
            </Link>
            <p className="text-surface-300 mt-4 max-w-xs text-sm leading-relaxed">
              Platform AI untuk fresh graduate Indonesia yang ingin lamar kerja
              lebih cerdas dan efisien.
            </p>
            <div className="text-surface-300 mt-4 flex items-center gap-1 text-xs">
              <span>🇮🇩</span>
              <span>Made with ❤️ in Indonesia</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-sm font-semibold text-white">
                {category}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-surface-300 text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-surface-300 text-xs">
            © {new Date().getFullYear()} SiLamar. Hak cipta dilindungi.
          </p>
          <p className="text-surface-300 text-xs">
            Dibuat untuk fresh graduate Indonesia 🎓
          </p>
        </div>
      </div>
    </footer>
  );
}
