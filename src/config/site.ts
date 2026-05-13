import { env } from "@/config/env";

export const siteConfig = {
  name: "SiLamar",
  description:
    "Platform AI-powered untuk membantu fresh graduate Indonesia melamar kerja lebih cerdas. Buat CV ATS-friendly, analisis resume, dan track lamaran kerja kamu.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "https://silamar.com/og.jpg",
  links: {
    twitter: "https://twitter.com/silamar",
    github: "https://github.com/silamar",
  },
  keywords: [
    "lamar kerja",
    "fresh graduate",
    "Resume builder",
    "resume ATS",
    "AI interview",
    "job tracker",
    "indonesia",
  ],
  authors: [{ name: "SiLamar", url: "https://silamar.com" }],
};

export type SiteConfig = typeof siteConfig;
