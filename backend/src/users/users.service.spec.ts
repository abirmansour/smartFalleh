import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Cooperative } from '../cooperative/entities/cooperative.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepo = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCoopRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
    sendResponsableAssignationEmail: jest.fn(),
    sendJuryCreatedEmail: jest.fn(),
  };

  const mockJwtService = { sign: jest.fn().mockReturnValue('jwtToken') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Cooperative), useValue: mockCoopRepo },
        { provide: MailService, useValue: mockMailService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks
    jest.clearAllMocks();

    // Mock bcrypt methods
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashedPassword');
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate token and call mailService for password reset', async () => {
    const user = { email: 'test@mail.com', save: jest.fn() };
    mockUserRepo.findOne.mockResolvedValue(user);

    const result = await service.requestPasswordReset('test@mail.com');

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@mail.com' } });
    expect(mockMailService.sendResetPasswordEmail).toHaveBeenCalled();
    expect(result.link).toContain('reset-password');
  });

  it('should create a new user', async () => {
    const dto = { email: 'new@mail.com', nom: 'Abir', prenom: 'Mansour' };
    mockUserRepo.findOne.mockResolvedValue(null);
    mockUserRepo.create.mockImplementation(dto => dto);
    mockUserRepo.save.mockResolvedValue({ uid: '123', ...dto, password: 'hashedPassword' });

    const user = await service.createUser(dto);

    expect(mockUserRepo.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(mockUserRepo.save).toHaveBeenCalled();
    expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
    expect(user).not.toHaveProperty('password');
  });
});
