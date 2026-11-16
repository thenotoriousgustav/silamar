import type { DescriptionItem, ResumeContent } from "@/types/resume";

export interface CompletenessResult {
  score: number;
  suggestions: {
    text: string;
    weight: number;
    completed: boolean;
    category: string;
  }[];
}

function getDescriptionLength(
  desc: string | DescriptionItem[] | undefined,
): number {
  if (!desc) return 0;
  if (typeof desc === "string") {
    return desc.replace(/<[^>]*>/g, "").length;
  }
  if (Array.isArray(desc)) {
    return desc
      .map((item) => (typeof item === "string" ? item : item.text))
      .join(" ").length;
  }
  return 0;
}

export function calculateCompleteness(
  content: ResumeContent,
): CompletenessResult {
  const suggestions = [
    // 1. Personal Info
    {
      text: "Nama lengkap belum diisi",
      weight: 5,
      completed: !!content.personalInfo.fullName,
      category: "Informasi Pribadi",
    },
    {
      text: "Email belum diisi",
      weight: 5,
      completed: !!content.personalInfo.email,
      category: "Informasi Pribadi",
    },
    {
      text: "Nomor telepon belum diisi",
      weight: 5,
      completed: !!content.personalInfo.phone,
      category: "Informasi Pribadi",
    },
    {
      text: "Ringkasan profesional minimal 50 karakter",
      weight: 15,
      completed: (content.personalInfo.summary?.length || 0) > 50,
      category: "Informasi Pribadi",
    },
    // 2. Experience
    {
      text: "Tambahkan minimal satu pengalaman kerja",
      weight: 15,
      completed:
        content.experience.length > 0 &&
        !!content.experience[0].company &&
        !!content.experience[0].position,
      category: "Pengalaman Kerja",
    },
    {
      text: "Deskripsi pengalaman kerja minimal 30 karakter",
      weight: 15,
      completed:
        content.experience.length > 0 &&
        getDescriptionLength(content.experience[0].description) > 30,
      category: "Pengalaman Kerja",
    },
    // 3. Education
    {
      text: "Tambahkan informasi pendidikan (Institusi & Gelar)",
      weight: 20,
      completed:
        content.education.length > 0 &&
        !!content.education[0].institution &&
        !!content.education[0].degree,
      category: "Pendidikan",
    },
    // 4. Skills
    {
      text: "Tambahkan minimal 5 keahlian (Skills)",
      weight: 20,
      completed: content.skills.length >= 5,
      category: "Keahlian",
    },
  ];

  const score = suggestions.reduce(
    (acc, curr) => acc + (curr.completed ? curr.weight : 0),
    0,
  );

  return {
    score: Math.min(score, 100),
    suggestions,
  };
}

/**
 * Maps a completeness score to a user-facing feedback label and color.
 * Score thresholds: <30 = "Baru Memulai" (red), <70 = "Hampir Lengkap" (amber),
 * <100 = "Sangat Bagus" (green), 100 = "Sempurna!" (brand).
 */
export function getCompletenessFeedback(score: number) {
  if (score < 30)
    return {
      message: "Baru Memulai",
      color: "text-red-400",
      bg: "bg-red-400",
    };
  if (score < 70)
    return {
      message: "Hampir Lengkap",
      color: "text-amber-400",
      bg: "bg-amber-400",
    };
  if (score < 100)
    return {
      message: "Sangat Bagus",
      color: "text-emerald-400",
      bg: "bg-emerald-400",
    };
  return {
    message: "Sempurna!",
    color: "text-brand-400",
    bg: "bg-brand-400",
  };
}
