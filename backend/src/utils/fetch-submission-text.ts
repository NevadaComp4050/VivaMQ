import { PrismaClient } from '@prisma/client';
import S3PDFHandler from './s3-util';

const prisma = new PrismaClient();
const s3Handler = new S3PDFHandler();

async function fetchSubmissionTextFromS3(submissionFile: string) {
  try {
    const submissionText = await s3Handler.fetchText(submissionFile);
    console.log('Submission text:', submissionText);
    return submissionText;
  } catch (error) {
    console.error(`Error fetching text for file ${submissionFile}:`, error);
    return null;
  }
}

export async function fetchAssignmentSubmissionsText(assignmentId: string) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: true,
        assignment: true,
      },
    });

    if (submissions.length === 0) {
      return [];
    }

    const submissionTextPromises = submissions.map(async (submission) => {
      const text = await fetchSubmissionTextFromS3(submission.submissionFile);
      return {
        submission,
        text,
      };
    });

    return await Promise.all(submissionTextPromises);
  } catch (error) {
    console.error('Error fetching submissions or their text:', error);
    throw new Error('Failed to fetch submissions and text');
  }
}

export async function fetchSubmissionText(submissionId: string) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: true,
        assignment: true,
      },
    });

    if (!submission) {
      return null;
    }

    const text = await fetchSubmissionTextFromS3(submission.submissionFile);
    return {
      submission,
      text,
    };
  } catch (error) {
    console.error(`Error fetching submission with ID ${submissionId}:`, error);
    throw new Error('Failed to fetch submission and text');
  }
}
