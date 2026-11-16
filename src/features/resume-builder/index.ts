// Components (public API)
export { ResumeBuilderClient } from "./components/resume-builder-client";

// Actions (public API)
export { createResumeAction } from "./actions/create-resume";
export { createEmptyResumeAction } from "./actions/create-empty-resume";
export { updateResumeAction } from "./actions/update-resume";

// Queries (public API)
export { getResumeById } from "./queries/get-resume";

// Types (public API)
export type { ResumeDTO } from "./types/resume-dto";
export type { ResumeContent, ResumeTemplateId } from "./types/resume-content";
export type { ResumeFormHandlers } from "./types/resume-form-handlers";

// Utils (public API)
export { extractPdfText } from "./utils/pdf-extractor";

// Schemas (public API)
export {
  createResumeSchema,
  createEmptyResumeSchema,
  updateResumeSchema,
} from "./schemas";
