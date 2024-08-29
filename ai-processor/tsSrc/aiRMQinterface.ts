import * as amqp from "amqplib";
import { parseMe } from "./openAIAPI";

async function receiveMessage() {
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
        const reply: [string, string] = await parseMe(msg.content[0].toString(), msg.content[1].toString());
        channel.sendToQueue(sendQueue, Buffer.from(reply[0]));
        console.log(` [x] Received `); // '${msg.content.toString()}'`);
        console.log(` [x] Replying to UUID:`, reply[1]); // '${reply}'`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

receiveMessage();
