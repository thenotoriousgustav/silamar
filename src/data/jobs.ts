import { db } from "@/lib/db";
import { jobApplications } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq, and, ilike, inArray, gte, lte, or, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * DATA ACCESS LAYER (DAL) - JOBS
 *
 * Rules:
 * 1. Only run on the server.
 * 2. Perform authorization checks.
 * 3. Return safe, minimal Data Transfer Objects (DTOs).
 */

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Fetch job applications for the current user with optional filtering and sorting
 */
export const getJobsDTO = cache(async (params: any = {}) => {
  const session = await getSession();
  if (!session?.user) return [];

  const {
    position,
    company,
    type,
    status,
    from,
    to,
    sort,
    page = 1,
    perPage = 10,
  } = params;

  const filters = [eq(jobApplications.userId, session.user.id)];

  if (position) {
    filters.push(ilike(jobApplications.position, `%${position}%`));
  }

  if (company) {
    filters.push(ilike(jobApplications.company, `%${company}%`));
  }

  if (type && Array.isArray(type) && type.length > 0) {
    filters.push(inArray(jobApplications.type, type as any));
  } else if (type && typeof type === "string") {
    filters.push(eq(jobApplications.type, type as any));
  }

  if (status && Array.isArray(status) && status.length > 0) {
    filters.push(inArray(jobApplications.status, status as any));
  } else if (status && typeof status === "string") {
    filters.push(eq(jobApplications.status, status as any));
  }

  const parseDate = (val: any) => {
    if (!val) return null;
    const date = new Date(isNaN(Number(val)) ? val : Number(val));
    return isNaN(date.getTime()) ? null : date;
  };

  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (fromDate) {
    filters.push(gte(jobApplications.appliedDate, fromDate));
  }

  if (toDate) {
    // Set to end of day if it's just a date
    const endOfDay = new Date(toDate);
    if (endOfDay.getHours() === 0 && endOfDay.getMinutes() === 0) {
      endOfDay.setHours(23, 59, 59, 999);
    }
    filters.push(lte(jobApplications.appliedDate, endOfDay));
  }

  let orderBy = desc(jobApplications.updatedAt);
  if (sort) {
    const [column, order] = sort.split(".");
    if (column === "appliedDate") {
      orderBy =
        order === "asc"
          ? asc(jobApplications.appliedDate)
          : desc(jobApplications.appliedDate);
    } else if (column === "position") {
      orderBy =
        order === "asc"
          ? asc(jobApplications.position)
          : desc(jobApplications.position);
    } else if (column === "company") {
      orderBy =
        order === "asc"
          ? asc(jobApplications.company)
          : desc(jobApplications.company);
    } else if (column === "status") {
      orderBy =
        order === "asc"
          ? asc(jobApplications.status)
          : desc(jobApplications.status);
    }
  }

  const jobs = await db
    .select()
    .from(jobApplications)
    .where(and(...filters))
    .orderBy(orderBy);

  return jobs;
});

/**
 * Fetch a single job application by ID, ensuring ownership
 */
export const getJobDTO = cache(async (id: string) => {
  const session = await getSession();
  if (!session?.user) return null;

  const job = await db
    .select()
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.id, id),
        eq(jobApplications.userId, session.user.id),
      ),
    )
    .limit(1);

  return job[0] || null;
});
