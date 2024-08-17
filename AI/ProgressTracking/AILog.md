# Week 2 - Meet and Greet
Welcome team!
The **Bandana** team is responsible for the AI component of the project.

Introductions
Aaron - Team Lead, interested in full stack integration and PM
Eli   - Technical Lead, intersted in "all of it"
Rahik - Developer, interested in practical uses of AI and PM
Zarin - Developer, interested in prompt engineering and PM
*** Each team member has pledged a 5hr a week commitment to thr project ***

Initial analysis and conversations with project lead (**Deb**) has indicated that we need to do some research on the AI technologies addressing their:
    - input types
    - limitations
    - cost
    - documentation
    - API available

Each member has been tasked with an investigating an AI provider with the above criteria:
- Eli - OpenAI
- Zarin - Gemini 
- Rahik - Anthropic
- Aaron - literature research and best practices of how Viva Voce are conducted currently

All Members in attendance for Friday project meeting

# Week 3
A summary of the research from each team member over the last week

| AI Service   | Cost | API  | Limitations |  
|--------|-----|---------------| ---------- |
| OpenAI  | $3/mil tokens (input),  $15/mil tokens (output) | HTTP requests, Python bindings, nodejs library | Text only, Send max 10 files as URLs |
| Anthropic | $3/mil tokens (input), $15/mil tokens (output) | JSON | 300,000 Tokens per day (TPD) and 5 Requests per minute |
| Gemini | $7/mil tokens (input), $21/mil tokens (output), >128k prompts |  Python, Node.js | Does not accept PDFs or DOCx files |

In conversations with the project manager the decision was unanimous to use OpenAI.

This weeks task for everyone in Bandana was to setup the a program to interact with the OpenAI API with both NodeJS and Python on our side.
[OpenAI quickstart][https://platform.openai.com/docs/quickstart?context=node. ]
Tasked to interact with the API inputs and outputs, and have a recommendation and reasons for preference?

Additionally have a read of [OpenAI Structured Queries][https://openai.com/index/introducing-structured-outputs-in-the-api/] and think about possible structure for the output

Rahik, Aaron in attendance for Friday project meeting, Zarin was available online

# Week 4
Bandanas coding component  - AI Module
The purpose of the module is to:
1) request files from backend
2) convert to format to make API request
3) make requests through the API to OpenAI
4) handle the responses 
5) give this to the backend

We also have to: (I need to clear up what this means exactly)
validation of GPT outputs
regeneration feature for submissions and individual questions
create a reproducible pipe line of information(input assignment spec -> output viva questions)
indicate how the information will be available for BE (dataflow with prisma or with some BE interface)
figure out how to best create the pipeline for ease of integration

*** Need a high level overview of the dataflow of all components of the system ***

Discussions this week with BE include:
    - what format will student data be in for the AI module
    - 
Questions for Carl:
    - 

Acceptance Criteria for AI component
1. Vivas
Viva sessions are becoming a common part of assessments based on written submissions. To make those worthwhile requires a lot of preparation by the examiner as the questions are best to be tailored to each submission. An AI tool could be used to process the submissions and generate a bank of questions. A tool has been developed to do that [1], but it does not have a user-friendly interface.

2. Quality of writing
An AI tool, could also be used to assess the quality of the written document in aspects such as: structure appropriate to the type of document, appropriate set of vocabulary, grammar and spelling. For example: a thesis is expected to have A title page, Introduction, TOC, chapters, reference list, in-text citations, register, style level, etc.

Items to address
• The Project Pitch
• Key User Stories (with MoSCoW prioritisation)
• The Proposed Architecture
• Roles and Responsibilities

Module development
- API w/ OpenAI
- Documentation
- Testing
- Integration w/ BE

18/8 - All members assigned tasks on GitHub Project

