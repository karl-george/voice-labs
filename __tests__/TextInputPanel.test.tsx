import { fireEvent, render, screen } from '@testing-library/react';
import TextInputPanel from '@/components/TextInputPanel';
import { useRouter } from 'next/navigation';
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from '@/lib/constants';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TextInputPanel', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<TextInputPanel />);
    expect(screen.getByPlaceholderText(/enter your text here/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 2,000 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/start typing to estimate/i)).toBeInTheDocument();
  });

  it('updates text on change', () => {
    render(<TextInputPanel />);
    const textarea = screen.getByPlaceholderText(/enter your text here/i);
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(textarea).toHaveValue('Hello world');
  });

  it('disables generate button when text is empty or only whitespace', () => {
    render(<TextInputPanel />);
    const button = screen.getByRole('button', { name: /generate speech/i });
    expect(button).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/enter your text here/i);
    fireEvent.change(textarea, { target: { value: '   ' } });
    expect(button).toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'Hi' } });
    expect(button).not.toBeDisabled();
  });

  it('calculates cost correctly', () => {
    render(<TextInputPanel />);
    const textarea = screen.getByPlaceholderText(/enter your text here/i);
    const text = 'Hello';
    fireEvent.change(textarea, { target: { value: text } });

    const expectedCost = (text.length * COST_PER_UNIT).toFixed(4);
    expect(screen.getByText(`$${expectedCost}`)).toBeInTheDocument();
    expect(screen.getByText(/estimated/i)).toBeInTheDocument();
  });

  it('navigates to text-to-speech page on generate click', () => {
    render(<TextInputPanel />);
    const textarea = screen.getByPlaceholderText(/enter your text here/i);
    const button = screen.getByRole('button', { name: /generate speech/i });

    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/text-to-speech?text=Test%20message');
  });

  it('respects maximum length', () => {
    render(<TextInputPanel />);
    const textarea = screen.getByPlaceholderText(/enter your text here/i);
    expect(textarea).toHaveAttribute('maxLength', TEXT_MAX_LENGTH.toString());
  });
});
