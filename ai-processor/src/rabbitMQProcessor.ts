import * as amqp from "amqplib";
import { promptSubUUID } from "./openAIAPI";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export async function startMessageProcessor() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? "amqp://localhost"
    );
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
        const contentSplit = JSON.parse(content);
        console.log("Received message: ", content);

        const submission = contentSplit[0];
        const uuid = contentSplit[1];
        const customPrompt = contentSplit.length > 2 ? contentSplit[2] : null;

        try {
          const response = await promptSubUUID(
            { prompt: "", submission, uuid, customPrompt }          );

          const sendMsg = Buffer.from(
            JSON.stringify([response[0], response[1]])
          );
          channel.sendToQueue(sendQueue, sendMsg);
          console.log("Sent response: ", sendMsg.toString());
        } catch (error) {
          console.error(
            "Error processing message:",
            msg.content.toString(),
            error
          );
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
