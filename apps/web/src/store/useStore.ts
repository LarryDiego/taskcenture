import { create } from 'zustand';
import { authApi, commentsApi, projectsApi, tasksApi, usersApi } from '@/services/api';
import { toast } from 'sonner';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type UserRole = 'Administrator' | 'Manager' | 'Collaborator';

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export interface HistoryEntry {
  id: string;
  action: string;
  author: string;
  timestamp: Date;
  changes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeId?: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  comments: Comment[];
  history: HistoryEntry[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  id: number;
}

interface AppState {
  user: User | null;
  projects: Project[];
  selectedProject: Project | null;
  selectedTask: Task | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectProject: (projectId: string) => void;
  selectTask: (taskId: string | null) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addComment: (taskId: string, comment: string) => void;
  createProject: (name: string, description: string, teamMemberIds?: number[]) => void;
  updateProject: (projectId: string, name: string, description: string) => void;
  deleteProject: (projectId: string) => void;
  createTask: (
    projectId: string,
    title: string,
    description: string,
    assigneeId: string | null,
    priority: TaskPriority,
    dueDate: string
  ) => Promise<void>;
}

// Helper function to enrich a task with user information
const enrichTaskWithUserInfo = async (task: Task): Promise<Task> => {
  // If task has an assigneeId but shows "User #X" or "Loading...", look up the username
  if (task.assigneeId && (task.assignee.startsWith('User #') || task.assignee === 'Loading...')) {
    try {
      const users = await usersApi.getAll();
      const user = users.find((u) => u.id.toString() === task.assigneeId);
      if (user) {
        return { ...task, assignee: user.username || user.email };
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }
  return task;
};

export const useStore = create<AppState>((set, get) => ({
  user: null,
  projects: [],
  selectedProject: null,
  selectedTask: null,

  login: async (email: string, password: string) => {
    try {
      // Call the real API
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.token);

      // Map backend role to frontend role
      const roleMap: Record<string, UserRole> = {
        ADMINISTRATOR: 'Administrator',
        MANAGER: 'Manager',
        COLLABORATOR: 'Collaborator',
      };

      const user = {
        email: response.user.email,
        name: response.user.username,
        id: response.user.id,
        role: roleMap[response.user.role] || 'Collaborator',
      };

      set({ user });

      // Load projects from API
      try {
        const projects = await projectsApi.getAll();

        // Enrich tasks with user information if assignee name is missing
        try {
          const users = await usersApi.getAll();
          const userMap = new Map(users.map((u) => [u.id.toString(), u.username || u.email]));

          const enrichedProjects = projects.map((project) => ({
            ...project,
            tasks: project.tasks.map((task) => {
              // If task has an assigneeId but shows "User #X" or "Loading...", look up the username
              if (task.assigneeId && (task.assignee.startsWith('User #') || task.assignee === 'Loading...')) {
                const userName = userMap.get(task.assigneeId);
                if (userName) {
                  return { ...task, assignee: userName };
                }
              }
              return task;
            }),
          }));

          set({ projects: enrichedProjects });
        } catch (userError) {
          console.error('Failed to enrich tasks with user info:', userError);
          set({ projects });
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, projects: [], selectedProject: null, selectedTask: null });
  },

  selectProject: async (projectId: string) => {
    const response = await projectsApi.getById(projectId);

    const project = get().projects.find((p) => p.id === projectId);
    set({ selectedProject: response || null });
  },

  selectTask: (taskId: string | null) => {
    if (!taskId) {
      set({ selectedTask: null });
      return;
    }
    const projects = get().projects;
    let task: Task | null = null;
    for (const project of projects) {
      const foundTask = project.tasks.find((t) => t.id === taskId);
      if (foundTask) {
        task = foundTask;
        break;
      }
    }
    set({ selectedTask: task });
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus) => {
    const user = get().user;
    if (!user) return;

    // Find which project the task belongs to
    const projects = get().projects;
    const project = projects.find((p) => p.tasks.some((t) => t.id === taskId));
    if (!project) {
      console.error('Project not found for task:', taskId);
      return;
    }

    // Find the current task
    const currentTask = project.tasks.find((t) => t.id === taskId);
    if (!currentTask) {
      console.error('Task not found:', taskId);
      return;
    }

    console.log('Updating task status:', { taskId, projectId: project.id, status });

    try {
      // Update task status via API using the dedicated updateStatus method
      let updatedTask = await tasksApi.updateStatus(taskId, project.id, status);

      // Enrich with user info if needed
      updatedTask = await enrichTaskWithUserInfo(updatedTask);

      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        action: 'Status changed',
        author: user.name,
        timestamp: new Date(),
        changes: `Status changed to "${status}"`,
      };

      set((state) => {
        const updatedProjects = state.projects.map((proj) => ({
          ...proj,
          tasks: proj.tasks.map((task) =>
            task.id === taskId ? { ...updatedTask, history: [...task.history, historyEntry] } : task
          ),
        }));

        const selectedProject = state.selectedProject
          ? updatedProjects.find((p) => p.id === state.selectedProject!.id) || null
          : null;

        const selectedTask =
          state.selectedTask?.id === taskId
            ? { ...updatedTask, history: [...(state.selectedTask.history || []), historyEntry] }
            : state.selectedTask;

        return {
          projects: updatedProjects,
          selectedProject,
          selectedTask,
        };
      });

      toast.success('Task status updated');
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const user = get().user;
    if (!user) return;

    // Find which project the task belongs to
    const projects = get().projects;
    const project = projects.find((p) => p.tasks.some((t) => t.id === taskId));
    if (!project) return;

    try {
      // Update task via API
      const updatedTask = await tasksApi.update(taskId, project.id, updates);

      const changes = Object.entries(updates)
        .filter(([key]) => key !== 'history')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        action: 'Updated',
        author: user.name,
        timestamp: new Date(),
        changes,
      };

      set((state) => {
        const updatedProjects = state.projects.map((proj) => ({
          ...proj,
          tasks: proj.tasks.map((task) =>
            task.id === taskId ? { ...updatedTask, history: [...task.history, historyEntry] } : task
          ),
        }));

        const selectedProject = state.selectedProject
          ? updatedProjects.find((p) => p.id === state.selectedProject!.id) || null
          : null;

        const selectedTask =
          state.selectedTask?.id === taskId
            ? { ...updatedTask, history: [...(state.selectedTask.history || []), historyEntry] }
            : state.selectedTask;

        return {
          projects: updatedProjects,
          selectedProject,
          selectedTask,
        };
      });

      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  },

  deleteTask: async (taskId: string) => {
    // Find which project the task belongs to
    const projects = get().projects;
    const project = projects.find((p) => p.tasks.some((t) => t.id === taskId));
    if (!project) return;

    try {
      // Delete task via API
      await tasksApi.delete(taskId, project.id);

      set((state) => {
        const updatedProjects = state.projects.map((proj) => ({
          ...proj,
          tasks: proj.tasks.filter((task) => task.id !== taskId),
        }));

        const selectedProject = state.selectedProject
          ? updatedProjects.find((p) => p.id === state.selectedProject!.id) || null
          : null;

        const selectedTask = state.selectedTask?.id === taskId ? null : state.selectedTask;

        return {
          projects: updatedProjects,
          selectedProject,
          selectedTask,
        };
      });

      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  },

  addComment: async (taskId: string, commentText: string) => {
    const user = get().user;
    if (!user) return;

    await commentsApi.add(taskId, commentText, user.id);
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: user.name,
      timestamp: new Date(),
    };

    set((state) => ({
      projects: state.projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) =>
          task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task
        ),
      })),
    }));

    // Update selected task if it's the one being commented on
    const selectedTask = get().selectedTask;
    if (selectedTask && selectedTask.id === taskId) {
      set({
        selectedTask: {
          ...selectedTask,
          comments: [...selectedTask.comments, newComment],
        },
      });
    }
  },

  createProject: async (name: string, description: string, teamMemberIds: number[] = []) => {
    try {
      // Create project via API and get the real project ID from backend
      const newProject = await projectsApi.create(name, description, get().user.id, teamMemberIds);
      
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
      
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  },

  updateProject: async (projectId: string, name: string, description: string) => {
    try {
      await projectsApi.update(projectId, name, description);
      
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, name, description } : project
        ),
      }));

      const selectedProject = get().selectedProject;
      if (selectedProject && selectedProject.id === projectId) {
        set({ selectedProject: { ...selectedProject, name, description } });
      }
      
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
    }
  },

  deleteProject: async (projectId: string) => {
    try {
      await projectsApi.delete(projectId);
      
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
      }));

      const selectedProject = get().selectedProject;
      if (selectedProject && selectedProject.id === projectId) {
        set({ selectedProject: null });
      }
      
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  },

  createTask: async (
    projectId: string,
    title: string,
    description: string,
    assigneeId: string | null,
    priority: TaskPriority,
    dueDate: string
  ) => {
    const user = get().user;
    if (!user) return;

    try {
      // Create task via API
      let newTask = await tasksApi.create(projectId, title, description, assigneeId, priority, dueDate);

      // Enrich with user info if needed
      newTask = await enrichTaskWithUserInfo(newTask);

      const historyEntry: HistoryEntry = {
        id: '1',
        action: 'Created',
        author: user.name,
        timestamp: new Date(),
        changes: 'Task created',
      };

      set((state) => {
        const updatedProjects = state.projects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: [...project.tasks, { ...newTask, history: [historyEntry] }] }
            : project
        );

        const selectedProject =
          state.selectedProject?.id === projectId
            ? updatedProjects.find((p) => p.id === projectId) || null
            : state.selectedProject;

        return {
          projects: updatedProjects,
          selectedProject,
        };
      });

      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  },
}));
