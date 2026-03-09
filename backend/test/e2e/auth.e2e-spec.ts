import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('should register a new user (201)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@thecutlab.com',
          password: 'Password123!',
          fullName: 'Test Barber',
          role: 'barber'
        })
        .expect(201);
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'invalid-email', password: '123' })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});