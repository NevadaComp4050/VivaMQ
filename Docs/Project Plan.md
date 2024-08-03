# Project Plan and Progress Documentation

## Current Progress (Week 2)
- **GitHub**: Repo with boilerplate set up, Dockerisation for frontend, backend, and database via Docker Compose.
- **Design Document**: Joshua Hoberman and Kazi working on the design document for approval in Week 3.
- **Backend Team (Boulder)**: Reviewing repo and documentation to understand the stack.
- **AI Team**: Researching constraints and selecting an AI provider (OpenAI, Anthropic, or Google).
- **Front End Team**: Quoc and Debashish investigating necessary screens.

## Adjusted Project Plan and Sub-Sprints

### Week 3: Design Document and Foundational Knowledge Base (Sprint 0)
**Topic**: Continue setting up foundational knowledge base  
**Activities**:
- Joshua Hoberman and Kazi seek approval for the design document.
- Backend team continues repository review and documentation.
- AI team finalises the API provider choice.
- Front end team outlines preliminary screens.

**Deliverables**:
- Approved design document
- Final AI provider choice

### Week 4: Sprint Review and Planning (Client Check-In) (Sprint 0)
**Topic**: Sprint review, retrospective, sprint planning  
**Activities**:
- Review project progress with the client and plan the next sprint.

**Deliverables**:
- Proposal
- Personal log
- Peer feedback

### Sprint 1 (Weeks 5-7)

#### Week 5: Backend and Frontend Setup
**Topic**: CI/CD and DevOps  
**Activities**:
- Backend: Set up Express.js with TypeScript and Prisma.
- Frontend: Set up Next.js and Shadcn UI.
- Refine and finalize CI/CD pipelines.
- Implement basic user authentication and dark mode.

**Deliverable**:
- Working backend and frontend skeletons with authentication and dark mode.

#### Week 6: Integration and Initial Feature Development
**Topic**: Working in teams  
**Activities**:
- Integrate backend with frontend.
- Implement zip file upload functionality on the frontend.
- Continue development on question generation algorithm with selected AI provider.

**Deliverable**:
- Integrated system with file upload.

#### Week 7: Sprint Review and Planning (Client Check-In)
**Topic**: Sprint review, retrospective, sprint planning  
**Activities**:
- Review functionalities with the client and gather feedback.
- Plan for further features based on feedback.

**Deliverables**:
- Personal log
- Peer feedback
- Updated sprint plan

### Mid-Session Break

### Week 8: Mid-Session Presentation
**Topic**: Mid-session presentation to the client  
**Activities**:
- Prepare and present the mid-session progress to stakeholders.

**Deliverables**:
- Presentation slides

### Sprint 2 (Weeks 9-11)

#### Week 9: User Mapping and Question Generation
**Topic**: Implement file upload, user mapping, and question generation  
**Activities**:
- Implement manual file-to-student mapping.
- Finalize and implement question generation logic.
- Allow locking and regenerating questions.

**Deliverable**:
- Functional file upload, mapping, and question generation features.

#### Week 10: Export and Temp Accounts Features
**Topic**: Backend services and security implementation  
**Activities**:
- Implement export feature (Excel, text, or CSV).
- Complete temp accounts for tutors with read-only access.
- Ensure output files are read-only and can be manually edited.

**Deliverable**:
- Fully functional export features and temp accounts.

#### Week 11: Sprint Review and Planning (Client Check-In)
**Topic**: Sprint review, retrospective, sprint planning  
**Activities**:
- Review functionalities with the client and gather feedback.
- Plan for the final sprint based on feedback.

**Deliverables**:
- Personal log
- Peer feedback
- Updated sprint plan

### Sprint 3 (Weeks 12-13)

#### Week 12: Final Adjustments and Review
**Topic**: Review and finalize all features  
**Activities**:
- Conduct thorough testing of the system.
- Make final adjustments and bug fixes.
- Ensure compliance with MQ systems, data handling policies, and procedures.

**Deliverable**:
- Stable and fully functional system ready for deployment.

#### Week 13: Final Presentation and Handover
**Topic**: Presentation and handover to the client  
**Activities**:
- Prepare and present the final project to stakeholders.
- Handover of technology and complete documentation to the product owner.

**Deliverables**:
- Presentation slides
- Reflection log
- User and developer documentation

## High-Level Design Elements

### Backend (Express.js, TypeScript, Prisma)
- RESTful API design for managing uploads, question generation, and exports.
- Database schema design with Prisma and MySQL.

### Frontend (Next.js, Shadcn UI)
- User Authentication (including temp tutor accounts).
- File upload and mapping interface.
- Question generation and regeneration interface.
- Export functionalities (Excel, text, CSV).
- Dark mode toggle.

### CI/CD and Deployment
- Automated tests and deployment setups (GitHub Actions, Docker).
- Ensure system is scalable for different screen sizes (27" to 13").

### Documentation & Handover
- Detailed user and developer documentation.
- Technology and installation handover to the product owner.