// __tests__/messageProcessor.test.ts

import { processMessage } from "../rabbitMQProcessor";
import { promptSubUUID } from "../openAIAPI";
import { assessWritingQuality } from "../writingQualityAssessment";
import { generateSummaryAndReport } from "../summarizationAndReportGeneration";
import { generateAutomatedMarksheet } from "../automatedMarksheetGeneration";
import { optimizePromptAndConfig } from "../promptEngineeringAndAIModelConfiguration";
import { createRubric } from "../rubricCreationAndConversion";

jest.mock("../openAIAPI");
jest.mock("../writingQualityAssessment");
jest.mock("../summarizationAndReportGeneration");
jest.mock("../automatedMarksheetGeneration");
jest.mock("../promptEngineeringAndAIModelConfiguration");
jest.mock("../rubricCreationAndConversion");

describe("Message Processor", () => {
  it("should process viva questions message", async () => {
    const message = {
      type: "vivaQuestions",
      data: { submission: "test submission", customPrompt: "test prompt" },
      uuid: "test-uuid",
    };

    (promptSubUUID as jest.Mock).mockResolvedValue(["response", "test-uuid"]);

    const result = await processMessage(message);

    expect(promptSubUUID).toHaveBeenCalledWith({
      prompt: "",
      submission: "test submission",
      uuid: "test-uuid",
      customPrompt: "test prompt",
    });
    expect(result).toEqual({
      type: "vivaQuestions",
      data: ["response", "test-uuid"],
      uuid: "test-uuid",
    });
  });

  it("should process writing quality assessment message", async () => {
    const message = {
      type: "writingQuality",
      data: { document: "test document", criteria: "test criteria" },
      uuid: "test-uuid",
    };

    (assessWritingQuality as jest.Mock).mockResolvedValue({
      structure: "Good",
      grammar: "Excellent",
      spelling: "Very good",
      vocabulary: "Advanced",
      overall_quality: "High",
      recommendations: ["Improve paragraph transitions"],
    });

    const result = await processMessage(message);

    expect(assessWritingQuality).toHaveBeenCalledWith(
      "test document",
      "test criteria"
    );
    expect(result).toEqual({
      type: "writingQuality",
      data: {
        structure: "Good",
        grammar: "Excellent",
        spelling: "Very good",
        vocabulary: "Advanced",
        overall_quality: "High",
        recommendations: ["Improve paragraph transitions"],
      },
      uuid: "test-uuid",
    });
  });

  it("should process summary and report generation message", async () => {
    const message = {
      type: "summaryAndReport",
      data: { document: "test document" },
      uuid: "test-uuid",
    };

    (generateSummaryAndReport as jest.Mock).mockResolvedValue({
      summary: "Test summary",
      detailed_report: "Test detailed report",
    });

    const result = await processMessage(message);

    expect(generateSummaryAndReport).toHaveBeenCalledWith("test document");
    expect(result).toEqual({
      type: "summaryAndReport",
      data: {
        summary: "Test summary",
        detailed_report: "Test detailed report",
      },
      uuid: "test-uuid",
    });
  });

  it("should process automated marksheet generation message", async () => {
    const message = {
      type: "automatedMarksheet",
      data: {
        document: "test document",
        rubric: "test rubric",
        learningOutcomes: "test learning outcomes",
      },
      uuid: "test-uuid",
    };

    (generateAutomatedMarksheet as jest.Mock).mockResolvedValue({
      scores: { criterion1: 8, criterion2: 9 },
      feedback: { criterion1: "Good work", criterion2: "Excellent" },
      total_score: 17,
      overall_feedback: "Very good submission",
    });

    const result = await processMessage(message);

    expect(generateAutomatedMarksheet).toHaveBeenCalledWith(
      "test document",
      "test rubric",
      "test learning outcomes"
    );
    expect(result).toEqual({
      type: "automatedMarksheet",
      data: {
        scores: { criterion1: 8, criterion2: 9 },
        feedback: { criterion1: "Good work", criterion2: "Excellent" },
        total_score: 17,
        overall_feedback: "Very good submission",
      },
      uuid: "test-uuid",
    });
  });

  it("should process prompt optimization message", async () => {
    const message = {
      type: "optimizePrompt",
      data: {
        originalPrompt: "test prompt",
        configParams: { param1: "value1" },
      },
      uuid: "test-uuid",
    };

    (optimizePromptAndConfig as jest.Mock).mockResolvedValue({
      optimized_prompt: "Optimized test prompt",
      configuration_params: { param1: "new_value1", param2: "value2" },
    });

    const result = await processMessage(message);

    expect(optimizePromptAndConfig).toHaveBeenCalledWith("test prompt", {
      param1: "value1",
    });
    expect(result).toEqual({
      type: "optimizePrompt",
      data: {
        optimized_prompt: "Optimized test prompt",
        configuration_params: { param1: "new_value1", param2: "value2" },
      },
      uuid: "test-uuid",
    });
  });

  it("should process rubric creation message", async () => {
    const message = {
      type: "createRubric",
      data: {
        assessmentTask: "test task",
        criteria: ["criterion1", "criterion2"],
        keywords: ["keyword1", "keyword2"],
        learningObjectives: ["objective1", "objective2"],
        existingGuide: "test guide",
      },
      uuid: "test-uuid",
    };

    (createRubric as jest.Mock).mockResolvedValue({
      criteria: [
        {
          name: "criterion1",
          descriptors: {
            F: "Fail description",
            P: "Pass description",
            C: "Credit description",
            D: "Distinction description",
            HD: "High Distinction description",
          },
        },
      ],
    });

    const result = await processMessage(message);

    expect(createRubric).toHaveBeenCalledWith(
      "test task",
      ["criterion1", "criterion2"],
      ["keyword1", "keyword2"],
      ["objective1", "objective2"],
      "test guide"
    );
    expect(result).toEqual({
      type: "createRubric",
      data: {
        criteria: [
          {
            name: "criterion1",
            descriptors: {
              F: "Fail description",
              P: "Pass description",
              C: "Credit description",
              D: "Distinction description",
              HD: "High Distinction description",
            },
          },
        ],
      },
      uuid: "test-uuid",
    });
  });
});
