import { promptSubUUID } from "./openAIAPI";
import { pdfToText } from "./extractPDF";
import * as amqp from "amqplib";
import { send } from "process";

(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
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
        console.log(msg.content[0].toString());
        const response = await promptSubUUID(
          "return five questions to assess understanding of the following prompt",
          msg.content[0].toString(),
          msg.content[1].toString()
        );
        const sendMsg = Buffer.from(JSON.stringify([response[0],response[1]]));
        console.log(sendMsg);
        channel.sendToQueue(sendQueue, sendMsg);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
})();


// ------------------- debugging --------------------//