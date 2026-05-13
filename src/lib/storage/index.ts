// Storage service — interface and implementations
export type {
  StorageClient,
  UploadFileParams,
  UploadResult,
  GetSignedUrlParams,
} from "./types";

export { createR2StorageClient } from "./r2";

// Legacy re-exports for backward compatibility
export {
  uploadResumePdf,
  getPresignedResumeUrl,
  deleteResumePdf,
} from "./r2";
