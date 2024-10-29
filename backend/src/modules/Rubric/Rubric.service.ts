// src/services/rubric.service.ts

import fs from 'fs';
import { Buffer } from 'buffer';
import { Prisma, RubricStatus, type Rubric } from '@prisma/client';
import pdfkit from 'pdfkit';
import ExcelJS from 'exceljs';
import { v4 as uuidv4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';
import prisma from '@/lib/prisma';
import vivaService from '@/services/generative-service/generative-service';
import { type CreateRubricDto, type UpdateRubricDto } from '@/dto/rubric.dto';

import { type CreateRubricMessage } from '@/types/message';
export default class RubricService {
  public async createRubric(
    data: CreateRubricDto & { createdById: string }
  ): Promise<Rubric> {
    const rubric = await prisma.rubric.create({
      data: {
        title: data.title,
        assignmentId: data.assignmentId ?? null, // Allow assignmentId to be null
        createdById: data.createdById,
        rubricData: Prisma.JsonNull,
        status: 'PENDING',
      },
    });

    // Prepare message for AI service
    const message: CreateRubricMessage = {
      type: 'createRubric',
      data: {
        id: rubric.id,
        assessmentTask: data.assessmentTask,
        criteria: data.criteria,
        keywords: data.keywords,
        learningObjectives: data.learningObjectives,
        existingGuide: data.existingGuide,
        title: data.title,
        createdById: data.createdById,
        assignmentId: data.assignmentId ?? '',
      },
      uuid: rubric.id, // Use Rubric ID for correlation
    };

    // Send message to AI service via RabbitMQ
    await vivaService.submitRubricCreation(message);

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
    // Fetch existing rubric
    const existingRubric = await prisma.rubric.findUnique({ where: { id } });

    if (!existingRubric || existingRubric.deletedAt) {
      return null;
    }

    // Prepare the update data
    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.rubricData !== undefined) {
      updateData.rubricData = data.rubricData; // Assign as object
    }

    // Optionally update status
    updateData.status = RubricStatus.COMPLETED;

    const updatedRubric = await prisma.rubric.update({
      where: { id },
      data: updateData,
    });

    return updatedRubric;
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
