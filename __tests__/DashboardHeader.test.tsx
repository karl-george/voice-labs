import { render, screen } from '@testing-library/react';
import DashboardHeader from '@/components/DashboardHeader';
import { useUser } from '@clerk/nextjs';
import '@testing-library/jest-dom';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

describe('DashboardHeader', () => {
  it('renders loading state when user is not loaded', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
      user: null,
    });

    render(<DashboardHeader />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('renders user name when loaded', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: { fullName: 'John Doe' },
    });

    render(<DashboardHeader />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('contains feedback and help links', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: { firstName: 'Jane' },
    });

    render(<DashboardHeader />);
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Need help?')).toBeInTheDocument();
  });
});
