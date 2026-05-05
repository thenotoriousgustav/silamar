import {
  LayoutDashboard,
  Target,
  Briefcase,
  Files,
  FileUser,
  ScrollText,
  Award,
  FolderOpen,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Documents",
      url: "#",
      icon: Files,
      items: [
        { title: "Resumes", url: "/documents/resumes", icon: FileUser },
        {
          title: "Cover Letter",
          url: "/documents/cover-letter",
          icon: ScrollText,
        },
        { title: "Certificates", url: "/documents/certificates", icon: Award },
        { title: "Portfolio", url: "/documents/portfolio", icon: FolderOpen },
      ],
    },
  ],
  navTrackers: [
    {
      title: "Job Tracker",
      url: "/job-tracker",
      icon: Briefcase,
    },
  ],
  navSecondary: [
    {
      title: "Skill Gap",
      url: "/skill-gap",
      icon: Target,
    },
  ],
};
