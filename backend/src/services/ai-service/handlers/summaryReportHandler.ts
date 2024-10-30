import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleSummaryAndReport(data: any, uuid: string) {
  try {
    const newSummary = await prisma.submissionSummary.create({
      data: {
        submissionId: uuid,
        data,
        status: 'COMPLETED',
      },
    });

    console.log('New Submission Summary created:', newSummary);
  } catch (error) {
    console.error('Error creating Submission Summary:', error);
  }
}
