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
  it("should return response when OpenAI returns a valid response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              scores: { clarity: 80, content_quality: 90 },
              feedback: {
                clarity: "Good clarity",
                content_quality: "High quality content",
              },
              total_score: 170,
              overall_feedback: "Well done overall",
            }),
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

    const result = await generateAutomatedMarksheet(mockOpenAIClient, {
      document,
      rubric,
      learningOutcomes,
    });

    expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: expect.any(String) }],
      response_format: expect.anything(), // i forgot to check this
    });

    expect(result).toEqual({
      scores: { clarity: 80, content_quality: 90 },
      feedback: {
        clarity: "Good clarity",
        content_quality: "High quality content",
      },
      total_score: 170,
      overall_feedback: "Well done overall",
    });
  });

  it("should throw an error when OpenAI fails", async () => {
    (mockOpenAIClient.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("OpenAI Error")
    );

    const document = "Test document";
    const rubric = "test-rubric";
    const learningOutcomes = "Test learning outcome";

    await expect(
      generateAutomatedMarksheet(mockOpenAIClient, {
        document,
        rubric,
        learningOutcomes,
      })
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

    const document = "Test document";
    const rubric = "test-rubric";
    const learningOutcomes = "Test learning outcomes";

    const result = await generateAutomatedMarksheet(mockOpenAIClient, {
      document,
      rubric,
      learningOutcomes,
    });
    await expect(
      generateAutomatedMarksheet(mockOpenAIClient, {
        document,
        rubric,
        learningOutcomes,
      })
    ).rejects.toThrow("Failed to generate automated marksheet");
  });
});
