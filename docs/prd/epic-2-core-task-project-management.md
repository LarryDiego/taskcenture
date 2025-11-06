# Epic 2: Core Task & Project Management
**Goal:** To enable users to create, manage, and track tasks and group them into projects, with a high-level overview on the dashboard.

## Story 2.1: Project CRUD
**As a** manager,
**I want** to create, read, update, and delete projects,
**so that** I can organize tasks into different initiatives.
### Acceptance Criteria
1.  An authenticated user with the "Manager" role can create a new project with a name and description.
2.  Users can view a list of all projects they are a member of.
3.  A project's name and description can be updated.
4.  A project can be deleted (and its tasks archived or deleted).

## Story 2.2: Task CRUD
**As a** user,
**I want** to create, read, update, and delete tasks within a project,
**so that** I can manage my work.
### Acceptance Criteria
1.  A user can create a task with a title, description, priority, and due date.
2.  A user can view the details of a single task.
3.  A user can update any attribute of a task.
4.  A user can delete a task.

## Story 2.3: Dashboard
**As a** user,
**I want** to see a dashboard with a summary of my projects,
**so that** I can quickly understand the overall progress.
### Acceptance Criteria
1.  The dashboard displays a list of projects.
2.  For each project, a completion percentage is shown (based on the number of "Done" tasks).
3.  The dashboard includes summary charts of project progress.
