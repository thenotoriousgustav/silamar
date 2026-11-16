/**
 * Per-language section labels used by every template. Keep keys in sync with
 * usage sites — both HTML and PDF renderers consume these.
 */
export const RESUME_TRANSLATIONS = {
  id: {
    professionalSummary: "Ringkasan Profesional",
    workExperience: "Pengalaman Kerja",
    education: "Pendidikan",
    skills: "Keahlian",
    projects: "Proyek",
    certificates: "Sertifikat",
    awards: "Penghargaan",
    publications: "Publikasi",
    present: "Sekarang",
    gpa: "IPK",
  },
  en: {
    professionalSummary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certificates: "Certificates",
    awards: "Awards",
    publications: "Publications",
    present: "Present",
    gpa: "GPA",
  },
} as const;

export type ResumeLanguage = keyof typeof RESUME_TRANSLATIONS;
export type ResumeTranslations = (typeof RESUME_TRANSLATIONS)[ResumeLanguage];

export function resolveTranslations(
  lang: string | undefined,
): ResumeTranslations {
  return RESUME_TRANSLATIONS[lang as ResumeLanguage] ?? RESUME_TRANSLATIONS.id;
}
