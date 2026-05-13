import type { CoverLetterBuilderData } from "./cover-letter-content";

export type CoverLetterDTO = {
  id: string;
  title: string;
  content: CoverLetterBuilderData;
  company: string | null;
  jobTitle: string | null;
  updatedAt: Date;
};
