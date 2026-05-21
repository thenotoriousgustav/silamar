"use client";

/**
 * ResumeTextView — minimal plain-HTML resume renderer.
 *
 * Used exclusively by HighlightedResumePreview for its DOM text-node
 * highlight overlay. It renders all resume text content as structured HTML
 * so the TreeWalker can find and wrap matching text nodes.
 *
 * This is NOT a visual preview — it's a functional text surface.
 */

import type { ResumeContent } from "@/types/resume";

interface ResumeTextViewProps {
  data: ResumeContent;
}

export function ResumeTextView({ data }: ResumeTextViewProps) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="bg-white p-10 font-sans text-[11px] leading-relaxed text-black">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold">{personalInfo.fullName}</h1>
        <p className="text-xs text-gray-600">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {personalInfo.summary && (
          <p className="mt-2 text-left text-xs">{personalInfo.summary}</p>
        )}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-black pb-0.5 text-xs font-bold uppercase">
            Work Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">
                  {exp.position}
                  {exp.company ? `, ${exp.company}` : ""}
                </span>
                <span className="text-gray-500">
                  {exp.startDate}
                  {exp.endDate ? ` – ${exp.endDate}` : ""}
                </span>
              </div>
              {exp.location && (
                <p className="text-gray-500">{exp.location}</p>
              )}
              {Array.isArray(exp.description) &&
                exp.description.map((line, j) => (
                  <p key={j} className="ml-2">
                    {typeof line === "string" ? line : ""}
                  </p>
                ))}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-black pb-0.5 text-xs font-bold uppercase">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">
                  {[edu.degree, edu.major, edu.institution]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                <span className="text-gray-500">
                  {edu.startYear}
                  {edu.endYear ? ` – ${edu.endYear}` : ""}
                </span>
              </div>
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-black pb-0.5 text-xs font-bold uppercase">
            Skills
          </h2>
          {skills.map((skill, i) => (
            <p key={i}>
              <span className="font-bold">{skill.category}: </span>
              {skill.items.join(", ")}
            </p>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 border-b border-black pb-0.5 text-xs font-bold uppercase">
            Projects
          </h2>
          {projects.map((project, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold">{project.name}</span>
              {Array.isArray(project.description) &&
                project.description.map((line, j) => (
                  <p key={j} className="ml-2">
                    {typeof line === "string" ? line : ""}
                  </p>
                ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
