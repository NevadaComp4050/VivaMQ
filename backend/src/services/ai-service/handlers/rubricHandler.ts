import { RubricStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

// Function to handle rubric creation
export async function handleCreateRubric(
  data: any,
  uuid: string,
  requestType: string | null
) {
  console.log('Handling rubric creation for ID:', uuid);

  try {
    // Update the rubric in the database with the generated data
    await prisma.rubric.update({
      where: { id: uuid },
      data: {
        rubricData: data,
        status: RubricStatus.COMPLETED,
      },
    });
    console.log('Rubric creation completed for ID:', uuid);
  } catch (error) {
    console.error('Error handling rubric creation:', error);

    // Update the rubric status to ERROR in case of failure
    await prisma.rubric.update({
      where: { id: uuid },
      data: { status: RubricStatus.ERROR },
    });
  }
}
