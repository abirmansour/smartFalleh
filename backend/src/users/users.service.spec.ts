import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let mailService: MailService;
  let jwtService: JwtService;

  // Test data
  const mockUser: User = {
  uid: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  password: 'hashedpassword',
  nom: 'MAnsour',
  prenom: 'Abir',
  telephone: '1234567890',
  adresse: '123 Test St',
  etat: 'active',
  resetPasswordToken: null,
  resetPasswordExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  cooperative: undefined,
  role: 'jury'
};

  // Mock repository with proper types
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock mail service with proper types
  const mockMailService: jest.Mocked<MailService> = {
    sendUserConfirmation: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  } as any;

  // Mock JWT service with proper types
  const mockJwtService: jest.Mocked<JwtService> = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn()
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // Test suite for create method
  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123!',
      nom: 'Doe',
      prenom: 'John',
      telephone: '1234567890',
      adresse: '123 Test St',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const userWithHashedPassword = {
        ...mockUser,
        password: hashedPassword
      };
      
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(userWithHashedPassword);
      mockUserRepository.save.mockResolvedValue(userWithHashedPassword);
      
      // Mock bcrypt.hash to return a predictable hash
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(userWithHashedPassword);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ 
        where: { email: createUserDto.email } 
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(userWithHashedPassword);
    });

    it('should throw BadRequestException if email already exists', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
    });
  });

  // Test suite for findAll method
  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue([mockUser]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  // Test suite for findOne method
  describe('findOne', () => {
    it('should return a user if found', async () => {
      // Arrange
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      mockUserRepository.findOne.mockImplementation((options) => {
        if (options?.where?.['uid'] === userId) {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      });

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { uid: userId },
        relations: ['cooperatives'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  // Test suite for update method
  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      nom: 'Updated',
      prenom: 'User',
    };

    it('should update a user successfully', async () => {
      // Arrange
      const userId = '550e8400-e29b-41d4-a716-446655440000';
      const updatedUser = { ...mockUser, ...updateUserDto };
      
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(userId, updateUserDto);

      // Assert
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: hashedPassword,
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(userWithHashedPassword);
  });

  it('should throw BadRequestException if email already exists', async () => {
    // Arrange
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act & Assert
    await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: createUserDto.email } });
  });
});

// Test suite for findAll method
describe('findAll', () => {
  it('should return an array of users', async () => {
    // Arrange
    mockUserRepository.find.mockResolvedValue([mockUser]);

    // Act
    const result = await service.findAll();

    // Assert
    expect(result).toEqual([mockUser]);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });
});

// Test suite for findOne method
describe('findOne', () => {
  it('should return a user if found', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    mockUserRepository.findOne.mockImplementation((options) => {
      if (options?.where?.['uid'] === userId) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    });

    // Act
    const result = await service.findOne(userId);

    // Assert
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { uid: userId },
      relations: ['cooperatives'],
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    // Arrange
    const userId = 'non-existent-id';
    mockUserRepository.findOne.mockResolvedValue(undefined);

    // Act & Assert
    await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
  });
});

// Test suite for update method
describe('update', () => {
  const updateUserDto: UpdateUserDto = {
    nom: 'Updated',
    prenom: 'User',
  };

  it('should update a user successfully', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const updatedUser = { ...mockUser, ...updateUserDto };
    
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockUserRepository.save.mockResolvedValue(updatedUser);

    // Act
    const result = await service.update(userId, updateUserDto);

    // Assert
    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
  });
});

// Test suite for remove method
describe('remove', () => {
  it('should remove a user successfully', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    mockUserRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult);

    // Act
    await service.remove(userId);

    // Assert
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException if user not found', async () => {
    // Arrange
    const userId = 'non-existent-id';
    mockUserRepository.delete.mockResolvedValue({ affected: 0 } as DeleteResult);

    // Act & Assert
    await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
  });
});

// Test suite for findByEmail method
describe('findByEmail', () => {
  it('should return a user if found by email', async () => {
    // Arrange
    const email = 'test@example.com';
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    // Act
    const result = await service.findByEmail(email);

    // Assert
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email }
    });
  });

  it('should return null if user not found by email', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    mockUserRepository.findOne.mockResolvedValue(null);

    // Act
    const result = await service.findByEmail(email);

    // Assert
    expect(result).toBeNull();
  });
});