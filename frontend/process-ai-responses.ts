// app/api/jobs/process-ai-responses.ts
import amqp from "amqplib";
import prisma from "./lib/prisma";
import { z } from "zod";

const Question = z.object({
  question_text: z.string(),
  question_category: z.string(),
});

const QuestionResponse = z.object({
  questions: z.array(Question),
});

export async function processAIResponses() {
  const retryInterval = 5000; // 5 seconds

  async function connectAndConsume() {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost"
      );
      const channel = await connection.createChannel();
      const queue = "AItoBE";
      await channel.assertQueue(queue, { durable: false });

      console.log(`Waiting for messages in ${queue}`);

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          const [responseData, submissionId] = JSON.parse(content);

          try {
            const parsedResponse = QuestionResponse.parse(
              JSON.parse(responseData)
            );

            // Store questions in the database
            await prisma.question.createMany({
              data: parsedResponse.questions.map((q) => ({
                submissionId,
                text: q.question_text,
                category: q.question_category,
              })),
            });

            console.log(`Processed questions for submission ${submissionId}`);
            channel.ack(msg);
          } catch (error) {
            console.error("Error processing AI response:", error);
            channel.nack(msg);
          }
        }
      });

      connection.on("error", (error) => {
        console.error("RabbitMQ connection error:", error);
        setTimeout(connectAndConsume, retryInterval);
      });

      connection.on("close", () => {
        console.error("RabbitMQ connection closed. Retrying...");
        setTimeout(connectAndConsume, retryInterval);
      });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      setTimeout(connectAndConsume, retryInterval);
    }
  }

  connectAndConsume();
}
