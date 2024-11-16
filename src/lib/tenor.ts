import { SIX_MB } from './constants';
import { TenorResponse, ResultsEntity, MediaEntity } from './types';
import { unSlugify } from './utils';

export const DEFAULT_NOT_FOUND_GIF =
  'https://media.tenor.com/images/7e2970b72db3471877850dc48c123d0b/tenor.gif';

export const validGifSize = (size: number, maxGifSize: number) =>
  size < maxGifSize;

export const getGifUrl = (
  results: ResultsEntity[],
  resultIndex: number,
  maxGifSize: number
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
    if (validGifSize(gif.size, maxGifSize)) {
      return gif.url;
    }
  }

  // If no gifs found, return sample gif
  return DEFAULT_NOT_FOUND_GIF;
};

export const getGifByText = async ({
  apiKey,
  text = '',
  maxGifSize = SIX_MB,
  getRandomGif = false,
}: {
  apiKey: string;
  text: string;
  maxGifSize?: number;
  getRandomGif?: boolean;
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

  let gifIndex = 0;

  if (getRandomGif) {
    gifIndex = Math.floor(Math.random() * results.length);
  }

  const gifUrl = getGifUrl(results, gifIndex, maxGifSize);
  return { url: gifUrl };
};
