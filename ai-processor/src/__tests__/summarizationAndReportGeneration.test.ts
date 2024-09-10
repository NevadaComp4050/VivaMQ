import { generateSummaryAndReport } from '../summarizationAndReportGeneration';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('Summarization and Report Generation', () => {
  it('should generate summary and report', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: 'This is a summary',
              detailed_report: 'This is a detailed report',
            }),
          },
        },
      ],
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateSummaryAndReport('Sample document');

    expect(result).toEqual({
      summary: 'This is a summary',
      detailed_report: 'This is a detailed report',
    });
  });
});