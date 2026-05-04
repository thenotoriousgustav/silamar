import {
  LayoutDashboard,
  FileText,
  Target,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const menuItems: MenuItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume-builder", icon: FileText, label: "Resume Builder" },
  { href: "/cover-letter", icon: FileText, label: "Cover Letter" },
  { href: "/job-tracker", icon: Briefcase, label: "Job Tracker" },
  { href: "/skill-gap", icon: Target, label: "Skill Gap" },
];
