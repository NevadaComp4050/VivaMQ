import prisma from '@/lib/prisma';

// Function to handle summary and report generation
export async function handleSummaryAndReport(
  data: any,
  uuid: string,
  requestType: string | null
) {
  console.log('Handling summary and report for submission ID:', uuid);

  try {
    // Update the submission with the generated summary and report
    await prisma.submission.update({
      where: { id: uuid },
      data: {
        summary: data.summary,
        qualityAssessment: data.quality,
        vivaStatus: 'COMPLETED',
      },
    });
    console.log(
      'Summary and report processing completed for submission:',
      uuid
    );
  } catch (error) {
    console.error('Error handling summary and report:', error);
  }
}
