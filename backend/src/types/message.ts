export interface Message {
  type: string;
  data: any;
  uuid: string;
  requestType: string | null;
}

export interface CreateRubricMessage extends Message {
  type: 'createRubric';
  data: {
    id: string;
    title: string;
    createdById: string;
    assignmentId: string;
    assessmentTask: string;
    criteria: string[];
    keywords: string[];
    learningObjectives: string[];
    existingGuide: string;
  };
}

export interface CreateRubricResponse extends Message {
  type: 'createRubric';
  data: any; // Define more specific type based on Rubric structure
}
export interface CreateVivaQuestionsMessage extends Message {
  type: 'vivaQuestions';
  data: {
    submission: string;
    customPrompt: string | null;
  };
}

export interface CreateVivaQuestionsResponse extends Message {
  type: 'vivaQuestions';
  data: any;
}
