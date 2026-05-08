import React, { useMemo } from "react";
import type {
  ResumeContent,
  DescriptionItem,
} from "@/features/resumes-list/types/resume";
import { cn } from "@/lib/utils";

interface HtmlResumeProps {
  data: ResumeContent;
  onJumpToSection?: (sectionId: string) => void;
}

const RESUME_TRANSLATIONS = {
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

const A4_HEIGHT = 1123;
const PAGE_PADDING = 100; // Total vertical padding (top + bottom)
const CONTENT_HEIGHT_LIMIT = A4_HEIGHT - PAGE_PADDING;

export function HtmlResume({ data, onJumpToSection }: HtmlResumeProps) {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    style,
    customSections,
  } = data;
  const lang = style?.language || "id";
  const translations =
    RESUME_TRANSLATIONS[lang as keyof typeof RESUME_TRANSLATIONS] ||
    RESUME_TRANSLATIONS.id;
  const templateId = style?.templateId || "classic";
  const fontFamily = style?.fontFamily || "Helvetica";

  const fontClassMap: Record<string, string> = {
    Calibri: "font-calibri",
    Georgia: "font-georgia",
    "Times New Roman": "font-serif",
    Helvetica: "font-sans",
  };
  const fontClass = fontClassMap[fontFamily] || "font-sans";
  const fontSize = style?.fontSize || "text-[11px]";
  const lineHeightMap: Record<string, string> = {
    tight: "leading-tight",
    normal: "leading-normal",
    relaxed: "leading-relaxed",
  };
  const lineHeightClass =
    lineHeightMap[style?.lineHeight || "relaxed"] || "leading-relaxed";

  const bodyTextClass = cn(fontSize, lineHeightClass, "text-slate-700");
  const headingTextClass = cn(fontSize, "font-bold");

  const cleanUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
  };

  const renderBulletList = (
    items: DescriptionItem[] | string[] | string | undefined,
  ) => {
    if (!items) return null;
    const bulletArray = Array.isArray(items)
      ? items.map((item) => (typeof item === "string" ? item : item.text))
      : (items as string).split("\n").filter(Boolean);
    if (bulletArray.length === 0) return null;

    return (
      <ul className="mt-1 list-disc space-y-0.5 pl-4">
        {bulletArray.map((item, i) => {
          if (!item || item.trim() === "") {
            return <li key={i} className="h-2 list-none" />;
          }
          return (
            <li key={i} className={bodyTextClass}>
              {item}
            </li>
          );
        })}
      </ul>
    );
  };

  // Helper to estimate height of a section (in pixels)
  const estimateHeight = (type: string, content: any): number => {
    switch (type) {
      case "header":
        return 160;
      case "summary":
        return 40 + (content?.length / 80) * 15;
      case "sectionTitle":
        return 45;
      case "experienceItem":
        const bulletCount = Array.isArray(content.description)
          ? content.description.length
          : 0;
        return 60 + bulletCount * 18;
      case "educationItem":
        return 55;
      case "skillItem":
        return 25;
      case "projectItem":
        return 70 + (content.description?.length ? 40 : 0);
      case "customItem":
        return 60 + (content.description?.length ? 30 : 0);
      default:
        return 20;
    }
  };

  const clickableClass =
    "group/clickable relative cursor-pointer rounded-none transition-all hover:bg-primary/[0.03] hover:outline hover:outline-2 hover:outline-dashed hover:outline-primary/40 hover:outline-offset-4";

  // Pagination Logic
  const pages = useMemo(() => {
    const result: React.ReactNode[][] = [[]];
    let currentHeight = 0;
    let currentPage = 0;

    const addToPage = (element: React.ReactNode, height: number) => {
      if (
        currentHeight + height > CONTENT_HEIGHT_LIMIT &&
        result[currentPage].length > 0
      ) {
        currentPage++;
        result[currentPage] = [];
        currentHeight = 0;
      }
      result[currentPage].push(element);
      currentHeight += height;
    };

    // Header
    const headerEl = (
      <header
        key="header"
        onClick={() => onJumpToSection?.("personal")}
        className={cn(
          "mb-6 flex",
          clickableClass,
          templateId === "classic" && "flex-col items-center text-center",
          templateId === "modern" &&
            "flex-row items-center justify-between border-b-2 border-blue-600 pb-4 text-left",
          templateId === "minimal" && "flex-col items-center text-center",
        )}
      >
        <div
          className={cn(
            "flex",
            templateId === "modern" ? "flex-1" : "flex-col items-center",
            (templateId === "classic" || templateId === "minimal") &&
              personalInfo.photoUrl &&
              "flex-row items-center gap-6 text-left",
          )}
        >
          {personalInfo.photoUrl &&
            (templateId === "classic" || templateId === "minimal") && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="h-24 w-24 rounded-full border border-slate-200 object-cover shadow-sm"
              />
            )}
          <div
            className={cn(
              (templateId === "classic" || templateId === "minimal") &&
                personalInfo.photoUrl
                ? "flex-1"
                : "",
            )}
          >
            <h1
              className={cn(
                "font-bold tracking-wider uppercase",
                templateId === "classic" && "mb-1 text-2xl text-slate-900",
                templateId === "modern" && "mb-0 text-3xl text-blue-600",
                templateId === "minimal" &&
                  "mb-1 text-2xl tracking-normal text-slate-900 normal-case",
              )}
            >
              {personalInfo.fullName || "NAMA LENGKAP"}
            </h1>
            {personalInfo.title && (
              <p
                className={cn(
                  "text-sm font-medium text-slate-600",
                  templateId === "modern" && "text-base text-blue-600",
                )}
              >
                {personalInfo.title}
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col",
            templateId === "modern"
              ? "items-end text-right"
              : "mt-2 items-center text-center",
          )}
        >
          {personalInfo.photoUrl && templateId === "modern" && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="mb-2 h-20 w-20 rounded-full border-2 border-blue-600 object-cover shadow-md"
            />
          )}
          <div
            className={cn(
              "text-[10px] text-slate-500",
              templateId === "modern" && "mt-0 text-right",
            )}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span>{personalInfo.email}</span>
              {personalInfo.phone && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{personalInfo.phone}</span>
                </>
              )}
              {personalInfo.location && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{personalInfo.location}</span>
                </>
              )}
            </div>
            {(personalInfo.website?.url || personalInfo.linkedin?.url) && (
              <div className="mt-0.5 space-x-2">
                {personalInfo.website?.url && (
                  <a
                    href={personalInfo.website.url}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {personalInfo.website.label ||
                      cleanUrl(personalInfo.website.url)}
                  </a>
                )}
                {personalInfo.linkedin?.url && (
                  <a
                    href={personalInfo.linkedin.url}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {personalInfo.linkedin.label ||
                      cleanUrl(personalInfo.linkedin.url)}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    );
    addToPage(headerEl, estimateHeight("header", null));

    // Summary
    if (personalInfo.summary) {
      const summaryEl = (
        <section
          key="summary"
          className={cn("mb-5", clickableClass)}
          onClick={() => onJumpToSection?.("personal")}
        >
          <h2
            className={cn(
              "mb-2 border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase",
              templateId === "modern" &&
                "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
              templateId === "minimal" &&
                "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
            )}
          >
            {translations.professionalSummary}
          </h2>
          <p className={cn("text-justify", bodyTextClass)}>
            {personalInfo.summary}
          </p>
        </section>
      );
      addToPage(summaryEl, estimateHeight("summary", personalInfo.summary));
    }

    const sectionOrder = data.sectionOrder || [
      "experience",
      "education",
      "projects",
      "skills",
      "custom",
    ];

    sectionOrder.forEach((sectionId) => {
      if (sectionId === "experience" && experience.length > 0) {
        addToPage(
          <h2
            key="exp-title"
            onClick={() => onJumpToSection?.("experience")}
            className={cn(
              "hover:text-primary mb-2 cursor-pointer border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors",
              templateId === "modern" &&
                "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
              templateId === "minimal" &&
                "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
            )}
          >
            {translations.workExperience}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        experience.forEach((exp, i) => {
          const expEl = (
            <div
              key={`exp-${i}`}
              className={cn("mb-4", clickableClass)}
              onClick={() => onJumpToSection?.(`experience-${exp.id}`)}
            >
              <div className="mb-0.5 flex items-baseline justify-between">
                <h3
                  className={cn(
                    headingTextClass,
                    templateId === "modern" && "text-blue-600",
                  )}
                >
                  {exp.position}
                </h3>
                <span className="text-[10px] font-medium text-slate-500">
                  {exp.startDate} —{" "}
                  {exp.endDate ||
                    (exp.isCurrentJob ? translations.present : "")}
                </span>
              </div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className={bodyTextClass}>{exp.company}</span>
                {exp.location && (
                  <span className="text-[10px] text-slate-500">
                    {exp.location}
                  </span>
                )}
              </div>
              {renderBulletList(exp.description)}
            </div>
          );
          addToPage(expEl, estimateHeight("experienceItem", exp));
        });
      }

      if (sectionId === "education" && education.length > 0) {
        addToPage(
          <h2
            key="edu-title"
            onClick={() => onJumpToSection?.("education")}
            className={cn(
              "hover:text-primary mb-2 cursor-pointer border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors",
              templateId === "modern" &&
                "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
              templateId === "minimal" &&
                "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
            )}
          >
            {translations.education}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        education.forEach((edu, i) => {
          const eduEl = (
            <div
              key={`edu-${i}`}
              className={cn("mb-3", clickableClass)}
              onClick={() => onJumpToSection?.(`education-${edu.id}`)}
            >
              <div className="mb-0.5 flex items-baseline justify-between">
                <h3 className={headingTextClass}>
                  {edu.degree} {edu.major}
                </h3>
                <span className="text-[10px] font-medium text-slate-500">
                  {edu.startYear} —{" "}
                  {edu.endYear ||
                    (edu.isCurrentlyStudying ? translations.present : "")}
                </span>
              </div>
              <div className={bodyTextClass}>{edu.institution}</div>
              {edu.gpa && (
                <div className="text-[10px] text-slate-500">
                  {translations.gpa}: {edu.gpa}
                </div>
              )}
              {edu.description && renderBulletList(edu.description)}
            </div>
          );
          addToPage(eduEl, estimateHeight("educationItem", edu));
        });
      }

      if (sectionId === "skills" && skills.length > 0) {
        addToPage(
          <h2
            key="skills-title"
            onClick={() => onJumpToSection?.("skills")}
            className={cn(
              "hover:text-primary mb-2 cursor-pointer border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors",
              templateId === "modern" &&
                "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
              templateId === "minimal" &&
                "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
            )}
          >
            {translations.skills}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        skills.forEach((skill, i) => {
          const skillEl = (
            <div
              key={`skill-${i}`}
              className={cn("mb-1", bodyTextClass, clickableClass)}
              onClick={() => onJumpToSection?.("skills")}
            >
              <span className="font-bold">{skill.category}: </span>
              <span className="text-slate-700">
                {(skill.items || []).join(", ")}
              </span>
            </div>
          );
          addToPage(skillEl, estimateHeight("skillItem", skill));
        });
      }

      if (sectionId === "projects" && projects.length > 0) {
        addToPage(
          <h2
            key="projects-title"
            onClick={() => onJumpToSection?.("projects")}
            className={cn(
              "hover:text-primary mb-2 cursor-pointer border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors",
              templateId === "modern" &&
                "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
              templateId === "minimal" &&
                "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
            )}
          >
            {translations.projects}
          </h2>,
          estimateHeight("sectionTitle", null),
        );

        projects.forEach((project, i) => {
          const projEl = (
            <div
              key={`proj-${i}`}
              className={cn("mb-3", clickableClass)}
              onClick={() => onJumpToSection?.(`projects-${project.id}`)}
            >
              <div className="mb-0.5 flex items-baseline justify-between">
                <h3 className={headingTextClass}>{project.name}</h3>
                {(project.startDate || project.endDate) && (
                  <span className="text-[10px] font-medium text-slate-500">
                    {project.startDate}{" "}
                    {project.endDate ? `— ${project.endDate}` : ""}
                  </span>
                )}
              </div>
              {project.link && (
                <div className="font-mono text-[9px] tracking-tight text-slate-500">
                  {cleanUrl(project.link)}
                </div>
              )}
              {renderBulletList(project.description)}
            </div>
          );
          addToPage(projEl, estimateHeight("projectItem", project));
        });
      }

      if (
        sectionId === "custom" &&
        customSections &&
        customSections.length > 0
      ) {
        customSections.forEach((section, sIndex) => {
          addToPage(
            <h2
              key={`custom-title-${sIndex}`}
              onClick={() => onJumpToSection?.(`custom-${section.id}`)}
              className={cn(
                "hover:text-primary mb-2 cursor-pointer border-b border-slate-900 pb-0.5 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors",
                templateId === "modern" &&
                  "mb-3 rounded-sm border-none bg-blue-50 p-1.5 px-3 text-blue-600",
                templateId === "minimal" &&
                  "mb-3 border-l-2 border-none border-slate-900 pl-3 text-sm tracking-normal text-slate-900 normal-case",
              )}
            >
              {section.title}
            </h2>,
            estimateHeight("sectionTitle", null),
          );

          section.items.forEach((item, iIndex) => {
            const itemEl = (
              <div
                key={`custom-${sIndex}-${iIndex}`}
                className={cn("mb-3", clickableClass)}
                onClick={() =>
                  onJumpToSection?.(`custom-${section.id}-${item.id}`)
                }
              >
                <div className="mb-0.5 flex items-baseline justify-between">
                  <h3 className={headingTextClass}>{item.title}</h3>
                  {item.date && (
                    <span className="text-[10px] font-medium text-slate-500">
                      {item.date}
                    </span>
                  )}
                </div>
                <div className={bodyTextClass}>{item.subtitle}</div>
                {item.link && (
                  <div className="font-mono text-[9px] tracking-tight text-slate-500">
                    {cleanUrl(item.link)}
                  </div>
                )}
                {renderBulletList(item.description)}
              </div>
            );
            addToPage(itemEl, estimateHeight("customItem", item));
          });
        });
      }
    });

    return result;
  }, [
    personalInfo,
    experience,
    education,
    skills,
    projects,
    customSections,
    data.sectionOrder,
    templateId,
    translations,
    onJumpToSection,
  ]);

  return (
    <div className={cn("flex flex-col items-center gap-10 pb-10", fontClass)}>
      {pages.map((pageContent, idx) => (
        <div
          key={idx}
          className="hover:shadow-primary/5 relative min-h-280.75 w-198.5 bg-white p-12.5 text-slate-900 shadow-2xl transition-all"
        >
          {/* Page Content */}
          <div className="relative z-10 h-full w-full">{pageContent}</div>

          {/* Page Number & Footer Ornament */}
          <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center">
            <div className="flex h-6 w-12 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
              {idx + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
