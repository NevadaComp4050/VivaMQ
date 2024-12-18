import prisma from '@/lib/prisma';

export default class ActivityService {
  public async getRecentActivities(
    userId: string,
    limit: number,
    page: number
  ) {
    const offset = (page - 1) * limit;
    console.log(
      'Getting recent activities for user',
      userId,
      'with limit',
      limit,
      'and offset',
      offset
    );

    const recentActivities = await prisma.$queryRaw<any[]>`
  SELECT
    'assignment' AS type,
    a.id,
    a.name,
    a."unitId",
    GREATEST(
      COALESCE(a."modifiedAt", '1970-01-01'::timestamp),
      COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp),
      COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp),
      COALESCE(a."createdAt", '1970-01-01'::timestamp)
    ) AS "latestDate",
    CASE
      WHEN GREATEST(
        COALESCE(a."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp),
        COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp),
        COALESCE(a."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(a."modifiedAt", '1970-01-01'::timestamp) THEN 'Modified'
      WHEN GREATEST(
        COALESCE(a."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp),
        COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp),
        COALESCE(a."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp) THEN 'Viva Questions Generated'
      WHEN GREATEST(
        COALESCE(a."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp),
        COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp),
        COALESCE(a."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp) THEN 'Submissions Uploaded'
      WHEN GREATEST(
        COALESCE(a."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(a."latestVivaUpdate", '1970-01-01'::timestamp),
        COALESCE(a."latestSubmissionUpload", '1970-01-01'::timestamp),
        COALESCE(a."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(a."createdAt", '1970-01-01'::timestamp) THEN 'Was Created'
      ELSE 'Unknown'
    END AS reason
  FROM "Assignment" a
  JOIN "Unit" u ON a."unitId" = u.id
  LEFT JOIN "UnitAccess" ua ON ua."unitId" = u.id
  WHERE a."deletedAt" IS NULL
    AND (
      u."ownerId" = ${userId}::text OR
      (ua."userId" = ${userId}::text AND ua."role" IN ('READ_WRITE', 'READ_ONLY'))
    )

  UNION ALL

  SELECT
    'rubric' AS type,
    r.id,
    r.title AS name,
    NULL AS "unitId",
    GREATEST(
      COALESCE(r."modifiedAt", '1970-01-01'::timestamp),
      COALESCE(r."dataModifiedAt", '1970-01-01'::timestamp),
      COALESCE(r."createdAt", '1970-01-01'::timestamp)
    ) AS "latestDate",
    CASE
      WHEN GREATEST(
        COALESCE(r."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."dataModifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(r."modifiedAt", '1970-01-01'::timestamp) THEN 'Changes Made'
      WHEN GREATEST(
        COALESCE(r."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."dataModifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(r."dataModifiedAt", '1970-01-01'::timestamp) THEN 'Content Changed'
      WHEN GREATEST(
        COALESCE(r."modifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."dataModifiedAt", '1970-01-01'::timestamp),
        COALESCE(r."createdAt", '1970-01-01'::timestamp)
      ) = COALESCE(r."createdAt", '1970-01-01'::timestamp) THEN 'Was Created'
      ELSE 'Unknown'
    END AS reason
  FROM "Rubric" r
  WHERE r."deletedAt" IS NULL
    AND r."createdById" = ${userId}::text

  ORDER BY "latestDate" DESC
  LIMIT ${limit} OFFSET ${offset}
`;

    console.log(recentActivities);
    return recentActivities;
  }
}
