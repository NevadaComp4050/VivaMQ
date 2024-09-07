import * as amqp from 'amqplib';
import { startMessageProcessor } from './aiInterface';
import { Connection, Channel, ConsumeMessage } from 'amqplib';
import { pdfToText } from './extractPDF';


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

  test('should establish a connection to RabbitMQ', async () => {
    expect(connection).toBeDefined();
  });

  test('should create and assert queue', async () => {
    expect(channel).toBeDefined();
    const queueName = 'BEtoAI';
    await channel.assertQueue(queueName, { durable: false });
    const queue = await channel.checkQueue(queueName);
    expect(queue).toBeDefined();
    expect(queue.queue).toBe(queueName);
  });



  test('should send and receive a message to/from the queue', async () => {
    const testMessage = await pdfToText("src/PDFs/pdf_9.pdf");
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
          expect(receivedMessages).toHaveLength(1);
          if (receivedMessages.length === 1) {
            resolve();
          }
        }
      });
    });

    // Verify that the received message is as expected
   // expect(receivedMessages[0]).toEqual(expectedBuffer);
  }, 10000);
});