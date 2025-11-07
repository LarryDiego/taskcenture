import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditProjectModal } from '../EditProjectModal';
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
    success: jest.fn(),
  },
}));

describe('EditProjectModal', () => {
  const mockUpdateProject = jest.fn();
  const mockUser = { id: 1, name: 'Test User', role: 'MANAGER' };
  const mockUsers = [
    { id: 1, username: 'Test User', email: 'test@test.com', role: 'MANAGER' },
    { id: 2, username: 'Jane Doe', email: 'jane@test.com', role: 'COLLABORATOR' },
    { id: 3, username: 'John Smith', email: 'john@test.com', role: 'COLLABORATOR' },
  ];
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'A project for testing',
    owner: { id: 1, name: 'Test User' },
    teamMembers: [{ id: 1, name: 'Test User' }, { id: 2, name: 'Jane Doe' }],
  };

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        updateProject: mockUpdateProject,
        user: mockUser,
      };
      return selector(state);
    });
    (usersApi.getAll as any).mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal and allows editing a project', async () => {
    render(<EditProjectModal project={mockProject as any} open={true} onClose={() => {}} />);

    // Check for the title
    expect(screen.getByText('project.edit')).toBeInTheDocument();

    // Check that the form is pre-filled
    expect(screen.getByLabelText('project.name')).toHaveValue(mockProject.name);
    expect(screen.getByLabelText('project.description')).toHaveValue(mockProject.description);

    // Change the form values
    fireEvent.change(screen.getByLabelText('project.name'), { target: { value: 'Updated Project' } });
    fireEvent.change(screen.getByLabelText('project.description'), { target: { value: 'An updated project' } });

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Smith (john@test.com)')).toBeInTheDocument();
    });

    // Add a new team member
    fireEvent.click(screen.getByRole('checkbox', { name: 'John Smith (john@test.com)' }));

    // Submit the form
    fireEvent.click(screen.getByText('project.update'));

    // Check if updateProject was called with the correct arguments
    expect(mockUpdateProject).toHaveBeenCalledWith('1', 'Updated Project', 'An updated project', [1, 2, 3]);
  });
});
