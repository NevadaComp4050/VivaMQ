import { generateAutomatedMarksheet } from '../automatedMarksheetGeneration';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('Automated Marksheet Generation', () => {
  it('should generate automated marksheet', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              scores: { criterion1: 8, criterion2: 9 },
              feedback: { criterion1: 'Good work', criterion2: 'Excellent' },
              total_score: 17,
              overall_feedback: 'Very good submission',
            }),
          },
        },
      ],
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await generateAutomatedMarksheet('Sample document', 'Sample rubric', 'Sample learning outcomes');

    expect(result).toEqual({
      scores: { criterion1: 8, criterion2: 9 },
      feedback: { criterion1: 'Good work', criterion2: 'Excellent' },
      total_score: 17,
      overall_feedback: 'Very good submission',
    });
  });
});