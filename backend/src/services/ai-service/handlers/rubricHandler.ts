import { RubricStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function handleCreateRubric(data: any, uuid: string) {
  try {
    const updatedRubric = await prisma.rubric.update({
      where: { id: uuid },
      data: {
        rubricData: data,
        status: RubricStatus.COMPLETED,
      },
    });

    console.log('Rubric updated with AI-generated data:', updatedRubric);
  } catch (error) {
    console.error('Error handling createRubric response:', error);
    await prisma.rubric.update({
      where: { id: uuid },
      data: { status: RubricStatus.ERROR },
    });
  }
}
