# Requirements

## Functional
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

## Non Functional
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
