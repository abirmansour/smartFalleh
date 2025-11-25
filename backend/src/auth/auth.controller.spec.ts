import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// Mock bcrypt properly
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should return user when credentials are valid', async () => {
    const mockUser = {
      id: 1,
      email: 'test@email.com',
      password: 'hashedPassword',
      isActive: true,
    };

    mockUsersService.findByEmail.mockResolvedValue(mockUser);

    const result = await authService.validateUser('test@email.com', 'password');
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
    });
  });

  it('should return logout message', async () => {
    const result = await authService.logout('some-token');
    expect(result).toEqual({ message: 'Déconnecté avec succès' });
  });
});
