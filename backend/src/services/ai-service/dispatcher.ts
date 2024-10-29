import type * as amqp from 'amqplib';
import { handleVivaQuestions } from './handlers/vivaHandler';
import { handleCreateRubric } from './handlers/rubricHandler';
import { handleWritingQuality } from './handlers/writingQualityHandler';
import { handleSummaryAndReport } from './handlers/summaryReportHandler';
import { handleAutomatedMarksheet } from './handlers/automatedMarksheetHandler';
import { handleOptimizePrompt } from './handlers/optimizePromptHandler';
import { ackMessage } from './utils/rabbitmq';

interface MessageResponse {
  type: string;
  data: any;
  uuid: string;
}

const handlers: Record<string, (data: any, uuid: string) => Promise<void>> = {
  vivaQuestions: handleVivaQuestions,
  createRubric: handleCreateRubric,
  writingQuality: handleWritingQuality,
  summaryAndReport: handleSummaryAndReport,
  automatedMarksheet: handleAutomatedMarksheet,
  optimizePrompt: handleOptimizePrompt,
};

export async function dispatchMessage(msg: amqp.Message | null) {
  if (!msg) return;

  let response: MessageResponse;
  try {
    response = JSON.parse(msg.content.toString());
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    ackMessage(msg);
    return;
  }

  const { type, data, uuid } = response;

  if (handlers[type]) {
    try {
      await handlers[type](data, uuid);
    } catch (error) {
      console.error(`Error handling message type ${type}:`, error);
    }
  } else {
    console.warn(`Unhandled message type: ${type}`);
  }

  ackMessage(msg);
}
