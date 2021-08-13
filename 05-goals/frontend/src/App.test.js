import { render, screen } from '@testing-library/react';
import App from './App';

test('renders New Goal component', () => {
  render(<App />);
  const newgoalElement = screen.getByText(/New Goal/i);
  expect(newgoalElement).toBeInTheDocument();
});
