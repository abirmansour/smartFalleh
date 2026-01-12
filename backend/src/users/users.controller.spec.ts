// users.controller.functional.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// On mocke le guard pour passer la sécurité JWT
class JwtAuthGuardMock {
  canActivate() {
    return true;
  }
}

// Mock du service
const mockUsersService = {
  findAll: jest.fn().mockResolvedValue([{ uid: '1', nom: 'Abir', prenom: 'Mansour' }]),
  findOne: jest.fn().mockImplementation((uid: string) => Promise.resolve({ uid, nom: 'Abir', prenom: 'Mansour' })),
  create: jest.fn().mockImplementation((dto: CreateUserDto) => Promise.resolve({ uid: '1', ...dto })),
  update: jest.fn().mockImplementation((uid: string, dto: UpdateUserDto) => Promise.resolve({ uid, ...dto })),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
  requestPasswordReset: jest.fn().mockResolvedValue({ link: 'http://reset-link' }),
  resetPassword: jest.fn().mockResolvedValue({ success: true }),
  updateProfile: jest.fn().mockImplementation((uid: string, dto: UpdateUserDto) => Promise.resolve({ uid, ...dto })),
};

describe('UsersController (Functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(JwtAuthGuardMock)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET) should return all users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([{ uid: '1', nom: 'Abir', prenom: 'Mansour' }]);
  });

  it('/users/:uid (GET) should return one user', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect({ uid: '1', nom: 'Abir', prenom: 'Mansour' });
  });

  it('/users (POST) should create a user', () => {
    const dto: CreateUserDto = { nom: 'John', prenom: 'Doe', email: 'john@test.com', password: '123456' };
    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(201)
      .expect({ uid: '1', ...dto });
  });

  it('/users/:uid (PATCH) should update a user', () => {
    const dto: UpdateUserDto = { nom: 'Updated' };
    return request(app.getHttpServer())
      .patch('/users/1')
      .send(dto)
      .expect(200)
      .expect({ uid: '1', ...dto });
  });

  it('/users/:uid (DELETE) should delete a user', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .expect({ deleted: true });
  });

  it('/users/request-password-reset (POST) should request reset', () => {
    return request(app.getHttpServer())
      .post('/users/request-password-reset')
      .send({ email: 'test@mail.com' })
      .expect(201)
      .expect({ link: 'http://reset-link' });
  });

  it('/users/reset-password (POST) should reset password', () => {
    return request(app.getHttpServer())
      .post('/users/reset-password')
      .send({ token: 'token123', newPassword: 'newpass' })
      .expect(201)
      .expect({ success: true });
  });
});
