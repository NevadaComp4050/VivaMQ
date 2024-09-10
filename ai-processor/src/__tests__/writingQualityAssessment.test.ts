import { assessWritingQuality } from '../writingQualityAssessment';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('Writing Quality Assessment', () => {
  it('should assess writing quality', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              structure: 'Good',
              grammar: 'Excellent',
              spelling: 'Very good',
              vocabulary: 'Advanced',
              overall_quality: 'High',
              recommendations: ['Improve paragraph transitions'],
            }),
          },
        },
      ],
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await assessWritingQuality('Sample document', 'Sample criteria');

    expect(result).toEqual({
      structure: 'Good',
      grammar: 'Excellent',
      spelling: 'Very good',
      vocabulary: 'Advanced',
      overall_quality: 'High',
      recommendations: ['Improve paragraph transitions'],
    });
  });
});