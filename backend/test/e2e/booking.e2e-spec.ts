import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get token (assuming seed exists or register works)
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@thecutlab.com', password: 'AdminPassword123!' });
    authToken = loginRes.header['set-cookie'][0];
  });

  it('GIVEN valid booking data WHEN POST /bookings THEN return 201', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .set('Cookie', authToken)
      .send({
        barberId: 'uuid-v4-here',
        clientId: 'uuid-v4-here',
        serviceId: 'uuid-v4-here',
        startTime: new Date(Date.now() + 86400000).toISOString(),
      })
      .expect(201);
  });

  it('GIVEN no token WHEN POST /bookings THEN return 401', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .send({})
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});