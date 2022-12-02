import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { faker } from '@faker-js/faker';

import App from '@/app';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/user.dto';
import { UserEntity } from '@entities/user.entity';
import AuthRoute from '@routes/auth.route';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await getConnection().dropDatabase();
  await getConnection().close();
});

describe('Testing Auth', () => {
  let user: CreateUserDto;

  beforeAll(async () => {
    user = {
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const hashPassword = await bcrypt.hash(user.password, 10);
    await UserEntity.create({
      email: user.email,
      password: hashPassword,
    }).save();
  });

  describe('[POST] /signup', () => {
    it('sign up should be success', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      const newUser = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
      };

      const res = await request(app.getServer()).post(`${authRoute.path}signup`).send(newUser);
      expect(res.statusCode).toBe(201);
    });
  });

  describe('[POST] /login', () => {
    it('login should be success', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      const res = await request(app.getServer()).post(`${authRoute.path}login`).send(user);
      expect(res.statusCode).toBe(200);
    });

    it('login should be failure by incorrect password', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      const res = await request(app.getServer())
        .post(`${authRoute.path}login`)
        .send({
          ...user,
          password: faker.internet.password(),
        });
      expect(res.statusCode).toBe(409);
    });
  });
});
