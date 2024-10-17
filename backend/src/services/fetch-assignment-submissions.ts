import { PrismaClient } from '@prisma/client';
import S3PDFHandler from '../utils/S3PDFHandler';

const prisma = new PrismaClient();
const s3Handler = new S3PDFHandler();

export async function fetchSubmissionsWithText(assignmentId: string) {
  try {
    // Fetch all submissions for the given assignment ID
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: true,
        assignment: true,
      },
    });

    // If no submissions are found, return an empty array
    if (submissions.length === 0) {
      return [];
    }

    // Fetch text from S3 for each submission
    const submissionTextPromises = submissions.map(async (submission) => {
      try {
        // Fetch the text file associated with the submission's PDF file
        const submissionText = await s3Handler.fetchText(
          submission.submissionFile
        );

        console.log('Submission text:', submissionText);

        return {
          submission,
          text: submissionText,
        };
      } catch (error) {
        console.error(
          `Error fetching text for submission ID ${submission.id}:`,
          error
        );
        return {
          submission,
          text: null, // In case of error, text is set to null
        };
      }
    });

    // Return the results
    return await Promise.all(submissionTextPromises);
  } catch (error) {
    console.error('Error fetching submissions or their text:', error);
    throw new Error('Failed to fetch submissions and text');
  }
}
