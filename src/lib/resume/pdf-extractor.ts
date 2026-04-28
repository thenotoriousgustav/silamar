// lib/resume/pdf-extractor.ts
export async function extractPdfText(buffer: Buffer): Promise<string> {
  // @ts-ignore - pdf-parse commonjs dynamic import
  const pdf = (await import("pdf-parse")).default;
  const result = await pdf(buffer);
  return result.text;
}
