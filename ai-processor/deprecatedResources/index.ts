import * as amqp from 'amqplib';
import { config } from 'dotenv';
import { generateQuestions } from './questionGenerator';

config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'document_processing';

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Waiting for messages...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log('Received message:', content);

        try {
          const result = await generateQuestions(content);
          console.log('Generated questions:', result);

          // Here you can send the result back to another queue or store it
          
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Error starting consumer:', error);
  }
}

startConsumer();