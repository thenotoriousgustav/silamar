/**
 * Lightweight DTO for cover letter list items (pagination-friendly).
 * Contains only the columns needed for basic list display.
 */
export type CoverLetterListItemDTO = {
  id: string;
  title: string;
  updatedAt: Date;
};

/**
 * Extended DTO that includes additional fields needed by the
 * cover letter list client component for preview and display.
 */
export type CoverLetterListItemWithDetailsDTO = CoverLetterListItemDTO & {
  jobTitle: string | null;
  company: string | null;
  content: unknown;
};
