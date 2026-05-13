import { CoverLetterBuilderData } from "@/features/cover-letter-builder/types/cover-letter-content";

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  category: "formal" | "modern" | "skill-focused";
  data: Partial<CoverLetterBuilderData>;
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: "formal-standard",
    name: "Formal (Standar)",
    description:
      "Cocok untuk melamar di perusahaan korporat, perbankan, atau instansi resmi.",
    category: "formal",
    data: {
      subject: "Lamaran Pekerjaan - [Nama Posisi] - [Nama Anda]",
      content: `Yth. Bapak/Ibu [Nama HRD atau Nama Manajer Perekrutan],
[Nama Perusahaan]
[Alamat Perusahaan]

Melalui surat ini, saya bermaksud menyampaikan ketertarikan saya untuk melamar posisi [Nama Posisi] di [Nama Perusahaan] sebagaimana diinformasikan melalui [Sebutkan Sumber Info Lowongan].

Dengan pengalaman selama [Jumlah] tahun di bidang [Bidang Keahlian], saya telah mengembangkan pemahaman mendalam mengenai [Sebutkan 1-2 Skill Utama]. Di peran saya sebelumnya sebagai [Posisi Terakhir], saya berhasil [Sebutkan Pencapaian Utama, misal: meningkatkan efisiensi operasional sebesar 20%]. Saya yakin latar belakang pendidikan dan pengalaman profesional saya akan memberikan kontribusi positif bagi tim [Nama Departemen] di [Nama Perusahaan].

Saya adalah pribadi yang disiplin, memiliki integritas tinggi, dan mampu bekerja secara mandiri maupun dalam tim. Bersama surat ini, saya lampirkan CV yang merinci riwayat pendidikan dan pengalaman kerja saya untuk Bapak/Ibu tinjau.

Besar harapan saya untuk dapat mendiskusikan kualifikasi saya lebih lanjut dalam sesi wawancara. Terima kasih atas waktu dan pertimbangan Bapak/Ibu.

Hormat saya,

[Nama Lengkap Anda]`,
    },
  },
  {
    id: "modern-startup",
    name: "Modern & Antusias",
    description:
      "Cocok untuk startup teknologi, agensi kreatif, atau lingkungan kerja dinamis.",
    category: "modern",
    data: {
      subject:
        "[Nama Posisi] - [Nama Anda]: Siap Berkontribusi untuk [Nama Perusahaan]",
      content: `Halo Tim Rekrutmen [Nama Perusahaan] / [Nama Manajer Perekrutan],

Saya telah lama mengikuti perkembangan [Nama Perusahaan], terutama dalam hal [Sebutkan Proyek atau Visi Perusahaan yang Anda Kagumi]. Oleh karena itu, saya sangat bersemangat saat mengetahui adanya lowongan untuk posisi [Nama Posisi].

Sebagai seorang [Nama Profesi] yang berfokus pada hasil, saya senang memecahkan masalah kompleks melalui [Sebutkan Metode atau Skill]. Beberapa poin yang saya bawa untuk tim Anda antara lain:
• [Skill 1]: Pengalaman dalam mengelola [Proyek] yang menghasilkan [Output].
• [Skill 2]: Kemampuan adaptasi cepat di lingkungan fast-paced.
• [Pencapaian]: Berhasil [Sebutkan pencapaian spesifik dengan angka/data].

Saya tidak hanya ingin mencari pekerjaan, tetapi saya ingin menjadi bagian dari perjalanan [Nama Perusahaan] dalam mencapai [Tujuan Perusahaan]. Saya percaya budaya kerja yang inovatif di sini sangat selaras dengan cara kerja saya.

Terlampir portofolio dan resume saya. Saya sangat menantikan kesempatan untuk berbincang lebih lanjut.

Salam hangat,

[Nama Lengkap Anda]`,
    },
  },
  {
    id: "skill-focused",
    name: "Berbasis Skill (Transisi Karir)",
    description:
      "Menonjolkan keahlian spesifik, cocok untuk fresh graduate atau pindah jalur karir.",
    category: "skill-focused",
    data: {
      subject: "Lamaran Pekerjaan - [Nama Posisi] - [Nama Anda]",
      content: `Yth. Manajer Perekrutan [Nama Perusahaan],

Saya menulis surat ini untuk mengekspresikan minat saya pada posisi [Nama Posisi]. Meskipun latar belakang saya sebelumnya berada di bidang [Bidang Lama], saya telah menghabiskan [Waktu] terakhir untuk mendalami [Bidang Baru] dan mengasah keahlian teknis yang relevan dengan kebutuhan perusahaan Anda.

Mengapa saya adalah kandidat yang tepat untuk peran ini?
1. Transferable Skills: Pengalaman saya dalam [Skill dari Pekerjaan Lama] sangat membantu saya dalam mengelola [Tanggung Jawab di Pekerjaan Baru].
2. Dedikasi Belajar: Saya telah menyelesaikan sertifikasi [Nama Sertifikasi] dan menguasai [Software/Alat] yang diperlukan untuk posisi ini.
3. Perspektif Baru: Dengan latar belakang lintas industri, saya mampu membawa sudut pandang unik dalam strategi [Sebutkan bagian pekerjaan].

Saya sangat termotivasi untuk membuktikan bahwa kemampuan saya dapat memberikan dampak nyata bagi [Nama Perusahaan]. Saya tersedia untuk wawancara kapan saja dan dapat dihubungi melalui [Nomor Telepon/Email].

Terima kasih atas perhatian Anda.

Hormat saya,

[Nama Lengkap Anda]`,
    },
  },
];
