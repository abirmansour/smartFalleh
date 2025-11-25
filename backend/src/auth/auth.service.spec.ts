import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// Mock UsersService
const mockUsersService = {
  findByEmail: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // ✅ Test 1: Service should be defined
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // ✅ Test 2: validateUser should return null for non-existent user
  it('should return null when user does not exist', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    const result = await authService.validateUser('nonexistent@email.com', 'password');

    expect(result).toBeNull();
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('nonexistent@email.com');
  });

  // ✅ Test 3: validateUser should return null for incorrect password
  it('should return null when password is incorrect', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@email.com',
      password: 'hashedPassword',
      etat: 'active'
    };

    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    const result = await authService.validateUser('test@email.com', 'wrongpassword');

    expect(result).toBeNull();
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
  });

  // ✅ Test 4: validateUser should return null for inactive account
  it('should return null when account is inactive', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@email.com',
      password: 'hashedPassword',
      etat: 'inactive'
    };

    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await authService.validateUser('test@email.com', 'correctpassword');

    expect(result).toBeNull();
  });

  // ✅ Test 5: validateUser should return user for valid credentials and active account
  it('should return user when credentials are valid and account is active', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@email.com',
      password: 'hashedPassword',
      etat: 'active',
      role: 'user'
    };

    mockUsersService.findByEmail.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await authService.validateUser('test@email.com', 'correctpassword');

    expect(result).toEqual(mockUser);
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@email.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedPassword');
  });

  // ✅ Test 6: login should return token and user data
  it('should return token and user data on login', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@email.com',
      role: 'user'
    };

    const mockToken = 'mock-jwt-token';
    mockJwtService.sign.mockReturnValue(mockToken);

    const result = await authService.login(mockUser);

    expect(result).toEqual({
      token: mockToken,
      id: '123',
      email: 'test@email.com',
      role: 'user'
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: 'test@email.com',
      sub: '123',
      role: 'user'
    });
  });

  // ✅ Test 7: logout should return success message
  it('should return logout message', async () => {
    const result = await authService.logout('some-token');

    expect(result).toEqual({ message: 'Déconnecté' });
  });
});