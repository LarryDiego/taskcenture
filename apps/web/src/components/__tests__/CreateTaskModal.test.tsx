import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateTaskModal } from '../CreateTaskModal';
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

describe('CreateTaskModal', () => {
  const mockCreateTask = jest.fn();
  const mockUsers = [
    { id: 1, username: 'Test User', email: 'test@test.com' },
    { id: 2, username: 'Jane Doe', email: 'jane@test.com' },
  ];

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        createTask: mockCreateTask,
      };
      return selector(state);
    });
    (usersApi.getAll as any).mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal and allows creating a task', async () => {
    render(<CreateTaskModal open={true} onClose={() => {}} projectId="1" />);

    // Check for the title
    expect(screen.getByText('Create New Task')).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Task Title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A new task description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2025-12-31' } });

    // Open assignee dropdown
    fireEvent.click(screen.getByText('Select an assignee'));

    // Wait for users to load and select an assignee
    await waitFor(() => {
      fireEvent.click(screen.getByRole('option', { name: 'Jane Doe (jane@test.com)' }));
    });

    // Open priority dropdown
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'High' }));
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create Task'));

    // Check if createTask was called with the correct arguments
    await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith('1', 'New Task', 'A new task description', '2', 'high', '2025-12-31');
    });
  });
});
