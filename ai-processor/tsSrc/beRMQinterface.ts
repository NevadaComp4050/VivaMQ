import * as amqp from "amqplib";
const jsonForm = require("./jsonFormats");
async function sendMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const sendQueue = 'BEtoAI';
    const receiveQueue = 'AItoBE';
    await channel.assertQueue(receiveQueue, { durable: false });
    await channel.assertQueue(sendQueue, { durable: false });

    const UUID = 12234;

    const msg = [jsonForm.fiveQuestions, UUID];
    channel.sendToQueue(sendQueue, Buffer.from(msg));

    console.log(` [x] Sent '${msg}'`);
    channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          console.log(` [x] Received '${msg.content.toString()}'`);
          channel.ack(msg);
        }
      });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();