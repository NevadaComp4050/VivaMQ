import * as amqp from "amqplib";
import { Message } from "./types";
import { promptSub } from "./handlers/openAIAPI";
import { assessWritingQuality } from "./handlers/writingQualityAssessment";
import { generateSummaryAndReport } from "./handlers/summarizationAndReportGeneration";
import { MarksheetGenerator } from "./handlers/automatedMarksheetGeneration";
import { optimizePrompt } from "./handlers/promptEngineeringAndAIModelConfiguration";
import { createARubric } from "./handlers/rubricCreationAndConversion";
import dotenv from "dotenv";
import openAIClient from "./config/openAIClient";
import { LogError } from "./logger";

dotenv.config();

class messageProcessor {
  
  @LogError()
async processMessage(message: Message): Promise<any> {
  try {
    let response;
    switch (message.type) {
      case "vivaQuestions":
        const prompSubs = new promptSub();
        response = await prompSubs.promptSubUUID(openAIClient, {
          submission: message.data.submission,
          uuid: message.uuid,
          customPrompt: message.data.customPrompt,
        });
        break;
      case "writingQuality":
        const writingAQuality = new assessWritingQuality();
        response = await writingAQuality.assessWritingQuality(
          openAIClient,

          {
            document: message.data.document,
            criteria: message.data.criteria,
          }
        );
        break;
      case "summaryAndReport":
        const summaryAndAReport = new generateSummaryAndReport();
        response = await summaryAndAReport.generateSummaryAndReport(
          openAIClient,
          message.data.document
        );
        break;
      case "automatedMarksheet":
        const automatedMarkSheet = new MarksheetGenerator();
        response = await automatedMarkSheet.generateAutomatedMarksheet(openAIClient, {
          document: message.data.document,
          rubric: message.data.rubric,
          learningOutcomes: message.data.learningOutcomes,
        });
        break;
      case "optimizePrompt":
        const promptAndConfig = new optimizePrompt();
        response = await promptAndConfig.optimizePromptAndConfig(
          message.data.originalPrompt,
          message.data.configParams
        );
        break;
      case "createRubric":
        const RubricCreation = new createARubric();
        response = await RubricCreation.createRubric(openAIClient, {
          assessmentTask: message.data.assessmentTask,
          criteria: message.data.criteria,
          keywords: message.data.keywords,
          learningObjectives: message.data.learningObjectives,
          existingGuide: message.data.existingGuide,
        });
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
    return { type: message.type, data: response, uuid: message.uuid };
  } catch (error) {
    console.error("Error processing message:", error);
    return {
      type: "error",
      data: error || "Unknown error",
      uuid: message.uuid,
    };
  }
}

@LogError()
 async startMessageProcessor() {
  try {
    const rabbitMQUrl = process.env.RABBITMQ_URL;

    if (!rabbitMQUrl) {
      throw new Error("RABBITMQ_URL environment variable is not set");
    }
    console.log("Connecting to RabbitMQ at:", rabbitMQUrl);
    const connection = await amqp.connect(rabbitMQUrl);
    console.log("Connected to RabbitMQ successfully");

    const channel = await connection.createChannel();

    const receiveQueue = `${process.env.NODE_ENV ?? "development"}_${
      process.env.uniqueID ?? "defaultID"
    }_BEtoAI`;
    const sendQueue = `${process.env.NODE_ENV ?? "development"}_${
      process.env.uniqueID ?? "defaultID"
    }_AItoBE`;

    await channel.assertQueue(receiveQueue, { durable: true });
    await channel.assertQueue(sendQueue, { durable: true });

    console.log(
      ` [*] Waiting for messages in '${receiveQueue}'. To exit press CTRL+C`
    );

    channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
      if (msg) {
        const content = msg.content.toString();
        const message: Message = JSON.parse(content);
        console.log("Received message:", content);

        try {
          const response = await this.processMessage(message);
          const sendMsg = Buffer.from(JSON.stringify(response));
          channel.sendToQueue(sendQueue, sendMsg, { persistent: true });
          console.log("Sent response:", sendMsg.toString());
        } catch (error) {
          console.error("Error processing message:", content, error);
          const errorMsg = Buffer.from(
            JSON.stringify({
              type: "error",
              data: error || "Unknown error",
              uuid: message.uuid,
            })
          );
          channel.sendToQueue(sendQueue, errorMsg, { persistent: true });
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error in startMessageProcessor:", error);
  }
}
}

export {messageProcessor}