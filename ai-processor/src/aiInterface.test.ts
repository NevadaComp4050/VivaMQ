import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
import { processMessages } from './aiInterface'; // Adjust the import path
import { promptSubUUID } from './openAIAPI'; // Adjust the import path

// Mock amqplib
jest.mock('amqplib');
const mockConnect = amqp.connect as jest.MockedFunction<typeof amqp.connect>;

// Mock promptSubUUID
jest.mock('./openAIAPI', () => ({
  promptSubUUID: jest.fn(),
}));

// Create a mock Channel object with proper type assertion
const mockChannel: jest.Mocked<Partial<Channel>> = {
  assertQueue: jest.fn().mockResolvedValue(undefined),
  consume: jest.fn(),
  sendToQueue: jest.fn(),
  ack: jest.fn(),
} as jest.Mocked<Partial<Channel>>;

// Create a mock Connection object with proper type assertion
const mockConnection: jest.Mocked<Partial<Connection>> = {
  createChannel: jest.fn().mockResolvedValue(mockChannel as Channel),
  close: jest.fn(),
} as jest.Mocked<Partial<Connection>>;

// Mock the connection to return our mockConnection
(mockConnect as jest.Mock).mockResolvedValue(mockConnection as Connection);

describe('RabbitMQ Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the consume method to invoke the callback with a mock message
    mockChannel.consume.mockImplementation((queue: string, callback: (msg: ConsumeMessage | null) => void) => {
      callback({
        content: Buffer.from(JSON.stringify(['prompt', 'data'])),
      } as ConsumeMessage);
      return Promise.resolve({} as any); // Mock return value for consume
    });
  });

  test('should process and send a message successfully', async () => {
    const response = ['question1', 'question2'];
    (promptSubUUID as jest.Mock).mockResolvedValue(response);

    await processMessages(promptSubUUID);

    // Check if functions were called correctly
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('BEtoAI', { durable: false });
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('AItoBE', { durable: false });
    expect(promptSubUUID).toHaveBeenCalledWith(
      'return five questions to assess understanding of the following prompt',
      'prompt',
      'data'
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith('AItoBE', Buffer.from(JSON.stringify([response[0], response[1]])));
    expect(mockChannel.ack).toHaveBeenCalledWith({
      content: Buffer.from(JSON.stringify(['prompt', 'data'])),
    } as ConsumeMessage);
  });

  test('should handle connection errors', async () => {
    (mockConnect as jest.Mock).mockRejectedValue(new Error('Connection Error'));

    await expect(processMessages(promptSubUUID)).rejects.toThrow('Connection Error');
  });


});
