import { fireEvent, render, screen } from '@testing-library/react';
import GenerateButton from '@/components/GenerateButton';
import '@testing-library/jest-dom';

describe('GenerateButton', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in default state', () => {
    render(<GenerateButton disabled={false} isSubmitting={false} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Generate Speech')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders loading state when isSubmitting is true', () => {
    render(<GenerateButton disabled={true} isSubmitting={true} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Generating')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<GenerateButton disabled={true} isSubmitting={false} onSubmit={mockOnSubmit} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onSubmit when clicked', () => {
    render(<GenerateButton disabled={false} isSubmitting={false} onSubmit={mockOnSubmit} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
