import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const requestSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

export interface LinkedInJobData {
  position: string;
  company: string;
  description: string;
  location: string | null;
  salary: string | null;
  type: string | null;
  logoUrl: string | null;
}

/**
 * Extracts the LinkedIn job ID from various URL formats:
 * - https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4341210682
 * - https://www.linkedin.com/jobs/view/4341210682
 * - https://www.linkedin.com/jobs/view/software-engineer-at-company-4341210682
 */
function extractJobId(url: string): string | null {
  // Try currentJobId query param
  try {
    const urlObj = new URL(url);
    const currentJobId = urlObj.searchParams.get("currentJobId");
    if (currentJobId && /^\d+$/.test(currentJobId)) {
      return currentJobId;
    }
  } catch {
    // Not a valid URL, try regex patterns
  }

  // Try /jobs/view/{id} pattern
  const viewMatch = url.match(/\/jobs\/view\/(?:.*?[-/])?(\d{8,})/);
  if (viewMatch) return viewMatch[1];

  // Try any long number in the URL as fallback
  const numberMatch = url.match(/(\d{8,})/);
  if (numberMatch) return numberMatch[1];

  return null;
}

/**
 * Scrapes LinkedIn job posting data from the public guest API.
 */
async function scrapeLinkedInJob(jobId: string): Promise<LinkedInJobData> {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`LinkedIn returned status ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract job position
  const position =
    $(".topcard__title").first().text().trim() ||
    $("h1").first().text().trim() ||
    "";

  // Extract company name
  const company =
    $(".topcard__org-name-link").first().text().trim() ||
    $(".topcard__flavor a").first().text().trim() ||
    "";

  // Extract job description (rich HTML content)
  const descriptionEl =
    $(".show-more-less-html__markup").first().length > 0
      ? $(".show-more-less-html__markup").first()
      : $(".description__text--rich").first();

  let description = "";
  if (descriptionEl.length > 0) {
    // Remove "show more" / "show less" buttons and hidden elements
    descriptionEl.find(".show-more-less-html__button").remove();
    descriptionEl.find("button").remove();

    // Replace <br> and block elements with newlines for readability
    descriptionEl.find("br").replaceWith("\n");
    descriptionEl.find("li").each(function () {
      $(this).prepend("• ");
      $(this).append("\n");
    });
    descriptionEl.find("p").each(function () {
      $(this).append("\n");
    });
    description = descriptionEl
      .text()
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // Extract location
  const location =
    $(".topcard__flavor--bullet").first().text().trim() ||
    $(".topcard__flavor:not(a)").eq(1).text().trim() ||
    null;

  // Extract salary if available
  const salary =
    $(".salary-main-rail__compensation-value").first().text().trim() ||
    $(".compensation__salary").first().text().trim() ||
    null;

  // Extract job type
  const typeText =
    $(".description__job-criteria-text").first().text().trim() || null;

  // Extract company logo
  const logoUrl =
    $(".artdeco-entity-image").attr("data-delayed-url") ||
    $(".artdeco-entity-image").attr("src") ||
    $("img.artdeco-entity-image").attr("src") ||
    null;

  return {
    position,
    company,
    description,
    location: location || null,
    salary: salary || null,
    type: typeText || null,
    logoUrl: logoUrl || null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const jobId = extractJobId(parsed.data.url);
    if (!jobId) {
      return NextResponse.json(
        {
          error:
            "Could not extract job ID from the provided URL. Please provide a valid LinkedIn job URL.",
        },
        { status: 400 },
      );
    }

    const jobData = await scrapeLinkedInJob(jobId);

    if (!jobData.position && !jobData.company) {
      return NextResponse.json(
        {
          error:
            "Could not extract job data. The job posting may no longer be available.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: jobData, jobId },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API] linkedin/scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape LinkedIn job posting. Please try again." },
      { status: 500 },
    );
  }
}
