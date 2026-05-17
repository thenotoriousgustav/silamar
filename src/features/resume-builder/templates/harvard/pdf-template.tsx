"use client";

import {
  Document,
  Image,
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

/**
 * Harvard PDF template — faithful to the Harvard OCS resume format:
 *  - Name centered, bold (not uppercase), underlined
 *  - Single full-width rule immediately below the name
 *  - Contact info centered below the rule, bullet-separated
 *  - Section titles bold, centered, no border
 *  - Items: Organization/Company bold (row 1), Position Title bold (row 2)
 */
export function HarvardPdfTemplate({ data }: PdfTemplateProps) {
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
      marginBottom: 10,
    },
    name: {
      fontSize: baseFontSize + 3,
      fontWeight: 700,
      textDecoration: "underline",
      marginBottom: 4,
      color: PDF_BASE_COLORS.primary,
    },
    headerRule: {
      borderBottomWidth: 1,
      borderBottomColor: PDF_BASE_COLORS.primary,
      width: "100%",
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.secondary,
    },
    contactSep: {
      marginHorizontal: 3,
      color: PDF_BASE_COLORS.muted,
    },
    // Section title: bold, centered, no border
    sectionTitle: {
      fontSize: baseFontSize,
      fontWeight: 700,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 4,
      color: PDF_BASE_COLORS.primary,
    },
    // Item rows
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemOrgName: {
      fontSize: baseFontSize - 1,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
      flex: 1,
    },
    itemPosition: {
      fontSize: baseFontSize - 1,
      fontWeight: 700,
      color: PDF_BASE_COLORS.primary,
      flex: 1,
    },
    itemDate: {
      fontSize: baseFontSize - 2,
      color: PDF_BASE_COLORS.secondary,
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
      marginBottom: 8,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet.create has narrow inferred types
  } as any) as any;

  const pdfPageSize = paperSize === "letter" ? "LETTER" : "A4";

  // Build contact items array for bullet-separated rendering
  const contactItems: { key: string; label: string; href?: string }[] = [];
  if (personalInfo.location)
    contactItems.push({ key: "loc", label: personalInfo.location });
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
    "experience",
    "education",
    "skills",
    "projects",
    "custom",
  ];

  return (
    <Document>
      <Page size={pdfPageSize} style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          {personalInfo.photoUrl ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 4,
              }}
            >
              <Image src={personalInfo.photoUrl} style={styles.photo} />
              <View style={{ alignItems: "flex-start" }}>
                <Text style={styles.name}>
                  {personalInfo.fullName || "Firstname Lastname"}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.name}>
              {personalInfo.fullName || "Firstname Lastname"}
            </Text>
          )}

          {/* Rule below name */}
          <View style={styles.headerRule} />

          {/* Contact row */}
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <View
                key={item.key}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                {idx > 0 && <Text style={styles.contactSep}>•</Text>}
                {item.href ? (
                  <Link
                    src={item.href}
                    style={{ color: PDF_BASE_COLORS.secondary, fontSize: baseFontSize - 2 }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Text style={{ fontSize: baseFontSize - 2 }}>{item.label}</Text>
                )}
              </View>
            ))}
          </View>
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
          if (sectionId === "experience" && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.workExperience}
                </Text>
                {data.experience.map((exp, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    {/* Row 1: Company — Location */}
                    <View style={styles.itemRow}>
                      <Text style={styles.itemOrgName}>{exp.company}</Text>
                      {exp.location && (
                        <Text style={styles.itemLocation}>{exp.location}</Text>
                      )}
                    </View>
                    {/* Row 2: Position — Date */}
                    <View style={styles.itemRow}>
                      <Text style={styles.itemPosition}>
                        {exp.position}
                        {exp.employmentType ? `, ${exp.employmentType}` : ""}
                      </Text>
                      <Text style={styles.itemDate}>
                        {exp.startDate} —{" "}
                        {exp.isCurrentJob
                          ? translations.present
                          : exp.endDate || ""}
                      </Text>
                    </View>
                    <PdfBulletList items={exp.description} styles={styles} />
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === "education" && data.education.length > 0) {
            return (
              <View key="education">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {translations.education}
                </Text>
                {data.education.map((edu, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    {/* Row 1: Institution — Location */}
                    <View style={styles.itemRow}>
                      <Text style={styles.itemOrgName}>{edu.institution}</Text>
                      {edu.location && (
                        <Text style={styles.itemLocation}>{edu.location}</Text>
                      )}
                    </View>
                    {/* Row 2: Degree + Major — Date */}
                    <View style={styles.itemRow}>
                      <Text style={styles.itemBody}>
                        {edu.degree}
                        {edu.major ? `, ${edu.major}` : ""}
                      </Text>
                      <Text style={styles.itemDate}>
                        {edu.startYear} —{" "}
                        {edu.isCurrentlyStudying
                          ? translations.present
                          : edu.endYear || ""}
                      </Text>
                    </View>
                    {edu.gpa && (
                      <Text style={styles.itemBody}>
                        {translations.gpa}: {edu.gpa}
                      </Text>
                    )}
                    {edu.description && (
                      <PdfBulletList items={edu.description} styles={styles} />
                    )}
                  </View>
                ))}
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
                  <View key={idx} style={{ marginBottom: 2 }}>
                    <Text style={styles.itemBody}>
                      <Text style={{ fontWeight: 700 }}>{skill.category}: </Text>
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
                {data.projects.map((project, idx) => (
                  <View key={idx} style={styles.experienceItem}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemOrgName}>{project.name}</Text>
                      {(project.startDate || project.endDate) && (
                        <Text style={styles.itemDate}>
                          {project.startDate}{" "}
                          {project.endDate ? `— ${project.endDate}` : ""}
                        </Text>
                      )}
                    </View>
                    {project.link && (
                      <Link
                        src={project.link}
                        style={{ fontSize: baseFontSize - 3, color: PDF_BASE_COLORS.muted }}
                      >
                        {cleanUrl(project.link)}
                      </Link>
                    )}
                    <PdfBulletList items={project.description} styles={styles} />
                  </View>
                ))}
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
                      <Text style={styles.itemOrgName}>{item.title}</Text>
                      {item.date && (
                        <Text style={styles.itemDate}>{item.date}</Text>
                      )}
                    </View>
                    {item.subtitle && (
                      <Text style={styles.itemBody}>{item.subtitle}</Text>
                    )}
                    {item.link && (
                      <Link
                        src={item.link}
                        style={{ fontSize: baseFontSize - 3, color: PDF_BASE_COLORS.muted }}
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
                {data.customSections.map((section, sIdx) => (
                  <View key={sIdx} style={{ marginBottom: 8 }}>
                    <Text style={styles.sectionTitle} minPresenceAhead={20}>
                      {section.title}
                    </Text>
                    {section.items.map((item, iIdx) => {
                      const period = item.startDate
                        ? `${item.startDate} — ${
                            item.isCurrent
                              ? translations.present
                              : item.endDate || ""
                          }`
                        : item.date || "";
                      return (
                        <View key={iIdx} style={styles.experienceItem}>
                          <View style={styles.itemRow}>
                            <Text style={styles.itemOrgName}>{item.title}</Text>
                            {period && (
                              <Text style={styles.itemDate}>{period}</Text>
                            )}
                          </View>
                          {item.subtitle && (
                            <Text style={styles.itemBody}>{item.subtitle}</Text>
                          )}
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
