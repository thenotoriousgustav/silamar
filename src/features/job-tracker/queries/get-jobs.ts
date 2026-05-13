import "server-only";

import { and, asc, desc, eq, gte, ilike, inArray, lte } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";

import type { JobApplicationDTO } from "../types/job-application-dto";

type GetJobsParams = {
  trackerId?: string;
  position?: string;
  company?: string;
  type?: string | string[];
  status?: string | string[];
  from?: string | number;
  to?: string | number;
  sort?: string;
  page?: number;
  perPage?: number;
};

function parseDate(val: string | number | undefined | null): Date | null {
  if (!val) return null;
  const date = new Date(isNaN(Number(val)) ? val : Number(val));
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Fetch job applications for the current user with optional filtering and sorting.
 * Uses column-specific select to avoid fetching unnecessary data.
 */
export const getJobs = cache(
  async (params: GetJobsParams = {}): Promise<JobApplicationDTO[]> => {
    const user = await getSessionUser();
    if (!user) return [];

    const {
      trackerId,
      position,
      company,
      type,
      status,
      from,
      to,
      sort,
    } = params;

    const filters = [eq(jobApplications.userId, user.id)];

    if (trackerId) {
      filters.push(eq(jobApplications.trackerId, trackerId));
    }

    if (position) {
      filters.push(ilike(jobApplications.position, `%${position}%`));
    }

    if (company) {
      filters.push(ilike(jobApplications.company, `%${company}%`));
    }

    if (type && Array.isArray(type) && type.length > 0) {
      filters.push(
        inArray(
          jobApplications.type,
          type as [
            "full-time" | "part-time" | "internship" | "contract" | "freelance",
            ...("full-time" | "part-time" | "internship" | "contract" | "freelance")[],
          ],
        ),
      );
    } else if (type && typeof type === "string") {
      filters.push(eq(jobApplications.type, type as never));
    }

    if (status && Array.isArray(status) && status.length > 0) {
      filters.push(
        inArray(
          jobApplications.status,
          status as [
            "dilamar" | "interview" | "penawaran" | "ditolak",
            ...("dilamar" | "interview" | "penawaran" | "ditolak")[],
          ],
        ),
      );
    } else if (status && typeof status === "string") {
      filters.push(eq(jobApplications.status, status as never));
    }

    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    if (fromDate) {
      filters.push(gte(jobApplications.appliedDate, fromDate));
    }

    if (toDate) {
      const endOfDay = new Date(toDate);
      if (endOfDay.getHours() === 0 && endOfDay.getMinutes() === 0) {
        endOfDay.setHours(23, 59, 59, 999);
      }
      filters.push(lte(jobApplications.appliedDate, endOfDay));
    }

    let orderBy = desc(jobApplications.updatedAt);
    if (sort) {
      const [column, order] = sort.split(".");
      const sortMap: Record<string, typeof orderBy> = {
        "appliedDate.asc": asc(jobApplications.appliedDate),
        "appliedDate.desc": desc(jobApplications.appliedDate),
        "position.asc": asc(jobApplications.position),
        "position.desc": desc(jobApplications.position),
        "company.asc": asc(jobApplications.company),
        "company.desc": desc(jobApplications.company),
        "status.asc": asc(jobApplications.status),
        "status.desc": desc(jobApplications.status),
      };
      orderBy = sortMap[`${column}.${order}`] ?? orderBy;
    }

    const rows = await db
      .select({
        id: jobApplications.id,
        trackerId: jobApplications.trackerId,
        resumeId: jobApplications.resumeId,
        company: jobApplications.company,
        position: jobApplications.position,
        location: jobApplications.location,
        logoUrl: jobApplications.logoUrl,
        salary: jobApplications.salary,
        type: jobApplications.type,
        status: jobApplications.status,
        appliedDate: jobApplications.appliedDate,
        interviewDate: jobApplications.interviewDate,
        offerDate: jobApplications.offerDate,
        notes: jobApplications.notes,
        jobUrl: jobApplications.jobUrl,
        description: jobApplications.description,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
      })
      .from(jobApplications)
      .where(and(...filters))
      .orderBy(orderBy);

    return rows;
  },
);
