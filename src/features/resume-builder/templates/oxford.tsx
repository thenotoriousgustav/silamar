"use client";

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import "./shared/pdf-fonts";

import { cleanUrl } from "./shared/constants";
import { buildBasePdfStyles, PDF_BASE_COLORS } from "./shared/pdf-base-styles";
import { PdfBulletList } from "./shared/pdf-bullet-list";
import { PdfSummary } from "./shared/pdf-summary";
import { resolveTranslations } from "./shared/translations";
import type { PdfTemplateProps, TemplateDefinition } from "./types";

/**
 * Oxford PDF template — University of Oxford careers CV style:
 *  - Name centered, larger font, black
 *  - Contact info centered, pipe-separated
 *  - Section titles: BOLD UPPERCASE, left-aligned, rule ABOVE (border-top)
 */
export function OxfordPdfTemplate({ data }: PdfTemplateProps) {
  const { personalInfo, style } = data;
  const translations = resolveTranslations(style?.language);
  const paperSize = style?.paperSize || "A4";
  const uppercaseHeaders = style?.uppercaseHeaders ?? true;

  const baseStyles = buildBasePdfStyles(style);
  const baseFontSize = (baseStyles.page.fontSize as number) ?? 11;

  const styles = StyleSheet.create({
    ...baseStyles,
    page: { ...baseStyles.page, paddingHorizontal: 50, paddingVertical: 45 },
    header: { alignItems: "center", marginBottom: 8 },
    name: {
      fontSize: baseFontSize + 7,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.primary,
      marginBottom: 4,
    },
    contactSep: { marginHorizontal: 4, color: PDF_BASE_COLORS.primary },
    headerRule: { width: "100%" },
    sectionTitle: {
      fontSize: baseFontSize,
      fontWeight: 700,
      textTransform: uppercaseHeaders ? "uppercase" : "none",
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.primary,
      paddingBottom: 3,
      marginTop: (baseStyles.sectionTitle as any).marginTop,
      marginBottom: 5,
      color: PDF_BASE_COLORS.primary,
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
    },
    itemHeadline: {
      fontSize: baseFontSize - 1,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
      flexGrow: 1,
      flexShrink: 1,
    },
    itemDate: {
      fontSize: baseFontSize - 2,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
    },
    itemBody: { fontSize: baseFontSize - 2, color: PDF_BASE_COLORS.primary },
    experienceItem: { marginBottom: (baseStyles.experienceItem as any).marginBottom ?? 7 },
    skillRow: { marginBottom: 2 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  const contactItems: { key: string; label: string; href?: string }[] = [];
  if (personalInfo.email)
    contactItems.push({
      key: "email",
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    });
  if (personalInfo.phone)
    contactItems.push({
      key: "phone",
      label: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
    });
  if (personalInfo.location)
    contactItems.push({ key: "loc", label: personalInfo.location });
  if (personalInfo.linkedin?.url)
    contactItems.push({
      key: "li",
      label: personalInfo.linkedin.label || cleanUrl(personalInfo.linkedin.url),
      href: personalInfo.linkedin.url,
    });
  if (personalInfo.website?.url)
    contactItems.push({
      key: "web",
      label: personalInfo.website.label || cleanUrl(personalInfo.website.url),
      href: personalInfo.website.url,
    });

  const order = data.sectionOrder || [
    "experience",
    "education",
    "skills",
    "projects",
    "custom",
  ];

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.fullName || "Full Name"}
          </Text>
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <View
                key={item.key}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                {idx > 0 && <Text style={styles.contactSep}>|</Text>}
                {item.href ? (
                  <Link
                    src={item.href}
                    style={{
                      color: PDF_BASE_COLORS.link,
                      fontSize: baseFontSize - 2,
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Text style={{ fontSize: baseFontSize - 2 }}>
                    {item.label}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View style={styles.headerRule} />
        </View>

        {/* Summary */}
        <PdfSummary
          summary={personalInfo.summary}
          translations={translations}
          styles={{
            ...styles,
            section: { marginBottom: 8 },
            summary: { ...styles.itemBody, textAlign: "justify" },
          }}
        />

        {/* Sections */}
        {order.map((sectionId) => {
          if (sectionId === "experience" && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.workExperience}
                </Text>
                {data.experience.map((exp, idx) => {
                  const dateRange = exp.startDate
                    ? `${exp.startDate}–${exp.isCurrentJob ? translations.present : exp.endDate || ""}`
                    : "";
                  return (
                    <View key={idx} style={styles.experienceItem}>
                      {/* Row 1: Company — Date */}
                      <View style={styles.itemRow}>
                        <Text style={styles.itemHeadline}>
                          {exp.company || ""}
                        </Text>
                        {dateRange ? (
                          <Text style={styles.itemDate}>{dateRange}</Text>
                        ) : null}
                      </View>
                      {/* Row 2: Position, Employment Type — Location */}
                      <View style={styles.itemRow}>
                        <Text style={styles.itemBody}>
                          {exp.position}
                          {exp.employmentType ? `, ${exp.employmentType}` : ""}
                        </Text>
                        {exp.location && (
                          <Text style={styles.itemBody}>{exp.location}</Text>
                        )}
                      </View>
                      <PdfBulletList items={exp.description} styles={styles} />
                    </View>
                  );
                })}
              </View>
            );
          }

          if (sectionId === "education" && data.education.length > 0) {
            return (
              <View key="education">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.education}
                </Text>
                {data.education.map((edu, idx) => {
                  const dateRange = edu.startYear
                    ? `${edu.startYear}–${edu.isCurrentlyStudying ? translations.present : edu.endYear || ""}`
                    : edu.endYear || "";
                  const headline = [
                    [edu.degree, edu.major].filter(Boolean).join(" "),
                    edu.institution,
                  ]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <View key={idx} style={styles.experienceItem}>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemHeadline}>{headline}</Text>
                        <View style={{ alignItems: "flex-end" }}>
                          {dateRange ? (
                            <Text style={styles.itemDate}>{dateRange}</Text>
                          ) : null}
                          {edu.location && (
                            <Text style={styles.itemBody}>{edu.location}</Text>
                          )}
                        </View>
                      </View>
                      {edu.gpa && (
                        <Text style={styles.itemBody}>
                          {translations.gpa}: {edu.gpa}
                        </Text>
                      )}
                      {edu.description && (
                        <PdfBulletList
                          items={edu.description}
                          styles={styles}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            );
          }

          if (sectionId === "skills" && data.skills.length > 0) {
            return (
              <View key="skills" style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.skills}
                </Text>
                {data.skills.map((skill, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.itemBody}>
                      <Text style={{ fontWeight: 700 }}>
                        {skill.category}:{" "}
                      </Text>
                      {skill.items.join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === "projects" && data.projects.length > 0) {
            return (
              <View key="projects" style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.projects}
                </Text>
                {data.projects.map((project, idx) => {
                  const dateRange = project.startDate
                    ? `${project.startDate}${project.endDate ? `–${project.endDate}` : ""}`
                    : "";
                  return (
                    <View key={idx} style={styles.experienceItem}>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemHeadline}>{project.name}</Text>
                        {dateRange ? (
                          <Text style={styles.itemDate}>{dateRange}</Text>
                        ) : null}
                      </View>
                      {project.link && (
                        <Link
                          src={project.link}
                          style={{
                            fontSize: baseFontSize - 3,
                            color: PDF_BASE_COLORS.link,
                          }}
                        >
                          {cleanUrl(project.link)}
                        </Link>
                      )}
                      <PdfBulletList
                        items={project.description}
                        styles={styles}
                      />
                    </View>
                  );
                })}
              </View>
            );
          }

          const itemList =
            sectionId === "certificates"
              ? data.certificates
              : sectionId === "awards"
                ? data.awards
                : sectionId === "publications"
                  ? data.publications
                  : null;
          if (itemList && itemList.length > 0) {
            const titleText =
              sectionId === "certificates"
                ? translations.certificates
                : sectionId === "awards"
                  ? translations.awards
                  : translations.publications;
            return (
              <View key={sectionId} style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {titleText}
                </Text>
                {itemList.map((item, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemHeadline}>
                        {item.title}
                        {item.subtitle ? `, ${item.subtitle}` : ""}
                      </Text>
                      {item.date ? (
                        <Text style={styles.itemDate}>{item.date}</Text>
                      ) : null}
                    </View>
                    {item.link && (
                      <Link
                        src={item.link}
                        style={{
                          fontSize: baseFontSize - 3,
                          color: PDF_BASE_COLORS.link,
                        }}
                      >
                        {cleanUrl(item.link)}
                      </Link>
                    )}
                    <PdfBulletList
                      items={item.description || []}
                      styles={styles}
                    />
                  </View>
                ))}
              </View>
            );
          }

          if (
            sectionId === "custom" &&
            data.customSections &&
            data.customSections.length > 0
          ) {
            return (
              <View key="custom">
                {data.customSections
                  .filter((s) => s.items.length > 0)
                  .map((section, sIdx) => (
                    <View key={sIdx} style={{ marginBottom: 8 }}>
                      <Text style={styles.sectionTitle} minPresenceAhead={20}>
                        {section.title}
                      </Text>
                      {section.items.map((item, iIdx) => {
                        const period = item.startDate
                          ? `${item.startDate}–${item.isCurrent ? translations.present : item.endDate || ""}`
                          : item.date || "";
                        return (
                          <View key={iIdx} style={styles.experienceItem}>
                            <View style={styles.itemRow}>
                              <Text style={styles.itemHeadline}>
                                {item.title}
                                {item.subtitle ? `, ${item.subtitle}` : ""}
                              </Text>
                              {period ? (
                                <Text style={styles.itemDate}>{period}</Text>
                              ) : null}
                            </View>
                            {item.link && (
                              <Link
                                src={item.link}
                                style={{
                                  fontSize: baseFontSize - 3,
                                  color: PDF_BASE_COLORS.link,
                                }}
                              >
                                {cleanUrl(item.link)}
                              </Link>
                            )}
                            <PdfBulletList
                              items={item.description || []}
                              styles={styles}
                            />
                          </View>
                        );
                      })}
                    </View>
                  ))}
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
}

export const oxfordTemplate: TemplateDefinition = {
  id: "oxford",
  label: "Oxford",
  description:
    "Nama biru terpusat, section title uppercase bergaris bawah, info item dalam satu baris bold. Gaya akademis Oxford.",
  Pdf: OxfordPdfTemplate,
};
