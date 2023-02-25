import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({ hello: 'hi' });
});

export default app;
