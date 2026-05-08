import Link from "next/link";
import {
  Zap,
  FileText,
  BarChart3,
  Briefcase,
  Mail,
  Target,
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

const features = [
  {
    icon: FileText,
    title: "Resume Builder ATS-Friendly",
    description:
      "Buat CV profesional yang lolos sistem ATS perusahaan. Template modern, export PDF.",
    tag: "Gratis",
    tagColor: "green",
  },
  {
    icon: Briefcase,
    title: "Job Tracker Kanban",
    description:
      "Lacak semua lamaran kerja kamu dalam satu tempat. Dari Dilamar hingga Penawaran.",
    tag: "Gratis",
    tagColor: "green",
  },
  {
    icon: BarChart3,
    title: "AI Resume Analyzer",
    description:
      "Dapatkan skor ATS dan saran perbaikan spesifik dari AI untuk resume kamu.",
    tag: "1 Kredit",
    tagColor: "purple",
  },
  {
    icon: Target,
    title: "Resume vs Job Description",
    description:
      "Bandingkan resume kamu dengan JD dan temukan keyword yang kurang.",
    tag: "1 Kredit",
    tagColor: "purple",
  },
  {
    icon: Mail,
    title: "AI Cover Letter Generator",
    description:
      "Generate surat lamaran yang personal dan menarik dalam hitungan detik.",
    tag: "1 Kredit",
    tagColor: "purple",
  },
  {
    icon: Brain,
    title: "Mock Interview AI",
    description:
      "Latihan interview dengan AI. Dapatkan pertanyaan dan feedback jawaban kamu.",
    tag: "1 Kredit",
    tagColor: "purple",
  },
];

const plans = [
  {
    name: "Gratis",
    price: 0,
    description: "Untuk kamu yang baru mulai",
    credits: "Resume Builder + Job Tracker",
    features: [
      "Resume Builder ATS-friendly",
      "Job Application Tracker (Kanban)",
      "Export PDF resume",
      "3 kredit AI saat daftar",
    ],
    cta: "Mulai Gratis",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 99000,
    description: "Untuk kamu yang serius cari kerja",
    credits: "Unlimited AI",
    features: [
      "Semua fitur Gratis",
      "AI Resume Analyzer unlimited",
      "Resume vs JD unlimited",
      "Cover Letter Generator unlimited",
      "Mock Interview AI unlimited",
      "Skill Gap Analysis unlimited",
      "Priority support",
    ],
    cta: "Mulai Pro",
    href: "/register?plan=pro",
    highlighted: true,
  },
];

const creditPacks = [
  { name: "Starter Pack", credits: 5, price: 15000 },
  { name: "Standard Pack", credits: 15, price: 35000 },
  { name: "Pro Pack", credits: 30, price: 60000 },
];

const testimonials = [
  {
    name: "Rizky Pratama",
    role: "Fresh Graduate — IT Telkom",
    content:
      "SiLamar bantu CV ku naik dari skor ATS 45% ke 89%! Dalam 2 minggu langsung dapat panggilan interview dari 3 perusahaan.",
    stars: 5,
  },
  {
    name: "Aulia Fitri",
    role: "Fresh Graduate — UI",
    content:
      "Job tracker-nya kece banget, akhirnya bisa track semua lamaran di satu tempat. Cover letter AI-nya juga natural banget.",
    stars: 5,
  },
  {
    name: "Budi Santoso",
    role: "Fresh Graduate — ITS",
    content:
      "Mock Interview AI-nya bikin aku jauh lebih siap. Akhirnya lolos di perusahaan impian setelah latihan intensif.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[90dvh] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Gradient background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, oklch(50% 0.26 290 / 20%), transparent)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(oklch(30% 0.02 240) 1px, transparent 1px), linear-gradient(90deg, oklch(30% 0.02 240) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="border-brand-500/30 bg-brand-500/10 text-brand-400 mb-6 inline-flex items-center gap-2 rounded-none border px-4 py-1.5 font-mono text-sm font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Google Gemini AI
        </div>

        <h1 className="max-w-4xl text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Lamar Kerja <span className="gradient-text">Lebih Cerdas</span>
          <br />
          dengan AI
        </h1>

        <p className="text-surface-300 mt-6 max-w-2xl text-lg leading-relaxed">
          Platform AI-powered khusus untuk fresh graduate Indonesia. Buat CV
          ATS-friendly, analisis resume, generate cover letter, dan track semua
          lamaran kerja kamu dalam satu platform.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            id="cta-register-hero"
            className="group bg-brand-600 shadow-brand-600/30 hover:bg-brand-500 hover:shadow-brand-500/40 flex items-center gap-2 rounded-none px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105"
          >
            Mulai Gratis Sekarang
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-surface-300 text-sm">
            ✓ Gratis · ✓ 3 kredit AI · ✓ Tanpa kartu kredit
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
          {[
            { value: "10rb+", label: "Pengguna Aktif" },
            { value: "50rb+", label: "Resume Dibuat" },
            { value: "89%", label: "Rata-rata Skor ATS" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-3xl font-extrabold text-white">
                {stat.value}
              </div>
              <div className="text-surface-300 mt-1 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold">
              Semua yang kamu butuhkan
              <br />
              <span className="gradient-text">dalam satu platform</span>
            </h2>
            <p className="text-surface-300 mt-4">
              Dari membuat CV hingga latihan interview — semua ada di SiLamar.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass hover:border-brand-500/30 hover:shadow-brand-600/10 group rounded-none p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="bg-brand-600/20 text-brand-400 flex h-10 w-10 items-center justify-center rounded-none transition-transform group-hover:scale-110">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-none px-2.5 py-0.5 text-xs font-semibold ${
                      feature.tagColor === "green"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-brand-500/10 text-brand-400"
                    }`}
                  >
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-white">{feature.title}</h3>
                <p className="text-surface-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold">
              Cerita sukses dari{" "}
              <span className="gradient-text">pengguna SiLamar</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-none p-6">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-surface-300 mb-4 text-sm leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-surface-300 font-mono text-xs italic">
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold">
              Harga yang <span className="gradient-text">terjangkau</span>
            </h2>
            <p className="text-surface-300 mt-4">
              Mulai gratis, upgrade kapan saja.
            </p>
          </div>

          <div className="mx-auto mb-12 grid max-w-3xl gap-8 lg:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-none p-8 ${
                  plan.highlighted
                    ? "gradient-border bg-surface-900 glow"
                    : "glass"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 rounded-none px-4 py-1 font-mono text-xs font-bold text-white shadow-lg">
                      PALING POPULER
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-surface-300 mt-1 text-sm">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-extrabold text-white">
                      {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-surface-300">/bulan</span>
                    )}
                  </div>
                  <p className="text-brand-400 mt-1 text-xs font-medium">
                    {plan.credits}
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span className="text-surface-200">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  id={`cta-plan-${plan.name.toLowerCase()}`}
                  className={`block w-full rounded-none py-3 text-center text-sm font-bold transition-all ${
                    plan.highlighted
                      ? "bg-brand-600 hover:bg-brand-500 hover:shadow-brand-600/30 text-white hover:shadow-lg"
                      : "hover:bg-surface-800 border border-white/10 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Credit Packs */}
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold text-white">
              Atau beli kredit satuan
            </h3>
            <p className="text-surface-300 mt-2 text-sm">
              Bayar sesuai kebutuhan. Tidak perlu berlangganan.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            {creditPacks.map((pack) => (
              <div
                key={pack.name}
                className="glass rounded-none p-5 text-center"
              >
                <div className="font-mono text-2xl font-extrabold text-white">
                  {pack.credits}
                </div>
                <div className="text-surface-300 mb-3 text-sm">kredit</div>
                <div className="text-brand-400 mb-1 font-mono text-lg font-bold">
                  {formatCurrency(pack.price)}
                </div>
                <div className="text-surface-300 mb-4 text-xs">
                  ~{formatCurrency(Math.round(pack.price / pack.credits))}
                  /kredit
                </div>
                <Link
                  href="/register"
                  className="bg-surface-800 hover:bg-surface-700 block rounded-none py-2 text-sm font-semibold text-white transition-colors"
                >
                  {pack.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold">
            Siap lamar kerja lebih{" "}
            <span className="gradient-text">cerdas?</span>
          </h2>
          <p className="text-surface-300 mt-4">
            Bergabung dengan ribuan fresh graduate Indonesia yang sudah
            menggunakan SiLamar.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              id="cta-register-bottom"
              className="group bg-brand-600 shadow-brand-600/30 hover:bg-brand-500 flex items-center gap-2 rounded-none px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105"
            >
              Mulai Gratis — Dapat 3 Kredit AI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="text-surface-300 mt-4 text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300">
              Masuk di sini
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
