import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  FileText,
  Layers,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import { AtsSimulator } from "./components/ats-simulator";
import { HeroHud } from "./components/hero-hud";

export default function HomePage() {
  return (
    <div className="relative space-y-24 sm:space-y-32 py-8 sm:py-12 overflow-hidden">
      {/* ─── Ambient Subtle Blueprint Grid & Spatial Glow ──────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />



      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Left: Narrative & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Status Beacon */}
            <div className="inline-flex items-center gap-2 border border-border bg-card/80 px-3.5 py-1.5 text-xs font-mono shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-muted-foreground uppercase tracking-wider">
                SISTEM: OPEN ACCESS // 100% GRATIS UNTUK TALENTA ID
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-[1.08]">
              Lamar Kerja Lebih Cerdas.{" "}
              <span className="text-muted-foreground">Didukung AI.</span>
            </h1>

            {/* Value Proposition */}
            <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Ekosistem karir terpadu untuk talenta dan fresh graduate Indonesia.
              Rancang CV ATS-friendly terstandar, evaluasi kecocokan lowongan,
              buat cover letter personal, latihan interview, dan pantau seluruh
              lamaran tanpa sistem kredit berbayar.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/register"
                id="cta-hero-register"
                className="group bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-white/5"
              >
                Buat CV ATS Sekarang
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#simulator"
                className="border border-border bg-card/80 hover:bg-muted text-foreground px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors hover:border-foreground/40"
              >
                Coba Simulator ATS ↓
              </a>
            </div>

            {/* Telemetry Stats Bar */}
            <div className="border-t border-border pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  Rp 0
                </div>
                <div className="text-muted-foreground text-xs">
                  Bebas Kuota Kredit
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                  89%
                </div>
                <div className="text-muted-foreground text-xs">
                  Rata-rata Lolos ATS
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  50k+
                </div>
                <div className="text-muted-foreground text-xs">
                  Dokumen Dibuat
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  1-Pintu
                </div>
                <div className="text-muted-foreground text-xs">
                  Dari CV ke Offering
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right: Tactical ATS HUD Mockup with Luminous Scanline */}
          <div className="lg:col-span-5">
            <HeroHud />
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ATS SIMULATOR SECTION ───────────────────────────── */}
      <section id="simulator" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Interactive Tool Preview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mt-2">
            Simulasi Analisis ATS & Kesenjangan Skill
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1">
            Uji coba bagaimana algoritma SiLamar mencocokkan profil kandidat
            dengan kriteria lowongan kerja secara transparan.
          </p>
        </div>

        <AtsSimulator />
      </section>

      {/* ─── BENTO GRID FEATURE SHOWCASE ─────────────────────────────────── */}
      <section id="fitur" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Layers className="h-4 w-4 text-primary" />
            <span>Modul Fitur Terpadu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mt-2">
            Dirancang Sesuai Standar Rekruter Indonesia
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mt-1">
            Semua alat yang kamu butuhkan untuk bersaing di pasar kerja
            profesional, terintegrasi tanpa perlu berpindah-pindah platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Bento Item 1 (Span 2): Resume Builder with Spotlight */}
          <SpotlightCard
            className="p-6 sm:p-8 sm:col-span-2 flex flex-col justify-between"
            spotlightColor="rgba(255, 255, 255, 0.08)"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 text-primary-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono uppercase text-foreground">
                      CV Builder ATS-Friendly
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Multi-template ekspor PDF standar A4
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono px-2 py-0.5 font-bold">
                  TERUJI ATS
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Editor modular yang menjaga struktur CV tetap terbaca sempurna
                oleh bot ATS rekruter. Pilihan tipografi profesional (Inter,
                Roboto, Lato, Garamond), kontrol kerapatan teks, dan bebas
                elemen grafis yang merusak parsing otomatis.
              </p>

              {/* Visual Mock: Template Bar & Preview */}
              <div className="border border-border bg-background/60 p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
                  <span>TEMPLATE PILIHAN: [Classic] [Modern] [Minimal]</span>
                  <span className="text-foreground font-semibold">
                    Ukuran: A4 Standard
                  </span>
                </div>
                <div className="space-y-1.5 text-foreground">
                  <div className="font-bold text-sm">
                    GUSTAM RHEZA — SOFTWARE ENGINEER
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Jakarta, Indonesia · linkedin.com/in/gustam · github.com/gustam
                  </div>
                  <p className="text-xs text-muted-foreground/90 pt-1 line-clamp-2">
                    Pengalaman 2+ tahun membangun aplikasi web berkinerja tinggi
                    menggunakan arsitektur Next.js & sistem basis data relasional.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                Ekspor PDF langsung tanpa watermark
              </span>
              <Link
                href="/documents/resumes"
                className="group text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Buka Editor Resume{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Bento Item 2: Job Tracker Kanban with Spotlight */}
          <SpotlightCard
            className="p-6 sm:p-8 flex flex-col justify-between"
            spotlightColor="rgba(16, 185, 129, 0.1)"
          >
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="bg-emerald-500/20 p-2 text-emerald-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-foreground">
                    Job Tracker Kanban
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manajemen alur lamaran
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Gantikan catatan spreadsheet yang berserakan. Pantau setiap posisi
                dari status Dilamar, Tahap Interview, hingga Penawaran Gaji dalam
                satu papan visual rapi.
              </p>

              {/* Visual Mock: Mini Kanban Column */}
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-background/80 border border-border p-2.5 flex items-center justify-between transition-colors hover:border-border/80">
                  <div>
                    <div className="font-bold text-foreground">Gojek (GoTo)</div>
                    <div className="text-xs text-muted-foreground">
                      Frontend Dev · Jakarta
                    </div>
                  </div>
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 font-semibold">
                    Interview
                  </span>
                </div>
                <div className="bg-background/80 border border-border p-2.5 flex items-center justify-between transition-colors hover:border-border/80">
                  <div>
                    <div className="font-bold text-foreground">Tokopedia</div>
                    <div className="text-xs text-muted-foreground">
                      Software Eng · BSD
                    </div>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 font-semibold">
                    Dilamar
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <Link
                href="/job-tracker"
                className="group text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Lihat Kanban Board{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Bento Item 3: AI Job Fit Analysis with Spotlight */}
          <SpotlightCard
            className="p-6 sm:p-8 flex flex-col justify-between"
            spotlightColor="rgba(168, 85, 247, 0.1)"
          >
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="bg-purple-500/20 p-2 text-purple-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-foreground">
                    Job Fit Matcher
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Resume vs Job Description
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Tempel teks lowongan kerja yang kamu minati. AI akan
                membandingkan keahlian di CV kamu dan mendeteksi keyword penting
                yang masih terlewat sebelum kamu mengirim lamaran.
              </p>

              <div className="border border-border bg-background/50 p-3 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Relevansi Kualifikasi:</span>
                  <span className="text-emerald-400 font-bold">88% MATCH</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Keyword Kurang:{" "}
                  <span className="text-amber-400">Docker, Redux Toolkit</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <Link
                href="/job-fit-analysis"
                className="group text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Analisis Kesesuaian Lowongan{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Bento Item 4: AI Cover Letter with Spotlight */}
          <SpotlightCard
            className="p-6 sm:p-8 flex flex-col justify-between"
            spotlightColor="rgba(59, 130, 246, 0.1)"
          >
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="bg-blue-500/20 p-2 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-foreground">
                    Cover Letter AI
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Surat lamaran profesional
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Hasilkan draf surat pengantar kerja yang tidak generik. AI meramu
                pengalaman spesifik dari resume kamu agar relevan dengan posisi
                dan perusahaan yang dituju.
              </p>

              <div className="border border-border bg-background/50 p-3 font-mono text-xs text-muted-foreground italic">
                "Berdasarkan pengalaman saya memimpin migrasi frontend ke Next.js,
                saya yakin dapat mempercepat waktu rendering aplikasi di tim Anda..."
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <Link
                href="/documents/cover-letter"
                className="group text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Generate Cover Letter{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>

          {/* Bento Item 5: Mock Interview AI with Spotlight */}
          <SpotlightCard
            className="p-6 sm:p-8 flex flex-col justify-between"
            spotlightColor="rgba(244, 63, 94, 0.1)"
          >
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
                <div className="bg-rose-500/20 p-2 text-rose-400">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono uppercase text-foreground">
                    Mock Interview AI
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Simulasi tanya-jawab & evaluasi
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Latihan menjawab pertanyaan wawancara teknis dan behavioral (metode
                STAR). Dapatkan umpan balik objektif mengenai kejelasan struktur
                dan bobot jawaban sebelum hari-H.
              </p>

              <div className="border border-border bg-background/50 p-3 font-mono text-xs space-y-1.5">
                <div className="text-foreground font-semibold text-xs">
                  Q: "Ceritakan tantangan terbesar dalam tim sebelumnya?"
                </div>
                <div className="text-emerald-400 text-xs">
                  ✓ Struktur STAR terpenuhi (Action & Result jelas)
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border">
              <Link
                href="/dashboard"
                className="group text-xs font-mono font-bold text-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Mulai Latihan Interview{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ─── WORKFLOW PIPELINE ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SpotlightCard className="p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Alur Kerja Terintegrasi
            </h2>
            <p className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mt-2">
              Dari Dokumen Kosong Hingga Penawaran Kerja
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Rancang CV ATS",
                desc: "Gunakan editor modular untuk memastikan format 1-kolom lolos screening sistem HRD.",
              },
              {
                step: "02",
                title: "Cek Match Score",
                desc: "Bandingkan resume dengan teks kualifikasi lowongan kerja untuk mengisi celah keyword.",
              },
              {
                step: "03",
                title: "Lacak di Kanban",
                desc: "Simpan setiap lamaran ke board dan pantau tenggat waktu serta jadwal follow-up.",
              },
              {
                step: "04",
                title: "Kuasai Interview",
                desc: "Latihan simulasi tanya-jawab dengan AI untuk melatih ketenangan dan ketajaman argumen.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-border bg-background/60 p-5 space-y-2 transition-all hover:border-primary/40"
              >
                <div className="font-mono text-xs font-bold text-primary">
                  TAHAP // {item.step}
                </div>
                <div className="font-mono text-sm font-bold text-foreground uppercase">
                  {item.title}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </section>

      {/* ─── FAQ SECTION ─────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Transparansi & Informasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mt-2">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Mengapa seluruh fitur SiLamar tersedia 100% gratis?",
              a: "SiLamar dibangun dengan komitmen membuka akses seluas-luasnya bagi talenta dan fresh graduate Indonesia untuk mendapatkan kesempatan karir yang adil. Tidak ada sistem kuota kredit kaku, paywall tersembunyi, ataupun biaya langganan bulanan.",
            },
            {
              q: "Apakah format resume yang dihasilkan benar-benar lolos sistem ATS?",
              a: "Ya. Template kami dirancang mengikuti panduan teknis parsing Applicant Tracking System internasional dan lokal (Workday, Taleo, Greenhouse, Kalibrr, Glints): struktur teks 1-kolom, hirarki heading standar, dan eliminasi tabel kompleks yang kerap menggagalkan pembacaan otomatis.",
            },
            {
              q: "Bagaimana dengan keamanan data pribadi saya?",
              a: "Dokumen resume dan data lamaran kerja Anda disimpan secara aman di cloud storage terenkripsi dan hanya dapat diakses oleh akun Anda sendiri. Kami tidak memperjualbelikan data pengguna ke pihak ketiga mana pun.",
            },
            {
              q: "Saya fresh graduate tanpa pengalaman kerja, apakah SiLamar tetap berguna?",
              a: "Sangat berguna. Resume Builder kami menyediakan panduan penulisan pengalaman proyek kuliah, organisasi kampus, sertifikasi, dan keahlian teknis agar tetap terlihat profesional dan berbobot di mata rekruter.",
            },
          ].map((item, i) => (
            <SpotlightCard
              key={i}
              className="p-6 space-y-2"
              spotlightColor="rgba(255, 255, 255, 0.05)"
            >
              <h3 className="text-sm font-bold font-mono text-foreground uppercase">
                Q: {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ─── FINAL CALL TO ACTION ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SpotlightCard
          className="p-8 sm:p-16 text-center space-y-6"
          spotlightColor="rgba(16, 185, 129, 0.15)"
        >
          <div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 text-xs font-mono text-muted-foreground">
            <span>READY TO APPLY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-foreground max-w-3xl mx-auto">
            Tingkatkan Peluang Karir Kamu Mulai Hari Ini
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pencari kerja di Indonesia yang telah
            mempersiapkan CV ATS-friendly dan mengorganisir lamaran mereka secara
            profesional.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              id="cta-final-register"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3.5 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 transition-all w-full sm:w-auto justify-center hover:scale-[1.02] active:scale-[0.99]"
            >
              Daftar Sekarang — 100% Gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="border border-border bg-background hover:bg-muted text-foreground px-8 py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors w-full sm:w-auto justify-center"
            >
              Masuk ke Akun
            </Link>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
