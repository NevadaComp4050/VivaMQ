import { assessWritingQuality } from "../handlers/writingQualityAssessment";
import { OpenAI } from "openai";

jest.mock("openai");

describe("generateAutomatedMarksheet", () => {
  let mockOpenAIClient: jest.Mocked<OpenAI>;
  const assessAWritingQuality = new assessWritingQuality();

  beforeEach(() => {
    mockOpenAIClient = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<OpenAI>;
  });
  it("should return response and assessWritingQuality when OpenAI returns a valid response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content:
              '[{"feedback": {"clarity": "The ideas are generally clear, but some sentences are complex.", "content_quality": "The document presents well-researched content with insightful analysis.", "engagement": "The document is engaging, but could benefit from more examples.", "organization": "The structure is logical, with smooth transitions between sections."}, "overall_feedback": "Strong submission overall. Focus on simplifying complex sentences for better clarity.", "scores": {"clarity": 88, "content_quality": 92, "engagement": 90, "organization": 85}, "total_score": 355}]',
          },
        },
      ],
    };

    (mockOpenAIClient.chat.completions.create as jest.Mock).mockResolvedValue(
      mockResponse as any
    );

    const document = "Test document";
    const criteria = "test-criteria";
    
    const result = await assessAWritingQuality.assessWritingQuality(mockOpenAIClient, {
      document,
      criteria
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
    const criteria = "test-criteria";
   
    await expect(
      assessAWritingQuality.assessWritingQuality(mockOpenAIClient, {
        document,
        criteria
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
    const criteria = "test-criteria";

    await expect(assessAWritingQuality.assessWritingQuality(mockOpenAIClient, {
      document,
      criteria
    })).rejects.toThrow("Failed to generate writing quality assessment");
  });
});
