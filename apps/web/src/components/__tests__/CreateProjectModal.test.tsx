import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateProjectModal } from '../CreateProjectModal';
import { useStore } from '@/store/useStore';
import { usersApi } from '@/services/api';
import { useTranslation } from 'react-i18next';

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

describe('CreateProjectModal', () => {
  const mockCreateProject = jest.fn();
  const mockUser = { id: 1, name: 'Test User', role: 'MANAGER' };
  const mockUsers = [
    { id: 1, username: 'Test User', email: 'test@test.com', role: 'MANAGER' },
    { id: 2, username: 'Jane Doe', email: 'jane@test.com', role: 'COLLABORATOR' },
  ];

  beforeEach(() => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        createProject: mockCreateProject,
        user: mockUser,
      };
      return selector(state);
    });
    (usersApi.getAll as any).mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal and allows creating a project', async () => {
    render(<CreateProjectModal open={true} onClose={() => {}} />);

    // Check for the title
    expect(screen.getByText('project.createNew')).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText('project.name'), { target: { value: 'New Project' } });
    fireEvent.change(screen.getByLabelText('project.description'), { target: { value: 'A great project' } });

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Jane Doe (jane@test.com)')).toBeInTheDocument();
    });

    // Select a team member
    fireEvent.click(screen.getByRole('checkbox', { name: 'Jane Doe (jane@test.com)' }));

    // Submit the form
    fireEvent.click(screen.getByText('dashboard.createProject'));

    // Check if createProject was called with the correct arguments
    expect(mockCreateProject).toHaveBeenCalledWith('New Project', 'A great project', [2]);
  });
});
