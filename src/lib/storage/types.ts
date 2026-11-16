/**
 * Storage service interface for file upload, retrieval, and deletion.
 * Implementations can use Cloudflare R2, S3, UploadThing, or any compatible provider.
 */

export type UploadResult = {
  key: string;
  url: string;
};

export type UploadFileParams = {
  /** Storage key/path for the file (e.g., "resumes/{userId}/{resumeId}/{timestamp}.pdf") */
  key: string;
  /** File content as a Buffer */
  body: Buffer;
  /** MIME content type (e.g., "application/pdf") */
  contentType: string;
};

export type GetSignedUrlParams = {
  /** Storage key of the file */
  key: string;
  /** URL expiration time in seconds (default: 3600) */
  expiresInSeconds?: number;
};

export interface StorageClient {
  /** Upload a file to storage */
  upload(params: UploadFileParams): Promise<UploadResult>;

  /** Delete a file from storage */
  delete(key: string): Promise<void>;

  /** Get a presigned/temporary URL for accessing a file */
  getSignedUrl(params: GetSignedUrlParams): Promise<string>;

  /** Get the public URL for a file (if publicly accessible) */
  getPublicUrl(key: string): string;
}
