import type { ResumeContent } from "@/types/resume";

export function calculateCompleteness(content: ResumeContent): number {
  let score = 0;

  // 1. Personal Info (Max 30%)
  const pi = content.personalInfo;
  if (pi.fullName) score += 5;
  if (pi.email) score += 5;
  if (pi.phone) score += 5;
  if (pi.summary && pi.summary.length > 50) score += 15;
  else if (pi.summary) score += 5;

  // 2. Experience (Max 30%)
  if (content.experience.length > 0) {
    const firstExp = content.experience[0];
    if (firstExp.company && firstExp.position) score += 15;
    if (firstExp.description && firstExp.description.length > 30) score += 15;
  }

  // 3. Education (Max 20%)
  if (content.education.length > 0) {
    const firstEdu = content.education[0];
    if (firstEdu.institution && firstEdu.degree) score += 20;
  }

  // 4. Skills (Max 20%)
  const skillCount = content.skills.length;
  if (skillCount >= 5) score += 20;
  else if (skillCount >= 3) score += 10;
  else if (skillCount >= 1) score += 5;

  return Math.min(score, 100);
}

export function getCompletenessFeedback(score: number) {
  if (score < 30) return { message: "Baru Memulai", color: "text-red-400", bg: "bg-red-400" };
  if (score < 70) return { message: "Hampir Lengkap", color: "text-amber-400", bg: "bg-amber-400" };
  if (score < 100) return { message: "Sangat Bagus", color: "text-emerald-400", bg: "bg-emerald-400" };
  return { message: "Sempurna!", color: "text-brand-400", bg: "bg-brand-400" };
}
