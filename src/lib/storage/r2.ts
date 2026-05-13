import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/config/env";

import type {
  GetSignedUrlParams,
  StorageClient,
  UploadFileParams,
  UploadResult,
} from "./types";

function createS3Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
      secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Creates a StorageClient backed by Cloudflare R2 (S3-compatible).
 * Use this factory function for dependency injection.
 */
export function createR2StorageClient(): StorageClient {
  const client = createS3Client();
  const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME!;
  const publicUrl = env.CLOUDFLARE_R2_PUBLIC_URL!;

  return {
    async upload(params: UploadFileParams): Promise<UploadResult> {
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
        }),
      );

      return {
        key: params.key,
        url: `${publicUrl}/${params.key}`,
      };
    },

    async delete(key: string): Promise<void> {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      );
    },

    async getSignedUrl(params: GetSignedUrlParams): Promise<string> {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: params.key,
      });

      return getSignedUrl(client, command, {
        expiresIn: params.expiresInSeconds ?? 3600,
      });
    },

    getPublicUrl(key: string): string {
      return `${publicUrl}/${key}`;
    },
  };
}

// ---------------------------------------------------------------------------
// Legacy exports — maintain backward compatibility with existing imports
// ---------------------------------------------------------------------------

const r2Client = createS3Client();
const BUCKET_NAME = env.CLOUDFLARE_R2_BUCKET_NAME!;
const PUBLIC_URL = env.CLOUDFLARE_R2_PUBLIC_URL!;

/**
 * Upload a file to Cloudflare R2
 * File naming convention: resumes/{userId}/{resumeId}/{timestamp}.pdf
 */
export async function uploadResumePdf(
  userId: string,
  resumeId: string,
  fileBuffer: Buffer,
  contentType: string = "application/pdf",
): Promise<{ key: string; url: string }> {
  const timestamp = Date.now();
  const key = `resumes/${userId}/${resumeId}/${timestamp}.pdf`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    }),
  );

  return {
    key,
    url: `${PUBLIC_URL}/${key}`,
  };
}

/**
 * Generate a presigned URL for viewing a resume PDF (expires in 1 hour)
 */
export async function getPresignedResumeUrl(
  key: string,
  expiresInSeconds: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a resume PDF from R2
 */
export async function deleteResumePdf(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
  );
}
