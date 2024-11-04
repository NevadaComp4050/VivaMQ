/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Document, Packer, Paragraph, TextRun } from 'docx';
import JSZip from 'jszip';

export default class DocxService {
  // Generates DOCX for a single submission
  public async generateSingleSubmissionDocx(submission: any): Promise<Buffer> {
    const studentName = submission.student?.id ?? this.generateRandomId();
    const studentHeader = `Viva Questions for ${studentName}`;

    const docSections: any[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: studentHeader,
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        text: 'Below are the viva questions for this student.',
        spacing: { after: 300 },
        style: 'Arial',
      }),
    ];

    let questionNumber = 1;
    for (const viva of submission.vivaQuestions) {
      const questionCategory = viva.category ?? 'General';
      const questionText = JSON.stringify(viva.question);

      const questionParagraph = new Paragraph({
        children: [
          new TextRun({
            text: `Category: ${questionCategory} - Question ${questionNumber}`,
            bold: true,
            size: 24,
            font: 'Arial',
          }),
          new TextRun({
            text: `\n${questionText}`,
            break: 1,
            font: 'Arial',
          }),
        ],
        spacing: { after: 200 },
      });

      docSections.push(questionParagraph);
      questionNumber++;
    }

    const doc = new Document({
      sections: [{ children: docSections }],
    });

    return await Packer.toBuffer(doc);
  }

  // Generate a ZIP file containing DOCX files for each student submission, plus a combined DOCX file
  public async generateVivaQuestionsZip(submissions: any[]): Promise<Buffer> {
    const zip = new JSZip();

    // Combined sections for the combined DOCX file
    const combinedSections: any[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Combined Viva Questions',
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph({
        text: 'This document contains viva questions grouped by student.',
        spacing: { after: 300 },
      }),
    ];

    for (const submission of submissions) {
      const studentBuffer = await this.generateSingleSubmissionDocx(submission);
      const studentName = submission.student?.id ?? this.generateRandomId();

      zip.file(
        `viva_questions_${studentName}.docx`,
        new Uint8Array(studentBuffer)
      );

      const studentHeader = `Viva Questions for ${studentName}`;
      combinedSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: studentHeader,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          text: 'Below are the viva questions for this student.',
          spacing: { after: 300 },
          style: 'Arial',
        })
      );

      let questionNumber = 1;
      for (const viva of submission.vivaQuestions) {
        const questionCategory = viva.category ?? 'General';
        const questionText = JSON.stringify(viva.question);

        const questionParagraph = new Paragraph({
          children: [
            new TextRun({
              text: `Category: ${questionCategory} - Question ${questionNumber}`,
              bold: true,
              size: 24,
              font: 'Arial',
            }),
            new TextRun({
              text: `\n${questionText}`,
              break: 1,
              font: 'Arial',
            }),
          ],
          spacing: { after: 200 },
        });

        combinedSections.push(questionParagraph);
        questionNumber++;
      }
    }

    // Generate the combined DOCX
    const combinedDoc = new Document({
      sections: [{ children: combinedSections }],
    });
    const combinedBuffer = await Packer.toBuffer(combinedDoc);
    zip.file('combined_viva_questions.docx', new Uint8Array(combinedBuffer));

    // Generate and return the ZIP buffer
    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  private generateRandomId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }
}
