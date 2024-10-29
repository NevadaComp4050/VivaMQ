import amqp from 'amqplib';
import { BE_TO_AI_QUEUE, AI_TO_BE_QUEUE, RABBITMQ_URL } from '../config';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;

export async function setupQueue(
  onMessage: (msg: amqp.Message | null) => void
) {
  try {
    if (!channel) {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
      await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

      await channel.consume(AI_TO_BE_QUEUE, onMessage, { noAck: false });

      console.log('RabbitMQ connected and queues set up.');
    }
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

export async function sendToQueue(message: object, queue: string) {
  const sendMsg = Buffer.from(JSON.stringify(message));
  if (channel) {
    channel.sendToQueue(queue, sendMsg, { persistent: true });
    console.log(`Message sent to ${queue}'`);
  }
}

export function ackMessage(msg: amqp.Message) {
  if (channel) channel.ack(msg);
}
