import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import path from 'path';

import App from '@/app';
import { dbConnection } from '@databases';
import StressRoute from '@routes/stress.route';
import { UserEntity } from '@/entities/user.entity';
import { CreateUserDto } from '@/dtos/user.dto';
import { faker } from '@faker-js/faker';
import AuthService from '@/services/auth.service';

jest.mock('bull', () => {
  return jest.fn().mockImplementation(() => {
    return {
      process: jest.fn().mockImplementation(() => {
        return {};
      }),
      add: jest.fn().mockImplementation(() => {
        return {};
      }),
      on: jest.fn().mockImplementation(() => {
        return {};
      }),
    };
  });
});

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().dropDatabase();
  await getConnection().close();
});

describe('Testing Stresses', () => {
  let userCookie: string;

  beforeAll(async () => {
    const authService = new AuthService();
    const createdUser: CreateUserDto = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const hashPassword = await bcrypt.hash(createdUser.password, 10);
    await UserEntity.create({
      email: createdUser.email,
      password: hashPassword,
    }).save();
    const { cookie } = await authService.login(createdUser);
    userCookie = cookie;
  });

  describe('[POST] /stresses', () => {
    it('create stress should be success', async () => {
      const image = path.join(__dirname, './static/test_img.png');
      const stressRoute = new StressRoute();
      const app = new App([stressRoute]);
      const res = await request(app.getServer()).post(`${stressRoute.path}`).set('Cookie', [userCookie]).field('level', 3).attach('image', image);
      expect(res.statusCode).toBe(201);
    });

    it('create stress should be failed by image required', async () => {
      const stressRoute = new StressRoute();
      const app = new App([stressRoute]);
      const res = await request(app.getServer()).post(`${stressRoute.path}`).set('Cookie', [userCookie]).field('level', 3);
      expect(res.statusCode).toBe(400);
    });

    it('create stress should be failed by level required', async () => {
      const image = path.join(__dirname, './static/test_img.png');
      const stressRoute = new StressRoute();
      const app = new App([stressRoute]);
      const res = await request(app.getServer()).post(`${stressRoute.path}`).set('Cookie', [userCookie]).attach('image', image);
      expect(res.statusCode).toBe(400);
    });

    it('create stress should be failed by missing authorization', async () => {
      const image = path.join(__dirname, './static/test_img.png');
      const stressRoute = new StressRoute();
      const app = new App([stressRoute]);
      const res = await request(app.getServer()).post(`${stressRoute.path}`).field('level', 3).attach('image', image);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('[GET] /stresses', () => {
    it('get stresses should be success', async () => {
      const stressRoute = new StressRoute();

      const app = new App([stressRoute]);
      const res = await request(app.getServer()).get(`${stressRoute.path}`).set('Cookie', [userCookie]);
      expect(res.statusCode).toBe(200);
    });

    it('get stresses should be failed by missing authorization', async () => {
      const stressRoute = new StressRoute();

      const app = new App([stressRoute]);
      const res = await request(app.getServer()).get(`${stressRoute.path}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
