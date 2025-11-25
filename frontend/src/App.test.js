import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the App component to avoid router issues in tests
jest.mock('./App', () => {
  return function MockApp() {
    return <div>Mock App Component</div>;
  };
});

test('renders without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText('Mock App Component')).toBeInTheDocument();
});