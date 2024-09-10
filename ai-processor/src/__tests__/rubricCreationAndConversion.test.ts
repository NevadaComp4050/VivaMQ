import { createRubric } from '../rubricCreationAndConversion';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('Rubric Creation and Conversion', () => {
  it('should create a rubric', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              criteria: [
                {
                  name: 'Criterion 1',
                  descriptors: {
                    F: 'Fail description',
                    P: 'Pass description',
                    C: 'Credit description',
                    D: 'Distinction description',
                    HD: 'High Distinction description',
                  },
                },
              ],
            }),
          },
        },
      ],
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await createRubric(
      'Sample task',
      ['Criterion 1'],
      ['Keyword1', 'Keyword2'],
      ['Objective 1', 'Objective 2'],
      'Existing guide'
    );

    expect(result).toEqual({
      criteria: [
        {
          name: 'Criterion 1',
          descriptors: {
            F: 'Fail description',
            P: 'Pass description',
            C: 'Credit description',
            D: 'Distinction description',
            HD: 'High Distinction description',
          },
        },
      ],
    });
  });
});