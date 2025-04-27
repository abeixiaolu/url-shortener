import { server } from './setup';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () => {
    await request(server)
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBe('Hello World!');
      });
  });
});
