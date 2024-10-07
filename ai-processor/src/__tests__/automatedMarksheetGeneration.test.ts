import { generateAutomatedMarksheet } from "../handlers/automatedMarksheetGeneration";
import { OpenAI } from "openai";

jest.mock("openai");

describe("generateAutomatedMarksheet", () => {
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

  it("should return automated marksheet when OpenAI returns valid response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              scores: { criterion1: 8, criterion2: 9 },
              feedback: { criterion1: "Good work", criterion2: "Excellent" },
              total_score: 17,
              overall_feedback: "Very good submission",
            }),
          },
        },
      ],
    };

    (mockOpenAIClient.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse as any
    );

    const document = "Test document content.";
    const rubric = "Test rubric.";
    const learningOutcomes = "Test learning outcomes.";

    const result = await generateAutomatedMarksheet(mockOpenAIClient, {
      document,
      rubric,
      learningOutcomes,
    });

    expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: expect.any(String) }],
      response_format: expect.anything(),
    });

    expect(result).toEqual({
      scores: { criterion1: 8, criterion2: 9 },
      feedback: { criterion1: "Good work", criterion2: "Excellent" },
      total_score: 17,
      overall_feedback: "Very good submission",
    });
  });

  it("should throw an error when OpenAI fails", async () => {
    (mockOpenAIClient.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("OpenAI Error")
    );

    const document = "Test document content.";
    const rubric = "Test rubric.";
    const learningOutcomes = "Test learning outcomes.";

    await expect(
      generateAutomatedMarksheet(mockOpenAIClient, {
        document,
        rubric,
        learningOutcomes,
      })
    ).rejects.toThrow("OpenAI Error");
  });

  it("should return 'response error' when response content is null", async () => {
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

    const document = "Test document";
    const rubric = "test-rubric";
    const learningOutcomes = "Test learning outcomes";

    await expect(
      generateAutomatedMarksheet(mockOpenAIClient, {
        document,
        rubric,
        learningOutcomes,
      })
    ).rejects.toThrow("Failed to generate automated marksheet");
  });

});
