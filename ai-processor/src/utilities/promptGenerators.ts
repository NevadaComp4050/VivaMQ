export const generateAutomatedMarkingSheetPrompt = (
  document: string,
  rubric: string,
  learningOutcomes: string
) => `
  Generate an automated marksheet for the following document based on the provided rubric and learning outcomes:
  
  Document:
  ${document}
  
  Rubric:
  ${rubric}
  
  Learning Outcomes:
  ${learningOutcomes}
  
  Provide scores and feedback for each criterion in the rubric, a total score, and overall feedback.
  `;

export const generateSingleQuestionVivaPrompt = (
  document: string,
  customPrompt: string | null
) => `
You are an experienced professor tasked with generating viva questions based on a student's document. Your goal is to assess the student's understanding of the material, their ability to discuss the concepts, and their capacity to expand on the ideas presented. Your task is to generate five viva questions that will effectively evaluate the student's knowledge and critical thinking skills. These questions should:

1. Test the student's familiarity with the written text
2. Assess their ability to discuss the concepts in depth
3. Challenge them to expand on the ideas presented 

When formulating your questions, consider the following criteria:
- Relevance: Ensure questions directly relate to key concepts in the document
- Coverage: Address all significant topics discussed
- Depth: Require thorough understanding rather than surface-level knowledge
- Clarity: Prompt clear and concise articulation of ideas
- Open-ended nature: Encourage detailed explanations
- Analytical thinking: Require analysis, comparison, or critique of concepts
- Creativity: Push students to apply concepts to new scenarios or generate new ideas

Examples of good questions:
1. "How does [concept from the document] relate to [another concept]? Can you provide an example of their interaction in a real-world scenario?"
2. "What are the potential limitations or criticisms of [theory/method discussed in the document]? How would you address these concerns?"
3. "If you were to extend the research presented in this document, what additional areas or aspects would you explore, and why?" 

${customPrompt ? `Additional instructions: ${customPrompt}\n\n` : ""}

As you generate the questions, increase their technicality and complexity. The first question should be relatively straightforward, while the final question should challenge the student to think critically and creatively about the material. Generate exactly five questions based on the document provided, adhering to the criteria and format specified above.

Document:
${document}
`;

export const generateRubricPrompt = (
  assessmentTask: string,
  criteria: string[],
  keywords: string[],
  learningObjectives: string[],
  existingGuide: string
) => `
  Create a rubric based on the following information:
  
  Assessment Task: ${assessmentTask}
  Criteria: ${criteria.join(", ")}
  Keywords/Competencies/Skills: ${keywords.join(", ")}
  Learning Objectives: ${learningObjectives.join(", ")}
  Existing Marking Guide: ${existingGuide}
  
  Generate a rubric with MQ's Grade Descriptors (F, P, C, D, HD) for each criterion.
  `;


export const generateDocumentSummaryPrompt = (document: string) => `
Summarize the following document and generate a detailed report:

Document:
${document}

Provide a concise summary followed by a detailed report on the submission.
`;

export const generateAssessmentQualityPrompt = (
  document: string,
  criteria: string
) => `
Assess the quality of the following document based on these criteria: ${criteria}

Document:
${document}

Provide a detailed assessment of the document's quality, including structure, grammar, spelling, and vocabulary usage. Also, provide recommendations for improvement.
`;

export const generateOptimizedPromptSuggestionPrompt = (
    originalPrompt: string,
    configParams: Record<string, unknown>
  ) => `
  Optimize the following prompt and suggest configuration parameters for AI tools:
  
  Original Prompt:
  ${originalPrompt}
  
  Configuration Parameters:
  ${JSON.stringify(configParams, null, 2)}
  
  Provide an optimized version of the prompt and suggest any changes to the configuration parameters.
  `;
  