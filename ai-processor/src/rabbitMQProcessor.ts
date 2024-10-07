import * as amqp from "amqplib";
import { Message } from "./types";
import { promptSubUUID } from "./handlers/openAIAPI";
import { assessWritingQuality } from "./handlers/writingQualityAssessment";
import { generateSummaryAndReport } from "./handlers/summarizationAndReportGeneration";
import { generateAutomatedMarksheet } from "./handlers/automatedMarksheetGeneration";
import { optimizePromptAndConfig } from "./handlers/promptEngineeringAndAIModelConfiguration";
import { createRubric } from "./handlers/rubricCreationAndConversion";
import dotenv from "dotenv";
import openAIClient from "./config/openAIClient";
dotenv.config();

interface Message {
  type: string;
  data: any;
  uuid: string;
} 

export async function processMessage(message: Message): Promise<any> {
  try {
    let response;
    switch (message.type) {
      case "vivaQuestions":
        response = await promptSubUUID(openAIClient, {
          submission: message.data.submission,
          uuid: message.uuid,
          customPrompt: message.data.customPrompt,
        });
        break;
      case "writingQuality":
        response = await assessWritingQuality(
          openAIClient,

          {
            document: message.data.document,
            criteria: message.data.criteria,
          }
        );
        break;
      case "summaryAndReport":
        response = await generateSummaryAndReport(
          openAIClient,
          message.data.document
        );
        break;
      case "automatedMarksheet":
        response = await generateAutomatedMarksheet(openAIClient, {
          document: message.data.document,
          rubric: message.data.rubric,
          learningOutcomes: message.data.learningOutcomes,
        });
        break;
      case "optimizePrompt":
        response = await optimizePromptAndConfig(
          message.data.originalPrompt,
          message.data.configParams
        );
        break;
      case "createRubric":
        response = await createRubric(
          openAIClient,
          {
          assessmentTask:message.data.assessmentTask,
          criteria:message.data.criteria,
          keywords:message.data.keywords,
          learningObjectives:message.data.learningObjectives,
          existingGuide:message.data.existingGuide
          }
        );
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
    return { type: message.type, data: response, uuid: message.uuid };
  } catch (error) {
    console.error("Error processing message:", error);
    return { type: "error", data: error, uuid: message.uuid };
  }
}

export async function startMessageProcessor() {
  try {
<<<<<<< HEAD
    console.log(
      "Connecting to RabbitMQ at: ",
      process.env.RABBITMQ_URL ?? "amqp://user:password@rabbitmq:5672"
    );
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? "amqp://user:password@rabbitmq:5672"
    );
=======
    const rabbitMQUrl =
      process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";
    console.log("Connecting to RabbitMQ at:", rabbitMQUrl);
    const connection = await amqp.connect(rabbitMQUrl);
>>>>>>> origin/ai-testing
    console.log("Connected to RabbitMQ successfully");

    const channel = await connection.createChannel();

    const receiveQueue = "BEtoAI";
    const sendQueue = "AItoBE";

    await channel.assertQueue(receiveQueue, { durable: false });
    await channel.assertQueue(sendQueue, { durable: false });

    console.log(
      ` [*] Waiting for messages in '${receiveQueue}'. To exit press CTRL+C`
    );

    channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
      if (msg) {
        const content = msg.content.toString();
        const message: Message = JSON.parse(content);
        console.log("Received message:", content);

        try {
          const response = await processMessage(message);
          const sendMsg = Buffer.from(JSON.stringify(response));
          channel.sendToQueue(sendQueue, sendMsg);
          console.log("Sent response:", sendMsg.toString());
        } catch (error) {
          console.error("Error processing message:", content, error);
          const errorMsg = Buffer.from(
            JSON.stringify({
              type: "error",
              data: error,
              uuid: message.uuid,
            })
          );
          channel.sendToQueue(sendQueue, errorMsg);
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error in startMessageProcessor:", error);
  }
}
