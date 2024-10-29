export const RABBITMQ_URL_DEFAULT = 'amqp://user:password@rabbitmq:5672';
export const RABBITMQ_URL = process.env.RABBITMQ_URL ?? RABBITMQ_URL_DEFAULT;
export const BE_TO_AI_QUEUE = `${process.env.NODE_ENV ?? 'development'}_${process.env.uniqueID ?? 'defaultID'}_BEtoAI`;
export const AI_TO_BE_QUEUE = `${process.env.NODE_ENV ?? 'development'}_${process.env.uniqueID ?? 'defaultID'}_AItoBE`;
