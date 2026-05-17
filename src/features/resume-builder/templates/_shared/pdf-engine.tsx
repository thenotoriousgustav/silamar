"use client";

import { Link, Text, View } from "@react-pdf/renderer";

import type { ResumeContent } from "@/types/resume";

import { cleanUrl } from "./constants";
import type { PdfStyleSheet } from "./pdf-base-styles";
import { PdfBulletList } from "./pdf-bullet-list";
import type { ResumeTranslations } from "./translations";

export interface PdfEngineConfig {
  data: ResumeContent;
  translations: ResumeTranslations;
  /** Resolved style sheet (already merged with template overrides). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @react-pdf StyleSheet is loose
  styles: PdfStyleSheet | any;
}

/**
 * Renders the body sections of a PDF resume in the order declared by
 * `data.sectionOrder`. Templates supply the styles, this engine handles
 * the section dispatch + bullet rendering so each template stays small.
 *
 * Returns an array of <View> elements (one per section).
 */
export function renderPdfSections(config: PdfEngineConfig) {
  const { data, translations: t, styles } = config;
  const order = data.sectionOrder || [
    "experience",
    "education",
    "skills",
    "projects",
    "custom",
  ];

  return order
    .map((sectionId) => {
      if (sectionId === "experience" && data.experience.length > 0) {
        return (
          <View key="experience">
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.workExperience}
            </Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View style={styles.experienceTitleRow}>
                    <Text style={styles.experienceTitle}>{exp.position}</Text>
                    <Text style={styles.experienceDate}>
                      {exp.startDate} —{" "}
                      {exp.isCurrentJob
                        ? t.present
                        : exp.endDate || ""}
                    </Text>
                  </View>
                  <View style={styles.experienceCompanyRow}>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    {exp.location && (
                      <Text style={styles.experienceLocation}>
                        {exp.location}
                      </Text>
                    )}
                  </View>
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
              {t.education}
            </Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceTitleRow}>
                  <Text style={styles.educationDegree}>
                    {edu.degree} {edu.major}
                  </Text>
                  <Text style={styles.experienceDate}>
                    {edu.startYear} —{" "}
                    {edu.isCurrentlyStudying
                      ? t.present
                      : edu.endYear || ""}
                  </Text>
                </View>
                <Text style={styles.educationSchool}>{edu.institution}</Text>
                {edu.gpa && (
                  <Text style={styles.educationDetails}>
                    {t.gpa}: {edu.gpa}
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
          <View key="skills" style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.skills}
            </Text>
            {data.skills.map((skill, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillsText}>
                  <Text style={styles.skillCategoryName}>
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
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.projects}
            </Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceTitleRow}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {(project.startDate || project.endDate) && (
                    <Text style={styles.experienceDate}>
                      {project.startDate}{" "}
                      {project.endDate ? `— ${project.endDate}` : ""}
                    </Text>
                  )}
                </View>
                {project.link && (
                  <Link src={project.link} style={styles.projectUrl}>
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
        const titleKey =
          sectionId === "certificates"
            ? t.certificates
            : sectionId === "awards"
              ? t.awards
              : t.publications;

        return (
          <View key={sectionId} style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {titleKey}
            </Text>
            {itemList.map((item, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceTitleRow}>
                  <Text style={styles.experienceTitle}>{item.title}</Text>
                  {item.date && (
                    <Text style={styles.experienceDate}>{item.date}</Text>
                  )}
                </View>
                {item.subtitle && (
                  <Text style={styles.experienceCompany}>{item.subtitle}</Text>
                )}
                {item.link && (
                  <Link src={item.link} style={styles.projectUrl}>
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
            {data.customSections.map((section, sIndex) => (
              <View key={sIndex} style={styles.section}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {section.title}
                </Text>
                {section.items.map((item, iIndex) => {
                  const period = item.startDate
                    ? `${item.startDate} — ${
                        item.isCurrent
                          ? t.present
                          : item.endDate || ""
                      }`
                    : item.date || "";
                  return (
                    <View key={iIndex} style={styles.experienceItem}>
                      <View style={styles.experienceTitleRow}>
                        <Text style={styles.experienceTitle}>{item.title}</Text>
                        {period && (
                          <Text style={styles.experienceDate}>{period}</Text>
                        )}
                      </View>
                      {item.subtitle && (
                        <Text style={styles.experienceCompany}>
                          {item.subtitle}
                        </Text>
                      )}
                      {item.link && (
                        <Link src={item.link} style={styles.projectUrl}>
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
    })
    .filter(Boolean);
}

/** Renders the optional summary block (same for all templates). */
export function renderPdfSummary(
  summary: string | undefined,
  translations: ResumeTranslations,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any,
) {
  if (!summary) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{translations.professionalSummary}</Text>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}
