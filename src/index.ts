import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { getGifByText } from './lib/tenor';

type Bindings = {
  TENOR_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => c.redirect('https://akashrajpurohit.com/?ref=easy-gif'));

app.get(
  '/:text',
  cache({
    cacheName: 'easy-gif',
    cacheControl: 'max-age=1296000, s-maxage=1296000', // cache for 15 days
  }),
  async (c) => {
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
  }
);

export default app;
