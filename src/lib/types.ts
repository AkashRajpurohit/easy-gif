export interface TenorResponse {
  results?: ResultsEntity[] | null;
  next: string;
}

export interface ResultsEntity {
  id: string;
  title: string;
  content_description: string;
  content_rating: string;
  h1_title: string;
  media: MediaEntity[];
  bg_color: string;
  created: number;
  itemurl: string;
  url: string;
  tags?: null[] | null;
  flags?: null[] | null;
  shares: number;
  hasaudio: boolean;
  hascaption: boolean;
  source_id: string;
  composite?: null;
}

export interface MediaEntity {
  nanowebm: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  loopedmp4: Loopedmp4OrMp4OrNanomp4OrTinymp4;
  mp4: Loopedmp4OrMp4OrNanomp4OrTinymp4;
  tinygif: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  gif: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  nanogif: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  nanomp4: Loopedmp4OrMp4OrNanomp4OrTinymp4;
  tinymp4: Loopedmp4OrMp4OrNanomp4OrTinymp4;
  webm: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  mediumgif: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
  tinywebm: NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm;
}

export interface NanowebmOrTinygifOrGifOrNanogifOrWebmOrMediumgifOrTinywebm {
  dims?: number[] | null;
  url: string;
  preview: string;
  size: number;
}
export interface Loopedmp4OrMp4OrNanomp4OrTinymp4 {
  size: number;
  dims?: number[] | null;
  preview: string;
  duration: number;
  url: string;
}

export interface SlackInteractivePayload {
  type: string;
  response_url: string;
  actions: Action[];
}

export interface Action {
  action_id: string;
  value: string;
  style: string;
}
