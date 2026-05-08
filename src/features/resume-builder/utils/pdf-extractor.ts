import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // unpdf expects Uint8Array
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });

    return text;
  } catch (error) {
    console.error("Unpdf extraction error:", error);
    throw new Error("Gagal mengekstrak teks dari PDF menggunakan unpdf");
  }
}
