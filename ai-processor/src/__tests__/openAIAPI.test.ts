import { promptSubUUID } from "../handlers/openAIAPI";
import { OpenAI } from "openai";

jest.mock("openai");

describe("promptSubUUID", () => {
  let mockOpenAIClient: jest.Mocked<OpenAI>;

  beforeEach(() => {
    mockOpenAIClient = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<OpenAI>;
  });

  it("should return response and uuid when OpenAI returns a valid response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content:
              '{"questions":[{"question_text":"Test question","question_category":"Category1"}]}',
          },
        },
      ],
    };

    (mockOpenAIClient.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse as any
    );

    const submission = "Test submission";
    const uuid = "test-uuid";
    const customPrompt = "Test custom prompt";

    const result = await promptSubUUID(mockOpenAIClient, {
      submission,
      uuid,
      customPrompt,
    });

    expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: expect.any(String) }],
      response_format: expect.anything(), // i forgot to check this
    });

    expect(result).toEqual([
      '{"questions":[{"question_text":"Test question","question_category":"Category1"}]}',
      "test-uuid",
    ]);
  });

  it("should throw an error when OpenAI fails", async () => {
    (mockOpenAIClient.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("OpenAI Error")
    );

    const submission = "Test submission";
    const uuid = "test-uuid";

    await expect(
      promptSubUUID(mockOpenAIClient, { submission, uuid })
    ).rejects.toThrow("OpenAI Error");
  });

  it("should return 'response error' and uuid when response content is null", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    };

    (mockOpenAIClient.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse as any
    );

    const submission = "Test submission";
    const uuid = "test-uuid";

    const result = await promptSubUUID(mockOpenAIClient, { submission, uuid });

    expect(result).toEqual(["response error", "test-uuid"]);
  });
});
