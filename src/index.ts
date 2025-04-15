import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { getGifByText } from './lib/tenor';
import { TWENTY_MB, SIX_MB } from './lib/constants';
import { SlackInteractivePayload } from './lib/types';

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
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'image',
            title: {
              type: 'plain_text',
              text,
            },
            block_id: 'preview_image',
            image_url: url,
            alt_text: text,
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Send' },
                action_id: 'send_gif',
                style: 'primary',
                value: JSON.stringify({ url, text }),
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Shuffle' },
                action_id: 'another_gif',
                value: JSON.stringify({ text }),
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: 'Cancel' },
                action_id: 'cancel',
                value: JSON.stringify({}),
              },
            ],
          },
          {
            type: 'context',
            elements: [{ type: 'mrkdwn', text: 'Preview of your GIF' }],
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

app.post('/slack/interactive', async (c) => {
  const { payload } = await c.req.parseBody();
  let slackPayload: SlackInteractivePayload;
  try {
    slackPayload = JSON.parse(payload as string);
  } catch (err) {
    return c.json({ text: 'Action not recognized' });
  }

  const action = slackPayload.actions && slackPayload.actions[0];
  const responseUrl = slackPayload.response_url;

  if (action && action.action_id === 'send_gif') {
    const { url, text } = JSON.parse(action.value);

    try {
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_type: 'in_channel',
          replace_original: true,
          delete_original: true,
          blocks: [
            {
              type: 'image',
              title: { type: 'plain_text', text },
              block_id: 'image_final',
              image_url: url,
              alt_text: text,
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Posted using /giffy by @${slackPayload.user.username}`,
                },
              ],
            },
          ],
        }),
      });

      return c.json({
        response_type: 'ephemeral',
        delete_original: true,
        replace_original: true,
        text: '',
      });
    } catch (error) {
      console.error('Error posting GIF:', error);
      return c.json({
        response_type: 'ephemeral',
        text: 'Failed to send the GIF. Please try again.',
      });
    }
  } else if (action && action.action_id === 'another_gif') {
    const { text } = JSON.parse(action.value);

    try {
      const apiKey = c.env.TENOR_API_KEY;
      const { error, url } = await getGifByText({
        apiKey,
        text,
        maxGifSize: TWENTY_MB,
        getRandomGif: true,
      });

      if (error || !url) {
        return c.json({
          response_type: 'ephemeral',
          text: `Unable to find GIF for the given text: ${text}`,
        });
      }

      await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_type: 'ephemeral',
          replace_original: true,
          blocks: [
            {
              type: 'image',
              title: {
                type: 'plain_text',
                text,
              },
              block_id: 'preview_image',
              image_url: url,
              alt_text: text,
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Send' },
                  action_id: 'send_gif',
                  style: 'primary',
                  value: JSON.stringify({ url, text }),
                },
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Shuffle' },
                  action_id: 'another_gif',
                  value: JSON.stringify({ text }),
                },
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'Cancel' },
                  action_id: 'cancel',
                  value: JSON.stringify({}),
                },
              ],
            },
            {
              type: 'context',
              elements: [{ type: 'mrkdwn', text: 'Preview of your GIF' }],
            },
          ],
        }),
      });

      return c.json({
        response_type: 'ephemeral',
        replace_original: true,
        text: '',
      });
    } catch (error) {
      console.error('Error posting GIF:', error);
      return c.json({
        response_type: 'ephemeral',
        text: 'Failed to send the GIF. Please try again.',
      });
    }
  } else if (action && action.action_id === 'cancel') {
    try {
      await fetch(responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_type: 'in_channel',
          delete_original: true,
        }),
      });

      return c.json({
        response_type: 'ephemeral',
        delete_original: true,
        replace_original: true,
        text: '',
      });
    } catch (error) {
      console.error('Error posting GIF:', error);
      return c.json({
        response_type: 'ephemeral',
        text: 'Please try again, or directly delete the message for now',
      });
    }
  }

  return c.json({ text: 'Action not recognized' });
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
