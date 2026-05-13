import type { ResumeContent } from "./resume-content";

/**
 * Data Transfer Object for a single resume in the builder context.
 * Exposes only the fields needed by the resume builder UI.
 */
export type ResumeDTO = {
  id: string;
  title: string;
  content: ResumeContent;
  atsScore: number | null;
  updatedAt: Date;
};
