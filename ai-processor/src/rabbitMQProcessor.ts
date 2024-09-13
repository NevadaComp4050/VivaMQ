import * as amqp from "amqplib";
import { promptSubUUID } from "./openAIAPI";
import { assessWritingQuality } from "./writingQualityAssessment";
import { generateSummaryAndReport } from "./summarizationAndReportGeneration";
import { generateAutomatedMarksheet } from "./automatedMarksheetGeneration";
import { optimizePromptAndConfig } from "./promptEngineeringAndAIModelConfiguration";
import { createRubric } from "./rubricCreationAndConversion";
import dotenv from "dotenv";

// Load environment variables
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
        response = await promptSubUUID({
          prompt: "",
          submission: message.data.submission,
          uuid: message.uuid,
          customPrompt: message.data.customPrompt,
        });
        break;
      case "writingQuality":
        response = await assessWritingQuality(
          message.data.document,
          message.data.criteria
        );
        break;
      case "summaryAndReport":
        response = await generateSummaryAndReport(message.data.document);
        break;
      case "automatedMarksheet":
        response = await generateAutomatedMarksheet(
          message.data.document,
          message.data.rubric,
          message.data.learningOutcomes
        );
        break;
      case "optimizePrompt":
        response = await optimizePromptAndConfig(
          message.data.originalPrompt,
          message.data.configParams
        );
        break;
      case "createRubric":
        response = await createRubric(
          message.data.assessmentTask,
          message.data.criteria,
          message.data.keywords,
          message.data.learningObjectives,
          message.data.existingGuide
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
    console.log(
      "Connecting to RabbitMQ at: ",
      process.env.RABBITMQ_URL ?? "amqp://user:password@rabbitmq:5672"
    );
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? "amqp://user:password@rabbitmq:5672"
    );
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
        console.log("Received message: ", content);

        try {
          let response;
          switch (message.type) {
            case "vivaQuestions":
              response = await promptSubUUID({
                prompt: "",
                submission: message.data.submission,
                uuid: message.uuid,
                customPrompt: message.data.customPrompt,
              });
              break;
            case "writingQuality":
              response = await assessWritingQuality(
                message.data.document,
                message.data.criteria
              );
              break;
            case "summaryAndReport":
              response = await generateSummaryAndReport(message.data.document);
              break;
            case "automatedMarksheet":
              response = await generateAutomatedMarksheet(
                message.data.document,
                message.data.rubric,
                message.data.learningOutcomes
              );
              break;
            case "optimizePrompt":
              response = await optimizePromptAndConfig(
                message.data.originalPrompt,
                message.data.configParams
              );
              break;
            case "createRubric":
              response = await createRubric(
                message.data.assessmentTask,
                message.data.criteria,
                message.data.keywords,
                message.data.learningObjectives,
                message.data.existingGuide
              );
              break;
            default:
              throw new Error(`Unknown message type: ${message.type}`);
          }

          const sendMsg = Buffer.from(
            JSON.stringify({
              type: message.type,
              data: response,
              uuid: message.uuid,
            })
          );
          channel.sendToQueue(sendQueue, sendMsg);
          console.log("Sent response: ", sendMsg.toString());
        } catch (error) {
          console.error(
            "Error processing message:",
            msg.content.toString(),
            error
          );
          // Send error response
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
    console.error("Error:", error);
  }
}
