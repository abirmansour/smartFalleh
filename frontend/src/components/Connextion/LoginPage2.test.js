// src/components/Connextion/LoginPage2.test.js
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage2 from './LoginPage2';
import AuthContext from '../../context/AuthContext';

// Mock navigate function
const mockedNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('LoginPage2', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = jest.fn();
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <BrowserRouter>
          <LoginPage2 />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  it('renders email and password inputs and login button', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('Se connecter')).toBeInTheDocument();
  });

  it('shows error message if login fails', async () => {
    loginMock.mockResolvedValue({ success: false, error: 'Invalid credentials' });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@mail.com' } });
      fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByText('Se connecter'));
    });

    const errorMessage = await screen.findByText('Invalid credentials');
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to dashboard if login succeeds', async () => {
    loginMock.mockResolvedValue({ success: true, role: 'user' });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@mail.com' } });
      fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'correctpass' } });
      fireEvent.click(screen.getByText('Se connecter'));
    });

    // Wait for the async navigation
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
