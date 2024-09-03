import * as amqp from 'amqplib';
import { startMessageProcessor } from './aiInterface';
import { Connection, Channel, ConsumeMessage } from 'amqplib';


describe('RabbitMQ Integration Test', () => {
  let connection: Connection;
  let channel: Channel;
  beforeAll(async () => {
    try {
      connection = await amqp.connect("amqp://localhost");
      channel = await connection.createChannel();
      await channel.assertQueue('BEtoAI', { durable: false });
    } catch (error) {
      console.error('Error setting up RabbitMQ connection and channel:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (channel) {
        await channel.close();
      }
      if (connection) {
        await connection.close();
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection and channel:', error);
      throw error;
    }
  });

  test('should send and receive a message to/from the queue', async () => {
    const testMessage = 'Explain to me the purpose of life';
    const uuid = '12345';
    const expectedBuffer = Buffer.from(JSON.stringify([testMessage, uuid]));

    if (!channel) {
      throw new Error('Channel is not initialized');
    }
    await startMessageProcessor();

    // Send a message to the queue
    await channel.sendToQueue('BEtoAI', expectedBuffer);


    // Consume the message from the queue
    const receivedMessages: Buffer[] = [];
    await new Promise<void>((resolve) => {
      channel.consume('AItoBE', (msg: ConsumeMessage | null) => {
        if (msg) {
          console.log(` [x] Received '${msg.content.toString()}'`);
          receivedMessages.push(msg.content);
          channel.ack(msg);
          if (receivedMessages.length === 1) {
            resolve();
          }
        }
      });
    });

    // Verify that the received message is as expected
   // expect(receivedMessages[0]).toEqual(expectedBuffer);
  });
});
