import axios from 'axios';
import type { Task, Project, TaskPriority, TaskStatus, Comment } from '@/store/useStore';
import { log } from 'console';

const API_BASE_URL = '/api';

// Configure axios to include JWT token in requests
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
  }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string, role: string): Promise<any> => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<Array<{ id: number; username: string; email: string; role: string }>> => {
    const response = await api.get('/users');
    return response.data;
  },
};

// Transform backend status to frontend format
const transformStatus = (status: string): TaskStatus => {
  const statusMap: Record<string, TaskStatus> = {
    TO_DO: 'todo',
    IN_PROGRESS: 'in-progress',
    DONE: 'done',
  };
  return statusMap[status] || 'todo';
};

// Transform frontend status to backend format
const transformStatusToBackend = (status: TaskStatus): string => {
  const statusMap: Record<TaskStatus, string> = {
    todo: 'TO_DO',
    'in-progress': 'IN_PROGRESS',
    done: 'DONE',
  };
  return statusMap[status];
};

// Transform backend priority to frontend format
const transformPriority = (priority: string): TaskPriority => {
  return priority.toLowerCase() as TaskPriority;
};

// Transform frontend priority to backend format
const transformPriorityToBackend = (priority: TaskPriority): string => {
  return priority.toUpperCase();
};

// Transform backend task to frontend format
const transformTask = (backendTask: any): Task => {
  const assignee = backendTask.assignee;
  const hasAssignee = assignee && assignee.id;

  // Get username, handling null/undefined values
  let assigneeName = 'Unassigned';
  if (hasAssignee) {
    // Check if username/email exist and are not null
    if (assignee.username && assignee.username !== null) {
      assigneeName = assignee.username;
    } else if (assignee.email && assignee.email !== null) {
      assigneeName = assignee.email;
    } else if (assignee.name && assignee.name !== null) {
      assigneeName = assignee.name;
    } else {
      // Fallback: fetch the user info from the users list if needed
      assigneeName = `User #${assignee.id}`;
    }
  }

  return {
    id: backendTask.id?.toString() || '',
    title: backendTask.title || '',
    description: backendTask.description || '',
    assignee: assigneeName,
    assigneeId: hasAssignee ? assignee.id?.toString() : undefined,
    priority: transformPriority(backendTask.priority || 'LOW'),
    dueDate: backendTask.dueDate || '',
    status: transformStatus(backendTask.status || 'TO_DO'),
    comments: (backendTask.comments || []).map((c: any) => ({
      id: c.id?.toString() || '',
      text: c.content || '',
      author: c.author?.username || c.author?.email || 'Unknown',
      timestamp: new Date(c.createdAt || Date.now()),
    })),
    history: [], // Backend doesn't have history yet
    projectId: backendTask.project?.id?.toString() || '',
  };
};

// Transform backend project to frontend format
const transformProject = (backendProject: any, tasks: Task[] = []): Project => ({
  id: backendProject.id?.toString() || '',
  name: backendProject.name || '',
  description: backendProject.description || '',
  tasks,
});

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');

    const data = response.data;
    // response.data might be an array or a paginated object like { content: [...] }
    const projects = Array.isArray(data) ? data : data?.content ?? [];

    // Fetch tasks for each project
    const projectsWithTasks = await Promise.all(
      projects.map(async (project: any) => {
        try {
          const tasksResponse = await api.get(`/projects/${project.id}/tasks`);
          console.log('Raw tasks response:', typeof tasksResponse.data, tasksResponse.data);

          // Normalize response data to ensure we have an array
          const tasksData =
            typeof tasksResponse.data === 'string' ? JSON.parse(tasksResponse.data) : tasksResponse.data;
          const tasksArray = Array.isArray(tasksData) ? tasksData : tasksData?.content ?? [];

          const tasks = tasksArray.map(transformTask);
          console.log('Transformed tasks:', tasks);

          return transformProject(project, tasks);
        } catch (error) {
          console.error(`Failed to fetch tasks for project ${project.id}:`, error);
          return transformProject(project, []);
        }
      })
    );

    return projectsWithTasks;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    const project = response.data;

    // Fetch tasks for the project
    try {
      const tasksResponse = await api.get(`/projects/${id}/tasks`);

      // Extract just the task data we need, ignoring nested circular references
      const tasks = (Array.isArray(tasksResponse.data) ? tasksResponse.data : [])
        .map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          assignee: task.assignee,
          project: { id: task.project?.id },
          comments: (task.comments || []).map((comment) => ({
            id: comment.id,
            content: comment.content,
            author: {
              id: comment.author?.id,
              username: comment.author?.username,
              email: comment.author?.email,
            },
            createdAt: comment.createdAt,
          })),
        }))
        .map(transformTask);
      console.log('Final tasks array:', tasks);

      return transformProject(project, tasks);
    } catch (error) {
      console.error(`Failed to fetch tasks for project ${id}:`, error);
      return transformProject(project, []);
    }
  },

  create: async (name: string, description: string, id: number): Promise<Project> => {
    const response = await api.post('/projects', { name, description, owner: { id } });
    return transformProject(response.data, []);
  },

  update: async (id: string, name: string, description: string): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, { name, description });
    return transformProject(response.data, []);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksApi = {
  getByProjectId: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return (response.data || []).map(transformTask);
  },

  getById: async (id: string): Promise<Task> => {
    // We need to know the project ID to fetch a task, but let's try to get it from all projects
    const response = await api.get(`/projects`);
    const projects = response.data || [];

    for (const project of projects) {
      try {
        const taskResponse = await api.get(`/projects/${project.id}/tasks/${id}`);
        return transformTask(taskResponse.data);
      } catch (error) {
        // Task not in this project, continue searching
        console.log(error);

        continue;
      }
    }

    throw new Error(`Task ${id} not found`);
  },

  create: async (
    projectId: string,
    title: string,
    description: string,
    assigneeId: string | null,
    priority: TaskPriority,
    dueDate: string
  ): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, {
      title,
      description,
      priority: transformPriorityToBackend(priority),
      status: 'TO_DO',
      dueDate,
      assignee: assigneeId ? { id: parseInt(assigneeId) } : null,
    });
    return transformTask(response.data);
  },

  update: async (id: string, projectId: string, updates: Partial<Task>): Promise<Task> => {
    const backendUpdates: any = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description && { description: updates.description }),
      ...(updates.priority && { priority: transformPriorityToBackend(updates.priority) }),
      ...(updates.status && { status: transformStatusToBackend(updates.status) }),
      ...(updates.dueDate && { dueDate: updates.dueDate }),
      ...(updates.assigneeId && { assignee: { id: parseInt(updates.assigneeId) } }),
    };

    const response = await api.put(`/projects/${projectId}/tasks/${id}`, backendUpdates);
    return transformTask(response.data);
  },

  delete: async (id: string, projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/tasks/${id}`);
  },

  updateStatus: async (id: string, projectId: string, status: TaskStatus): Promise<Task> => {
    if (!id || !projectId) {
      throw new Error(`Invalid parameters: id="${id}", projectId="${projectId}"`);
    }
    
    const response = await api.put(`/projects/${projectId}/tasks/${id}`, {
      status: transformStatusToBackend(status),
    });
    
    return transformTask(response.data);
  },
};

// Comments API (if backend supports it)
export const commentsApi = {
  add: async (taskId: string, content: string, id: number): Promise<Comment> => {
    // This endpoint might need adjustment based on actual backend implementation
    const response = await api.post(`/tasks/${taskId}/comments`, {
      task: { id: parseInt(taskId) },
      content,
      author: { id },
    });

    return {
      id: response.data.id?.toString() || '',
      text: response.data.content || '',
      author: response.data.author?.username || response.data.author?.email || 'Unknown',
      timestamp: new Date(response.data.createdAt || Date.now()),
    };
  },
};
