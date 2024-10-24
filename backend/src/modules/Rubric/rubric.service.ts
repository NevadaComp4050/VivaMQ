// src/services/rubric.service.ts

import fs from 'fs';
import { Buffer } from 'buffer';
import { Prisma, type Rubric } from '@prisma/client';
import pdfkit from 'pdfkit';
import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';
import prisma from '@/lib/prisma';
import vivamqService from '@/services/viva-service';
import { type CreateRubricDto, type UpdateRubricDto } from '@/dto/rubric.dto';

export default class RubricService {
  // Create Rubric - sends message to AI via RabbitMQ
  public async createRubric(
    data: CreateRubricDto & { createdById: string }
  ): Promise<Rubric> {
    // Create initial Rubric entry with status PENDING
    const rubric = await prisma.rubric.create({
      data: {
        id: data.id ?? uuidv4(), // Ensure the client can provide a UUID or generate one here
        title: data.title,
        assignmentId: data.assignmentId,
        createdById: data.createdById,
        rubricData: Prisma.JsonNull, // To be updated by AI response
        status: 'PENDING',
      },
    });

    // Prepare message for AI service
    const message = {
      type: 'createRubric',
      data: {
        assessmentTask: data.assessmentTask,
        criteria: data.criteria,
        keywords: data.keywords,
        learningObjectives: data.learningObjectives,
        existingGuide: data.existingGuide,
      },
      uuid: rubric.id, // Use Rubric ID for correlation
    };

    // Send message to AI service via RabbitMQ
    void vivamqService.submitCreateRubric(message);

    return rubric;
  }

  public async getRubrics(limit: number, offset: number): Promise<Rubric[]> {
    return await prisma.rubric.findMany({
      skip: offset,
      take: limit,
      where: { deletedAt: null },
    });
  }

  public async getRubricById(id: string): Promise<Rubric | null> {
    return await prisma.rubric.findUnique({
      where: { id },
    });
  }

  public async updateRubric(
    id: string,
    data: UpdateRubricDto
  ): Promise<Rubric | null> {
    try {
      // Transform rubricData DTO to a plain object
      const plainRubricData = data.rubricData
        ? instanceToPlain(data.rubricData)
        : undefined;

      return await prisma.rubric.update({
        where: { id },
        data: {
          title: data.title,
          rubricData: plainRubricData, // Use the plain object here
          // Optionally handle updating status if needed
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        return null;
      }
      throw e;
    }
  }

  public async deleteRubric(id: string): Promise<Rubric | null> {
    return await prisma.rubric
      .update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      .catch((e) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2025'
        ) {
          return null;
        }
        throw e;
      });
  }

  // Export Rubric as PDF
  public async exportRubricAsPDF(rubricId: string): Promise<Buffer> {
    const rubric = await prisma.rubric.findUnique({
      where: { id: rubricId },
    });

    if (!rubric) {
      throw new Error('Rubric not found');
    }

    if (!rubric.rubricData) {
      throw new Error('Rubric data is not available yet');
    }

    // eslint-disable-next-line new-cap
    const doc = new pdfkit();
    const chunks: any[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      // Handle the result here, e.g., save to file, send as response, etc.
      // Example: save to file
      fs.writeFileSync('output.pdf', new Uint8Array(result));
    });

    // Construct PDF content
    doc.fontSize(20).text(rubric.title, { align: 'center' });
    doc.moveDown();

    // Add criteria table
    const rubricData = rubric.rubricData as {
      criteria: Array<{
        name: string;
        marks: number;
        descriptors: Record<string, string>;
      }>;
    };
    for (const criterion of rubricData.criteria) {
      doc.fontSize(14).text(`Criterion: ${criterion.name}`);
      doc.fontSize(12).text(`Marks: ${criterion.marks}`);
      doc.fontSize(12).text('Descriptors:');
      for (const [key, value] of Object.entries(criterion.descriptors)) {
        doc.fontSize(10).text(`${key}: ${value}`);
      }
      doc.moveDown();
    }

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for PDF to be generated
    await new Promise((resolve) => {
      doc.on('finish', resolve);
    });

    return Buffer.concat(chunks);
  }

  // Export Rubric as XLS
  public async exportRubricAsXLS(rubricId: string): Promise<Buffer> {
    const rubric = await prisma.rubric.findUnique({
      where: { id: rubricId },
    });

    if (!rubric) {
      throw new Error('Rubric not found');
    }

    if (!rubric.rubricData) {
      throw new Error('Rubric data is not available yet');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rubric');

    // Define columns
    worksheet.columns = [
      { header: 'Criterion', key: 'criterion', width: 30 },
      { header: 'F Description', key: 'F', width: 30 },
      { header: 'P Description', key: 'P', width: 30 },
      { header: 'C Description', key: 'C', width: 30 },
      { header: 'D Description', key: 'D', width: 30 },
      { header: 'HD Description', key: 'HD', width: 30 },
      { header: 'Marks', key: 'marks', width: 10 },
    ];

    // Add rows
    const rubricData = rubric.rubricData as {
      criteria: Array<{
        name: string;
        marks: number;
        descriptors: Record<string, string>;
      }>;
    };
    for (const criterion of rubricData.criteria) {
      worksheet.addRow({
        criterion: criterion.name,
        F: criterion.descriptors.F,
        P: criterion.descriptors.P,
        C: criterion.descriptors.C,
        D: criterion.descriptors.D,
        HD: criterion.descriptors.HD,
        marks: criterion.marks,
      });
    }

    // Generate XLS buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
