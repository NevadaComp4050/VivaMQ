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

# Week 5

Standup to discuss current project status conducted. 
Module development
- API w/ OpenAI
- Documentation
- Testing
- Integration w/ BE

Sprint review progress

18/8 - All members assigned tasks on GitHub Project


# Week 6

Standup to discuss current project status conducted. 
Feedback received from presentation:
- presentation too casual
- Introduction -> too wordy on the slides make it more catchy , (look at esapnol) 
- User does not care about roles and responsibilities
- user stories: choose 5 epics not 10 user stories 
- subsystrm diagram is good 
- prelminary ER model, losing everybody too small cant read 
- prelimary infrastucture is good (maybe make it layered) 
- API page is good
*** -- AI is good ***

Weekly tasks reviewed
- Rahik still working on batch processing
- Eli assigned code review and documentation
- Zarin Second week of prompt testing
- Aaron fixing openAI implementation and documentation, update logs and clean documentation

Status update:
- Rahik having trouble loading batch processing
- Formal review of testing still required
- Code review and documentation ongoing
- Implementation requires input sanitisation
- Documentation can be improved by removing 'bloating'

All tasks assigned on GitHub Projects

## 01/09 - Monday task and deadline pivot:
MVP target date updated, role pivot required. All memebers of group acknowledged assigned tasks
Discord message to the group
``` bash
The new implementation has a one podantic type dependency that I have listed in the usage doc but am happy to do a zoom call to run anyone through.

With MVP deadline coming up we are going to shift the workload slightly. 
@zarin were going to need some more structured and deeper analysis for testing suite. There are maybe 10 PDFs on google drive and need a variety of prompts to get a more comprehensive testing round in preliminaryTesting.md. We need three prompts per PDF and an analysis of the outputs utilizing testingCriteria.md framework by Wednesday. 

@Eliiiii we need some unit tests for MVP to test the limitations of the system. Aim for 10-15 test cases (functionality, error handling and async) and documentation (dependencies and how to run the tests) for this by Wednesday also (https://jestjs.io/). 

@rahik I need you to push your work into the ./ai-processor/srcDevelopment and update documentation(specifically dependencies and how to run), by latest tmr night. 

Please react 👌 when you have read and if you have any questions let me know 🙂 
```

# Week 7
Standup to discuss current project status conducted. 
Weekly tasks reviewed
- Rahik completed batch processing and draft documentation
- Eli testing implementation
- Zarin prompt testing 
- Aaron openAI implementation and documentation, update logs

Status update:
- Rahik having trouble loading batch processing
- Formal review of testing still required
- Code review and documentation ongoing
- Implementation requires input sanitisation
- Documentation can be improved by removing 'bloating'



Issues with sprint
- Zarin - more than 5 questions, time limit on responses, computer problems,
- Rahik - billing hard limit, batch limit reached, input file path problem
- Eli - integrating JEST, 
- Aaron - 

Next weeks tasks assigned
- Eli/Zarin - JEST Testing: 
    - functionality, error handling and performance (around 12ish tests) + 
    - documentation: general overview, how to set it up and how to run it
- Rahik - slides created and draft ready by Monday with the criteria from Kates notes on iLearn
- Aaron - need to make deployable

Successful Integration with BE
TBA 

All tasks updated on GitHub Projects

Embeddings
~~~ js
mvp process
user gets on application
application allows user to CRUD a unit
application allows user to CRUD an assignment
application allows user to upload a single document at a time for processing
application shows user a list of questions generated from the document
~~~

## Mid week meeting 10/09
any mission critical issues raised from the tests
program functioning (a few additions/modifications)
client slides (rahik will have final version done tonight)
integration between teams (Wednesday MVP Jam)
address any repo restructure questions

Rate limit function created in openAIAPI.ts of 30,000 token per minute limit
Batch queue limit 90,000 tokens per minute 

### Eli and Zarin on testing regiment
#### Test 1) Test Message Rejection
Verify that message rejection works as expected:

Send a message to a queue.
Consume the message and reject it.
Ensure that the message is re-queued or moved to a dead-letter queue, if configured.

#### Test 2) Test Queue Deletion
Test whether queues can be deleted and re-created:

Assert that a queue exists.
Delete the queue.
Recreate the queue.
Verify that the queue can be re-created without issues.
#### Test 3) Test Different Queue Configurations
Test various queue configurations (e.g., durable vs. non-durable, exclusive queues):

Send and receive messages in queues with different configurations.
Verify that each configuration behaves as expected.
#### Test 4) + write tests on the token limits

Performance testing not worth doing as OpenAI is setting the limit

### future implementations
fix error handling and talk to BE about persistent storage
address any repo restructure questions
client slides (rahik will have final version done tonight)
integration between teams (Wednesday MVP Jam)
