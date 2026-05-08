/**
 * PDF generation helper
 * Uses browser's print API for PDF generation (via window.print())
 * For server-side PDF generation, consider using @react-pdf/renderer
 */

export interface PdfGenerationOptions {
  filename?: string;
}

/**
 * Trigger browser print dialog for PDF export (client-side only)
 */
export function triggerPrintToPdf(filename?: string): void {
  if (typeof window === "undefined") return;

  if (filename) {
    // Set document title temporarily to influence PDF filename
    const originalTitle = document.title;
    document.title = filename;
    window.print();
    document.title = originalTitle;
  } else {
    window.print();
  }
}

/**
 * Convert a resume content object to plain text for AI analysis
 */
export function resumeContentToText(content: Record<string, unknown>): string {
  const sections: string[] = [];

  // Personal Info
  if (content.personalInfo) {
    const info = content.personalInfo as Record<string, string>;
    sections.push(
      `INFORMASI PRIBADI\n${[
        info.fullName,
        info.email,
        info.phone,
        info.location,
        info.linkedin,
        info.website,
      ]
        .filter(Boolean)
        .join(" | ")}`,
    );

    if (info.summary) {
      sections.push(`RINGKASAN PROFESIONAL\n${info.summary}`);
    }
  }

  // Experience
  if (content.experience && Array.isArray(content.experience)) {
    const expItems = (content.experience as Array<Record<string, string>>)
      .map(
        (exp) =>
          `${exp.position} di ${exp.company} (${exp.startDate} - ${exp.endDate || "Sekarang"})\n${exp.description || ""}`,
      )
      .join("\n\n");
    sections.push(`PENGALAMAN KERJA\n${expItems}`);
  }

  // Education
  if (content.education && Array.isArray(content.education)) {
    const eduItems = (content.education as Array<Record<string, string>>)
      .map(
        (edu) =>
          `${edu.degree} di ${edu.institution} (${edu.startYear} - ${edu.endYear || "Sekarang"}) IPK: ${edu.gpa || "-"}`,
      )
      .join("\n");
    sections.push(`PENDIDIKAN\n${eduItems}`);
  }

  // Skills
  if (content.skills && Array.isArray(content.skills)) {
    sections.push(`SKILL\n${(content.skills as string[]).join(", ")}`);
  }

  // Projects
  if (content.projects && Array.isArray(content.projects)) {
    const projectItems = (content.projects as Array<Record<string, string>>)
      .map(
        (proj) =>
          `${proj.name}: ${proj.description || ""}\nTech: ${proj.technologies || ""}\n${proj.url ? `URL: ${proj.url}` : ""}`,
      )
      .join("\n\n");
    sections.push(`PROYEK\n${projectItems}`);
  }

  return sections.join("\n\n---\n\n");
}
