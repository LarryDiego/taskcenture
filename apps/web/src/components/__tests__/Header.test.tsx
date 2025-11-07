import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock the dependencies
jest.mock('@/store/useStore');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('../NotificationsDropdown', () => ({
  NotificationsDropdown: () => <div data-testid="notifications-dropdown" />,
}));


describe('Header', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: null,
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without user info when no user is logged in', () => {
    render(<Header />);
    expect(screen.getByText('taskCenture')).toBeInTheDocument();
    expect(screen.queryByText('common.logout')).not.toBeInTheDocument();
  });

  it('renders user info and navigation buttons when a user is logged in', () => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { id: 1, name: 'Test User', role: 'COLLABORATOR' },
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
    render(<Header />);
    expect(screen.getByText('taskCenture')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('COLLABORATOR')).toBeInTheDocument();
    expect(screen.getByText('common.logout')).toBeInTheDocument();
    expect(screen.queryByText('users.manageUsers')).not.toBeInTheDocument();
  });

  it('renders admin button when an administrator is logged in', () => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { id: 1, name: 'Admin User', role: 'Administrator' },
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
    render(<Header />);
    expect(screen.getByText('taskCenture')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(screen.getByText('users.manageUsers')).toBeInTheDocument();
  });

  it('navigates to dashboard on title click', () => {
    render(<Header />);
    fireEvent.click(screen.getByText('taskCenture'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to admin users page when admin button is clicked', () => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { id: 1, name: 'Admin User', role: 'Administrator' },
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
    render(<Header />);
    fireEvent.click(screen.getByText('users.manageUsers'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
  });

  it('navigates to settings page when settings button is clicked', () => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { id: 1, name: 'Test User', role: 'COLLABORATOR' },
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
    render(<Header />);
    fireEvent.click(screen.getByText('common.settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('logs out and navigates to login page on logout button click', () => {
    (useStore as jest.Mock).mockImplementation((selector) => {
      const state = {
        user: { id: 1, name: 'Test User', role: 'COLLABORATOR' },
        logout: mockLogout,
      };
      return selector ? selector(state) : state;
    });
    render(<Header />);
    fireEvent.click(screen.getByText('common.logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
