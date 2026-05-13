"use client";

import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut, useSession } from "@/lib/auth/client";


const navLinks = [
  { href: "#fitur", label: "Fitur" },
  { href: "#harga", label: "Harga" },
  { href: "#tentang", label: "Tentang" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="bg-surface-950/80 sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="bg-brand-600 shadow-brand-600/30 flex h-8 w-8 items-center justify-center rounded-none shadow-lg transition-transform group-hover:scale-110">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text text-lg font-bold tracking-tight">
              SiLamar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface-300 text-sm font-medium transition-colors hover:text-white"
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
                  className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-600/30 rounded-none px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="text-surface-300 text-sm font-medium transition-colors hover:text-white"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-surface-300 text-sm font-medium transition-colors hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-600 hover:bg-brand-500 hover:shadow-brand-600/30 rounded-none px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="text-surface-300 hover:bg-surface-800 rounded-none p-2 hover:text-white md:hidden"
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
          <div className="border-t border-white/5 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-surface-300 text-sm font-medium hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/5" />
              {session ? (
                <Link
                  href="/dashboard"
                  className="bg-brand-600 rounded-none px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-surface-300 text-sm font-medium"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="bg-brand-600 rounded-none px-4 py-2 text-center text-sm font-semibold text-white"
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
