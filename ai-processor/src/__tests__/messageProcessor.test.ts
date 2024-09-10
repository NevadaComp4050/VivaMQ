import { startMessageProcessor } from '../rabbitMQProcessor';
import * as amqp from 'amqplib';
import { promptSubUUID } from '../openAIAPI';
import { assessWritingQuality } from '../writingQualityAssessment';
import { generateSummaryAndReport } from '../summarizationAndReportGeneration';
import { generateAutomatedMarksheet } from '../automatedMarksheetGeneration';
import { optimizePromptAndConfig } from '../promptEngineeringAndAIModelConfiguration';
import { createRubric } from '../rubricCreationAndConversion';

jest.mock('amqplib');
jest.mock('../openAIAPI');
jest.mock('../writingQualityAssessment');
jest.mock('../summarizationAndReportGeneration');
jest.mock('../automatedMarksheetGeneration');
jest.mock('../promptEngineeringAndAIModelConfiguration');
jest.mock('../rubricCreationAndConversion');

describe('Message Processor', () => {
  let mockChannel: any;
  let mockConsume: jest.Mock;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      sendToQueue: jest.fn(),
      ack: jest.fn(),
    };
    mockConsume = mockChannel.consume;
    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    });
  });

  it('should process viva questions message', async () => {
    const message = {
      content: Buffer.from(JSON.stringify({
        type: 'vivaQuestions',
        data: { submission: 'test submission', customPrompt: 'test prompt' },
        uuid: 'test-uuid',
      })),
    };

    (promptSubUUID as jest.Mock).mockResolvedValue(['response', 'test-uuid']);

    await startMessageProcessor();

    const consumeCallback = mockConsume.mock.calls[0][1];
    await consumeCallback(message);

    expect(promptSubUUID).toHaveBeenCalledWith({
      prompt: '',
      submission: 'test submission',
      uuid: 'test-uuid',
      customPrompt: 'test prompt',
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalled();
    expect(mockChannel.ack).toHaveBeenCalledWith(message);
  });

  // Add similar tests for other message types
});