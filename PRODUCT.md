# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pencari kerja di Indonesia—termasuk fresh graduate, mahasiswa tingkat akhir, profesional pemula (junior), dan career switcher yang membutuhkan bantuan menyusun resume standar industri, menyaring kesesuaian lowongan kerja, mempersiapkan wawancara, serta mengelola alur lamaran kerja secara terorganisir.

## Product Purpose

Membantu pencari kerja di Indonesia meningkatkan peluang diterima kerja melalui platform all-in-one cerdas. SiLamar menyederhanakan proses lamaran dari hulu ke hilir: mulai dari penyusunan CV ATS-friendly dan surat lamaran personal, simulasi interview, hingga pelacakan status seleksi di berbagai perusahaan tanpa hambatan sistem kredit berbayar.

## Positioning

Platform pendamping karir terpadu khusus talenta Indonesia yang menyatukan pembuatan berkas lamaran, evaluasi AI kontekstual, dan manajemen pelacakan lowongan dalam satu atap secara gratis dan terbuka, dengan fleksibilitas model Bring-Your-Own-Key (BYOK) untuk kemandirian pengguna.

## Operating Context

- Digunakan melalui web desktop dan mobile browser saat pengguna aktif mencari kerja, menyalin lowongan dari portal rekrutmen (LinkedIn, JobStreet, Glints, Kalibrr), dan memperbarui berkas lamaran.
- Pengguna berulang kali mengekspor dokumen dalam format PDF standar rekruter untuk dikirimkan melalui email, portal karir, atau platform formulir online.
- Sesi penggunaan intensif terjadi saat persiapan wawancara atau saat mengevaluasi skor kecocokan antara resume dengan deskripsi pekerjaan yang ditargetkan.

## Capabilities and Constraints

- **Resume Builder ATS-Friendly:** Editor modular dengan template bersih, kontrol tata letak, dan ekspor langsung ke PDF (@react-pdf/renderer).
- **Job Application Tracker:** Papan Kanban interaktif untuk melacak status pelacakan (Dilamar, Screening, Interview, Penawaran, Ditolak) dilengkapi integrasi scrape lowongan.
- **AI Resume & ATS Analyzer:** Penilaian kompatibilitas ATS, identifikasi kelemahan struktur, dan rekomendasi perbaikan berbasis AI.
- **Job Fit Analysis:** Komparasi komprehensif antara isi resume dengan kriteria Job Description untuk mendeteksi kesenjangan keahlian (*skill gap*) dan kata kunci penting.
- **AI Cover Letter Generator:** Pembuatan draf surat lamaran terpersonalisasi berdasarkan resume dan posisi yang dituju dengan pilihan nada bahasa.
- **Mock Interview AI:** Latihan tanya-jawab wawancara kerja terarah dengan evaluasi otomatis terhadap struktur jawaban pengguna.
- **Resume Roast AI:** Fitur evaluasi resume gaya santai dan konstruktif untuk menemukan celah yang perlu diperbaiki dengan cara yang interaktif.
- **Model Akses:** Akses penuh bebas kredit, dengan rencana dukungan Bring-Your-Own-Key (BYOK) untuk opsi penggunaan kuota AI pengguna secara mandiri.
- **Pondasi Teknis:** Next.js 16 (App Router), React 19, Tailwind CSS v4, PostgreSQL (Neon) + Drizzle ORM, Better Auth, dan Cloudflare R2 storage.

## Brand Commitments

- **Nama:** SiLamar (dengan tagline: *"Lamar Kerja Lebih Cerdas"*).
- **Tone & Voice:** Memberdayakan, profesional, jelas, praktis, dan ramah bagi pencari kerja lokal tanpa istilah rekrutmen yang mengintimidasi.
- **Estetika:** Modern, efisien, fungsional, dan fokus pada kejelasan tipografi dokumen formal.

## Evidence on Hand

- Skema database relasional aktif di `db/schema/` untuk data akun, resume, cover letter, aplikasi kerja, dan log AI.
- Komponen siap pakai di `src/features/` untuk alur resume builder, cover letter, job tracker, resume analysis, dan mock interview.
- Draf template dokumen dan prompt AI yang telah disesuaikan dengan bahasa dan kebutuhan pasar kerja Indonesia di `src/lib/ai/prompts/`.

## Product Principles

1. **Aksesibilitas Tanpa Hambatan:** Fitur esensial pencarian kerja tidak boleh dikunci di balik paywall atau kuota kredit yang membatasi peluang pengguna.
2. **Konteks Lokal Indonesia:** Dirancang dengan pemahaman terhadap kebiasaan rekruter, struktur CV, dan format rekrutmen di Indonesia.
3. **AI Sebagai Asisten Kolaboratif:** AI bertindak sebagai pendorong inspirasi dan pemeriksa kualitas; keputusan konten dan keaslian fakta tetap sepenuhnya berada di tangan pelamar.
4. **Satu Alur Terintegrasi:** Menghubungkan pembuatan dokumen, evaluasi kesesuaian posisi, hingga papan pelacakan lamaran agar pengguna tidak perlu berpindah-pindah aplikasi terpisah.

## Accessibility & Inclusion

- Mematuhi standar aksesibilitas web mendasar (kontras warna yang memadai, navigasi ramah keyboard, dan struktur heading hierarkis).
- Kompatibilitas responsif di perangkat layar kecil (ponsel pintar) untuk memastikan kemudahan akses bagi pencari kerja dengan perangkat terbatas.
