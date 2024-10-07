import { generateSummaryAndReport } from "../handlers/summarizationAndReportGeneration";
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

    const document = "Test document";

    const result = await generateSummaryAndReport(mockOpenAIClient, {
      document,
    });

    expect(mockOpenAIClient.chat.completions.create).toHaveBeenCalledWith({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: expect.any(String) }],
      response_format: expect.anything(), // i forgot to check this
    });

    expect(result).toEqual([
      {
        scores: {
          content_quality: 92,
          clarity: 88,
          organization: 85,
          engagement: 90,
        },
        feedback: {
          content_quality:
            "The document presents well-researched content with insightful analysis.",
          clarity:
            "The ideas are generally clear, but some sentences are complex.",
          organization:
            "The structure is logical, with smooth transitions between sections.",
          engagement:
            "The document is engaging, but could benefit from more examples.",
        },
        total_score: 355,
        overall_feedback:
          "Strong submission overall. Focus on simplifying complex sentences for better clarity.",
      },
    ]);
  });
  it("should throw an error when OpenAI fails", async () => {
    (mockOpenAIClient.chat.completions.create as jest.Mock).mockRejectedValue(
      new Error("OpenAI Error")
    );

    const document = "Test document";

    await expect(
      generateSummaryAndReport(mockOpenAIClient, {
        document,
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

    const result = await generateSummaryAndReport(mockOpenAIClient, {
      document,
    });

    expect(result).toEqual(["response error", "test-rubric"]);
  });
});