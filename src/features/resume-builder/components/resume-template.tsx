"use client";

import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type {
  DescriptionItem,
  ResumeContent,
} from "@/types/resume";
import { isLexicalJson, lexicalJsonToTextLines } from "@/lib/lexical-to-html";

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

// Register aliases for common font names
Font.register({
  family: "font-serif",
  src: "/fonts/times.ttf",
});

Font.register({
  family: "font-sans",
  src: "/fonts/helvetica.ttf",
});

Font.register({
  family: "font-mono",
  src: "/fonts/helvetica.ttf", // Monospace fallback
});

interface ResumeTemplateProps {
  data: ResumeContent;
}

const colors = {
  primary: "#000000",
  secondary: "#333333",
  muted: "#555555",
  border: "#000000",
  accent: "#2563eb", // Blue accent for Modern template
};

const getStyles = (
  fontFamily: string = "Helvetica",
  templateId: string = "classic",
  fontSizeStr: string = "text-[11px]",
  lineHeightKey: string = "relaxed",
) => {
  // Map common names or use fallback
  const validFonts = [
    "Calibri",
    "Georgia",
    "Times New Roman",
    "Helvetica",
    "font-serif",
    "font-sans",
    "font-mono",
  ];
  const pdfFont = validFonts.includes(fontFamily) ? fontFamily : "Helvetica";

  // Parse font size from string like "text-[11px]"
  const baseFontSize = parseInt(fontSizeStr.match(/\d+/)?.[0] || "11");

  // Map line height
  const lineHeightMap: Record<string, number> = {
    tight: 1.15,
    normal: 1.35,
    relaxed: 1.55,
  };
  const baseLineHeight = lineHeightMap[lineHeightKey] || 1.55;

  // Use the same font for bold/italic if separate files aren't provided
  const boldFont = pdfFont;

  const styles: any = {
    page: {
      padding: 50,
      fontSize: baseFontSize,
      fontFamily: pdfFont,
      color: colors.primary,
      lineHeight: baseLineHeight,
    },
    header: {
      marginBottom: 6,
      textAlign: "center",
    },
    headerContentLeft: {
      flex: 1,
    },
    headerContentRight: {
      textAlign: "right",
    },
    name: {
      fontSize: baseFontSize + 8,
      fontFamily: boldFont,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    jobTitle: {
      fontSize: baseFontSize,
      color: colors.secondary,
      marginBottom: 6,
    },
    contactInfo: {
      fontSize: baseFontSize - 2,
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
      fontSize: baseFontSize,
      fontFamily: boldFont,
      marginBottom: 6,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summary: {
      fontSize: baseFontSize - 1,
      color: colors.secondary,
      lineHeight: baseLineHeight,
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
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
    },
    experienceDate: {
      fontSize: baseFontSize - 2,
      color: colors.muted,
    },
    experienceCompanyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    experienceCompany: {
      fontSize: baseFontSize - 1,
      fontFamily: pdfFont,
      color: colors.secondary,
    },
    experienceLocation: {
      fontSize: baseFontSize - 2,
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
      fontSize: baseFontSize - 1,
    },
    bulletText: {
      flex: 1,
      fontSize: baseFontSize - 2,
      lineHeight: baseLineHeight,
    },
    educationItem: {
      marginBottom: 8,
    },
    educationDegree: {
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
    },
    educationSchool: {
      fontSize: baseFontSize - 1,
      fontFamily: pdfFont,
      color: colors.secondary,
    },
    educationDetails: {
      fontSize: baseFontSize - 2,
      color: colors.muted,
    },
    skillsText: {
      fontSize: baseFontSize - 2,
      lineHeight: baseLineHeight,
    },
    skillCategory: {
      marginBottom: 4,
    },
    skillCategoryName: {
      fontFamily: boldFont,
      fontSize: baseFontSize - 2,
    },
    projectItem: {
      marginBottom: 8,
    },
    projectName: {
      fontSize: baseFontSize - 1,
      fontFamily: boldFont,
    },
    projectUrl: {
      fontSize: baseFontSize - 3,
      color: colors.muted,
    },
    projectDescription: {
      fontSize: baseFontSize - 2,
      color: colors.secondary,
      marginTop: 2,
    },
    certItem: {
      marginBottom: 4,
    },
    certName: {
      fontSize: baseFontSize - 2,
      fontFamily: boldFont,
    },
    certDetails: {
      fontSize: baseFontSize - 3,
      color: colors.muted,
    },
    inlineList: {
      fontSize: baseFontSize - 2,
      lineHeight: baseLineHeight,
    },
    photo: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
      borderWidth: 1,
      borderColor: colors.border,
    },
    modernPhoto: {
      width: 60,
      height: 60,
      borderRadius: 30,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: colors.accent,
      marginBottom: 5,
    },
    headerWithPhoto: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      marginBottom: 10,
    },
  };

  if (templateId === "modern") {
    styles.header = {
      ...styles.header,
      textAlign: "left",
      borderBottomWidth: 3,
      borderBottomColor: colors.accent,
      paddingBottom: 12,
      marginBottom: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center", // Changed from flex-end to center for photo alignment
    };
    styles.name = {
      ...styles.name,
      fontSize: baseFontSize + 14,
      color: colors.accent,
      marginBottom: 4,
    };
    styles.jobTitle = {
      ...styles.jobTitle,
      color: colors.accent,
      fontSize: baseFontSize + 1,
      fontFamily: boldFont,
    };
    styles.contactInfo = {
      ...styles.contactInfo,
      textAlign: "right",
      fontSize: baseFontSize - 3,
    };
    styles.sectionTitle = {
      ...styles.sectionTitle,
      backgroundColor: "#eff6ff", // Light blue background
      color: colors.accent,
      padding: 5,
      paddingLeft: 8,
      borderBottomWidth: 0,
      marginBottom: 10,
      borderRadius: 2,
    };
    styles.experienceTitle = {
      ...styles.experienceTitle,
      color: colors.accent,
    };
  } else if (templateId === "minimal") {
    styles.page = { ...styles.page, padding: 45 };
    styles.header = {
      ...styles.header,
      marginBottom: 20,
      textAlign: "center",
      borderBottomWidth: 0,
    };
    styles.name = {
      ...styles.name,
      fontSize: baseFontSize + 10,
      textTransform: "none",
      letterSpacing: 0,
      marginBottom: 4,
      textAlign: "center",
    };
    styles.contactInfo = {
      ...styles.contactInfo,
      textAlign: "center",
      color: colors.muted,
    };
    styles.sectionTitle = {
      ...styles.sectionTitle,
      borderBottomWidth: 0,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      paddingLeft: 10,
      textTransform: "none",
      fontSize: baseFontSize + 2,
      letterSpacing: 0,
      marginBottom: 10,
    };
    styles.experienceTitle = {
      ...styles.experienceTitle,
      fontSize: baseFontSize,
    };
  }

  return StyleSheet.create(styles);
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
  items: DescriptionItem[] | string[] | string;
  styles: any;
}) {
  if (!items) return null;

  let bulletArray: string[];

  if (typeof items === "string" && isLexicalJson(items)) {
    // Lexical serialized JSON → extract plain text lines
    bulletArray = lexicalJsonToTextLines(items).filter(Boolean);
  } else {
    bulletArray = Array.isArray(items)
      ? items.map((item) => (typeof item === "string" ? item : item.text))
      : (items as string).split("\n").filter(Boolean);
  }

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
    certificates: "Sertifikat",
    awards: "Penghargaan",
    publications: "Publikasi",
    present: "Sekarang",
    gpa: "IPK",
  },
  en: {
    professionalSummary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certificates: "Certificates",
    awards: "Awards",
    publications: "Publications",
    present: "Present",
    gpa: "GPA",
  },
};

export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const { personalInfo, experience, education, skills, projects, style } = data;
  const lang = style?.language || "id";
  const t = translations[lang];
  const templateId = style?.templateId || "classic";
  const styles = getStyles(
    style?.fontFamily,
    templateId,
    style?.fontSize,
    style?.lineHeight,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        {templateId === "modern" ? (
          <View style={styles.header}>
            <View style={styles.headerContentLeft}>
              <Text style={styles.name}>
                {personalInfo.fullName || "NAMA LENGKAP"}
              </Text>
              {personalInfo.title && (
                <Text style={styles.jobTitle}>{personalInfo.title}</Text>
              )}
            </View>
            <View style={styles.headerContentRight}>
              {personalInfo.photoUrl && (
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Image
                    src={personalInfo.photoUrl}
                    style={styles.modernPhoto}
                  />
                </View>
              )}
              <Link
                src={`mailto:${personalInfo.email}`}
                style={styles.contactInfo}
              >
                {personalInfo.email}
              </Link>
              {personalInfo.phone && (
                <Link
                  src={`tel:${personalInfo.phone}`}
                  style={styles.contactInfo}
                >
                  {personalInfo.phone}
                </Link>
              )}
              {(personalInfo.location || personalInfo.linkedin?.url) && (
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  {personalInfo.location && (
                    <Text style={styles.contactInfo}>
                      {personalInfo.location}
                    </Text>
                  )}
                  {personalInfo.location && personalInfo.linkedin?.url && (
                    <Text style={styles.contactInfo}> | </Text>
                  )}
                  {personalInfo.linkedin?.url && (
                    <Link
                      src={personalInfo.linkedin.url}
                      style={styles.contactInfo}
                    >
                      {personalInfo.linkedin.label ||
                        cleanUrl(personalInfo.linkedin.url)}
                    </Link>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.header}>
            <View
              style={
                personalInfo.photoUrl
                  ? {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 20,
                      marginBottom: 10,
                    }
                  : {}
              }
            >
              {personalInfo.photoUrl && (
                <Image src={personalInfo.photoUrl} style={styles.photo} />
              )}
              <View
                style={
                  personalInfo.photoUrl
                    ? { alignItems: "flex-start", textAlign: "left" }
                    : {}
                }
              >
                <Text style={styles.name}>
                  {personalInfo.fullName || "NAMA LENGKAP"}
                </Text>
                {personalInfo.title && (
                  <Text style={styles.jobTitle}>{personalInfo.title}</Text>
                )}
              </View>
            </View>
            <View style={styles.contactInfo}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Link
                  src={`mailto:${personalInfo.email}`}
                  style={{ marginRight: 6 }}
                >
                  {personalInfo.email}
                </Link>
                {personalInfo.phone && (
                  <Link
                    src={`tel:${personalInfo.phone}`}
                    style={{ marginRight: 6 }}
                  >
                    {personalInfo.phone}
                  </Link>
                )}
                {personalInfo.location && (
                  <Text style={{ marginRight: 6 }}>
                    {personalInfo.location}
                  </Text>
                )}
                {personalInfo.website?.url && (
                  <Link src={personalInfo.website.url}>
                    {personalInfo.website.label ||
                      cleanUrl(personalInfo.website.url)}
                  </Link>
                )}
              </View>
            </View>
            {personalInfo.linkedin?.url && (
              <Link src={personalInfo.linkedin.url} style={styles.contactInfo}>
                {personalInfo.linkedin.label ||
                  cleanUrl(personalInfo.linkedin.url)}
              </Link>
            )}
          </View>
        )}

        {/* Professional Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.professionalSummary}</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Render Sections in Order */}
        {(
          data.sectionOrder || [
            "experience",
            "education",
            "skills",
            "projects",
            "custom",
          ]
        ).map((sectionId) => {
          if (sectionId === "experience" && experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {t.workExperience}
                </Text>
                {experience.map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceHeader}>
                      <View style={styles.experienceTitleRow}>
                        <Text style={styles.experienceTitle}>
                          {exp.position}
                        </Text>
                        <Text style={styles.experienceDate}>
                          {exp.startDate} —{" "}
                          {exp.endDate || (exp.isCurrentJob ? t.present : "")}
                        </Text>
                      </View>
                      <View style={styles.experienceCompanyRow}>
                        <Text style={styles.experienceCompany}>
                          {exp.company}
                        </Text>
                        {exp.location && (
                          <Text style={styles.experienceLocation}>
                            {exp.location}
                          </Text>
                        )}
                      </View>
                    </View>
                    <BulletList items={exp.description} styles={styles} />
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === "education" && education.length > 0) {
            return (
              <View key="education">
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
                        {edu.endYear ||
                          (edu.isCurrentlyStudying ? t.present : "")}
                      </Text>
                    </View>
                    <Text style={styles.educationSchool}>
                      {edu.institution}
                    </Text>
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
            );
          }

          if (sectionId === "skills" && skills.length > 0) {
            return (
              <View key="skills" style={styles.section}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {t.skills}
                </Text>
                {skills.map((skill, index) => (
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

          if (sectionId === "projects" && projects.length > 0) {
            return (
              <View key="projects" style={styles.section}>
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
                      <Link src={project.link} style={styles.projectUrl}>
                        {cleanUrl(project.link)}
                      </Link>
                    )}
                    <BulletList items={project.description} styles={styles} />
                  </View>
                ))}
              </View>
            );
          }

          if (
            sectionId === "certificates" &&
            data.certificates &&
            data.certificates.length > 0
          ) {
            return (
              <View key="certificates" style={styles.section}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {t.certificates}
                </Text>
                {data.certificates.map((item, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceTitleRow}>
                      <Text style={styles.experienceTitle}>{item.title}</Text>
                      {item.date && (
                        <Text style={styles.experienceDate}>{item.date}</Text>
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
                    <BulletList
                      items={item.description || []}
                      styles={styles}
                    />
                  </View>
                ))}
              </View>
            );
          }

          if (
            sectionId === "awards" &&
            data.awards &&
            data.awards.length > 0
          ) {
            return (
              <View key="awards" style={styles.section}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {t.awards}
                </Text>
                {data.awards.map((item, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceTitleRow}>
                      <Text style={styles.experienceTitle}>{item.title}</Text>
                      {item.date && (
                        <Text style={styles.experienceDate}>{item.date}</Text>
                      )}
                    </View>
                    {item.subtitle && (
                      <Text style={styles.experienceCompany}>
                        {item.subtitle}
                      </Text>
                    )}
                    <BulletList
                      items={item.description || []}
                      styles={styles}
                    />
                  </View>
                ))}
              </View>
            );
          }

          if (
            sectionId === "publications" &&
            data.publications &&
            data.publications.length > 0
          ) {
            return (
              <View key="publications" style={styles.section}>
                <Text style={styles.sectionTitle} minPresenceAhead={20}>
                  {t.publications}
                </Text>
                {data.publications.map((item, index) => (
                  <View key={index} style={styles.experienceItem}>
                    <View style={styles.experienceTitleRow}>
                      <Text style={styles.experienceTitle}>{item.title}</Text>
                      {item.date && (
                        <Text style={styles.experienceDate}>{item.date}</Text>
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
                    <BulletList
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
                    {section.items.map((item, iIndex) => (
                      <View key={iIndex} style={styles.experienceItem}>
                        <View style={styles.experienceTitleRow}>
                          <Text style={styles.experienceTitle}>
                            {item.title}
                          </Text>
                          {item.date && (
                            <Text style={styles.experienceDate}>
                              {item.date}
                            </Text>
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
                        <BulletList
                          items={item.description || []}
                          styles={styles}
                        />
                      </View>
                    ))}
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
