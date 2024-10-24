// src/types/message.ts

export interface Message {
  type: string;
  data: any;
  uuid: string;
}

export interface CreateRubricMessage extends Message {
  type: 'createRubric';
  data: {
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
