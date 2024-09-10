import { optimizePromptAndConfig } from '../promptEngineeringAndAIModelConfiguration';
import { OpenAI } from 'openai';

jest.mock('openai');

describe('Prompt Engineering and AI Model Configuration', () => {
  it('should optimize prompt and configuration', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              optimized_prompt: 'Optimized prompt',
              configuration_params: { param1: 'value1', param2: 'value2' },
            }),
          },
        },
      ],
    };

    (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await optimizePromptAndConfig('Original prompt', { param1: 'old_value1' });

    expect(result).toEqual({
      optimized_prompt: 'Optimized prompt',
      configuration_params: { param1: 'value1', param2: 'value2' },
    });
  });
});