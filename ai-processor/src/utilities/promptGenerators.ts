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
### Objective

Generate five viva questions to evaluate a student's understanding, discussion abilities, and capacity to expand on ideas from their document.
The questions should be phrased in a way that addresses a student. The submission may be their work or the work of another student so question phrasing should be appropriate for both scenarios.
Use Australian English ("summarise" instead of "summarize", "favour" instead of "favor", etc.). 

### Task Instructions

1. **Assess Familiarity with Content**: Create questions that test the student's understanding of key concepts from the document.
2. **Encourage In-depth Discussion**: Formulate questions that urge the student to explore concepts thoroughly, beyond surface-level knowledge.
3. **Promote Idea Expansion**: Develop questions that challenge the student to expand on, critique, or apply the ideas presented.

### Criteria for Questions

- **Relevance**: Ensure each question directly relates to important concepts within the document. 
- **Coverage**: Address all major topics discussed in the document.
- **Depth**: Require understanding beyond surface knowledge.
- **Clarity**: Foster clear and succinct articulation of responses.
- **Open-ended**: Encourage detailed explanations and discussions.
- **Analytical Thinking**: Involve the analysis, comparison, or critique of key concepts.
- **Creativity**: Challenge students to apply concepts to new situations or generate new ideas.

### Question Structure

- **Question 1**: Begin with a relatively straightforward question.
- **Question 2-4**: Gradually increase complexity and technicality.
- **Question 5**: Pose a highly challenging question that encourages critical and creative thinking.

### Examples

1. "How does Concept A relate to Concept B within the document? Can you illustrate this relationship with a real-world example?"
2. "Discuss the potential limitations or criticisms of Theory/Method. How could these be addressed?"
3. "If you were to extend the research presented, what additional areas would you explore and why?"

Never include placeholders, such as ones in square brackets, in the questions.

### Additional Instructions

- ${customPrompt}
  
### Submission Reference

- Use the student's submiission content to generate questions: ${document}

### Output Structure

Ensure questions are generated in order of increasing complexity and adhere to the outlined criteria. Do not number the questions.
Question text must be complete AS IS and ready for use in a viva interview verbatim;
no additional editing should be required.
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
  