import { TenorResponse, ResultsEntity, MediaEntity } from './types';
import { unSlugify } from './utils';

export const DEFAULT_NOT_FOUND_GIF =
  'https://media.tenor.com/images/7e2970b72db3471877850dc48c123d0b/tenor.gif';

export const getGifUrl = (
  results: ResultsEntity[],
  resultIndex = 0
): string => {
  const result = results[resultIndex];
  if (!result) {
    return DEFAULT_NOT_FOUND_GIF;
  }

  const media = result.media[0];
  const keys = [
    'gif',
    'mediumgif',
    'tinygif',
    'nanogif',
  ] as (keyof MediaEntity)[];

  for (let i = 0; i < keys.length; i++) {
    const gif = media[keys[i]];
    return gif.url;
  }

  // If no gifs found, return sample gif
  return DEFAULT_NOT_FOUND_GIF;
};

export const getGifByText = async ({
  apiKey,
  text = '',
}: {
  apiKey: string;
  text: string;
}) => {
  if (!text) {
    // TODO: Handle it better, send a default gif?
    return { error: 'bad request' };
  }

  if (!apiKey) {
    // TODO: Handle server error
    return { error: 'missing stuff' };
  }

  const query = unSlugify(text);

  const tenorUrl = `https://g.tenor.com/v1/search?key=${apiKey}&q=${query}`;

  const response = await fetch(tenorUrl);
  const json = await response.json<TenorResponse>();

  if (!json.results || !json.results.length) {
    // In case of no results, just return an gif
    return { error: 'No gifs available for this text search', status: 404 };
  }

  const { results } = json;

  // Pick the first gif (0-indexed) and return the url
  const gifUrl = getGifUrl(results, 0);
  return { url: gifUrl };
};
