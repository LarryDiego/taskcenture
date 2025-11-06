# Epic 3: Interactive Kanban Board & Collaboration
**Goal:** To provide a visual way to manage tasks using a Kanban board and to enable basic team collaboration through comments.

## Story 3.1: Kanban Board View
**As a** user,
**I want** to view my tasks on a Kanban board,
**so that** I can visualize my workflow.
### Acceptance Criteria
1.  A Kanban board is displayed for each project.
2.  The board has three columns: "To Do", "In Progress", and "Done".
3.  Tasks are displayed as cards in the appropriate column based on their status.

## Story 3.2: Drag-and-Drop Tasks
**As a** user,
**I want** to drag and drop tasks between columns on the Kanban board,
**so that** I can easily update their status.
### Acceptance Criteria
1.  A task card can be dragged from one column to another.
2.  Dropping a task in a new column updates the task's status in the backend.
3.  The UI updates to reflect the new task status.

## Story 3.3: Task Comments
**As a** user,
**I want** to add comments to a task,
**so that** I can collaborate with my team.
### Acceptance Criteria
1.  A user can add a text comment to a task.
2.  All comments for a task are displayed in chronological order.
3.  The system sends a notification to the task assignee when a new comment is added.
