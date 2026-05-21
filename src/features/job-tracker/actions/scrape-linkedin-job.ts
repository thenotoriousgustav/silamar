"use server";

import * as cheerio from "cheerio";

import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types/action-result";

export interface LinkedInJobData {
  position: string;
  company: string;
  description: string;
  location: string | null;
  salary: string | null;
  type: string | null;
  logoUrl: string | null;
  jobUrl: string;
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
 * Server action to scrape a LinkedIn job posting.
 * Extracts job ID from URL, fetches the public guest API, and parses with cheerio.
 */
export async function scrapeLinkedInJob(
  linkedinUrl: string,
): Promise<ActionResult<LinkedInJobData>> {
  const user = await getSessionUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const jobId = extractJobId(linkedinUrl);
  if (!jobId) {
    return {
      success: false,
      error:
        "Could not extract job ID from the provided URL. Please provide a valid LinkedIn job URL.",
    };
  }

  try {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `LinkedIn returned status ${response.status}. The job posting may no longer be available.`,
      };
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
    // Use only the inner markup element to avoid duplicate text from parent container
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
      $(".topcard__flavor--bullet").first().text().trim() || null;

    // Extract salary if available
    const salary =
      $(".salary-main-rail__compensation-value").first().text().trim() ||
      $(".compensation__salary").first().text().trim() ||
      null;

    // Extract job type from criteria list
    const typeText =
      $(".description__job-criteria-text").first().text().trim() || null;

    // Extract company logo
    const logoUrl =
      $(".artdeco-entity-image").attr("data-delayed-url") ||
      $(".artdeco-entity-image").attr("src") ||
      $("img.artdeco-entity-image").attr("src") ||
      null;

    if (!position && !company) {
      return {
        success: false,
        error:
          "Could not extract job data. The job posting may no longer be available.",
      };
    }

    // Build canonical job URL
    const jobUrl = `https://www.linkedin.com/jobs/view/${jobId}`;

    return {
      success: true,
      data: {
        position,
        company,
        description,
        location,
        salary,
        type: typeText,
        logoUrl,
        jobUrl,
      },
    };
  } catch (error) {
    console.error("[scrapeLinkedInJob] error:", error);
    return {
      success: false,
      error: "Failed to scrape LinkedIn job posting. Please try again.",
    };
  }
}
