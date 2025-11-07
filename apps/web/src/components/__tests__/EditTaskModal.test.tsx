import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditTaskModal } from '../EditTaskModal';
import { useStore } from '@/store/useStore';
import { usersApi } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Mock the dependencies
jest.mock('@/store/useStore');
jest.mock('@/services/api', () => ({
  usersApi: {
    getAll: jest.fn(),
  },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('EditTaskModal', () => {
  const mockUpdateTask = jest.fn();
  const mockUsers = [
    { id: 1, username: 'Test User', email: 'test@test.com' },
    { id: 2, username: 'Jane Doe', email: 'jane@test.com' },
  ];
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'A task for testing',
    assigneeId: '1',
    priority: 'medium' as const,
    dueDate: '2025-12-31',
    status: 'todo' as const,
  };

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        updateTask: mockUpdateTask,
      };
      return selector(state);
    });
    (usersApi.getAll as any).mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal and allows editing a task', async () => {
    render(<EditTaskModal task={mockTask} open={true} onClose={() => {}} />);

    // Check for the title
    expect(screen.getByText('Edit Task')).toBeInTheDocument();

    // Check that the form is pre-filled
    expect(screen.getByLabelText('Task Title')).toHaveValue(mockTask.title);
    expect(screen.getByLabelText('Description')).toHaveValue(mockTask.description);
    expect(screen.getByLabelText('Due Date')).toHaveValue(mockTask.dueDate);

    // Change the form values
    fireEvent.change(screen.getByLabelText('Task Title'), { target: { value: 'Updated Task' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'An updated task' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-01-01' } });

    // Open assignee dropdown
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Jane Doe (jane@test.com)' }));
    });

    // Open priority dropdown
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'High' }));
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update Task'));

    // Check if updateTask was called with the correct arguments
    await waitFor(() => {
        expect(mockUpdateTask).toHaveBeenCalledWith('1', { title: 'Updated Task', description: 'An updated task', assigneeId: '2', priority: 'high', dueDate: '2026-01-01' });
    });
  });
});
