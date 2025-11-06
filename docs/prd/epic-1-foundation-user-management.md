# Epic 1: Foundation & User Management
**Goal:** To set up the initial project structure, implement a secure authentication system with user roles, and provide a basic user management interface for administrators.

## Story 1.1: Project Setup
**As a** developer,
**I want** to set up the initial monorepo with separate packages for the frontend (React) and backend (Spring Boot),
**so that** we have a clean and organized codebase from the start.
### Acceptance Criteria
1.  A Git repository is created.
2.  The repository contains a `frontend` directory with a new React application.
3.  The repository contains a `backend` directory with a new Spring Boot application.
4.  A root `package.json` or build script can run both applications.

## Story 1.2: User Authentication
**As a** user,
**I want** to be able to sign up and log in to the application,
**so that** I can access my tasks and projects.
### Acceptance Criteria
1.  A user can register with a username, email, and password.
2.  A user can log in with their email and password.
3.  The system returns a JWT upon successful login.
4.  The backend protects endpoints, requiring a valid JWT for access.

## Story 1.3: User Roles
**As a** system,
**I want** to assign roles to users (Administrator, Manager, Collaborator),
**so that** I can control access to different features.
### Acceptance Criteria
1.  The `User` model includes a `role` attribute.
2.  The default role on sign-up is "Collaborator".
3.  Backend services check user roles before performing actions.
