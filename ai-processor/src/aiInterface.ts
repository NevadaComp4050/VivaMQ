import { promptSubUUID } from "./openAIAPI";
import * as amqp from "amqplib";

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
        const content = msg.content.toString();
        const contentSplit = JSON.parse(content);
        
        const response = await promptSubUUID(
          "return five questions to assess understanding of the following prompt",
          contentSplit[0],
          contentSplit[1]
        );
        const sendMsg = Buffer.from(JSON.stringify([response[0],response[1]]));
        channel.sendToQueue(sendQueue, sendMsg);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
})();


// ------------------- debugging --------------------//