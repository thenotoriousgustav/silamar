// Components (public API)
export { ResumeListClient } from "./components/resume-list-client";
export { ResumeCreateClient } from "./components/resume-create-client";
export { ResumeImportDialog } from "./components/resume-import-dialog";
export { ResumePreviewDrawer } from "./components/resume-preview-drawer";
export { TemplateSelectionDialog } from "./components/template-selection-dialog";

// Actions (public API)
export { getResumesAction, deleteResumeAction } from "./actions";

// Queries (public API)
export { getResumesDTO } from "./queries";

// Types (public API)
export type {
  ResumeListItemDTO,
  ResumeListItemWithDetailsDTO,
} from "./types/resume-list-item-dto";
export type {
  ResumeContent,
  ResumePersonalInfo,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkill,
  ResumeCustomSection,
  ResumeCustomSectionItem,
  ResumeStyle,
  ResumeTemplateId,
  DescriptionItem,
  AtsAnalysisResult,
  JdMatchResult,
} from "./types/resume";
export { RESUME_TEMPLATE_IDS } from "./types/resume";

// Utils (public API)
export {
  calculateCompleteness,
  getCompletenessFeedback,
} from "./utils/completeness";
export type { CompletenessResult } from "./utils/completeness";

// Schemas (public API)
export { ResumeContentSchema } from "./schema";
