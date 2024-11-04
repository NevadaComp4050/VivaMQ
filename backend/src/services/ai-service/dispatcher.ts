import type * as amqp from 'amqplib';
import { handleVivaQuestions } from './handlers/vivaHandler';
import { handleCreateRubric } from './handlers/rubricHandler';
import { handleWritingQuality } from './handlers/writingQualityHandler';
import { handleSummaryAndReport } from './handlers/summaryReportHandler';
import { handleAutomatedMarksheet } from './handlers/automatedMarksheetHandler';
import { handleOptimizePrompt } from './handlers/optimizePromptHandler';
import { ackMessage } from './utils/rabbitmq';

// Define the interface for incoming messages
interface MessageResponse {
  type: string;
  data: any;
  uuid: string;
  requestType?: string | null; // Optional or nullable
}

// Map each message type to its respective handler
const handlers: Record<
  string,
  (data: any, uuid: string, requestType: string | null) => Promise<void>
> = {
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

  const { type, data, uuid, requestType = null } = response;

  if (handlers[type]) {
    try {
      await handlers[type](data, uuid, requestType);
    } catch (error) {
      console.error(`Error handling message type ${type}:`, error);
    }
  } else {
    console.warn(`Unhandled message type: ${type}`);
  }

  // Acknowledge message after processing
  ackMessage(msg);
}
