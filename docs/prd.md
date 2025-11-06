# taskFlow Product Requirements Document (PRD)

## Goals and Background Context

### Goals
*   Deliver a stable MVP with essential task management features.
*   Demonstrate how BMAD agents can reduce planning and QA time.
*   Achieve positive user feedback in internal usability tests.
*   MVP usability by small teams in real workflows.
*   High engagement: daily and weekly active users (DAU/WAU).
*   Positive user feedback via satisfaction surveys (CSAT).
*   High task completion rate within the app.

### Background Context
taskFlow is a web-based collaborative task management application designed for individuals and small teams seeking a clean, visual, and efficient productivity tool. Most task management tools are overloaded with unnecessary features, creating complexity and frustration for users who just want to stay organized. Freelancers and small teams often face steep learning curves, cluttered interfaces, and wasted time managing the tool instead of completing actual tasks. taskFlow addresses this by providing a minimalist yet powerful experience centered on usability and focus.

### Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-11-04 | 1.0 | Initial draft based on Project Brief | BMad PM Agent |

## Requirements

### Functional
1.  FR1: Users shall be able to sign-up, login, and logout using a JWT-based authentication system.
2.  FR2: The system shall support password recovery via email.
3.  FR3: The system shall have three user roles: Administrator, Manager, and Collaborator.
4.  FR4: Users shall be able to perform CRUD (Create, Read, Update, Delete) operations for tasks.
5.  FR5: Tasks shall have the following attributes: title, description, assignee, priority, due date, and status.
6.  FR6: The system shall maintain a history log for changes made to a task.
7.  FR7: Users shall be able to filter tasks by project, assignee, and status.
8.  FR8: Users shall be able to create and manage projects to group tasks.
9.  FR9: The dashboard shall display the completion percentage for each project.
10. FR10: The application shall feature a Kanban board with "To Do", "In Progress", and "Done" columns.
11. FR11: Users shall be able to drag and drop tasks between columns on the Kanban board.
12. FR12: Users shall be able to add comments to tasks.
13. FR13: The system shall send basic notifications when a task is assigned or updated.
14. FR14: Users shall be able to export project or user-based reports in CSV and PDF formats.
15. FR15: The dashboard shall display summary charts of project progress.
16. FR16: Administrators shall be able to manage users, roles, and permissions.

### Non Functional
1.  NFR1: The backend shall be developed using Java with Spring Boot.
2.  NFR2: The frontend shall be developed using React.js.
3.  NFR3: The database shall be MySQL.
4.  NFR4: Authentication shall use JSON Web Tokens (JWT).
5.  NFR5: Passwords shall be hashed using BCrypt.
6.  NFR6: All communication shall be encrypted using HTTPS (TLS).
7.  NFR7: The system shall implement Role-Based Access Control (RBAC).
8.  NFR8: The system shall have input validation to protect against SQL injection and XSS attacks.
9.  NFR9: Backend unit and integration tests shall be written using JUnit.
10. NFR10: The initial architecture will be a monolith.

## User Interface Design Goals

### Overall UX Vision
A modern, responsive web application with a Kanban-style task board and list view that support intuitive task management. The interface should be clean, visual, and efficient, providing a minimalist yet powerful experience centered on usability and focus.

### Key Interaction Paradigms
*   Drag-and-drop for task management on the Kanban board.
*   Single-page application (SPA) experience for seamless navigation.

### Core Screens and Views
*   Login/Sign-up Screen
*   Main Dashboard with project summaries
*   Project-specific Kanban Board
*   Task Detail View with comments and history
*   Admin Panel for User Management

### Accessibility: None
*   (Assumption) Accessibility features are not in scope for the MVP but should be considered for future versions.

### Branding
*   (Assumption) No specific branding guidelines provided. The UI should be clean, modern, and professional.

### Target Device and Platforms: Web Responsive
*   The application should be responsive and work on modern web browsers on desktop and mobile devices.

## Technical Assumptions

### Repository Structure: Monorepo
*   (Assumption) A monorepo will be used to simplify development and deployment for the MVP.

### Service Architecture
*   Initial monolithic architecture for MVP.

### Testing Requirements
*   JUnit for backend unit and integration tests.

### Additional Technical Assumptions and Requests
*   **Frontend:** React.js
*   **Backend:** Java with Spring Boot (RESTful API)
*   **Database:** MySQL
*   **Authentication:** JSON Web Tokens (JWT)

## Epic List
1.  **Epic 1: Foundation & User Management:** Establish project setup, authentication, and basic user management.
2.  **Epic 2: Core Task & Project Management:** Implement CRUD operations for tasks and projects, and create the main dashboard.
3.  **Epic 3: Interactive Kanban Board & Collaboration:** Implement the drag-and-drop Kanban board and commenting features.
4.  **Epic 4: Reporting & Administration:** Develop report generation and the admin panel for user management.

## Epic 1: Foundation & User Management
**Goal:** To set up the initial project structure, implement a secure authentication system with user roles, and provide a basic user management interface for administrators.

### Story 1.1: Project Setup
**As a** developer,
**I want** to set up the initial monorepo with separate packages for the frontend (React) and backend (Spring Boot),
**so that** we have a clean and organized codebase from the start.
#### Acceptance Criteria
1.  A Git repository is created.
2.  The repository contains a `frontend` directory with a new React application.
3.  The repository contains a `backend` directory with a new Spring Boot application.
4.  A root `package.json` or build script can run both applications.

### Story 1.2: User Authentication
**As a** user,
**I want** to be able to sign up and log in to the application,
**so that** I can access my tasks and projects.
#### Acceptance Criteria
1.  A user can register with a username, email, and password.
2.  A user can log in with their email and password.
3.  The system returns a JWT upon successful login.
4.  The backend protects endpoints, requiring a valid JWT for access.

### Story 1.3: User Roles
**As a** system,
**I want** to assign roles to users (Administrator, Manager, Collaborator),
**so that** I can control access to different features.
#### Acceptance Criteria
1.  The `User` model includes a `role` attribute.
2.  The default role on sign-up is "Collaborator".
3.  Backend services check user roles before performing actions.

## Epic 2: Core Task & Project Management
**Goal:** To enable users to create, manage, and track tasks and group them into projects, with a high-level overview on the dashboard.

### Story 2.1: Project CRUD
**As a** manager,
**I want** to create, read, update, and delete projects,
**so that** I can organize tasks into different initiatives.
#### Acceptance Criteria
1.  An authenticated user with the "Manager" role can create a new project with a name and description.
2.  Users can view a list of all projects they are a member of.
3.  A project's name and description can be updated.
4.  A project can be deleted (and its tasks archived or deleted).

### Story 2.2: Task CRUD
**As a** user,
**I want** to create, read, update, and delete tasks within a project,
**so that** I can manage my work.
#### Acceptance Criteria
1.  A user can create a task with a title, description, priority, and due date.
2.  A user can view the details of a single task.
3.  A user can update any attribute of a task.
4.  A user can delete a task.

### Story 2.3: Dashboard
**As a** user,
**I want** to see a dashboard with a summary of my projects,
**so that** I can quickly understand the overall progress.
#### Acceptance Criteria
1.  The dashboard displays a list of projects.
2.  For each project, a completion percentage is shown (based on the number of "Done" tasks).
3.  The dashboard includes summary charts of project progress.

## Epic 3: Interactive Kanban Board & Collaboration
**Goal:** To provide a visual way to manage tasks using a Kanban board and to enable basic team collaboration through comments.

### Story 3.1: Kanban Board View
**As a** user,
**I want** to view my tasks on a Kanban board,
**so that** I can visualize my workflow.
#### Acceptance Criteria
1.  A Kanban board is displayed for each project.
2.  The board has three columns: "To Do", "In Progress", and "Done".
3.  Tasks are displayed as cards in the appropriate column based on their status.

### Story 3.2: Drag-and-Drop Tasks
**As a** user,
**I want** to drag and drop tasks between columns on the Kanban board,
**so that** I can easily update their status.
#### Acceptance Criteria
1.  A task card can be dragged from one column to another.
2.  Dropping a task in a new column updates the task's status in the backend.
3.  The UI updates to reflect the new task status.

### Story 3.3: Task Comments
**As a** user,
**I want** to add comments to a task,
**so that** I can collaborate with my team.
#### Acceptance Criteria
1.  A user can add a text comment to a task.
2.  All comments for a task are displayed in chronological order.
3.  The system sends a notification to the task assignee when a new comment is added.

## Epic 4: Reporting & Administration
**Goal:** To allow users to export project data for reporting purposes and to provide administrators with the tools to manage users and roles.

### Story 4.1: Export Reports
**As a** manager,
**I want** to export a report of tasks for a project,
**so that** I can analyze progress and share it with stakeholders.
#### Acceptance Criteria
1.  A user can export a list of tasks for a given project.
2.  The export format can be either CSV or PDF.
3.  The report includes task title, description, assignee, priority, due date, and status.

### Story 4.2: Admin User Management
**As a** an administrator,
**I want** to manage users and their roles,
**so that** I can control access to the system.
#### Acceptance Criteria
1.  An admin can view a list of all users.
2.  An admin can change the role of any user.
3.  An admin can deactivate or delete a user.

## Next Steps

### UX Expert Prompt
"Please review this PRD and the associated Project Brief. Create a `front-end-spec.md` that outlines the UI/UX for the taskFlow application. Focus on the core screens and user flows defined in the epics, and provide wireframes or mockups for the Login, Dashboard, Kanban, and Task Detail pages."

### Architect Prompt
"Please review this PRD and the associated Project Brief. Create an `architecture.md` document that details the technical architecture for the taskFlow application. The document should cover the monolithic structure, the REST API design, the database schema for MySQL, and the integration of JWT for security, based on the requirements and technical assumptions outlined."
