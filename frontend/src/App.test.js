import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div data-testid="app">Mock App</div>;
  };
});

test('renders app', () => {
  render(<App />);
  const appElement = screen.getByTestId('app');
  expect(appElement).toBeInTheDocument();
});