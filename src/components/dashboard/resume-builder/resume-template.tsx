"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeContent } from "@/types/resume";

// Register custom fonts
Font.register({
  family: "Calibri",
  src: "/fonts/calibri.ttf",
});

Font.register({
  family: "Georgia",
  src: "/fonts/georgia.ttf",
});

Font.register({
  family: "Times New Roman",
  src: "/fonts/times.ttf",
});

Font.register({
  family: "Helvetica",
  src: "/fonts/helvetica.ttf",
});

interface ResumeTemplateProps {
  data: ResumeContent;
}

const colors = {
  primary: "#000000",
  secondary: "#333333",
  muted: "#555555",
  border: "#000000",
};

const getStyles = (fontFamily: string = "Helvetica") => {
  const pdfFont = fontFamily;

  // Use the same font for bold/italic if separate files aren't provided
  const boldFont = pdfFont;
  const italicFont = pdfFont;

  return StyleSheet.create({
    page: {
      padding: 50,
      fontSize: 10,
      fontFamily: pdfFont,
      color: colors.primary,
      lineHeight: 1.4,
    },
    header: {
      marginBottom: 6,
      textAlign: "center",
    },
    name: {
      fontSize: 18,
      fontFamily: boldFont,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    headline: {
      fontSize: 11,
      color: colors.secondary,
      marginBottom: 6,
    },
    contactInfo: {
      fontSize: 9,
      color: colors.secondary,
      marginBottom: 2,
    },
    contactSeparator: {
      marginHorizontal: 6,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: boldFont,
      marginBottom: 6,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summary: {
      fontSize: 10,
      color: colors.secondary,
      lineHeight: 1.5,
      textAlign: "justify",
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      marginBottom: 2,
    },
    experienceTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    experienceTitle: {
      fontSize: 10,
      fontFamily: boldFont,
    },
    experienceDate: {
      fontSize: 9,
      color: colors.muted,
    },
    experienceCompanyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    experienceCompany: {
      fontSize: 10,
      fontFamily: pdfFont,
      color: colors.secondary,
    },
    experienceLocation: {
      fontSize: 9,
      color: colors.muted,
    },
    bulletList: {
      marginTop: 4,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      paddingLeft: 8,
    },
    bullet: {
      width: 12,
      fontSize: 10,
    },
    bulletText: {
      flex: 1,
      fontSize: 9,
      lineHeight: 1.4,
    },
    educationItem: {
      marginBottom: 8,
    },
    educationDegree: {
      fontSize: 10,
      fontFamily: boldFont,
    },
    educationSchool: {
      fontSize: 10,
      fontFamily: pdfFont,
      color: colors.secondary,
    },
    educationDetails: {
      fontSize: 9,
      color: colors.muted,
    },
    skillsText: {
      fontSize: 9,
      lineHeight: 1.5,
    },
    skillCategory: {
      marginBottom: 4,
    },
    skillCategoryName: {
      fontFamily: boldFont,
      fontSize: 9,
    },
    projectItem: {
      marginBottom: 8,
    },
    projectName: {
      fontSize: 10,
      fontFamily: boldFont,
    },
    projectUrl: {
      fontSize: 8,
      color: colors.muted,
    },
    projectDescription: {
      fontSize: 9,
      color: colors.secondary,
      marginTop: 2,
    },
    certItem: {
      marginBottom: 4,
    },
    certName: {
      fontSize: 9,
      fontFamily: boldFont,
    },
    certDetails: {
      fontSize: 8,
      color: colors.muted,
    },
    inlineList: {
      fontSize: 9,
      lineHeight: 1.5,
    },
  });
};

function cleanUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function BulletList({
  items,
  styles,
}: {
  items: string[] | string;
  styles: any;
}) {
  if (!items) return null;
  const bulletArray = Array.isArray(items)
    ? items
    : items.split("\n").filter(Boolean);
  if (bulletArray.length === 0) return null;

  return (
    <View style={styles.bulletList}>
      {bulletArray.map((item, i) => {
        if (!item || item.trim() === "") {
          return <View key={i} style={{ height: 8 }} />;
        }
        return (
          <View key={i} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        );
      })}
    </View>
  );
}

const translations = {
  id: {
    professionalSummary: "Ringkasan Profesional",
    workExperience: "Pengalaman Kerja",
    education: "Pendidikan",
    skills: "Keahlian",
    projects: "Proyek",
    present: "Sekarang",
    gpa: "IPK",
  },
  en: {
    professionalSummary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    present: "Present",
    gpa: "GPA",
  },
};

export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const { personalInfo, experience, education, skills, projects, style } = data;
  const lang = style?.language || "id";
  const t = translations[lang];
  const styles = getStyles(style?.fontFamily);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.fullName || "NAMA LENGKAP"}
          </Text>
          <Text style={styles.contactInfo}>
            {[
              personalInfo.email,
              personalInfo.phone,
              personalInfo.location,
              cleanUrl(personalInfo.website),
            ]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          {personalInfo.linkedin && (
            <Text style={styles.contactInfo}>
              {cleanUrl(personalInfo.linkedin)}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
            <Text style={styles.summary}>
              {lang === "en"
                ? personalInfo.summaryEn || personalInfo.summary
                : personalInfo.summaryId || personalInfo.summary}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.workExperience}
            </Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View style={styles.experienceTitleRow}>
                    <Text style={styles.experienceTitle}>{exp.position}</Text>
                    <Text style={styles.experienceDate}>
                      {exp.startDate} —{" "}
                      {exp.endDate || (exp.isCurrentJob ? t.present : "")}
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
                <BulletList
                  items={
                    lang === "en"
                      ? exp.descriptionEn || exp.description
                      : exp.descriptionId || exp.description
                  }
                  styles={styles}
                />
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.education}
            </Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceTitleRow}>
                  <Text style={styles.educationDegree}>
                    {edu.degree} {edu.major}
                  </Text>
                  <Text style={styles.experienceDate}>
                    {edu.startYear} —{" "}
                    {edu.endYear || (edu.isCurrentlyStudying ? t.present : "")}
                  </Text>
                </View>
                <Text style={styles.educationSchool}>{edu.institution}</Text>
                {edu.gpa && (
                  <Text style={styles.educationDetails}>
                    {t.gpa}: {edu.gpa}
                  </Text>
                )}
                {edu.description && (
                  <BulletList items={edu.description} styles={styles} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.skills}
            </Text>
            <Text style={styles.skillsText}>{skills.join(", ")}</Text>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>
              {t.projects}
            </Text>
            {projects.map((project, index) => (
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
                  <Text style={styles.projectUrl}>
                    {cleanUrl(project.link)}
                  </Text>
                )}
                <Text style={styles.projectDescription}>
                  {project.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
