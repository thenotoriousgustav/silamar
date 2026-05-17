"use client";

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import "../_shared/pdf-fonts";

import { cleanUrl } from "../_shared/constants";
import {
  buildBasePdfStyles,
  PDF_BASE_COLORS,
} from "../_shared/pdf-base-styles";
import { PdfBulletList } from "../_shared/pdf-bullet-list";
import { resolveTranslations } from "../_shared/translations";
import type { PdfTemplateProps } from "../types";

// Oxford accent blue
const OXFORD_BLUE = "#1a4a8a";

/**
 * Oxford PDF template — University of Oxford careers CV style:
 *  - Name centered in Oxford blue, larger font
 *  - Contact info centered, pipe-separated
 *  - Full-width rule below contact
 *  - Section titles ALL CAPS, bold, left-aligned, bottom border
 *  - Items: all key info on ONE bold line "Company, Position; Date"
 *  - Bullet points below
 */
export function OxfordPdfTemplate({ data }: PdfTemplateProps) {
  const { personalInfo, style } = data;
  const translations = resolveTranslations(style?.language);
  const paperSize = style?.paperSize || "A4";

  const baseStyles = buildBasePdfStyles(style);
  const baseFontSize = (baseStyles.page.fontSize as number) ?? 11;

  const styles = StyleSheet.create({
    ...baseStyles,
    page: {
      ...baseStyles.page,
      paddingHorizontal: 50,
      paddingVertical: 45,
    },
    // Header
    header: {
      alignItems: "center",
      marginBottom: 8,
    },
    name: {
      fontSize: baseFontSize + 6,
      fontWeight: 700,
      color: OXFORD_BLUE,
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.secondary,
      marginBottom: 4,
    },
    contactSep: {
      marginHorizontal: 4,
      color: PDF_BASE_COLORS.muted,
    },
    headerRule: {
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.primary,
      width: "100%",
    },
    // Section title: ALL CAPS, bold, left-aligned, bottom border
    sectionTitle: {
      fontSize: baseFontSize,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.primary,
      paddingBottom: 2,
      marginBottom: 5,
      color: PDF_BASE_COLORS.primary,
    },
    // Item headline row
    itemHeadlineRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemHeadline: {
      fontSize: baseFontSize - 1,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
      flex: 1,
    },
    itemLocation: {
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.secondary,
    },
    itemBody: {
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.secondary,
    },
    experienceItem: {
      marginBottom: 7,
    },
    skillRow: {
      marginBottom: 2,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet.create has narrow inferred types
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  // Contact items
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
      label:
        personalInfo.linkedin.label || cleanUrl(personalInfo.linkedin.url),
      href: personalInfo.linkedin.url,
    });
  if (personalInfo.website?.url)
    contactItems.push({
      key: "web",
      label:
        personalInfo.website.label || cleanUrl(personalInfo.website.url),
      href: personalInfo.website.url,
    });

  const order = data.sectionOrder || [
    "education",
    "experience",
    "skills",
    "projects",
    "custom",
  ];

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* ── Header ── */}
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
                      color: PDF_BASE_COLORS.secondary,
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

        {/* ── Summary ── */}
        {personalInfo.summary && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.sectionTitle}>
              {translations.professionalSummary}
            </Text>
            <Text style={styles.itemBody}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* ── Sections ── */}
        {order.map((sectionId) => {
          // ── Education ──
          if (sectionId === "education" && data.education.length > 0) {
            return (
              <View key="education">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.education}
                </Text>
                {data.education.map((edu, idx) => {
                  const dateRange = edu.startYear
                    ? `${edu.startYear} – ${edu.isCurrentlyStudying ? translations.present : edu.endYear || ""}`
                    : edu.endYear || "";
                  const headline = [
                    [edu.degree, edu.major].filter(Boolean).join(" "),
                    edu.institution,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <View key={idx} style={styles.experienceItem}>
                      <View style={styles.itemHeadlineRow}>
                        <Text style={styles.itemHeadline}>
                          {headline}
                          {dateRange ? `; ${dateRange}` : ""}
                        </Text>
                        {edu.location && (
                          <Text style={styles.itemLocation}>
                            {edu.location}
                          </Text>
                        )}
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

          // ── Experience ──
          if (sectionId === "experience" && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.workExperience}
                </Text>
                {data.experience.map((exp, idx) => {
                  const dateRange = exp.startDate
                    ? `${exp.startDate} – ${exp.isCurrentJob ? translations.present : exp.endDate || ""}`
                    : "";
                  const headline = [exp.company, exp.position]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <View key={idx} style={styles.experienceItem}>
                      <View style={styles.itemHeadlineRow}>
                        <Text style={styles.itemHeadline}>
                          {headline}
                          {dateRange ? `; ${dateRange}` : ""}
                        </Text>
                        {exp.location && (
                          <Text style={styles.itemLocation}>
                            {exp.location}
                          </Text>
                        )}
                      </View>
                      <PdfBulletList items={exp.description} styles={styles} />
                    </View>
                  );
                })}
              </View>
            );
          }

          // ── Skills ──
          if (sectionId === "skills" && data.skills.length > 0) {
            return (
              <View key="skills" style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.skills}
                </Text>
                {data.skills.map((skill, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.itemBody}>
                      <Text style={{ fontWeight: 700 }}>{skill.category}: </Text>
                      {skill.items.join(", ")}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          // ── Projects ──
          if (sectionId === "projects" && data.projects.length > 0) {
            return (
              <View key="projects" style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.projects}
                </Text>
                {data.projects.map((project, idx) => {
                  const dateRange = project.startDate
                    ? `${project.startDate}${project.endDate ? ` – ${project.endDate}` : ""}`
                    : "";
                  return (
                    <View key={idx} style={styles.experienceItem}>
                      <Text style={styles.itemHeadline}>
                        {project.name}
                        {dateRange ? `; ${dateRange}` : ""}
                      </Text>
                      {project.link && (
                        <Link
                          src={project.link}
                          style={{
                            fontSize: baseFontSize - 3,
                            color: PDF_BASE_COLORS.muted,
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

          // ── Certificates / Awards / Publications ──
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
                    <Text style={styles.itemHeadline}>
                      {item.title}
                      {item.subtitle ? `, ${item.subtitle}` : ""}
                      {item.date ? `; ${item.date}` : ""}
                    </Text>
                    {item.link && (
                      <Link
                        src={item.link}
                        style={{
                          fontSize: baseFontSize - 3,
                          color: PDF_BASE_COLORS.muted,
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

          // ── Custom ──
          if (
            sectionId === "custom" &&
            data.customSections &&
            data.customSections.length > 0
          ) {
            return (
              <View key="custom">
                {data.customSections.map((section, sIdx) => (
                  <View key={sIdx} style={{ marginBottom: 8 }}>
                    <Text style={styles.sectionTitle} minPresenceAhead={20}>
                      {section.title}
                    </Text>
                    {section.items.map((item, iIdx) => {
                      const period = item.startDate
                        ? `${item.startDate} – ${item.isCurrent ? translations.present : item.endDate || ""}`
                        : item.date || "";
                      return (
                        <View key={iIdx} style={styles.experienceItem}>
                          <Text style={styles.itemHeadline}>
                            {item.title}
                            {item.subtitle ? `, ${item.subtitle}` : ""}
                            {period ? `; ${period}` : ""}
                          </Text>
                          {item.link && (
                            <Link
                              src={item.link}
                              style={{
                                fontSize: baseFontSize - 3,
                                color: PDF_BASE_COLORS.muted,
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
