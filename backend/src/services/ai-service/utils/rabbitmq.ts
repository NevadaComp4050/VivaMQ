import amqp from 'amqplib';
import { BE_TO_AI_QUEUE, AI_TO_BE_QUEUE, RABBITMQ_URL } from '../config';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

const recentMessages = new Map<string, number>();
const DEBOUNCE_TIME = 5000;

async function createChannel() {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
    console.log('RabbitMQ connection established.');
  }

  if (!channel) {
    channel = await connection.createChannel();
    console.log('RabbitMQ channel created.');
  }

  return channel;
}

export async function setupQueue(
  onMessage: (msg: amqp.Message | null) => void
) {
  try {
    channel = await createChannel();

    await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
    await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

    await channel.consume(
      AI_TO_BE_QUEUE,
      (msg) => {
        if (msg) {
          console.log(`Message received from ${AI_TO_BE_QUEUE}`);
          onMessage(msg);
        }
      },
      { noAck: false }
    );

    console.log('RabbitMQ connected and queues set up.');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

export async function sendToQueue(message: object, queue: string) {
  try {
    const messageString = JSON.stringify(message);
    const currentTime = Date.now();

    if (recentMessages.has(messageString)) {
      const lastSentTime = recentMessages.get(messageString) as number;
      if (currentTime - lastSentTime < DEBOUNCE_TIME) {
        console.log(`Debounced message to ${queue}, not sent.`);
        return;
      }
    }

    recentMessages.set(messageString, currentTime);

    channel = await createChannel();

    const sendMsg = Buffer.from(messageString);
    channel.sendToQueue(queue, sendMsg, { persistent: true });

    console.log(`Message sent to ${queue}`);
  } catch (error) {
    console.error(`Failed to send message to ${queue}:`, error);
  }
}

export function ackMessage(msg: amqp.Message) {
  try {
    if (channel) {
      channel.ack(msg);
      console.log('Message acknowledged.');
    }
  } catch (error) {
    console.error('Failed to acknowledge message:', error);
  }
}

process.on('SIGINT', async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
    process.exit(1);
  }
});
