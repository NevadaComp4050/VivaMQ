import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { connect } from 'amqplib';
import { extractTextFromPDF } from '~/lib/pdfUtils';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const assignmentId = formData.get('assignmentId') as string;
  const studentId = formData.get('studentId') as string;
  const studentName = formData.get('studentName') as string;

  if (!file || !assignmentId || !studentId || !studentName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const fileBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPDF(Buffer.from(fileBuffer));

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        studentName,
        submissionDate: new Date(),
        status: 'Submitted',
        pdfSubmission: {
          create: {
            fileName: file.name,
            fileContent: Buffer.from(fileBuffer),
            extractedText,
          },
        },
      },
    });

    // Send extracted text to RabbitMQ
    const connection = await connect(process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672');
    const channel = await connection.createChannel();
    const queue = 'BEtoAI';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify([extractedText, submission.id])));

    await channel.close();
    await connection.close();

    return NextResponse.json({ success: true, submissionId: submission.id });
    
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}