import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Fib Calculator text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Fib Calculator/i);
  expect(linkElement).toBeInTheDocument();
});
