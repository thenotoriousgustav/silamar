"use client";

import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut, useSession } from "@/lib/auth/client";

const navLinks = [
  { href: "#fitur", label: "Fitur" },
  { href: "#simulator", label: "ATS Simulator" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-background/85 sticky top-0 z-50 border-b border-border backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-none transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground text-base font-bold tracking-tight">
                SiLamar
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-xs font-bold tracking-widest uppercase">
                OPEN ACCESS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  Buka Dashboard →
                </Link>
                <button
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-none px-3.5 py-1.5 text-xs font-semibold transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="text-muted-foreground hover:bg-muted rounded-none p-2 hover:text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-xs font-semibold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              {session ? (
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground rounded-none px-4 py-2 text-center text-xs font-bold uppercase tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buka Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="border border-border text-center text-xs font-semibold py-2 rounded-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-primary-foreground text-center text-xs font-bold uppercase tracking-wider py-2 rounded-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
