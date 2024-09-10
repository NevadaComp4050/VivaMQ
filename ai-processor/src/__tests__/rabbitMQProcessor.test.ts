import * as amqp from "amqplib";
import { startMessageProcessor } from "../rabbitMQProcessor";
import { Connection, Channel, ConsumeMessage } from "amqplib";
import * as fs from "fs";

describe("RabbitMQ Integration Test", () => {
  let connection: Connection;
  let channel: Channel;

  beforeAll(async () => {
    try {
      connection = await amqp.connect("amqp://localhost");
      channel = await connection.createChannel();
      await channel.assertQueue("BEtoAI", { durable: false });
      await channel.assertQueue("AItoBE", { durable: false });
    } catch (error) {
      console.error("Error setting up RabbitMQ connection and channel:", error);
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
      console.error("Error closing RabbitMQ connection and channel:", error);
      throw error;
    }
  });

  test("should establish a connection to RabbitMQ", async () => {
    expect(connection).toBeDefined();
    expect(connection).not.toBeNull();
  });

  test("should create and assert queue", async () => {
    expect(channel).toBeDefined();
    const queueName = "BEtoAI";
    await channel.assertQueue(queueName, { durable: false });
    const queue = await channel.checkQueue(queueName);
    expect(queue).toBeDefined();
    expect(queue.queue).toBe(queueName);
  });

  test("should send and receive a message to/from the queue", async () => {
    // read local file testdoc.txt
    const testMessage = fs.readFileSync("__tests__/rabbitMQProcessor.test.ts", "utf8");
    const uuid = "12345";
    const expectedBuffer = Buffer.from(JSON.stringify([testMessage, uuid]));

    if (!channel) {
      throw new Error("Channel is not initialized");
    }

    // Start the message processor
    startMessageProcessor();

    // Send a message to the queue
    channel.sendToQueue("BEtoAI", expectedBuffer);

    // Consume the message from the queue
    const receivedMessages: Buffer[] = [];
    await new Promise<void>((resolve) => {
      channel.consume("AItoBE", (msg: ConsumeMessage | null) => {
        if (msg) {
          console.log(` [x] Received '${msg.content.toString()}'`);
          receivedMessages.push(msg.content);
          channel.ack(msg);
          if (receivedMessages.length === 1) {
            expect(receivedMessages[0].toString()).toContain(uuid);
            resolve();
          }
        }
      });
    });

    expect(receivedMessages).toHaveLength(1);
    expect(receivedMessages[0]).toEqual(expect.any(Buffer));
  }, 30000); // increasing timeout for async operation
});
