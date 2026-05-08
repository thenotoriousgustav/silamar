import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

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
