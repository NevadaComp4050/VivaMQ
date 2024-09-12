# Week 0
Unit guide not released for this session
Not sure how to best prepared for these classes
Discussions with 4060 students but little insight gained

# Week 1
Explanation about the project conveyed by Ansgar

I have nominated AI as first preference, Frontend as second and Backend as third. This was by recommendation by Deb.
I think this project could be done in a weekend with some requisite knowledge


# Week 2
Use the format for all logs: **What** **When** **Who** 

**What**
Met the Nevada team today, very general project discussions occurred.
Project management structure designated
Please discuss also project management issues, such as who will be
the product owner, and who will fill other roles. Agree on how you
want to stay in contact when you want to work where, and on what
platform you want to collaborate. You should create a Team GitHub
repository, by following the link on iLearn. You can, however, decide
to use other tools, as long as it is documented in the GitHub repo.
**When**
**Who**
Project team name - Nevada
## Frontend - Burrito
    Debash (PL), Josh, Quoc, Kazi
## Backend - Boulder
    Ryan, Ben, Adrian, Ivan
## AI - Bandana
    Eli, Zarin, Rahik, Aaron

# Week 3/4 (Sprint 0) - Research phase
Resource allocations and documentation changes occurred during this sprint through AI Channel on [[discord](https://discord.com/channels/1268791198370234379/1268791413328318546)]
Notably:
    - Task allocation -> moved to GitHub Projects [https://github.com/orgs/NevadaComp4050/projects/2]
    - Resource collection points -> 
        - Official/In development documentation (in markdown) GitHub/AI [https://github.com/NevadaComp4050/VivaMQ/tree/main/AI]
        - Unrefined/dump site google drive [https://drive.google.com/drive/folders/1smZQxVk9Okn5IibhHAR_vPzWciA2TK7G?usp=drive_link]
    - Sprints are now also organised on GitHub Projects

The client has asked for additional use cases:
1. Vivas (already agreed upon - sprints assigned)
Viva sessions are becoming a common part of assessments based on written submissions. To make those worthwhile requires a lot of preparation by the examiner as the questions are best to be tailored to each submission. An AI tool could be used to process the submissions and generate a bank of questions. A tool has been developed to do that [1], but it does not have a user-friendly interface.

2. Quality of writing (project level discussions - not on backlog)
An AI tool, could also be used to assess the quality of the written document in aspects such as: structure appropriate to the type of document, appropriate set of vocabulary, grammar and spelling. For example: a thesis is expected to have A title page, Introduction, TOC, chapters, reference list, in-text citations, register, style level, etc.

3. Rubric Generator (project level discussions - not on backlog)
Both holistic and specific rubrics, linked to Unit Guides. 
    - Holistic rubric, aligns with the learning outcomes specified in the unit guide
    - Specific rubric, built ground up to fit specific assessment and learning outcomes of assessment

Additionally there should be permanence and traceability for all prompts response outputs for testing, error analysis and future diagnostics.

# Summary - Sprint 0
What team did?
Summarised individual milestones and accomplishments for first sprint. Presented across all three groups.
Group log finalised and sumbitted for review.
GitHub projects and Sprints setup
Resource and task assignments updated

How team did?
Sufficient details were obtained for the first sprint
With the lack of structure and review process it is hard to gauge the depth and quality of work for the team.


## Planning and estimation. 
Soliciting and determining:
    - client input
        - client increased scope (as above)
        - no adjustments to sprint 1 for MVP
        - additional backlog items added
    - new features/fixes
        - no programming changes, sprint 0 research stage
    - functionality 
        - Structured outputs research conducted.
    - milestones achieved in project period

## Software development 
No GitHub issues so far. Each team member expressed some familiarity with GitHub repo management. 
Testing of OpenAI API conducted by each member, for Python or NodeJS implementation.
NodeJS is the preferred choice by the majority

## Review
Opportunity: Identified a need to formalise the review process for future sprints to ensure depth and quality.
             Workflow, processes and communication could be improved for clarity and conciseness
Achievement: Successful in determining the AI provider and being able to use the API to communicate with.
             Presenting findings to all project teams
             Identifying speed bumps in workflow
      
## Team functioning 
    Aspects that worked well?
All team members performed as expected and achieved by the end of the sprint.

    Aspects that could be improved?
Initial assignments made it difficult to determine task, expectation and communication structure and processes.
    Are you satisfied with your contribution? 
Everyone met the objectives for the first AI sprint, some aspects can be addressed above to streamline future sprints.

# Week 5/6 (Sprint 1)
GitHub Project Management Utilised, tasks assigned to all members

Question for BE:
- how will pipeline work for submissions? (parse database ID? raw txt file? )
- calling the function what would you like returned?
- we give you a set of functions you can call -> blackbox -> response
- how to handle errors?
- to think about automarker/rubric:
    - Input/output data?
    

Questions for AI:
- what do we think about generating >5 (maybe 20) questions for the user to select from? saves the regeneration of questions step/time/cost/flexibility for assessors
- 

Questions for FE:
- nothing you guys look dope
- ohh actually... how you look so dope

Sunday 25/08
Have completed a the RabbitMQ implementation for single prompts. `singlePDFStaticPrompt.js`
- using a UUID
Have completed a implementation of PDF -> text then upload to OpenAI. `singlePromptNoPDF.js`
Initial documentation for `Development and Usage guide.md`
- Step by Step to setup and run both ends of RabbitMQ
- 
Created `serviceSimulator.js` to mock BE queries throught RabbitMQ

*** need to be more consistent with logs ***
Wednesday 28/08
cleaned up src folder
- moved items to deprecated
- consolidated documentation
- updated team log

Saturday 

# Week 7/8 (Sprint 2)

# Week 9/10 (Sprint 3)

# Week 11/12 (Sprint 4)

# Week 13 (Project review)