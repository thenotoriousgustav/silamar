/**
 * Lightweight DTO for resume list items (pagination-friendly).
 * Contains only the columns needed for list display.
 */
export type ResumeListItemDTO = {
  id: string;
  title: string;
  atsScore: number | null;
  updatedAt: Date;
};

/**
 * Extended DTO that includes content and tracker info
 * needed by the resume list client component for completeness
 * calculation and tracker display.
 */
export type ResumeListItemWithDetailsDTO = ResumeListItemDTO & {
  content: unknown;
  trackers: { id: string; name: string }[];
};
