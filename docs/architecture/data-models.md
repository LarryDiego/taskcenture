# Data Models

## User
*   **Purpose:** Represents a user of the application.
*   **TypeScript Interface:**
    ```typescript
    interface User {
      id: string;
      username: string;

      email: string;
      role: 'ADMINISTRATOR' | 'MANAGER' | 'COLLABORATOR';
    }
    ```

## Project
*   **Purpose:** Represents a project that contains tasks.
*   **TypeScript Interface:**
    ```typescript
    interface Project {
      id: string;
      name: string;
      description: string;
      tasks: Task[];
    }
    ```

## Task
*   **Purpose:** Represents a single task within a project.
*   **TypeScript Interface:**
    ```typescript
    interface Task {
      id: string;
      title: string;
      description: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
      status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
      dueDate: string;
      assignee?: User;
    }
    ```
