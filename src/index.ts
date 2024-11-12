import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { getGifByText } from './lib/tenor';
import { TWENTY_MB, SIX_MB } from './lib/constants';

type Bindings = {
  TENOR_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => c.redirect('https://akashrajpurohit.com/?ref=easy-gif'));

app.post('/slack/giffy', async (c) => {
  const params = await c.req.parseBody();
  const text = params.text as string;
  const responseUrl = params.response_url as string;

  if (!text) {
    // Respond with error message if no text is provided
    return c.json({
      response_type: 'ephemeral',
      text: 'Please provide text after `/giffy` command.',
    });
  }

  if (!responseUrl || !responseUrl.startsWith('https://hooks.slack.com')) {
    return c.json({
      response_type: 'ephemeral',
      text: "Sorry, slash commando, that didn't work. Please try again.",
    });
  }

  try {
    const apiKey = c.env.TENOR_API_KEY;
    const { error, url } = await getGifByText({
      apiKey,
      text,
      maxGifSize: TWENTY_MB,
    });

    if (error || !url) {
      return c.json({
        response_type: 'ephemeral',
        text: `Unable to find GIF for the given text: ${text}`,
      });
    }

    // Respond to Slack
    await fetch(responseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_type: 'in_channel',
        blocks: [
          {
            type: 'image',
            title: {
              type: 'plain_text',
              text,
            },
            block_id: 'image4',
            image_url: url,
            alt_text: text,
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Posted using /giffy',
              },
            ],
          },
        ],
      }),
    });

    // Send acknowledgment to Slack
    return c.newResponse(null, 200);
  } catch (error) {
    console.error('Error fetching GIF:', error);
    return c.json({
      response_type: 'ephemeral',
      text: 'Sorry, something went wrong. Please try again.',
    });
  }
});

app.get(
  '/:text',
  cache({
    cacheName: 'easy-gif',
    cacheControl: 's-maxage=1296000', // cache for 15 days
  }),
  async (c) => {
    const text = c.req.param('text');
    const apiKey = c.env.TENOR_API_KEY;

    const { error, url } = await getGifByText({
      apiKey,
      text,
      maxGifSize: SIX_MB,
    });

    if (error || !url) {
      return c.json({ error }, 400);
    }

    // Fetch the GIF from url and stream the response
    const imageResponse = await fetch(url);

    const { readable, writable } = new TransformStream();

    imageResponse.body?.pipeTo(writable);

    return c.newResponse(readable, 200, {
      'Content-Type': 'image/gif',
      'Cache-Control': 'max-age=1296000',
    });
  }
);

export default app;
