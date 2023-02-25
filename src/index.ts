import { Hono } from 'hono';
import { getGifByText } from './lib/tenor';

type Bindings = {
  TENOR_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/:text', async (c) => {
  const text = c.req.param('text');
  const apiKey = c.env.TENOR_API_KEY;

  const { error, url } = await getGifByText({ apiKey, text });

  if (error || !url) {
    return c.json({ error }, 400);
  }

  // Fetch the GIF from url and stream the response
  const imageResponse = await fetch(url);

  const { readable, writable } = new TransformStream();

  imageResponse.body?.pipeTo(writable);

  return c.newResponse(readable, 200);
});

export default app;
