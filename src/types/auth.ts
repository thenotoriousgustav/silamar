export type UserPlan = "free" | "pro";

export type AiFeatureType =
  | "resume_analyze"
  | "resume_analyze_jd"
  | "cover_letter"
  | "skill_gap"
  | "mock_interview";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  credits: number;
  plan: UserPlan;
  planExpiresAt?: Date | null;
  createdAt: Date;
}

export interface AuthSession {
  user: UserProfile;
  session: {
    id: string;
    expiresAt: Date;
  };
}

export const AI_FEATURE_LABELS: Record<AiFeatureType, string> = {
  resume_analyze: "Analisis Resume",
  resume_analyze_jd: "Resume vs Deskripsi Kerja",
  cover_letter: "Generate Cover Letter",
  skill_gap: "Analisis Skill Gap",
  mock_interview: "Mock Interview AI",
};

export const CREDITS_PER_FEATURE: Record<AiFeatureType, number> = {
  resume_analyze: 1,
  resume_analyze_jd: 1,
  cover_letter: 1,
  skill_gap: 1,
  mock_interview: 1,
};
