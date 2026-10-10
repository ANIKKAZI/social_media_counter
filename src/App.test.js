import { render, screen } from '@testing-library/react';
import App from './App';

test('renders platform choices', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Instagram Live follower counter/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Google reviews QR code/i })).toBeInTheDocument();
});
